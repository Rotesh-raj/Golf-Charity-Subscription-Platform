import { useEffect, useState } from "react";
import { drawsAPI } from "../../api/api";

const ManageDraws = () => {
  const [draws, setDraws] = useState([]);
  const [title, setTitle] = useState("");

  useEffect(() => {
    fetchDraws();
  }, []);

  const fetchDraws = async () => {
    try {
      const res = await drawsAPI.list();
      setDraws(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const createDraw = async () => {
    try {
      await drawsAPI.create({ title });
      setTitle("");
      fetchDraws();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Manage Draws</h1>

      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Draw title"
        className="border p-2 mr-2"
      />

      <button
        onClick={createDraw}
        className="bg-green-500 text-white px-4 py-2 rounded"
      >
        Create Draw
      </button>

      <div className="mt-4">
        {draws.map((draw) => (
          <div key={draw._id} className="border p-2 mb-2">
            {draw.title}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageDraws;