
import { supabase } from '../config/database.js';

export const createSubscriptionSession = async (userId, plan) => {
  const prices = {
    monthly: 'price_monthly_id', // replace with real Stripe price IDs
    yearly: 'price_yearly_id'
  };

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [{
      price: prices[plan],
      quantity: 1,
    }],
    metadata: {
      userId,
      plan
    },
    success_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/dashboard?success=true`,
    cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/subscription?cancel=true`,
    subscription_data: {
      metadata: { userId }
    }
  });

  return session.url;
};

export const handleWebhook = async (signature, payload) => {
  const event = stripe.webhooks.constructEvent(payload, signature, process.env.STRIPE_WEBHOOK_SECRET || '');

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const userId = session.metadata.userId;
    const subId = session.subscription;

    // Update DB
    await supabase.from('subscriptions').upsert({
      stripe_sub_id: subId,
      user_id: userId,
      status: 'active',
      plan: session.metadata.plan,
      expires_at: plan === 'yearly' ? new Date(Date.now() + 365*24*60*60*1000) : new Date(Date.now() + 30*24*60*60*1000),
      charity_contribution: 0.1 // default 10%
    });
  } else if (event.type === 'invoice.payment_failed') {
    const subId = event.data.object.subscription;
    await supabase.from('subscriptions').update({ status: 'past_due' }).eq('stripe_sub_id', subId);
  } else if (event.type === 'customer.subscription.deleted') {
    const subId = event.data.object.id;
    await supabase.from('subscriptions').update({ status: 'canceled' }).eq('stripe_sub_id', subId);
  }

  return { received: true };
};

export const payoutWinner = async (winnerId, amount) => {
  const { data: winner } = await supabase.from('winners').select('user_id').eq('id', winnerId).single();
  // Assume payout account connected to user Stripe account
  // For test, log/logic
  await stripe.payouts.create({
    amount: Math.round(amount),
    currency: 'usd',
  });
  await supabase.from('winners').update({ status: 'paid' }).eq('id', winnerId);
};

export const addToPrizePool = async (amount) => {
  const { data } = await supabase.from('prize_pool').select('amount').single();
  const newAmount = (data?.amount || 0) + amount;
  await supabase.from('prize_pool').upsert({ amount: newAmount });
};

export default { createSubscriptionSession, handleWebhook, payoutWinner, addToPrizePool };

