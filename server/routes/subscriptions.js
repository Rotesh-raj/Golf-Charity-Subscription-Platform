import express from "express";
import stripe from "../config/stripe.js";
import { supabase } from "../config/database.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();


// ================= SELECT PLAN =================
router.post('/select-plan', authenticate, async (req, res) => {
  try {
    const { plan } = req.body;

    if (!["monthly", "yearly"].includes(plan)) {
      return res.status(400).json({ error: "Invalid plan" });
    }

    const { data, error } = await supabase
      .from('users')
      .update({
        subscription_status: 'active',
        subscription_plan: plan
      })
      .eq('id', req.user.id)
      .select()
      .single();

    if (error) throw error;

    res.json({ success: true, user: data });

  } catch (err) {
    console.error("PLAN ERROR:", err.message);
    res.status(500).json({ error: err.message });
  }
});


// ================= CREATE CHECKOUT =================
router.post("/create-checkout", authenticate, async (req, res) => {
  try {
    const { plan } = req.body;
    const priceId = plan === 'yearly' ? process.env.STRIPE_YEARLY_PRICE_ID : process.env.STRIPE_PRICE_ID;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "subscription",

      customer_email: req.user.email,

      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],

      success_url: "http://localhost:5173/success?session_id={CHECKOUT_SESSION_ID}",
      cancel_url: "http://localhost:5173/subscription",
      
      metadata: {
        userId: req.user.id,
        plan
      }
    });

    res.json({ url: session.url });

  } catch (err) {
    console.error("STRIPE ERROR:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// ================= STATUS =================
router.get("/status", authenticate, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('subscriptions')
      .select('status, stripe_subscription_id, plan, current_period_end')
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') throw error; // no rows ok

    // Sync to user table
    await supabase
      .from('users')
      .update({ 
        subscription_status: data?.status || 'cancelled',
        subscription_plan: data?.plan 
      })
      .eq('id', req.user.id);

    res.json(data || null);
  } catch (err) {
    console.error("SUB STATUS ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

// ================= CANCEL =================
router.post("/cancel", authenticate, async (req, res) => {
  try {
    // Cancel in Supabase
    const { error } = await supabase
      .from('subscriptions')
      .update({ status: 'cancelled' })
      .eq('user_id', req.user.id)
      .eq('status', 'active');

    if (error) throw error;

    // Sync user status
    await supabase
      .from('users')
      .update({ 
        subscription_status: 'cancelled',
        subscription_plan: null 
      })
      .eq('id', req.user.id);

    res.json({ success: true, message: 'Subscription cancelled' });
  } catch (err) {
    console.error("CANCEL ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});



export default router;