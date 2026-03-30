import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSubscription } from '../context/SubscriptionContext';
import { subscriptionAPI } from '../api/api';
import { motion } from 'framer-motion';
import { userAPI } from "../api/api";
import {
  CreditCard,
  CheckCircle,
  XCircle,
  Heart,
  Calendar,
  ArrowRight,
  Trophy,
  Users
} from 'lucide-react';

const Subscription = () => {
  const navigate = useNavigate();
  const { subscription, activateSubscription, cancelSubscription } = useSubscription();

  const [loading, setLoading] = useState(false);

  // 🔥 SUBSCRIBE
const handleUpgrade = async () => {
  setLoading(true);

  try {
    const res = await subscriptionAPI.createCheckout("monthly");

    // 🔥 REDIRECT TO STRIPE
    window.location.href = res.data.url;

  } catch (error) {
    console.error("Stripe error:", error);
  } finally {
    setLoading(false);
  }
};


// ✅ ADD THIS HERE
const selectPlan = async (plan) => {
  try {
    await userAPI.selectPlan(plan);
    console.log("Plan saved:", plan);
  } catch (err) {
    console.error("Plan error:", err);
  }
};

  // 🔥 CANCEL
  const handleCancel = () => {
  cancelSubscription();
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-pink-50 to-blue-50">

      <main className="container mx-auto px-4 py-8 max-w-6xl">

        {/* HEADER */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center mb-10">
          <h1 className="text-3xl font-bold mb-2">Subscription</h1>
          <p className="text-gray-600">
            Support golf charities through your subscription
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">



          {/* STATUS */}
          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-xl font-semibold mb-4">
              Status: {subscription?.status === "active" ? "Active" : "Inactive"}
            </h2>

            <p className="mb-4">
              Price: {subscription ? "₹100/month" : "$0"}
            </p>

            {subscription && (
              <p className="mb-4 text-sm text-gray-500">
                Next billing: {new Date().toLocaleDateString()}
              </p>
            )}

            <div className="flex gap-4">
             {subscription?.status === "active" ? (
                <button
                  onClick={handleCancel}
                  className="bg-red-500 text-white px-4 py-2 rounded"
                >
                  Cancel
                </button>
              ) : (
                <button
  onClick={async () => {
    await selectPlan("monthly");   // ✅ save plan
    handleUpgrade();               // ✅ Stripe checkout
  }}
                  disabled={loading}
                  className="bg-green-500 text-white px-4 py-2 rounded"
                >
                  {loading ? "Processing..." : "Subscribe"}
                </button>
              )}
            </div>
          </div>

          {/* BENEFITS */}
          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-xl font-semibold mb-4">Benefits</h2>

            <ul className="space-y-3">
              <li className="flex items-center gap-2">
                <CheckCircle className="text-green-500" /> Unlimited entries
              </li>
              <li className="flex items-center gap-2">
                <Trophy className="text-pink-500" /> Priority draws
              </li>
              <li className="flex items-center gap-2">
                <Users className="text-blue-500" /> Charity support
              </li>
              <li className="flex items-center gap-2">
                <Calendar className="text-purple-500" /> Live leaderboard
              </li>
            </ul>
          </div>

        </div>

        {/* FOOTER */}
        <div className="mt-10 text-center">
          <Heart className="mx-auto text-pink-500 mb-3" />
          <p className="text-gray-600">
            Every subscription supports golf charities ❤️
          </p>
        </div>
<div className="flex gap-4 mt-6 justify-center">

  <button
    onClick={() => navigate("/")}
    className="bg-gray-500 text-white px-4 py-2 rounded"
  >
    Home
  </button>

  <button
    onClick={() => navigate("/dashboard")}
    className="bg-blue-500 text-white px-4 py-2 rounded"
  >
    Dashboard
  </button>

</div>
      </main>
    </div>
  );
};

export default Subscription;