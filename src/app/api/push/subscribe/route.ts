
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import PushSubscription from '@/lib/models/PushSubscription';
import { verifyToken } from '@/lib/auth';

export async function POST(req: NextRequest) {
  await dbConnect();

  try {
    const user = await verifyToken(req);
    if (!user) {
      return NextResponse.json({ msg: 'No token, authorization denied' }, { status: 401 });
    }

    const subscription = await req.json();

    const existingSubscription = await PushSubscription.findOne({ endpoint: subscription.endpoint });
    if (existingSubscription) {
      return NextResponse.json({ message: 'Subscription already exists' }, { status: 200 });
    }

    await PushSubscription.create({
      user: user.id,
      endpoint: subscription.endpoint,
      keys: {
        p256dh: subscription.keys.p256dh,
        auth: subscription.keys.auth,
      },
    });

    return NextResponse.json({ message: 'Subscription successful' }, { status: 201 });
  } catch (err) {
    console.error('Błąd podczas subskrypcji:', (err as Error).message);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
