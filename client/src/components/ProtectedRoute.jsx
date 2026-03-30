import { Navigate, Outlet, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useSubscription } from "../context/SubscriptionContext";
import Loader from "../components/Loader";

const ProtectedRoute = () => {
  const { user, loading: authLoading } = useAuth();
  const { subscription, loading: subLoading } = useSubscription();

  // ✅ GLOBAL LOADING
  if (authLoading || subLoading) {
    return <Loader />;
  }

  // 🔐 NOT LOGGED IN
  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center">
        <h2 className="text-2xl font-bold mb-4">
          🔒 Please login to access dashboard
        </h2>

        <Link
          to="/login"
          className="bg-indigo-600 text-white px-6 py-3 rounded"
        >
          Go to Login
        </Link>
      </div>
    );
  }

  // 🚫 SUBSCRIPTION REQUIRED
  if (!subscription || subscription.status !== "active") {
    return <Navigate to="/subscription" />;
  }

  return <Outlet />;
};

export default ProtectedRoute;