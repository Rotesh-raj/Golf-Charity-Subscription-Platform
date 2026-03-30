import { useState } from "react";
import { useNavigate } from "react-router-dom";


import { scoresAPI } from "../api/api";
import { z } from "zod";

const scoreSchema = z.object({
  played_at: z.string().min(1),
  numbers: z.array(z.number().min(1).max(45)).length(5),
}).refine(nums => new Set(nums).size === 5, { message: "Numbers must be unique" });


const Scores = () => {
  const [numbers, setNumbers] = useState([0,0,0,0,0]);

  const [played_at, setPlayedAt] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const scoreData = { numbers, played_at };
    try {
      scoreSchema.parse(scoreData);
      
      await scoresAPI.add(numbers, played_at);
      navigate("/dashboard");
    } catch (err) {
      if (err.errors) {
        const fieldErrors = {};
        err.errors.forEach(e => {
          fieldErrors[e.path[0]] = e.message;
        });
        setErrors(fieldErrors);
      }
    }
  };

  const updateNumber = (index, value) => {
    const newNums = [...numbers];
    newNums[index] = parseInt(value) || 0;
    setNumbers(newNums);
  };

  return (
    <div className="min-h-screen p-8 flex flex-col items-center justify-center">
      <form onSubmit={handleSubmit} className="max-w-md w-full space-y-6">
        <h2 className="text-3xl font-bold text-center">Enter Your Lucky Numbers 🎯</h2>
        <p className="text-center text-gray-600">5 unique numbers between 1-45 + play date</p>

        
        <div>
          <label className="block text-sm font-medium mb-2">Played Date</label>
          <input
            type="date"
            value={played_at}
            onChange={(e) => setPlayedAt(e.target.value)}
            className="w-full p-3 border rounded-xl"
            required
          />
          {errors.played_at && <p className="text-red-500 text-sm mt-1">{errors.played_at}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Numbers (1-45, unique)</label>
          <div className="grid grid-cols-5 gap-3">
            {numbers.map((num, index) => (
              <input
                key={index}
                type="number"
                min="1"
                max="45"
                value={num || ""}
                onChange={(e) => updateNumber(index, e.target.value)}
                className="w-full p-3 border rounded-xl text-center font-mono text-lg"
                required
              />
            ))}
          </div>

          {errors.numbers && <p className="text-red-500 text-sm mt-1">{errors.numbers}</p>}
        </div>

        <button type="submit" className="w-full bg-green-500 text-white py-3 rounded-xl font-medium hover:bg-green-600">
          Submit Numbers → Dashboard
        </button>
      </form>
    </div>
  );
};

export default Scores;

