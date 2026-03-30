import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart, Trophy, Users, ArrowRight } from "lucide-react";

const Landing = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50">

      {/* HERO */}
      <section className="flex flex-col items-center justify-center text-center px-6 py-24">
        <motion.h1 
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-5xl md:text-6xl font-bold text-slate-800 mb-6 leading-tight"
        >
          Play Golf. <br />
          <span className="text-emerald-600">Win Big.</span> <br />
          Give Back ❤️
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-lg text-gray-600 max-w-2xl mb-8"
        >
          Track your golf scores, enter monthly draws, and support charities — all in one modern platform.
        </motion.p>
<motion.div 
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ delay: 0.6 }}
  className="flex gap-4 flex-wrap justify-center"
>

  <Link
    to="/signup"
    className="bg-emerald-600 text-white px-6 py-3 rounded-xl flex items-center gap-2 shadow-lg hover:scale-105 transition"
  >
    Get Started <ArrowRight size={18} />
  </Link>

  <Link
    to="/login"
    className="border px-6 py-3 rounded-xl hover:bg-gray-100 transition"
  >
    Login
  </Link>

  {/* 🔥 NEW BUTTONS */}
  <Link
    to="/charities"
    className="bg-pink-500 text-white px-6 py-3 rounded-xl hover:scale-105 transition"
  >
    View Charities
  </Link>

  <Link
    to="/subscription"
    className="bg-pink-500 text-white px-6 py-3 rounded-xl hover:scale-105 transition"
  >
    Subscription
  </Link>


<Link
  to="/how-it-works"
  className="bg-pink-500 text-white px-6 py-3 rounded-xl hover:scale-105 transition"
>
  How it Works →
</Link>


</motion.div>
      </section>

      {/* FEATURES */}
      <section className="max-w-6xl mx-auto px-6 py-16 grid md:grid-cols-3 gap-8">
        <FeatureCard 
          icon={<Trophy className="text-emerald-600" />}
          title="Win Monthly Prizes"
          desc="Join draw-based prize pools every month."
        />

        <FeatureCard 
          icon={<Heart className="text-pink-500" />}
          title="Support Charity"
          desc="Your subscription contributes to real causes."
        />

        <FeatureCard 
          icon={<Users className="text-blue-500" />}
          title="Golf Community"
          desc="Be part of a meaningful golf network."
        />
      </section>

      {/* CHARITY PREVIEW */}
      <section className="bg-white py-16 px-6">
        <h2 className="text-3xl font-bold text-center mb-10">
          Featured Charities
        </h2>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {["Junior Golf Fund", "Green Earth Initiative", "Youth Sports Trust"].map((charity, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05 }}
              className="p-6 border rounded-2xl shadow-sm text-center bg-slate-50"
            >
              <Heart className="mx-auto mb-3 text-pink-500" />
              <h3 className="font-semibold text-lg">{charity}</h3>
              <p className="text-sm text-gray-500 mt-2">
                Supporting communities through golf.
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-16 text-center">
        <h2 className="text-3xl font-bold mb-10">How It Works</h2>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <Step number="1" title="Subscribe" desc="Choose your plan" />
          <Step number="2" title="Enter Scores" desc="Add your golf scores" />
          <Step number="3" title="Win & Give" desc="Join draws + support charity" />
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-20 text-center bg-gradient-to-r from-emerald-500 to-pink-500 text-white">
        <h2 className="text-3xl font-bold mb-4">
          Start Your Journey Today
        </h2>
        <p className="mb-6">Play, win, and give back.</p>

        <Link to="/signup" className="bg-white text-emerald-600 px-6 py-3 rounded-xl font-semibold">
          Join Now
        </Link>
      </section>

    </div>
  );
};

// COMPONENTS

const FeatureCard = ({ icon, title, desc }) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className="bg-white p-6 rounded-2xl shadow text-center"
  >
    <div className="w-12 h-12 mx-auto mb-4 flex items-center justify-center bg-gray-100 rounded-xl">
      {icon}
    </div>
    <h3 className="font-semibold text-lg mb-2">{title}</h3>
    <p className="text-sm text-gray-500">{desc}</p>
  </motion.div>
);

const Step = ({ number, title, desc }) => (
  <div>
    <div className="w-12 h-12 mx-auto mb-4 flex items-center justify-center bg-emerald-600 text-white rounded-full">
      {number}
    </div>
    <h3 className="font-semibold">{title}</h3>
    <p className="text-sm text-gray-500">{desc}</p>
  </div>
);

export default Landing;