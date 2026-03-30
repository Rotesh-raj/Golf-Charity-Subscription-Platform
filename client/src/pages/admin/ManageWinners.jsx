import { useEffect, useState } from "react";
import { adminAPI } from "../../api/api";

const ManageWinners = () => {
  const [winners, setWinners] = useState([]);

  useEffect(() => {
    fetchWinners();
  }, []);

  const fetchWinners = async () => {
    try {
      const res = await adminAPI.getWinners();
      setWinners(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const approveWinner = async (id) => {
    try {
      await adminAPI.approveWinner(id);
      fetchWinners();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Manage Winners</h1>

      {winners.length === 0 ? (
        <p>No winners</p>
      ) : (
        winners.map((w) => (
          <div key={w._id} className="border p-3 mb-2 flex justify-between">
            <span>{w.user?.email || "User"}</span>

            <button
              onClick={() => approveWinner(w._id)}
              className="bg-green-500 text-white px-3 py-1 rounded"
            >
              Approve
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default ManageWinners;