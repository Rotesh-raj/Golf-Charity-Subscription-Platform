import { useEffect, useState } from "react";
import { adminAPI } from "../../api/api";

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await adminAPI.users();
      setUsers(res.data || []);
    } catch (err) {
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // ================= ACTIONS =================

  const editUser = async (id) => {
    const name = prompt("Enter new name:");
    const email = prompt("Enter new email:");

    if (!name || !email) return;

    await adminAPI.updateUser(id, { name, email });
    fetchUsers();
  };

  const toggleStatus = async (id, currentStatus) => {
    const status = currentStatus === "active" ? "banned" : "active";

    await adminAPI.updateStatus(id, status);
    fetchUsers();
  };

  const editScore = async (id) => {
    const input = prompt("Enter 5 numbers (comma separated)");
    if (!input) return;

    const numbers = input.split(",").map(Number);

    await adminAPI.updateScore(id, numbers);
    alert("Score updated");
  };

  const updateSub = async (id) => {
    const plan = prompt("Plan (monthly/yearly)");
    const status = prompt("Status (active/cancelled)");

    if (!plan || !status) return;

    await adminAPI.updateSubscription(id, plan, status);
    fetchUsers();
  };

  // ================= UI =================

  if (loading) {
    return <div className="p-6">Loading users...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">User Management</h1>

      <div className="overflow-x-auto bg-white shadow rounded-lg">
        <table className="w-full text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3">Email</th>
              <th className="p-3">Status</th>
              <th className="p-3">Subscription</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan="4" className="p-4 text-center">
                  No users found
                </td>
              </tr>
            ) : (
              users.map((u) => (
                <tr key={u.id} className="border-t hover:bg-gray-50">
                  <td className="p-3">{u.email}</td>

                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded text-sm ${
                        u.status === "active"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {u.status}
                    </span>
                  </td>

                  <td className="p-3">
                    {u.subscriptions?.[0]?.plan || "none"} (
                    {u.subscriptions?.[0]?.status || "inactive"})
                  </td>

                  <td className="p-3 flex flex-wrap gap-2">
                    <button
                      className="px-3 py-1 bg-blue-500 text-white rounded"
                      onClick={() => editUser(u.id)}
                    >
                      Edit
                    </button>

                    <button
                      className="px-3 py-1 bg-yellow-500 text-white rounded"
                      onClick={() => toggleStatus(u.id, u.status)}
                    >
                      Ban/Unban
                    </button>

                    <button
                      className="px-3 py-1 bg-purple-500 text-white rounded"
                      onClick={() => editScore(u.id)}
                    >
                      Score
                    </button>

                    <button
                      className="px-3 py-1 bg-green-600 text-white rounded"
                      onClick={() => updateSub(u.id)}
                    >
                      Subscription
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}