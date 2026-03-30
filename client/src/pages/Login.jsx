import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "../context/AuthContext";
import { useSubscription } from "../context/SubscriptionContext";
import { Mail, Lock, Eye, EyeOff, ArrowLeft } from "lucide-react";
import Loader from "../components/Loader";

const schema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Min 6 chars"),
});

const Login = () => {
  const { loginUser, loading } = useAuth();
  const { subscription } = useSubscription();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      await loginUser(data.email, data.password);
      
      // Check subscription after login
      if (subscription?.status === 'active') {
        navigate('/dashboard');
      } else {
        navigate('/subscription');
      }
    } catch (error) {
      alert('Invalid email or password');
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">

      {/* 🔙 BACK BUTTON */}
      <div className="w-full max-w-md mb-4">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-black transition"
        >
          <ArrowLeft size={18} />
          <span className="text-sm font-medium">Back to Home</span>
        </Link>
      </div>

      {/* 🧊 CARD */}
      <div className="max-w-md w-full card p-8">

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-600 to-emotional-gradient bg-clip-text text-transparent">
            Welcome Back
          </h1>
          <p className="text-gray-600 mt-2">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

          {/* 📧 EMAIL */}
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                {...register("email")}
                type="email"
                name="email"
                autoComplete="email"
                className="w-full pl-11 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary-500"
                placeholder="your@email.com"
              />
            </div>
            {errors.email && (
              <p className="text-sm text-red-600 mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* 🔒 PASSWORD */}
          <div>
            <label className="block text-sm font-medium mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                {...register("password")}
                type={showPassword ? "text" : "password"}
                name="password"
                autoComplete="current-password"
                className="w-full pl-11 pr-12 py-3 border rounded-xl focus:ring-2 focus:ring-primary-500"
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-sm text-red-600 mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* 🚀 BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary h-12 text-lg font-medium"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>

          {/* 🔗 SIGNUP */}
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="text-primary-600 font-medium hover:underline"
              >
                Sign up
              </Link>
            </p>
          </div>

        </form>
      </div>
    </div>
  );
};

export default Login;
