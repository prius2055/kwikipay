import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../components/authContext";

import "./Auth.css";

const Register = () => {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    phone: "",
    address: "",
    referral: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false,
  });

  const navigate = useNavigate();
  const { register } = useAuth();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");
    setIsLoading(true);

    console.log("=== REGISTRATION STARTED ===");
    console.log("Form Data:", formData);

    try {
      // 🔍 Validation
      if (
        !formData.fullName ||
        !formData.username ||
        !formData.email ||
        !formData.phone ||
        !formData.address ||
        !formData.password
      ) {
        throw new Error("Please fill in all required fields");
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        throw new Error("Please enter a valid email address");
      }

      if (formData.password.length < 8) {
        throw new Error("Password must be at least 8 characters long");
      }

      if (formData.password !== formData.confirmPassword) {
        throw new Error("Passwords do not match");
      }

      if (!formData.agreeTerms) {
        throw new Error("You must agree to the terms and conditions");
      }

      console.log("📡 Sending registration request...");

      // 🚀 Call backend
      const result = await register({
        fullName: formData.fullName,
        username: formData.username,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        referrer: formData.referral,
        password: formData.password,
      });

      console.log("=== REGISTRATION RESULT ===");
      console.log("Result:", result);

      if (result?.status) {
        console.log("✅ Registration successful");
        setError("");
        setSuccess("Account created successfully!");

        setTimeout(() => {
          navigate("/login");
        }, 1500);
      } else {
        console.warn("⚠️ Backend rejected registration");
        setError(result?.message || "Registration failed. Please try again.");
      }
    } catch (err) {
      console.error("🔥 Registration error caught:", err);

      setError(
        err.message ||
          "Something went wrong. Please check your connection and try again."
      );
    } finally {
      console.log("🧹 Registration cleanup complete");
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="loading">
        <p>Creating your account...</p>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-card register-card">
        <h1 className="auth-brand">GEODNATECH</h1>
        <h2 className="auth-title">Sign Up</h2>

        <div className="auth-form">
          {error && (
            <div
              style={{
                padding: "10px",
                marginBottom: "15px",
                backgroundColor: "#fee",
                color: "#c33",
                borderRadius: "5px",
                fontSize: "14px",
              }}
            >
              {error}
            </div>
          )}

          {success && (
            <div
              style={{
                padding: "10px",
                marginBottom: "15px",
                backgroundColor: "#efe",
                color: "#3c3",
                borderRadius: "5px",
                fontSize: "14px",
              }}
            >
              {success}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="fullName">Full Name*</label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Enter your full name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="username">Username*</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Choose a username"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email*</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone">Phone*</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter your phone number"
            />
          </div>

          <div className="form-group">
            <label htmlFor="address">Address*</label>
            <textarea
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              rows="4"
              placeholder="Enter your address"
            />
          </div>

          <div className="form-group">
            <label htmlFor="referral">Referral username [optional]</label>
            <input
              type="text"
              id="referral"
              name="referral"
              placeholder="Leave blank if no referral"
              value={formData.referral}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password*</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a password"
            />
            <small className="form-hint">
              min_length: 8 mix characters [e.g., musa1234]
            </small>
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password*</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              placeholder="Enter same password as before"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
          </div>

          <div className="form-group checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="agreeTerms"
                checked={formData.agreeTerms}
                onChange={handleChange}
              />
              <span>
                I Agree{" "}
                <span className="terms-link">to the terms and conditions</span>
              </span>
            </label>
          </div>

          <button
            onClick={handleSubmit}
            className="btn-submit btn-block"
            disabled={isLoading}
          >
            {isLoading ? "Creating Account..." : "Sign Up"}
          </button>

          <div className="auth-switch">
            Already a member? <Link to="/login">Sign In</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
