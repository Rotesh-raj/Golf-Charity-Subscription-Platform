import { createContext, useContext, useState, useEffect } from "react";
import { authAPI, subscriptionAPI } from "../api/api";

const SubscriptionContext = createContext();

export const useSubscription = () => useContext(SubscriptionContext);

export const SubscriptionProvider = ({ children }) => {
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ FETCH SUBSCRIPTION
  const fetchSubscription = async () => {
    try {
      const res = subscriptionAPI.status();
      setSubscription(res.data);
    } catch (err) {
      console.error("Fetch error:", err);
      setSubscription(null);
    } finally {
      setLoading(false);
    }
  };


  // ✅ ACTIVATE AFTER PAYMENT (optional manual update)
  const activateSubscription = (plan = "monthly") => {
    setSubscription({
      status: "active",
      plan,
    });
  };

  // ✅ CANCEL SUBSCRIPTION
  const cancelSubscription = async () => {
    try {
      await subscriptionAPI.cancel(); // backend API

      setSubscription({
        status: "cancelled",
        plan: null,
      });
    } catch (err) {
      console.error("Cancel error:", err);
    }
  };

  const isSubscribed = subscription?.status === "active";

  useEffect(() => {
    fetchSubscription();
  }, []);

  return (
    <SubscriptionContext.Provider
      value={{
        subscription,
        loading,
        isSubscribed,
        fetchSubscription,
        activateSubscription,
        cancelSubscription,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
};