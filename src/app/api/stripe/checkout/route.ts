import Stripe from 'stripe';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder', {
  apiVersion: '2024-06-20',
});

export async function POST(req: NextRequest) {
  try {
    const { userId, email } = await req.json();

    if (!process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY.includes('placeholder')) {
      return NextResponse.json({ error: 'Stripe not configured' }, { status: 503 });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'StackStreak Pro',
            description: 'Streak shields, unlimited challenges, AI coach, ad-free',
            images: [],
          },
          unit_amount: 799, // $7.99
          recurring: { interval: 'month' },
        },
        quantity: 1,
      }],
      customer_email: email || undefined,
      metadata: { userId: userId || '' },
      success_url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://stackstreak.aivantageworks.com'}/dashboard?upgraded=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://stackstreak.aivantageworks.com'}/pro`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Stripe error:', error);
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 });
  }
}
