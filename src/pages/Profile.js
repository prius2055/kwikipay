import { useEffect } from "react";
import { useAuth } from "../components/authContext";
import { useWallet } from "../components/walletContext";
import SideBar from "../components/SideBar";
import Header from "../components/Header";
import { useNavigate } from "react-router";

import "./Profile.css";

const UserProfile = () => {
  const { user } = useAuth();
  const { wallet } = useWallet();

  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      console.log(user);
    }
  }, [user]);

  return (
    <div className="user-profile-page">
      <SideBar />

      <div className="profile">
        <Header />
        <div className="profile-container">
          {/* Header */}
          <div className="profile-header">
            <div className="profile-avatar">
              <div className="avatar-circle">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
            </div>
            <div className="profile-info">
              <h1 className="profile-name">{user?.fullName || "User"}</h1>
              <p className="profile-username">
                @{user?.username || "username"}
              </p>
              <div className="profile-badges">
                <span className="badge badge-primary">
                  {user?.role || "User"}
                </span>
                <span className="badge badge-success">Verified</span>
              </div>
            </div>
          </div>

          {/* Wallet Summary */}
          <div className="wallet-summary">
            <div className="wallet-card">
              <div className="wallet-icon">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                  />
                </svg>
              </div>
              <div>
                <p className="wallet-label">Wallet Balance</p>
                <p className="wallet-amount">
                  ₦{wallet?.balance?.toLocaleString() || "0.00"}
                </p>
              </div>
            </div>
            <div className="wallet-card">
              <div className="wallet-icon">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <div>
                <p className="wallet-label">Referral Code</p>
                <p className="wallet-amount">{user?.referralCode || "N/A"}</p>
              </div>
            </div>
          </div>
          <div className="profile-content">
            <div className="content-header">
              <h2>Profile Information</h2>

              <button
                className="btn-edit"
                onClick={() => navigate("/password/reset")}
              >
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
                Change Password
              </button>
            </div>

            <div className="form-row">
              <div className="form-group">
                <p className="form-group-label">Full Name</p>
                <p className="form-group-input">{user.fullName}</p>
              </div>
              <div className="form-group">
                <p className="form-group-label">Email</p>
                <p className="form-group-input">{user.email}</p>
              </div>
              <div className="form-group">
                <p className="form-group-label">Username</p>
                <p className="form-group-input">{user.username}</p>
              </div>
              <div className="form-group">
                <p className="form-group-label">Phone Number</p>
                <p className="form-group-input">{user.phone}</p>
              </div>
              <div className="form-group">
                <p className="form-group-label">Address</p>
                <p className="form-group-input">{user.address}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
