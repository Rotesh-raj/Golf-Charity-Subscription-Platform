import { Link } from "react-router-dom";

const DrawsInfo = () => {
  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-blue-50 to-purple-100">

      <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow">

        <h1 className="text-3xl font-bold mb-4">
          How Draw Works 🎯
        </h1>

        <p className="text-gray-600 mb-6">
          Enter your golf scores and participate in our monthly draw system.
          Match numbers to win exciting prizes!
        </p>

        <ul className="space-y-3 mb-6">
          <li>🎯 5 Match → Jackpot (40%)</li>
          <li>🎯 4 Match → Medium Prize (35%)</li>
          <li>🎯 3 Match → Small Prize (25%)</li>
        </ul>

        <p className="text-gray-500 mb-6">
          Draws are conducted every month. If no jackpot winner, the prize rolls over.
        </p>

        <Link
          to="/subscription"
          className="bg-indigo-600 text-white px-6 py-3 rounded-lg"
        >
          Start Playing →
        </Link>

      </div>
    </div>
  );
};

export default DrawsInfo;