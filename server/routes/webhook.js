import express from "express";
import stripe from "../config/stripe.js";
import { supabase } from "../config/database.js";

const router = express.Router();

router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const sig = req.headers["stripe-signature"];

    let event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      console.log("Webhook error:", err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // 🎯 PAYMENT SUCCESS
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const userId = session.metadata.userId;
      const plan = session.metadata.plan;

      if (!userId) {
        console.log("No userId in metadata");
        return res.status(400).json({ error: "Missing userId" });
      }

      // Store subscription
      const { error } = await supabase
        .from("subscriptions")
        .insert({
          user_id: userId,
          stripe_sub_id: session.subscription,
          status: "active",
          plan
        });

      if (error) {
        console.error("Webhook insert error:", error);
      }

      // Sync user table
      await supabase
        .from("users")
        .update({ 
          subscription_status: "active",
          subscription_plan: plan 
        })
        .eq("id", userId);

      console.log(`Activated sub for user ${userId}, plan: ${plan}`);
    }


    res.json({ received: true });
  }
);

export default router;