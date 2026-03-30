import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "../context/AuthContext";
import { Mail, Lock, ArrowLeft } from "lucide-react";
import Loader from "../components/Loader";
import { useNavigate, Link } from "react-router-dom";

const schema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Min 6 chars"),
  charity_id: z.string().min(1, "Please select a charity"),
  contribution_pct: z.number().min(10).max(100),
  
});

const Signup = () => {
  const { signupUser, loading } = useAuth();
  const navigate = useNavigate();
  const [charities, setCharities] = useState([]);
  const [errorMsg, setErrorMsg] = useState(""); // ✅ ADD HERE
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    setCharities([
      { id: "1", name: "Red Cross" },
      { id: "2", name: "UNICEF" },
    ]);
  }, []);

  const onSubmit = async (data) => {
  try {
    setErrorMsg("");

    const payload = {
      email: data.email,
      password: data.password,
      charity_id: data.charity_id,
      contribution_pct: data.contribution_pct,
    };

    const success = await signupUser(payload);

    if (success) {
      navigate("/login");
    }

  } catch (err) {
    console.error(err);

    if (err.response?.data?.error) {
      setErrorMsg(err.response.data.error);
    } else {
      setErrorMsg("Something went wrong");
    }
  }
};

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      
{errorMsg && (
  <p className="text-red-600 text-sm text-center">
    {errorMsg}
  </p>
)}
      {/* 🔥 BACK BUTTON */}
      <div className="w-full max-w-md mb-4">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-black transition"
        >
          <ArrowLeft size={18} />
          <span className="text-sm font-medium">Back to Home</span>
        </Link>
      </div>

      {/* 🔥 CARD */}
      <div className="max-w-md w-full card p-8">

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-600 to-emotional-gradient bg-clip-text text-transparent">
            Join the Community
          </h1>
          <p className="text-gray-600 mt-2">
            Create account and support charity
          </p>
        </div>



        <form autoComplete="off" onSubmit={handleSubmit(onSubmit)} className="space-y-6">

          {/* EMAIL */}
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                {...register("email")}
  type="email"

  autoComplete="off"
                className="w-full pl-11 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary-500"
                placeholder="example@gmail.com"
              />
            </div>
            {errors.email && (
              <p className="text-sm text-red-600 mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* PASSWORD */}
          <div>
            <label className="block text-sm font-medium mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                  {...register("password")}
  type="password"
   // 🔥 change name
  autoComplete="new-password"
                className="w-full pl-11 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary-500"
                placeholder="••••••"
              />
            </div>
            {errors.password && (
              <p className="text-sm text-red-600 mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* CHARITY */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Select Charity (min 10%)
            </label>
            <select
              {...register("charity_id")}
              className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-primary-500"
              onChange={(e) => setValue("charity_id", e.target.value)}
            >
              <option value="">Select charity</option>
              {charities.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            {errors.charity_id && (
              <p className="text-sm text-red-600 mt-1">
                {errors.charity_id.message}
              </p>
            )}
          </div>

          {/* CONTRIBUTION */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Contribution % (min 10%)
            </label>
            <input
              {...register("contribution_pct", { valueAsNumber: true })}
              type="number"
              step="10"
              min="10"
              max="100"
              defaultValue="10"
              className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-primary-500"
            />
            {errors.contribution_pct && (
              <p className="text-sm text-red-600 mt-1">
                {errors.contribution_pct.message}
              </p>
            )}
          </div>

          {/* BUTTON */}
          <button className="w-full btn-primary h-12 text-lg">
            Create Account
          </button>

          {/* LOGIN LINK */}
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-primary-600 font-medium hover:underline"
              >
                Sign in
              </Link>
            </p>
          </div>

        </form>
      </div>
    </div>
  );
};

export default Signup;