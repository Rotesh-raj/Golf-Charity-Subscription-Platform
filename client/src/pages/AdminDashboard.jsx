import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import {
  Users,
  Trophy,
  Heart,
  CreditCard,
  Activity,
  ArrowRight
} from "lucide-react";
import { motion } from "framer-motion";

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [stats] = useState({
    users: 120,
    draws: 25,
    charities: 8,
    subscriptions: 64,
  });

  return (
    <div className="space-y-10">

      {/* 🔥 HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">
            Admin Dashboard
          </h1>
          <p className="text-slate-500 mt-1">
            Welcome back, <span className="font-medium">{user?.email}</span>
          </p>
        </div>

        <div className="flex items-center gap-3">

  {/* STATUS */}
  <div className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-4 py-2 rounded-xl shadow-lg">
    Live System
  </div>

  {/* LOGOUT BUTTON */}
  <button
    onClick={logout}
    className="bg-red-500 text-white px-4 py-2 rounded-xl shadow hover:scale-105 hover:bg-red-600 transition"
  >
    Logout
  </button>

</div>
      </div>

      {/* 🔥 STATS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">

        <StatCard
          title="Total Users"
          value={stats.users}
          icon={<Users />}
          gradient="from-blue-500 to-indigo-500"
        />

        <StatCard
          title="Total Draws"
          value={stats.draws}
          icon={<Trophy />}
          gradient="from-pink-500 to-rose-500"
        />

        <StatCard
          title="Charities"
          value={stats.charities}
          icon={<Heart />}
          gradient="from-green-500 to-emerald-500"
        />

        <StatCard
          title="Subscriptions"
          value={stats.subscriptions}
          icon={<CreditCard />}
          gradient="from-purple-500 to-violet-500"
        />

      </div>

      {/* 🔥 QUICK ACTIONS */}
      <div className="bg-white/70 backdrop-blur-xl p-6 rounded-2xl shadow-xl border border-white/30">
        <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>

        <div className="grid md:grid-cols-4 gap-4">

          <ActionCard title="Manage Users" onClick={() => navigate("/admin/users")} />
          <ActionCard title="Manage Draws" onClick={() => navigate("/admin/draws")} />
          <ActionCard title="Charities" onClick={() => navigate("/admin/charities")} />
          <ActionCard title="Winners" onClick={() => navigate("/admin/winners")} />

        </div>
      </div>

      {/* 🔥 RECENT ACTIVITY */}
      <div className="bg-white/70 backdrop-blur-xl p-6 rounded-2xl shadow-xl border border-white/30">
        <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
          <Activity className="w-5 h-5 text-indigo-600" />
          Recent Activity
        </h2>

        <div className="space-y-4">
          <ActivityItem text="New user registered" />
          <ActivityItem text="Draw #24 completed" />
          <ActivityItem text="Charity updated" />
          <ActivityItem text="Subscription activated" />
        </div>
      </div>

    </div>
  );
};

export default AdminDashboard;





/* ================= COMPONENTS ================= */

const StatCard = ({ title, value, icon, gradient }) => (
  <motion.div
    whileHover={{ scale: 1.06 }}
    className={`relative overflow-hidden rounded-2xl p-6 text-white shadow-xl bg-gradient-to-br ${gradient}`}
  >
    {/* glow effect */}
    <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/20 rounded-full blur-2xl"></div>

    <div className="flex justify-between items-center relative z-10">
      <div>
        <p className="text-sm opacity-80">{title}</p>
        <h2 className="text-2xl font-bold mt-1">{value}</h2>
      </div>

      <div className="bg-white/20 p-3 rounded-xl backdrop-blur">
        {icon}
      </div>
    </div>
  </motion.div>
);



const ActionCard = ({ title, onClick }) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    onClick={onClick}
    className="cursor-pointer bg-gray-50 hover:bg-gray-100 p-4 rounded-xl flex justify-between items-center shadow-sm"
  >
    <span className="font-medium">{title}</span>
    <ArrowRight size={18} />
  </motion.div>
);



const ActivityItem = ({ text }) => (
  <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl shadow-sm">
    <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
    <p className="text-sm text-gray-600">{text}</p>
  </div>
);