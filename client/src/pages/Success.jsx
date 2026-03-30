import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Success = () => {
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      navigate("/scores"); // go to lucky draw entry
    }, 3000);
  }, []);

return (
  <div className="min-h-screen flex items-center justify-center bg-green-50">
    <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
      <div className="w-24 h-24 bg-green-100 rounded-2xl mx-auto mb-6 flex items-center justify-center">
        <span className="text-4xl">🎉</span>
      </div>
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Payment Successful!</h1>
      <p className="text-lg text-gray-600 mb-8">
        Redirecting to enter your lucky numbers in 3 seconds...
      </p>
      <div className="space-y-2 text-sm text-gray-500">
        <p>✓ Subscription activated</p>
        <p>✓ Dashboard unlocked</p>
        <p>→ Next: Enter 6 lucky numbers (1-45)</p>
      </div>
    </div>
  </div>
);
};

export default Success;