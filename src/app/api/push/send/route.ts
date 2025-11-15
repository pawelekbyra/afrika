
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import PushSubscription from '@/lib/models/PushSubscription';
import { verifyToken } from '@/lib/auth';
import webpush from 'web-push';

const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!;
const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY!;

webpush.setVapidDetails(
  'mailto:your-email@example.com',
  vapidPublicKey,
  vapidPrivateKey
);

export async function POST(req: NextRequest) {
  await dbConnect();

  try {
    const user = await verifyToken(req);
    if (!user) {
      return NextResponse.json({ msg: 'No token, authorization denied' }, { status: 401 });
    }

    const subscriptions = await PushSubscription.find();

    const { title, body } = await req.json();

    const payload = JSON.stringify({
      title: title || 'Nowe powiadomienie!',
      body: body || 'Masz nową wiadomość od Ting Tong.',
      icon: '/vite.svg',
    });

    const sendPromises = subscriptions.map(sub =>
      webpush.sendNotification(sub.toObject(), payload).catch(async (err) => {
        if (err.statusCode === 410) {
          await PushSubscription.deleteOne({ _id: sub._id });
        } else {
          console.error('Błąd wysyłania powiadomienia:', err);
        }
      })
    );

    await Promise.all(sendPromises);
    return NextResponse.json({ message: 'Powiadomienia wysłane.' });
  } catch (err) {
    console.error('Błąd podczas wysyłania powiadomień:', (err as Error).message);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
