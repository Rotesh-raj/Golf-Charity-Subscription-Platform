import { useEffect, useState } from "react";
import axios from "axios";

export default function Users() {
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    const res = await axios.get("/api/admin/users");
    setUsers(res.data);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Update user
  const updateUser = async (id) => {
    const name = prompt("Enter new name:");
    await axios.put(`/api/admin/users/${id}`, { name });
    fetchUsers();
  };

  // Ban user
  const toggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === "active" ? "banned" : "active";

    await axios.patch(`/api/admin/users/${id}/status`, {
      status: newStatus
    });

    fetchUsers();
  };

  // Add score
  const addScore = async (id) => {
    const numbers = prompt("Enter 5 numbers comma separated")
      .split(",")
      .map(Number);

    await axios.patch(`/api/admin/users/${id}/scores`, {
      numbers
    });

    alert("Score updated");
  };

  // Update subscription
  const updateSub = async (id) => {
    const plan = prompt("Enter plan (monthly/yearly)");

    await axios.patch(`/api/admin/users/${id}/subscription`, {
      status: "active",
      plan
    });

    fetchUsers();
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">User Management</h1>

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th>Email</th>
            <th>Status</th>
            <th>Subscription</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {users.map((u) => (
            <tr key={u.id} className="border-t">
              <td>{u.email}</td>
              <td>{u.status}</td>
              <td>
                {u.subscriptions?.[0]?.plan || "none"} (
                {u.subscriptions?.[0]?.status || "inactive"})
              </td>

              <td className="space-x-2">
                <button onClick={() => updateUser(u.id)}>
                  Edit
                </button>

                <button onClick={() => toggleStatus(u.id, u.status)}>
                  Ban/Unban
                </button>

                <button onClick={() => addScore(u.id)}>
                  Add Score
                </button>

                <button onClick={() => updateSub(u.id)}>
                  Update Sub
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}