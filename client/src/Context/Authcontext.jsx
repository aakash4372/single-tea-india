import { createContext, useContext, useState, useEffect } from "react";
import axiosInstance from "../api/axiosInstance.jsx";
import { showToast } from "../utils/customToast.jsx";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch current user
  const loadUser = async () => {
    try {
      const res = await axiosInstance.get("/auth/me");
      setUser(res.data);
    } catch (err) {
      console.log("Error loading user:", err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  // Register
  const register = async (name, email, password) => {
    try {
      const res = await axiosInstance.post("/auth/register", { name, email, password });
      showToast("success", res.data.message);
      await loadUser();
      return res.data;
    } catch (err) {
      showToast("error", err.response?.data?.message || err.message);
      throw err;
    }
  };

  // Login
  const login = async (email, password) => {
    try {
      const res = await axiosInstance.post("/auth/login", { email, password });

      showToast("success", res.data.message);
      await loadUser();
      return res.data;
    } catch (err) {
      showToast("error", err.response?.data?.message || err.message);
      throw err;
    }
  };

  // Logout
  const logout = async () => {
    try {
      await axiosInstance.post("/auth/logout");
      setUser(null);
      showToast("success", "Logged out successfully");
    } catch (err) {
      showToast("error", err.response?.data?.message || err.message);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
