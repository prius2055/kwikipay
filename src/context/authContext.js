import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BASE_URL, getHeaders } from "../api/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in on mount
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setLoading(false);
      return;
    }

    try {
      // console.log("🔵 Checking authentication...");

      const response = await fetch(`${BASE_URL}/verify`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      } else {
        // console.log("⚠️ Token invalid, clearing...");
        localStorage.removeItem("token");
        setUser(null);
      }
    } catch (error) {
      // console.error("❌ Auth check failed:", error);
      localStorage.removeItem("token");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      // console.log("🔵 Registering user...");

      const response = await fetch(`${BASE_URL}/register`, {
        method: "POST",
        headers: getHeaders(false), // false = no auth (public route)
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      // console.log(data);

      if (data.status === "success") {
        // console.log("✅ Registration successful");

        localStorage.setItem("token", data.token);
        setUser(data.user);
        return {
          status: true,
          message: "Registration successful!",
        };
      } else {
        // console.error("❌ Registration failed:", data.message);
        return {
          status: false,
          message: data.message || "Registration failed",
        };
      }
    } catch (error) {
      // console.error("❌ Registration error:", error);
      return {
        status: "error",
        message: error.message || "Something went wrong",
      };
    }
  };

  const login = async (username, password) => {
    try {
      // console.log("🔵 Logging in...");

      const response = await fetch(`${BASE_URL}/login`, {
        method: "POST",
        headers: getHeaders(false),
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok && data.status === "success") {
        console.log("✅ Login successful");
        localStorage.setItem("token", data.token);
        setUser(data.user);
        return { status: true, user: data.user };
      } else {
        console.error("❌ Login failed:", data.message);
        return { status: false, message: data.message || "Login failed" };
      }
    } catch (error) {
      // console.error("❌ Login error:", error);
      return { status: false, message: error.message };
    }
  };

  const requestPasswordReset = async (email) => {
    try {
      const response = await fetch(`${BASE_URL}/password/reset`, {
        method: "POST",
        headers: getHeaders(false),
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok && data.status === "success") {
        // ✅ No token or user returned here — only a success message
        return { status: true, message: data.message };
      } else {
        return {
          status: false,
          message: data.message || "Reset failed. Please try again.",
        };
      }
    } catch (error) {
      return {
        status: false,
        message:
          error.message || "Network error. Please check your connection.",
      };
    }
  };

  const resetPassword = async (password, token) => {
    try {
      const response = await fetch(`${BASE_URL}/password/reset/${token}`, {
        method: "POST",
        headers: getHeaders(false),
        body: JSON.stringify({ password, confirmPassword: password }),
      });

      const data = await response.json();

      if (response.ok && data.status === "success") {
        // ✅ data.token not response.data.token
        const authToken = data.token;

        if (authToken) {
          localStorage.setItem("token", authToken);
        }

        // ✅ user is nested in data.data.user from createSendToken
        const user = data.data?.user || data.user || null;
        if (user) setUser(user);

        return { status: true, user };
      } else {
        return {
          status: false,
          message: data.message || "Reset failed. Please try again.",
        };
      }
    } catch (error) {
      return {
        status: false,
        message:
          error.message || "Network error. Please check your connection.",
      };
    }
  };

  const logout = () => {
    console.log("🔵 Logging out...");
    setLoggingOut(true); // ✅ trigger overlay

    setTimeout(() => {
      try {
        localStorage.removeItem("token");
        setUser(null);
        setLoggingOut(false); // ✅ reset before navigating
        console.log("✅ Logout successful");
      } catch (error) {
        console.error("❌ Logout error:", error);
        setLoggingOut(false); // ✅ reset before navigating
      } finally {
        navigate("/", { replace: true });
      }
    }, 1500); // ✅ let animation play before clearing state
  };

  const isAuthenticated = () => {
    return !!user && !!localStorage.getItem("token");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        resetPassword,
        requestPasswordReset,
        logout,
        loggingOut,
        isAuthenticated,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
