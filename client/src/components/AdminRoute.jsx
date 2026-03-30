import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AdminRoute = () => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // ⏳ Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-500">
        Checking admin access...
      </div>
    );
  }

  // 🔐 Not logged in
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 🧪 DEBUG (remove later)
  console.log("AdminRoute User:", user);

  // 🚫 Not admin
  if (user.role !== "admin") {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center">
        <h2 className="text-2xl font-bold mb-2">🚫 Access Denied</h2>
        <p className="text-gray-500 mb-4">
          You do not have permission to access admin panel.
        </p>

        <button
          onClick={() => (window.location.href = "/dashboard")}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Go to Dashboard
        </button>
      </div>
    );
  }

  // ✅ Admin allowed
  return <Outlet />;
};

export default AdminRoute;