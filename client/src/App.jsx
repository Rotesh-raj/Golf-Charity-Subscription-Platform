import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Loader from "./components/Loader";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import DrawsInfo from "./pages/DrawsInfo";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";

import Subscription from "./pages/Subscription";
import Scores from "./pages/Scores";
import Draws from "./pages/Draws";
import Charities from "./pages/Charities";
import Winners from "./pages/Winners";
import Landing from "./pages/landing";
import Profile from "./pages/user/profile";
import Success from "./pages/Success";

// ✅ ADMIN PAGES (CREATE THESE FILES)
import ManageUsers from "./pages/admin/ManageUsers";
import ManageDraws from "./pages/admin/ManageDraws";
import ManageCharities from "./pages/admin/ManageCharities";
import ManageWinners from "./pages/admin/ManageWinners";

function App() {
  const { user, loading } = useAuth();

  if (loading) return <Loader />;

  return (
    <Routes>

      {/* PUBLIC */}
  <Route path="/login" element={<Login />} />
<Route path="/signup" element={<Signup />} />
 <Route path="/how-it-works" element={<DrawsInfo />} /> ✅
   <Route path="/" element={<Landing />} />
<Route path="/charities" element={<Charities />} />
<Route path="/subscription" element={<Subscription />} />
<Route path="/success" element={<Success />} />
      {/* USER */}

 
      <Route element={<ProtectedRoute />}>
      
     <Route path="/subscription" element={<Subscription />} />
<Route path="/success" element={<Success />} />

<Route
  path="/scores"
  element={
    <ProtectedRoute>
      <Scores />
    </ProtectedRoute>
  }
/>


       <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/draws" element={<Draws />} />
        <Route path="/charities" element={<Charities />} />
        <Route path="/winners" element={<Winners />} />
        <Route path="/profile" element={<Profile />} />
      </Route>

      {/* ADMIN */}
      <Route element={<AdminRoute />}>
        <Route path="/admin" element={<AdminDashboard />} />
        
        <Route path="/admin/users" element={<ManageUsers />} />
        <Route path="/admin/draws" element={<ManageDraws />} />
        <Route path="/admin/charities" element={<ManageCharities />} />
        <Route path="/admin/winners" element={<ManageWinners />} />

     
      </Route>



      {/* FALLBACK */}
      <Route path="*" element={<Navigate to={user ? "/dashboard" : "/login"} />} />

    </Routes>
  );
}

export default App;