import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../components/authContext";
import SideBar from "../components/SideBar";
import Header from "../components/Header";

import "./ResetPassword.css";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const { resetPassword } = useAuth();

  // Password strength calculator
  const getPasswordStrength = (password) => {
    if (!password) return null;

    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;

    if (strength <= 2) return "weak";
    if (strength <= 4) return "medium";
    return "strong";
  };

  const passwordStrength = getPasswordStrength(password);

  // Password validation checks
  const passwordChecks = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /\d/.test(password),
    match: password && password === confirmPassword,
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    console.log("=== PASSWORD RESET STARTED ===");
    console.log("Form Data:", password, confirmPassword);

    try {
      // 🔍 Validation
      if (!password || !confirmPassword) {
        throw new Error("Please fill in all required fields");
      }

      if (password.length < 8) {
        throw new Error("Password must be at least 8 characters long");
      }

      if (password !== confirmPassword) {
        throw new Error("Passwords do not match");
      }

      console.log("📡 Sending password reset request...");

      // 🚀 Call backend
      const result = await resetPassword({
        password: password,
        token,
      });

      console.log("=== RESET PASSWORD RESULT ===");
      console.log("Result:", result);

      if (result?.status) {
        console.log("✅ Password reset successful");
        setError("");
        setSuccess(true);

        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        console.warn("⚠️ Backend rejected password reset");
        setError(result?.message || "Password reset failed. Please try again.");
      }
    } catch (err) {
      console.error("🔥 Password reset error caught:", err);

      setError(
        err.message ||
          "Failed to reset password. Please check your connection and try again.",
      );
    } finally {
      console.log("🧹 Reset Password cleanup complete");
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="reset-password-page">
        <SideBar />
        <div className="reset-password-card">
          <Header />
          <div className="reset-password-body">
            <div className="success-alert">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <div>
                <strong>Password reset successful!</strong>
                <p style={{ margin: "0.25rem 0 0 0", fontSize: "0.875rem" }}>
                  Redirecting to login...
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="reset-password-page">
      <div className="reset-password-card">
        {/* Header */}
        <div className="reset-password-header">
          <div className="reset-password-icon">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
              />
            </svg>
          </div>
          <h1 className="reset-password-title">Reset Password</h1>
          <p className="reset-password-subtitle">
            Enter your new password below
          </p>
        </div>

        {/* Body */}
        <div className="reset-password-body">
          <form onSubmit={handleSubmit} className="reset-password-form">
            {/* Error Alert */}
            {error && (
              <div className="error-alert">
                <div className="error-alert-icon">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div className="error-alert-content">
                  <p className="error-alert-title">Error</p>
                  <p className="error-alert-message">{error}</p>
                </div>
              </div>
            )}

            {/* New Password */}
            <div className="form-group">
              <label htmlFor="password" className="form-label required">
                New Password
              </label>
              <div className="password-input-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-input"
                  placeholder="Enter new password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="toggle-password"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? (
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                      />
                    </svg>
                  ) : (
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  )}
                </button>
              </div>

              {/* Password Strength */}
              {password && (
                <div className="password-strength">
                  <span className="password-strength-label">
                    Password strength:{" "}
                    <strong style={{ textTransform: "capitalize" }}>
                      {passwordStrength}
                    </strong>
                  </span>
                  <div className="password-strength-bar">
                    <div
                      className={`password-strength-fill ${passwordStrength}`}
                    ></div>
                  </div>
                </div>
              )}

              {/* Requirements */}
              <div className="password-requirements">
                <ul>
                  <li className={passwordChecks.length ? "valid" : "invalid"}>
                    <svg fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    At least 8 characters
                  </li>
                  <li
                    className={
                      passwordChecks.uppercase && passwordChecks.lowercase
                        ? "valid"
                        : "invalid"
                    }
                  >
                    <svg fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Uppercase & lowercase letters
                  </li>
                  <li className={passwordChecks.number ? "valid" : "invalid"}>
                    <svg fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    At least one number
                  </li>
                </ul>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="form-group">
              <label htmlFor="confirmPassword" className="form-label required">
                Confirm Password
              </label>
              <div className="password-input-wrapper">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`form-input ${confirmPassword && !passwordChecks.match ? "error" : ""}`}
                  placeholder="Confirm new password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="toggle-password"
                  aria-label="Toggle confirm password visibility"
                >
                  {showConfirmPassword ? (
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                      />
                    </svg>
                  ) : (
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  )}
                </button>
              </div>
              {confirmPassword && !passwordChecks.match && (
                <p
                  style={{
                    fontSize: "0.8125rem",
                    color: "#dc2626",
                    margin: "0.375rem 0 0 0",
                  }}
                >
                  Passwords do not match
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={
                loading || !passwordChecks.match || !passwordChecks.length
              }
              className={`submit-button ${loading ? "loading" : ""}`}
            >
              {loading && <span className="button-spinner"></span>}
              {loading ? "Resetting Password..." : "Reset Password"}
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="reset-password-footer">
          <a href="/login" className="footer-link">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Login
          </a>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
