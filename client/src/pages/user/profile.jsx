import { useEffect, useState } from "react";
import { authAPI } from "../../api/api"; 
import { User, Mail, Shield, CreditCard, Calendar } from "lucide-react";
import { motion } from "framer-motion";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [edit, setEdit] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
  });

  // 🔥 FETCH PROFILE FROM BACKEND
  const fetchProfile = async () => {
    try {
      const res = await authAPI.profile();
      setUser(res.data);

      setForm({
        name: res.data.name || "",
        email: res.data.email || "",
      });

    } catch (err) {
      console.error("Profile error:", err);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // 🔥 HANDLE INPUT
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 🔥 UPDATE PROFILE
  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      await authAPI.updateProfile(form); // 👈 you must create this API
      alert("✅ Profile updated");
      setEdit(false);
      fetchProfile();
    } catch (err) {
      console.error(err);
    }
  };

  if (!user) return <p className="p-6">Loading...</p>;

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-slate-100 via-blue-50 to-purple-100">

      {/* HEADER */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-8">
        <h1 className="text-3xl font-bold">Profile</h1>
        <p className="text-gray-500">Manage your account</p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-6">

        {/* INFO CARD */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-lg font-semibold mb-4">Account Info</h2>

          <div className="space-y-3 text-sm">

            <p><User size={16} className="inline mr-2"/> {user.name || "Not set"}</p>
            <p><Mail size={16} className="inline mr-2"/> {user.email}</p>

            <p><Shield size={16} className="inline mr-2"/>
              Role: {user.role}
            </p>

            <p><CreditCard size={16} className="inline mr-2"/>
              Subscription: {user.subscription_status}
            </p>

            <p>
              Plan: {user.subscription_plan || "None"}
            </p>

            <p><Calendar size={16} className="inline mr-2"/>
              Joined: {new Date(user.created_at).toLocaleDateString()}
            </p>

          </div>

          <button
            onClick={() => setEdit(!edit)}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
          >
            {edit ? "Cancel" : "Edit Profile"}
          </button>
        </div>

        {/* EDIT FORM */}
        {edit && (
          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-lg font-semibold mb-4">Edit Profile</h2>

            <form onSubmit={handleUpdate} className="space-y-4">

              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Name"
                className="w-full p-2 border rounded"
              />

              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Email"
                className="w-full p-2 border rounded"
              />

              <button className="bg-green-600 text-white px-4 py-2 rounded">
                Save
              </button>

            </form>
          </div>
        )}

      </div>
    </div>
  );
};

export default Profile;