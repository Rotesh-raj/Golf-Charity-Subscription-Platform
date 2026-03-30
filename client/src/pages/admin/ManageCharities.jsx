import { useEffect, useState } from "react";
import { charitiesAPI } from "../../api/api";

const ManageCharities = () => {
  const [charities, setCharities] = useState([]);
  const [name, setName] = useState("");

  useEffect(() => {
    fetchCharities();
  }, []);

  const fetchCharities = async () => {
    try {
      const res = await charitiesAPI.list();
      setCharities(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const addCharity = async () => {
    try {
      await charitiesAPI.create({ name });
      setName("");
      fetchCharities();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Manage Charities</h1>

      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Charity name"
        className="border p-2 mr-2"
      />

      <button
        onClick={addCharity}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Add Charity
      </button>

      <div className="mt-4">
        {charities.map((c) => (
          <div key={c._id} className="border p-2 mb-2">
            {c.name}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageCharities;