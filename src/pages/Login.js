import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../components/authContext";

import "./Auth.css";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { login, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect if already logged in
    if (user) {
      // console.log("✅ User already logged in, redirecting to dashboard...");
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Validation
    if (!username || !password) {
      setError("Please fill in all fields");
      setIsLoading(false);
      return;
    }

    // Email validation
    // const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // if (!emailRegex.test(email)) {
    //   setError("Please enter a valid email address");
    //   setIsLoading(false);
    //   return;
    // }

    // console.log("🔵 Attempting login...");

    // Call backend login
    const result = await login(username.trim(), password.trim());

    // console.log("📊 Login result:", result);

    if (result.status) {
      // console.log("✅ Login successful, redirecting to dashboard...");
      setError("");
      // Navigation will happen via useEffect when user state updates
      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);
    } else {
      setError(result.message || "Invalid email or password");
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="loading">
        <p>Signing you in...</p>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-brand">GEODNATECH</h1>
        <h2 className="auth-title">Sign In</h2>

        <div className="auth-form">
          {error && (
            <div
              style={{
                padding: "12px",
                marginBottom: "20px",
                backgroundColor: "#fee2e2",
                color: "#dc2626",
                borderRadius: "8px",
                fontSize: "14px",
                border: "1px solid #fecaca",
              }}
            >
              {error}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Username*</label>
            <input
              type="username"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your Username"
              autoComplete="Username"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password*</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              autoComplete="current-password"
            />
          </div>

          <div className="form-footer">
            <Link className="forgot-link" to="/password/reset">
              Forgot Password?
            </Link>
            <button
              onClick={handleSubmit}
              className="btn-submit"
              disabled={isLoading}
            >
              {isLoading ? "Signing In..." : "Sign In"}
            </button>
          </div>

          <div className="auth-switch">
            Don't have an account yet?
            <Link to="/signup"> Sign Up</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
