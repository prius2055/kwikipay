import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
const AuthContext = createContext();

const BASE_URL = `http://localhost:5000/api/v1`;

// const BASE_URL = `https://vtu-backend-wjn6.onrender.com/api/v1`;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

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
        headers: {
          "Content-Type": "application/json",
        },
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
        headers: {
          "Content-Type": "application/json",
        },
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
      // console.log("🔵 Logging in...");

      const response = await fetch(`${BASE_URL}/password/reset`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok && data.status === "success") {
        // console.log("✅ Reset successful");
        localStorage.setItem("token", response.data.token);
        setUser(data.user);
        return { status: true, user: data.user };
      } else {
        // console.error("❌ Password reset failed:", data.message);
        return { status: false, message: data.message || "Reset failed" };
      }
    } catch (error) {
      // console.error("❌ Password reset error:", error);
      return { status: false, message: error.message };
    }
  };

  const resetPassword = async (password, token) => {
    try {
      // console.log("🔵 Logging in...");

      const response = await fetch(`${BASE_URL}/password/reset/${token}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (response.ok && data.status === "success") {
        // console.log("✅ Reset successful");
        localStorage.setItem("token", response.data.token);
        setUser(data.user);
        return { status: true, user: data.user };
      } else {
        // console.error("❌ Password reset failed:", data.message);
        return { status: false, message: data.message || "Reset failed" };
      }
    } catch (error) {
      // console.error("❌ Password reset error:", error);
      return { status: false, message: error.message };
    }
  };

  const logout = () => {
    console.log("🔵 Logging out...");

    try {
      // Clear auth storage
      localStorage.removeItem("token");

      // Reset auth state
      setUser(null);

      console.log("✅ Logout successful");
    } catch (error) {
      console.error("❌ Logout error:", error);
    } finally {
      // Always redirect
      navigate("/", { replace: true });
    }
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
        isAuthenticated,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
