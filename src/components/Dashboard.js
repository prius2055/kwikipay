import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MessageCircle } from "lucide-react";
import { useAuth } from "./authContext";
import { useWallet } from "./walletContext";
import SideBar from "./SideBar";
import Header from "./Header";
import UpgradeModal from "./UpgradeModal";
import ServiceTable from "./ServiceTable";

import "./Dashboard2.css";

const Dashboard = () => {
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const { user } = useAuth();

  const {
    loading,
    balance,
    fetchDataPlans,
    dataPlans,
    totalFunded,
    totalSpent,
    upgradeToReseller,
  } = useWallet();

  const navigate = useNavigate();

  const { referralEarnings, referralsCount } = user;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(amount);
  };

  useEffect(() => {
    fetchDataPlans();
  }, [fetchDataPlans]);

  const handleUpgradeClick = () => {
    setShowUpgradeModal(true);

    console.log("clicked to upgrade");
    // Prevent body scroll
    document.body.classList.add("modal-open");
  };

  const handleCloseModal = () => {
    setShowUpgradeModal(false);
    // Re-enable body scroll
    document.body.classList.remove("modal-open");
  };

  const handleConfirmUpgrade = async () => {
    try {
      const result = await upgradeToReseller();
      console.log(result);
      if (result.success) {
        // Show success message
        alert("Successfully upgraded to Reseller!");
        handleCloseModal();
      }
    } catch (error) {
      console.error("Upgrade failed:", error);
      alert(error.message || "Upgrade failed. Please try again.");
    }
  };

  const serviceCards = [
    { icon: "📱", title: "Data card Printing", color: "#f59e42" },
    {
      icon: "💳",
      title: "Airtime TopUp",
      color: "#3b9fd8",
      page: () => {
        navigate("/buy-airtime");
      },
    },
    {
      icon: "📶",
      title: "Buy Data",
      color: "#6ca843",
      page: () => {
        navigate("/buy-data");
      },
    },
    { icon: "💰", title: "Airtime to cash", color: "#2d6f3f" },
    {
      icon: "💡",
      title: "Electricity Bills",
      color: "#f59e42",
      page: () => {
        navigate("/utilities/recharge-meter");
      },
    },
    {
      icon: "📺",
      title: "Cable Subscription",
      color: "#5c7cfa",
      page: () => {
        navigate("/utilities/recharge-cable");
      },
    },
    { icon: "💳", title: "Bonus to wallet", color: "#3b9fd8" },
    { icon: "📚", title: "Result Checker", color: "#2d5f8f" },
    { icon: "🎫", title: "Recharge card Printing", color: "#888" },
    { icon: "👥", title: "My Referrals", color: "#6c5ce7" },
  ];

  const balanceCards = [
    {
      icon: "💰",
      title: "Total Funded",
      amount: `${totalFunded !== null ? formatCurrency(totalFunded) : "Loading..."}`,
      color: "#3b9fd8",
    },
    {
      icon: "💰",
      title: "Total Spent",
      amount: `${totalSpent !== null ? formatCurrency(totalSpent) : "Loading..."}`,
      color: "#3b9fd8",
    },

    {
      icon: "💰",
      title: "Referral Bonus",
      amount: `${formatCurrency(referralEarnings)}`,
      color: "#3b9fd8",
    },
    {
      icon: "💳",
      title: "Wallet Balance",
      amount: `${balance !== null ? formatCurrency(balance) : "Loading..."}`,
      color: "#3b9fd8",
    },
    {
      icon: "👥",
      title: "My Total Referral",
      amount: `${referralsCount}`,
      color: "#6c5ce7",
    },
  ];

  const quickActions = [
    { icon: "🔄", title: "get VFB Account", color: "#6c5ce7" },
    {
      icon: "📋",
      title: "Transactions",
      color: "#6c5ce7",
      page: () => {
        navigate("/transactions");
      },
    },
    // { icon: "📱", title: "Data Transactions", color: "#6c5ce7" },
    // { icon: "📶", title: "Airtime Transactions", color: "#6c5ce7" },
    { icon: "💳", title: "Wallet summary", color: "#f59e42" },
    {
      icon: "⬆️",
      title: "Upgrade to Reseller ₦1000",
      color: "#e74c3c",
      page: handleUpgradeClick,
    },
  ];

  return (
    <div className="dashboard-container">
      <SideBar />
      <div className="main-content">
        <Header />
        <Link to="/funding" className="fund-wallet-btn">
          Fund Wallet
        </Link>

        <div className="content">
          <div className="greeting-section">
            <div className="package-title">
              Package:
              <span className={user.role === "reseller" ? "premium" : ""}>
                {user.role === "user" ? "Smart Earner" : user.role}
              </span>
            </div>

            <a
              href="https://play.google.com/store/apps/details?id=your.app.id"
              target="_blank"
              rel="noopener noreferrer"
              className="google-play-btn"
            >
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
                alt="Get it on Google Play"
              />
            </a>

            <button
              className="generate-vfb-btn"
              // onClick={handleGenerateVirtualAccount}
            >
              Generate Virtual Account
              <br />
              to fund your wallet
            </button>
          </div>

          {user.role === "user" && (
            <div className="dashboard-hero">
              <div className="hero-content">
                {/* Badge */}
                <div className="hero-badge">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                    />
                  </svg>
                  <span>Limited Time Offer</span>
                </div>

                {/* Heading */}
                <h1 className="hero-title">
                  Ready to
                  <span className="gradient-text">Unlock More Profits?</span>
                </h1>

                {/* Description */}
                <p className="hero-description">
                  Upgrade to Reseller status and enjoy exclusive discounts,
                  priority support, and higher commission rates. Start earning
                  more on every transaction today!
                </p>

                {/* Features */}
                <div className="hero-features">
                  <div className="feature-item">
                    <svg fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>Up to 30% Higher Discounts</span>
                  </div>
                  <div className="feature-item">
                    <svg fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>Priority 24/7 Support</span>
                  </div>
                  <div className="feature-item">
                    <svg fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>Exclusive Reseller Dashboard</span>
                  </div>
                </div>

                {/* CTA Button */}
                <div className="hero-cta">
                  <button className="cta-button" onClick={handleUpgradeClick}>
                    <span className="button-content">
                      <svg
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M13 10V3L4 14h7v7l9-11h-7z"
                        />
                      </svg>
                      Upgrade to Reseller Now
                    </span>
                    <span className="button-shine"></span>
                  </button>
                  <p className="cta-subtext">
                    Only ₦1,000 one-time fee • Instant activation
                  </p>
                </div>
              </div>

              {/* Illustration/Icon Side */}
              <div className="hero-illustration">
                <div className="illustration-circle circle-1"></div>
                <div className="illustration-circle circle-2"></div>
                <div className="illustration-circle circle-3"></div>
                <div className="illustration-icon">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              </div>
            </div>
          )}

          <div className="quick-actions-grid">
            {quickActions.map(
              (action, index) =>
                action.title !== "Upgrade to Reseller ₦1000" &&
                user.role === "user" && (
                  <div
                    key={index}
                    className="quick-action-card"
                    onClick={action.page}
                  >
                    <div
                      className="quick-action-icon"
                      style={{ background: action.color }}
                    >
                      {action.icon}
                    </div>
                    <div className="quick-action-title">{action.title}</div>
                  </div>
                ),
            )}
          </div>

          <div className="balance-cards-grid">
            {balanceCards.map((card, index) => (
              <div key={index} className="balance-card">
                <div
                  className="balance-icon"
                  style={{ background: card.color }}
                >
                  {card.icon}
                </div>
                <div className="balance-info">
                  <div className="balance-title">{card.title}</div>
                  <div className="balance-amount">{card.amount}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="info-cards-row">
            <div
              className="info-card"
              style={{
                background: "linear-gradient(135deg, #3b9fd8 0%, #2980b9 100%)",
              }}
            >
              <h3>Notifications</h3>
            </div>
            <div
              className="info-card"
              style={{
                background: "linear-gradient(135deg, #3b9fd8 0%, #2980b9 100%)",
              }}
            >
              <h3>FAQs:</h3>
              <p>
                Please go through them to have a better knowledge of this
                platform
              </p>
              <button className="info-card-btn">❓ FAQs</button>
            </div>
            <div
              className="info-card"
              style={{
                background: "linear-gradient(135deg, #3b9fd8 0%, #2980b9 100%)",
              }}
            >
              <h3>Support Team:</h3>
              <p>
                Have anything to say to us? Please contact our Support Team on
                Whatsapp
              </p>
              <button className="whatsapp-btn">💬 whatsapp us</button>
              <button className="whatsapp-btn">
                💬 Join Our Whatsapp group
              </button>
            </div>
          </div>
          <div className="services-grid">
            {serviceCards.map((service, index) => (
              <div
                key={index}
                className="dashboard-service-card"
                onClick={service.page}
              >
                <div
                  className="service-icon"
                  style={{ background: service.color }}
                >
                  {service.icon}
                </div>
                <div className="service-title">{service.title}</div>
              </div>
            ))}
          </div>

          <ServiceTable
            dataPlans={dataPlans}
            role={user.role}
            loading={loading}
          />
        </div>
      </div>

      <div className="whatsapp-float">
        <MessageCircle size={28} />
      </div>

      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={handleCloseModal}
        onConfirm={handleConfirmUpgrade}
        walletBalance={balance}
        upgradeFee={1000}
      />
    </div>
  );
};

export default Dashboard;
