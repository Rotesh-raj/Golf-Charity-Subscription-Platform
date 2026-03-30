import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useSubscription } from "../context/SubscriptionContext";
import { charitiesAPI, scoresAPI, drawsAPI } from "../api/api";
import { Link } from "react-router-dom";

import {
  Users,
  DollarSign,
  Heart,
  Trophy,
  CreditCard,
} from "lucide-react";
import { motion } from "framer-motion";

const Dashboard = () => {
  
  const { subscription } = useSubscription();
const { user, logout } = useAuth();
  const [charity, setCharity] = useState(null);
  const [scores, setScores] = useState([]);
  const [recentDraws, setRecentDraws] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [scoresRes, charityRes, drawsRes] = await Promise.all([
          scoresAPI.list(),
          charitiesAPI.list(),
          drawsAPI.list()
        ]);
        setScores(scoresRes.data || []);
        setCharity(charityRes.data?.[0] || null);
        setRecentDraws(drawsRes.data || []);
      } catch (err) {
        console.error('Dashboard load error:', err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);
  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-slate-100 via-blue-50 to-purple-100 space-y-10">

      {/* 🔥 NAVBAR */}
      <div className="flex justify-between items-center bg-white/60 backdrop-blur-xl border border-white/30 p-4 rounded-xl shadow">

        <Link to="/" className="flex items-center gap-2 text-gray-700 hover:text-black">
          ← Home
        </Link>

        <div className="flex gap-6 text-sm font-medium">
          <Link to="/dashboard" className="text-indigo-600">Dashboard</Link>
          <Link to="/subscription">Subscription</Link>
          <Link to="/profile">Profile</Link>
        </div>

      </div>

      {/* 🔒 SUBSCRIPTION LOCK */}
      {!subscription || subscription.status !== "active" ? (
        <div className="flex flex-col items-center justify-center h-[60vh] text-center">
          <h2 className="text-2xl font-bold mb-4">🔒 Subscription Required</h2>
          <p className="text-gray-500 mb-6">
            Upgrade your plan to access dashboard features
          </p>

          <Link
            to="/subscription"
            className="bg-green-500 text-white px-6 py-3 rounded-lg shadow hover:bg-green-600"
          >
            Go to Subscription
          </Link>
        </div>
      ) : loading ? (
        <div className="flex items-center justify-center h-[60vh] text-gray-500">
          Loading dashboard...
        </div>
      ) : (
        <>
          {/* HEADER */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h1 className="text-3xl font-bold text-slate-800">Dashboard</h1>
            <p className="text-slate-500">
              Welcome, <span className="font-medium">{user?.email}</span>
            </p>
              <button
    onClick={logout}
    className="flex items-center gap-2 bg-red-500 px-4 py-2 text-white rounded-xl shadow hover:scale-105 transition"
  >
    Logout
  </button>
          </motion.div>

          {/* STATS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">

            <Card icon={<Users />} title="User" value={user?.email} />

            <Card
              icon={<CreditCard />}
              title="Subscription"
              value={subscription?.status || "Inactive"}
            />

            <Card
              icon={<Heart />}
              title="Charity"
              value={charity?.name || "Not selected"}
            />

            <Card
              icon={<Trophy />}
              title="Last Score"
              value={scores[0]?.numbers?.join(', ') || "No score"}
            />

            <Card
  icon={<DollarSign />}
  title="Winnings"
  value={scores.length > 0 ? "₹0" : "No wins"}
/>

          </div>

          {/* SCORES */}
          <Section title="Your Scores ⛳">
            {scores.length === 0 ? (
              <p className="text-gray-500">No scores added yet</p>
            ) : (
              <div className="flex gap-3 flex-wrap">
                {scores.map((s, i) => (
                  <div key={i} className="px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg text-sm">
                    {s.numbers?.join(', ') || 'No numbers'}
                  </div>
                ))}
              </div>
            )}
          </Section>

          {/* CHARITY */}
       <Section title="Your Charity ❤️">
  {charity ? (
    <div>
      <p>Supporting: <strong>{charity.name}</strong></p>
      <p className="text-sm text-gray-500 mt-1">
        Contribution: {charity.contribution_pct || "10%"}
      </p>
    </div>
  ) : (
    <p className="text-gray-500">No charity selected</p>
  )}
</Section>
          {/* DRAWS */}
          <Section title="Recent Draws 🎯">
            {recentDraws.length === 0 ? (
              <p className="text-gray-500">No draws yet</p>
            ) : (
              <div className="grid md:grid-cols-3 gap-4">
                {recentDraws.map((draw, i) => (
                  <div key={i} className="p-4 border rounded-xl text-center">
                    <p className="text-xs text-gray-500">
                      {new Date(draw.created_at || Date.now()).toLocaleDateString()}
                    </p>
                    <p className="font-semibold mt-2">
                      {draw.draw_numbers?.join(", ")}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </Section>
<Section title="Subscription Management">
  <div className="space-y-4">
    <div className="flex justify-between items-center">
      <span>Status: <span className="font-semibold capitalize">{subscription.status}</span></span>
      <span>Renews: {subscription?.current_period_end ? new Date(subscription.current_period_end * 1000).toLocaleDateString() : 'N/A'}</span>

    </div>
    <button 
      onClick={subscription.cancelSubscription}
      className="w-full bg-red-500 text-white py-2 px-4 rounded-xl hover:bg-red-600 transition disabled:opacity-50"
      disabled={subscription.loading}
    >
      {subscription.loading ? 'Cancelling...' : 'Cancel Subscription'}
    </button>

  </div>
</Section>

        </>
      )}
    </div>
  );
};

// 🔥 SECTION
const Section = ({ title, children }) => (
  <div className="bg-white/60 backdrop-blur-xl border border-white/30 rounded-2xl p-6 shadow-lg hover:shadow-xl transition">
    <h2 className="text-lg font-semibold mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
      {title}
    </h2>
    {children}
  </div>
);

// 🔥 3D CARD
const Card = ({ icon, title, value }) => (
  <div className="relative group">

    <div className="absolute inset-0 bg-gradient-to-r from-indigo-200 to-purple-200 blur-xl opacity-0 group-hover:opacity-60 transition duration-300 rounded-2xl"></div>

    <div className="relative bg-white/60 backdrop-blur-xl border border-white/30 p-6 rounded-2xl shadow-lg hover:shadow-2xl transition transform hover:-translate-y-2">

      <div className="flex flex-col items-center text-center">

        <div className="w-12 h-12 mb-3 flex items-center justify-center bg-gradient-to-br from-indigo-100 to-purple-100 text-indigo-600 rounded-xl shadow-inner">
          {icon}
        </div>

        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-lg font-semibold mt-1">{value}</p>

      </div>

    </div>
  </div>
);

export default Dashboard;