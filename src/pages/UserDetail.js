import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { useAuth } from "../context/authContext";
import "./UserDetail.css";

/**
 * UserDetail
 * Admin view of a single user — profile, wallet adjustment,
 * password reset, role change, and transaction history.
 */
const UserDetail = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { notify } = useAuth();
  const {
    user,
    userLoading,
    actionLoading,
    getUser,
    clearUser,
    suspendUser,
    activateUser,
    changeUserRole,
    adminResetUserPassword,
    adjustUserWallet,
    getUserTransactions,
  } = useUser();

  const [transactions, setTransactions] = useState([]);
  const [txLoading, setTxLoading] = useState(false);

  /* ── Forms ── */
  const [newPassword, setNewPassword] = useState("");
  const [newRole, setNewRole] = useState("");
  const [walletAmount, setWalletAmount] = useState("");
  const [walletType, setWalletType] = useState("credit");
  const [walletReason, setWalletReason] = useState("");

  useEffect(() => {
    getUser(userId);
    loadTransactions();
    return () => clearUser();
  }, [userId]);

  useEffect(() => {
    if (user) setNewRole(user.role);
  }, [user]);

  const loadTransactions = async () => {
    setTxLoading(true);
    const result = await getUserTransactions(userId);
    if (result.status) setTransactions(result.transactions);
    setTxLoading(false);
  };

  const handleStatusToggle = async () => {
    const result =
      user.status === "active"
        ? await suspendUser(userId)
        : await activateUser(userId);
    notify(result.status ? "success" : "error", result.message);
  };

  const handleRoleChange = async (e) => {
    e.preventDefault();
    const result = await changeUserRole(userId, newRole);
    notify(result.status ? "success" : "error", result.message);
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    if (newPassword.length < 8) {
      notify("error", "Password must be at least 8 characters.");
      return;
    }
    const result = await adminResetUserPassword(userId, newPassword);
    notify(result.status ? "success" : "error", result.message);
    if (result.status) setNewPassword("");
  };

  const handleWalletAdjust = async (e) => {
    e.preventDefault();
    if (!walletAmount || isNaN(walletAmount) || Number(walletAmount) <= 0) {
      notify("error", "Enter a valid amount.");
      return;
    }
    const result = await adjustUserWallet(userId, {
      amount: Number(walletAmount),
      type: walletType,
      reason: walletReason,
    });
    notify(result.status ? "success" : "error", result.message);
    if (result.status) {
      setWalletAmount("");
      setWalletReason("");
    }
  };

  if (userLoading) {
    return (
      <div className="ud-loading">
        <div className="ud-spinner" />
        <p>Loading user...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="ud-empty">
        <span>👤</span>
        <p>User not found.</p>
        <button className="ud-back-btn" onClick={() => navigate(-1)}>
          ← Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="ud-wrapper">
      {/* ── Back ── */}
      <button className="ud-back-btn" onClick={() => navigate(-1)}>
        ← Back to Users
      </button>

      {/* ── Profile Card ── */}
      <div className="ud-profile-card">
        <div className="ud-avatar">
          {user.fullName?.charAt(0).toUpperCase()}
        </div>
        <div className="ud-profile-info">
          <h2 className="ud-name">{user.fullName}</h2>
          <p className="ud-meta">
            @{user.username} · {user.email} · {user.phone}
          </p>
          <div className="ud-badges">
            <span className={`ud-badge ud-badge--${user.status}`}>
              {user.status}
            </span>
            <span className={`ud-role ud-role--${user.role}`}>{user.role}</span>
            <span className="ud-joined">
              Joined {new Date(user.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
        <button
          className={`ud-toggle-btn ${user.status === "active" ? "ud-toggle-btn--warn" : "ud-toggle-btn--success"}`}
          onClick={handleStatusToggle}
          disabled={actionLoading}
        >
          {actionLoading
            ? "..."
            : user.status === "active"
              ? "Suspend"
              : "Activate"}
        </button>
      </div>

      {/* ── Stats row ── */}
      <div className="ud-stats">
        {[
          {
            label: "Wallet Balance",
            value: `₦${(user.walletBalance || 0).toLocaleString()}`,
          },
          { label: "Referrals", value: user.referralsCount || 0 },
          {
            label: "Commission",
            value: `₦${(user.commissionEarnings || 0).toLocaleString()}`,
          },
          { label: "Referral Code", value: user.referralCode || "—" },
        ].map((s) => (
          <div className="ud-stat" key={s.label}>
            <p className="ud-stat-label">{s.label}</p>
            <p className="ud-stat-value">{s.value}</p>
          </div>
        ))}
      </div>

      {/* ── Admin Actions Grid ── */}
      <div className="ud-actions-grid">
        {/* Change Role */}
        <div className="ud-action-card">
          <h3 className="ud-action-title">Change Role</h3>
          <form onSubmit={handleRoleChange} className="ud-form">
            <select
              className="ud-input"
              value={newRole}
              onChange={(e) => setNewRole(e.target.value)}
            >
              <option value="user">User</option>
              <option value="reseller">Reseller</option>
              <option value="marketer">Marketer</option>
              <option value="admin">Admin</option>
            </select>
            <button
              className="ud-btn ud-btn--primary"
              type="submit"
              disabled={actionLoading}
            >
              {actionLoading ? "Saving..." : "Update Role"}
            </button>
          </form>
        </div>

        {/* Reset Password */}
        <div className="ud-action-card">
          <h3 className="ud-action-title">Reset Password</h3>
          <form onSubmit={handlePasswordReset} className="ud-form">
            <input
              className="ud-input"
              type="password"
              placeholder="New password (min 8 chars)"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              minLength={8}
              required
            />
            <button
              className="ud-btn ud-btn--warn"
              type="submit"
              disabled={actionLoading}
            >
              {actionLoading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        </div>

        {/* Wallet Adjustment */}
        <div className="ud-action-card">
          <h3 className="ud-action-title">Adjust Wallet</h3>
          <form onSubmit={handleWalletAdjust} className="ud-form">
            <select
              className="ud-input"
              value={walletType}
              onChange={(e) => setWalletType(e.target.value)}
            >
              <option value="credit">Credit (+)</option>
              <option value="debit">Debit (−)</option>
            </select>
            <input
              className="ud-input"
              type="number"
              placeholder="Amount (₦)"
              value={walletAmount}
              onChange={(e) => setWalletAmount(e.target.value)}
              min="1"
              required
            />
            <input
              className="ud-input"
              type="text"
              placeholder="Reason (optional)"
              value={walletReason}
              onChange={(e) => setWalletReason(e.target.value)}
            />
            <button
              className={`ud-btn ${walletType === "credit" ? "ud-btn--success" : "ud-btn--danger"}`}
              type="submit"
              disabled={actionLoading}
            >
              {actionLoading
                ? "Processing..."
                : walletType === "credit"
                  ? "Credit Wallet"
                  : "Debit Wallet"}
            </button>
          </form>
        </div>
      </div>

      {/* ── Transactions ── */}
      <div className="ud-tx-section">
        <h3 className="ud-section-title">Recent Transactions</h3>
        {txLoading ? (
          <div className="ud-loading">
            <div className="ud-spinner" />
          </div>
        ) : transactions.length === 0 ? (
          <p className="ud-no-tx">No transactions found.</p>
        ) : (
          <div className="ud-tx-table-wrapper">
            <table className="ud-tx-table">
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Reference</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx) => (
                  <tr key={tx._id}>
                    <td className="ud-tx-type">{tx.type}</td>
                    <td>₦{tx.amount?.toLocaleString()}</td>
                    <td>
                      <span className={`ud-badge ud-badge--${tx.status}`}>
                        {tx.status}
                      </span>
                    </td>
                    <td>{new Date(tx.createdAt).toLocaleDateString()}</td>
                    <td className="ud-tx-ref">{tx.reference || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDetail;
