import { useState } from "react";
// import { useNavigate } from "react-router-dom";
import { useAuth } from "../components/authContext";
import Sidebar from "../components/SideBar";
import Header from "../components/Header";

import "./RequestPasswordReset.css";

const RequestPasswordReset = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { requestPasswordReset } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    console.log("=== EMAIL PASSED ===");
    console.log("Email:", email);

    try {
      // 🔍 Validation
      if (!email) {
        throw new Error("Please enter your email address");
      }

      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw new Error("Please enter a valid email address");
      }

      console.log("📡 Sending password reset request...");

      // 🚀 Call backend
      const result = await requestPasswordReset(email);

      console.log("=== PASSWORD RESET REQUESTED ===");
      console.log("Result:", result);

      if (result?.status === "success" || result?.status) {
        console.log("✅ Password request email sent");
        setError("");
        // setSuccess(true);

        // Don't auto-redirect, let user read the success message
        // setTimeout(() => {
        //   navigate("/login");
        // }, 5000);
      } else {
        console.warn("⚠️ Backend rejected password reset");
        setError(result?.message || "Password reset failed. Please try again.");
      }
    } catch (err) {
      console.error("🔥 Password reset error caught:", err);

      setError(
        err.message ||
          "Failed to send reset email. Please check your connection and try again.",
      );
    } finally {
      console.log("🧹 Reset Password cleanup complete");
      setLoading(false);
    }
  };

  // Success state
  // if (success) {
  //   return (
  //     <div className="reset-password-page">
  //       <Sidebar />
  //       <div className="reset-password-card">
  //         <Header />
  //         <div className="reset-password-header">
  //           <div
  //             className="reset-password-icon"
  //             style={{ backgroundColor: "rgba(16, 185, 129, 0.2)" }}
  //           >
  //             <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
  //               <path
  //                 strokeLinecap="round"
  //                 strokeLinejoin="round"
  //                 strokeWidth="2"
  //                 d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
  //               />
  //             </svg>
  //           </div>
  //           <h1 className="reset-password-title">Check Your Email</h1>
  //           <p className="reset-password-subtitle">
  //             We've sent a password reset link to your email
  //           </p>
  //         </div>

  //         <div className="reset-password-body">
  //           <div className="success-alert">
  //             <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
  //               <path
  //                 strokeLinecap="round"
  //                 strokeLinejoin="round"
  //                 strokeWidth="2"
  //                 d="M5 13l4 4L19 7"
  //               />
  //             </svg>
  //             <div>
  //               <strong>Email sent successfully!</strong>
  //               <p style={{ margin: "0.5rem 0 0 0", fontSize: "0.875rem" }}>
  //                 Please check your email inbox (and spam folder) for a password
  //                 reset link. The link will expire in 10 minutes.
  //               </p>
  //             </div>
  //           </div>

  //           <div style={{ marginTop: "1.5rem", textAlign: "center" }}>
  //             <p
  //               style={{
  //                 fontSize: "0.875rem",
  //                 color: "#6b7280",
  //                 marginBottom: "1rem",
  //               }}
  //             >
  //               Didn't receive the email?
  //             </p>
  //             <button
  //               onClick={() => setSuccess(false)}
  //               className="submit-button"
  //               style={{ maxWidth: "200px", margin: "0 auto" }}
  //             >
  //               Resend Email
  //             </button>
  //           </div>
  //         </div>

  //         <div className="reset-password-footer">
  //           <a href="/login" className="footer-link">
  //             <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
  //               <path
  //                 strokeLinecap="round"
  //                 strokeLinejoin="round"
  //                 strokeWidth="2"
  //                 d="M15 19l-7-7 7-7"
  //               />
  //             </svg>
  //             Back to Login
  //           </a>
  //         </div>
  //       </div>
  //     </div>
  //   );
  // }

  // Form state
  return (
    <div className="request-password-page">
      <Sidebar />

      <div className="request-container">
        <Header />
        <div className="request-password-card">
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
            <h1 className="reset-password-title">Forgot Password?</h1>
            <p className="reset-password-subtitle">
              Enter your email address and we'll send you a link to reset your
              password
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

              {/* Email Input */}
              <div className="form-group">
                <label htmlFor="email" className="form-label required">
                  Email Address
                </label>
                <div className="password-input-wrapper">
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="form-input"
                    placeholder="Enter your email address"
                    required
                    autoFocus
                  />
                  <div
                    style={{
                      position: "absolute",
                      right: "1rem",
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: "#9ca3af",
                      pointerEvents: "none",
                    }}
                  >
                    <svg
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      style={{ width: "20px", height: "20px" }}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                      />
                    </svg>
                  </div>
                </div>
                <p
                  style={{
                    fontSize: "0.8125rem",
                    color: "#6b7280",
                    margin: "0.375rem 0 0 0",
                  }}
                >
                  We'll send a password reset link to this email
                </p>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || !email}
                className={`submit-button ${loading ? "loading" : ""}`}
              >
                {loading && <span className="button-spinner"></span>}
                {loading ? "Sending Email..." : "Send Reset Link"}
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
    </div>
  );
};

export default RequestPasswordReset;
