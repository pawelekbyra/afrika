
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { headers } from 'next/headers';
import dbConnect from '@/lib/db';
import User from '@/lib/models/User';
import Donation from '@/lib/models/Donation';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  await dbConnect();

  const body = await req.text();
  const signature = (await headers()).get('stripe-signature') as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    return NextResponse.json({ error: `Webhook Error: ${(err as Error).message}` }, { status: 400 });
  }

  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;
    const email = paymentIntent.receipt_email;

    try {
      if (!email) {
        throw new Error('Email not found in payment intent');
      }

      let user = await User.findOne({ email });

      if (!user) {
        const password = Math.random().toString(36).slice(-8);
        user = await User.create({ email, password });
      }

      await Donation.create({
        user: user._id,
        paymentIntentId: paymentIntent.id,
        amount: paymentIntent.amount / 100,
        currency: paymentIntent.currency,
      });
    } catch (err) {
      console.error((err as Error).message);
    }
  }

  return NextResponse.json({ received: true });
}
