
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

export async function POST(req: NextRequest) {
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

  if (!stripeSecretKey) {
    console.error("Stripe secret key is not configured.");
    return NextResponse.json({ error: { message: "Payment processing is not configured on the server." } }, { status: 500 });
  }

  const stripe = new Stripe(stripeSecretKey);

  try {
    const { amount, currency } = await req.json();

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100,
      currency,
      automatic_payment_methods: { enabled: true },
    });

    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    console.error('Błąd serwera przy tworzeniu intencji płatności:', (err as Error).message);
    return NextResponse.json({ error: { message: (err as Error).message } }, { status: 400 });
  }
}
