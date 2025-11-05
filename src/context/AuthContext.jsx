import { createContext, useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../services/axiosInstance";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch current logged-in user (from cookie)
  const fetchUser = async () => {
    try {
      const res = await axios.get("/users/current-user");
      setUser(res.data);
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  // ✅ Login function
  const login = async (credentials) => {
    try {
      setLoading(true);
      const res = await axios.post("/users/login", credentials, {
        withCredentials: true, // 👈 ensure cookies are sent
      });
      setUser(res.data.user || res.data);
      navigate("/");
    } catch (err) {
      console.error("Login failed:", err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // ✅ Register function
  const register = async (formData) => {
    try {
      setLoading(true);
      const res = await axios.post("/users/register", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });
      setUser(res.data.user);
      navigate("/");
    } catch (err) {
      console.error("Register failed:", err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // ✅ Logout function
  const logout = async () => {
    try {
      await axios.post("/users/logout", {}, { withCredentials: true });
      setUser(null);
      navigate("/login");
    } catch (err) {
      console.error("Logout failed:", err.message);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        fetchUser,
        setUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
