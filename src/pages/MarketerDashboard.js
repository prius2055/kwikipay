import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { useWallet } from "../context/walletContext";
import { BASE_URL, getHeaders } from "../api/api";
import SideBar from "../components/SideBar";
import Header from "../components/Header";
import VirtualAccountModal from "../components/VirtualAccountModal";

import "./MarketerDashboard.css";

/* ─── Stat Card ─── */
const StatCard = ({ icon, title, value, sub, color, delay }) => (
  <div className="md-stat-card" style={{ "--delay": delay, "--accent": color }}>
    <div className="md-stat-icon" style={{ background: color }}>
      {icon}
    </div>
    <div className="md-stat-body">
      <p className="md-stat-title">{title}</p>
      <h3 className="md-stat-value">{value}</h3>
      {sub && <p className="md-stat-sub">{sub}</p>}
    </div>
  </div>
);

/* ─── Quick Link ─── */
const QuickLink = ({ icon, label, to, color }) => {
  const navigate = useNavigate();
  return (
    <div
      className="md-quick-link"
      style={{ "--accent": color }}
      onClick={() => navigate(to)}
    >
      <span className="md-quick-icon">{icon}</span>
      <span className="md-quick-label">{label}</span>
      <span className="md-quick-arrow">→</span>
    </div>
  );
};

/* ─── Withdrawal Modal ─── */
// const WithdrawalModal = ({ onClose, onSubmit, submitting, error }) => {
//   const [form, setForm] = useState({
//     amount: "",
//     bankName: "",
//     accountNumber: "",
//     accountName: "",
//   });

//   const handleChange = (e) => {
//     setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     onSubmit(form);
//   };

//   return (
//     <div className="md-modal-overlay">
//       <div className="md-modal">
//         <div className="md-modal-header">
//           <h3>Request Withdrawal</h3>
//           <button className="md-modal-close" onClick={onClose}>
//             ✕
//           </button>
//         </div>

//         {error && <div className="md-modal-error">⚠️ {error}</div>}

//         <form onSubmit={handleSubmit} className="md-modal-form">
//           <div className="md-modal-field">
//             <label>Amount (₦)</label>
//             <input
//               type="number"
//               name="amount"
//               value={form.amount}
//               onChange={handleChange}
//               placeholder="Minimum ₦100"
//               min="100"
//               required
//             />
//           </div>
//           <div className="md-modal-field">
//             <label>Bank Name</label>
//             <input
//               type="text"
//               name="bankName"
//               value={form.bankName}
//               onChange={handleChange}
//               placeholder="e.g. First Bank"
//               required
//             />
//           </div>
//           <div className="md-modal-field">
//             <label>Account Number</label>
//             <input
//               type="text"
//               name="accountNumber"
//               value={form.accountNumber}
//               onChange={handleChange}
//               placeholder="10-digit account number"
//               maxLength={10}
//               required
//             />
//           </div>
//           <div className="md-modal-field">
//             <label>Account Name</label>
//             <input
//               type="text"
//               name="accountName"
//               value={form.accountName}
//               onChange={handleChange}
//               placeholder="As on your bank account"
//               required
//             />
//           </div>
//           <div className="md-modal-actions">
//             <button
//               type="button"
//               className="md-btn md-btn-secondary"
//               onClick={onClose}
//               disabled={submitting}
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               className="md-btn md-btn-primary"
//               disabled={submitting}
//             >
//               {submitting ? "Submitting..." : "Submit Request"}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

/* ─────────────────────────────────────────────────────────────
 * MARKETER DASHBOARD
 * ───────────────────────────────────────────────────────────── */
const MarketerDashboard = () => {
  const { user, loggingOut } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalUsers: 0,
    profitBalance: 0,
    fundingBalance: 0,
    totalBalance: 0,
    revenueToday: 0,
    totalWithdrawn: 0,
    totalRevenue: 0,
  });

  const [recentTransactions, setRecentTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  // const [withdrawSubmitting, setWithdrawSubmitting] = useState(false);
  // const [withdrawError, setWithdrawError] = useState(null);
  const [showVirtualAccountModal, setShowVirtualAccountModal] = useState(false);

  const [successMessage] = useState(null);

  const { balance, fundWallet, virtualAccounts, refreshWallet } = useWallet();

  const fmt = (n) =>
    new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      maximumFractionDigits: 0,
    }).format(n || 0);

  /* ── Fetch dashboard data ── */
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch(`${BASE_URL}/marketer/dashboard`, {
          headers: getHeaders(),
        });
        const result = await response.json();

        if (result.status === "success") {
          setStats(result.data.stats);
          setRecentTransactions(result.data.recentTransactions);
        } else {
          setError(result.message || "Failed to load dashboard.");
        }
      } catch (err) {
        console.error("Dashboard fetch error:", err.message);
        setError("Network error. Please refresh.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  /* ── Auto-verify Paystack redirect ──
   * When Paystack redirects back to /marketer/dashboard?reference=xxx
   * we verify the payment automatically.
   */

  /* ── Fund wallet ── */
  // const fundWallet = async () => {
  //   setFundingLoading(true);
  //   setError(null);

  //   try {
  //     const res = await fetch(`${BASE_URL}/marketer/fund`, {
  //       // ✅ fixed typo
  //       method: "POST",
  //       headers: getHeaders(),
  //     });

  //     const data = await res.json();

  //     if (!res.ok || data.status !== "success") {
  //       throw new Error(data.message || "Payment initialization failed.");
  //     }

  //     // ✅ Redirect to Paystack checkout
  //     window.location.href = data.data.authorization_url;
  //   } catch (err) {
  //     console.error("Fund wallet error:", err.message);
  //     setError(err.message);
  //   } finally {
  //     setFundingLoading(false);
  //   }
  // };

  const handleFundWallet = async (e) => {
    e.preventDefault();
    setError("");

    setLoading(true);

    const result = await fundWallet();

    if (result.success) {
      setShowVirtualAccountModal(true);
    } else {
      setError(result.message || "Failed to get virtual account.");
    }
    setLoading(false);
  };
  /* ── Verify wallet funding (called automatically after Paystack redirect) ── */

  /* ── Request withdrawal ── */
  // const requestWithdrawal = async ({
  //   amount,
  //   bankName,
  //   accountNumber,
  //   accountName,
  // }) => {
  //   setWithdrawSubmitting(true);
  //   setWithdrawError(null);

  //   try {
  //     const res = await fetch(`${BASE_URL}/marketer/withdraw`, {
  //       method: "POST", // ✅ POST not GET
  //       headers: getHeaders(),
  //       body: JSON.stringify({
  //         // ✅ required fields sent
  //         amount: Number(amount),
  //         bankName,
  //         accountNumber,
  //         accountName,
  //       }),
  //     });

  //     const data = await res.json();

  //     if (!res.ok || data.status !== "success") {
  //       throw new Error(data.message || "Withdrawal request failed.");
  //     }

  //     // ✅ Update profitBalance in stats
  //     setStats((prev) => ({
  //       ...prev,
  //       profitBalance: data.data.profitBalance,
  //     }));

  //     setShowWithdrawModal(false);
  //     setSuccessMessage(
  //       "Withdrawal request submitted. You will be paid within 24 hours.",
  //     );
  //     setTimeout(() => setSuccessMessage(null), 5000);
  //   } catch (err) {
  //     console.error("Withdrawal error:", err.message);
  //     setWithdrawError(err.message);
  //   } finally {
  //     setWithdrawSubmitting(false);
  //   }
  // };

  const statCards = [
    {
      icon: "👥",
      title: "Total Users",
      value: stats.totalUsers.toLocaleString(),
      sub: "Registered on your platform",
      color: "#3b82f6",
      delay: "0s",
    },
    {
      icon: "💰",
      title: "Funding Balance",
      value: fmt(stats.fundingBalance),
      sub: "Operating capital",
      color: "#10b981",
      delay: "0.1s",
    },
    {
      icon: "💸",
      title: "Profit Balance",
      value: fmt(stats.profitBalance),
      sub: "Available to withdraw",
      color: "#6366f1",
      delay: "0.2s",
    },
    {
      icon: "💸",
      title: "Total Balance",
      value: fmt(stats.totalBalance),
      sub: "All funds in your account",
      color: "#6366f1",
      delay: "0.2s",
    },
    {
      icon: "📊",
      title: "Total Withdrawn",
      value: fmt(stats.totalWithdrawn),
      sub: "All time",
      color: "#8b5cf6",
      delay: "0.3s",
    },
    {
      icon: "📈",
      title: "Today's Revenue",
      value: fmt(stats.revenueToday),
      sub: "Since midnight",
      color: "#ef4444",
      delay: "0.4s",
    },
  ];

  const quickLinks = [
    {
      icon: "👥",
      label: "Manage Users",
      to: "/marketer/users",
      color: "#3b82f6",
    },
    {
      icon: "📋",
      label: "Transactions",
      to: "/marketer/transactions",
      color: "#8b5cf6",
    },
    // {
    //   icon: "💸",
    //   label: "Withdraw Profit",
    //   to: "/marketer/withdrawals",
    //   color: "#10b981",
    // },
    {
      icon: "📡",
      label: "Data Plans & Pricing",
      to: "/marketer/data",
      color: "#f59e0b",
    },
    {
      icon: "🏪",
      label: "Resellers",
      to: "/marketer/resellers",
      color: "#ec4899",
    },
    // {
    //   icon: "⚙️",
    //   label: "Platform Settings",
    //   to: "/marketer/settings",
    //   color: "#64748b",
    // },
  ];

  const txStatusColor = {
    success: "#10b981",
    failed: "#ef4444",
    pending: "#f59e0b",
  };

  // Stop watching when modal closes
  const handleCloseVirtualModal = () => {
    setShowVirtualAccountModal(false);
  };

  // ✅ Add this at the very top of the return statement
  if (loggingOut) {
    return (
      <div className="logout-overlay">
        <div className="logout-card">
          <div className="logout-spinner" />
          <p className="logout-message">Signing you out...</p>
          <span className="logout-sub">See you next time 👋</span>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <SideBar marketerWalletBalance={stats?.totalBalance} />

      <div className="main-content">
        <Header />
        <div className="content md-content">
          {/* ── Success Banner ── */}
          {successMessage && (
            <div className="md-success-banner">✅ {successMessage}</div>
          )}

          {/* ── Error Banner ── */}
          {error && (
            <div className="md-error-banner">
              ⚠️ {error}
              <button onClick={() => setError(null)}>✕</button>
            </div>
          )}

          {/* ── Welcome Banner ── */}
          <div className="md-welcome">
            <div className="md-welcome-text">
              <p className="md-welcome-label">Marketer Dashboard</p>
              <h1 className="md-welcome-title">
                Welcome back,{" "}
                <span>{user?.fullName?.split(" ")[0] || "Marketer"}</span>
              </h1>
              <p className="md-welcome-sub">
                Here's what's happening on your platform today.
              </p>
            </div>
            <div className="md-welcome-actions">
              {/* ── Fund Wallet inline ── */}
              <div className="md-fund-row">
                <button
                  className="md-btn md-btn-primary"
                  onClick={handleFundWallet}
                  disabled={loading}
                >
                  {loading ? "Processing..." : "💳 Fund Wallet"}
                </button>
              </div>
              {/* <button
                className="md-btn md-btn-primary"
                onClick={() => setShowWithdrawModal(true)}
              >
                💸 Request Withdrawal
              </button> */}
              <button
                className="md-btn md-btn-secondary"
                onClick={() => navigate("/marketer/settings")}
              >
                ⚙️ Settings
              </button>
            </div>
          </div>

          {/* ── Stats Grid ── */}
          {loading ? (
            <div className="md-skeleton-grid">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="md-skeleton-card" />
              ))}
            </div>
          ) : (
            <div className="md-stats-grid">
              {statCards.map((card, i) => (
                <StatCard key={i} {...card} />
              ))}
            </div>
          )}

          {/* ── Main Grid: Recent Tx + Quick Links ── */}
          <div className="md-main-grid">
            <div className="md-panel">
              <div className="md-panel-header">
                <h2 className="md-panel-title">Recent Transactions</h2>
                <button
                  className="md-panel-link"
                  onClick={() => navigate("/marketer/transactions")}
                >
                  View all →
                </button>
              </div>

              {recentTransactions.length === 0 ? (
                <div className="md-empty">
                  <span>📭</span>
                  <p>No transactions yet</p>
                </div>
              ) : (
                <div className="md-tx-list">
                  {recentTransactions.map((tx, i) => (
                    <div key={i} className="md-tx-row">
                      <div className="md-tx-icon">
                        {tx.type === "data"
                          ? "📶"
                          : tx.type === "airtime"
                            ? "📱"
                            : tx.type === "meter_recharge"
                              ? "💡"
                              : tx.type === "cable_recharge"
                                ? "📺"
                                : "💳"}
                      </div>
                      <div className="md-tx-info">
                        <p className="md-tx-desc">
                          {tx.description || tx.type}
                        </p>
                        <p className="md-tx-meta">
                          {tx.phone} ·{" "}
                          {new Date(tx.createdAt).toLocaleDateString("en-NG")}
                        </p>
                      </div>
                      <div className="md-tx-right">
                        <p className="md-tx-amount">{fmt(tx.amount)}</p>
                        <span
                          className="md-tx-status"
                          style={{ color: txStatusColor[tx.status] }}
                        >
                          {tx.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="md-panel">
              <div className="md-panel-header">
                <h2 className="md-panel-title">Quick Actions</h2>
              </div>
              <div className="md-quick-links">
                {quickLinks.map((link, i) => (
                  <QuickLink key={i} {...link} />
                ))}
              </div>
            </div>
          </div>

          {/* ── Info Row ── */}
          <div className="md-info-row">
            <div className="md-info-card md-info-support">
              <h3>Support Team</h3>
              <p>Need help? Reach our support team directly on WhatsApp.</p>
              <div className="md-info-btns">
                <button className="md-whatsapp-btn">💬 WhatsApp Us</button>
                <button className="md-whatsapp-btn">💬 Join Group</button>
              </div>
            </div>
            <div className="md-info-card md-info-notice">
              <h3>📢 Notice</h3>
              <p>
                Keep your platform settings up to date and monitor your profit
                balance regularly.
              </p>
              <button
                className="md-info-btn"
                onClick={() => navigate("/marketer/settings")}
              >
                Go to Settings
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Withdrawal Modal ── */}
      {/* {showWithdrawModal && (
        <WithdrawalModal
          onClose={() => {
            setShowWithdrawModal(false);
            setWithdrawError(null);
          }}
          onSubmit={requestWithdrawal}
          submitting={withdrawSubmitting}
          error={withdrawError}
        />
      )} */}

      {showVirtualAccountModal && (
        <VirtualAccountModal
          accounts={virtualAccounts}
          onClose={handleCloseVirtualModal} // ✅ stops interval on close
          onBalanceRefresh={refreshWallet} // ✅ modal polls internally too
          currentBalance={balance} // ✅ modal detects balance change
        />
      )}
    </div>
  );
};

export default MarketerDashboard;
