import { createContext, useContext, useState, useEffect } from "react";
import { authAPI } from "../api/api";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // 🔥 CHECK USER ON LOAD
useEffect(() => {
  const checkUser = async () => {
    const savedToken = localStorage.getItem("token");
    console.log("TOKEN:", savedToken);

    if (!savedToken) {
      setLoading(false);
      return;
    }

    try {
      const res = await authAPI.profile();

      // 🔥 FIX: validate response
      if (!res || !res.data) {
        throw new Error("Invalid user");
      }

      setUser(res.data);
      setToken(savedToken);

    } catch (error) {
      console.error("Auth error:", error);

      localStorage.removeItem("token");
      setUser(null);
      setToken(null);
    } finally {
      setLoading(false);
    }
  };

  checkUser();
}, []);

  // 🔥 LOGIN
 const loginUser = async (email, password) => {
  try {
    const res = await authAPI.login({ email, password });

    const token = res.data?.token;

    if (!token) throw new Error("No token");

    localStorage.setItem("token", token);

    setToken(token);
    setUser(res.data.user);

    return true;

  } catch (error) {
    console.error("Login error:", error);

    throw error; // 🔥 important
  }
};

  // 🔥 SIGNUP (NO AUTO LOGIN)
const signupUser = async (data) => {
  try {
    await authAPI.signup(data);
    return true;
  } catch (error) {
    console.error(error);

    if (!user.subscriptionActive) {
  navigate("/subscription");
} else {
  navigate("/dashboard");
}

    // 🔥 THROW ERROR TO UI
    throw error;
  }
};


  // 🔥 LOGOUT
  const logout = () => {
    localStorage.removeItem("token");
   

    setUser(null);
    setToken(null);

    navigate("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        loginUser,
        signupUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};