import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./ThankYou.css";
// import  './BuyData.css'

const ThankYou = ({
  onThankYouPageOpen,
  onThankYouPageClose,
  transactionData,
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  console.log("Location State:", location);

  useEffect(() => {
    // Confetti animation on mount
    const duration = 3000;
    const animationEnd = Date.now() + duration;

    const colors = ["#667eea", "#764ba2", "#f093fb", "#4facfe"];

    (function frame() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) return;

      const particleCount = 3;

      for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement("div");
        particle.className = "confetti-particle";
        particle.style.left = Math.random() * 100 + "%";
        particle.style.background =
          colors[Math.floor(Math.random() * colors.length)];
        particle.style.animationDelay = Math.random() * 0.5 + "s";
        document.querySelector(".thank-you-container")?.appendChild(particle);

        setTimeout(() => particle.remove(), 3000);
      }

      requestAnimationFrame(frame);
    })();
  }, []);

  // const getTransactionIcon = () => {
  //   switch (type.toLowerCase()) {
  //     case 'data':
  //       return (
  //         <svg width="80" height="80" viewBox="0 0 24 24" fill="none">
  //           <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  //           <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  //           <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  //         </svg>
  //       );
  //     case 'airtime':
  //       return (
  //         <svg width="80" height="80" viewBox="0 0 24 24" fill="none">
  //           <path d="M22 16.92V19.92C22 20.4696 21.5523 20.92 21.0027 20.92C9.95264 20.4367 1.56334 12.0474 1.08 1H4.08C4.62975 1 5.08 1.45025 5.08 2V5.5C5.08 6.05 4.63 6.5 4.08 6.5H2.5C3.5 12.5 8.5 17.5 14.5 18.5V17C14.5 16.45 14.95 16 15.5 16H19C19.55 16 20 16.45 20 17V19.92Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  //         </svg>
  //       );
  //     case 'wallet_funding':
  //     case 'wallet':
  //       return (
  //         <svg width="80" height="80" viewBox="0 0 24 24" fill="none">
  //           <path d="M21 4H3C1.89543 4 1 4.89543 1 6V18C1 19.1046 1.89543 20 3 20H21C22.1046 20 23 19.1046 23 18V6C23 4.89543 22.1046 4 21 4Z" stroke="currentColor" strokeWidth="2"/>
  //           <path d="M1 10H23" stroke="currentColor" strokeWidth="2"/>
  //           <circle cx="17" cy="15" r="1" fill="currentColor"/>
  //         </svg>
  //       );
  //     default:
  //       return (
  //         <svg width="80" height="80" viewBox="0 0 24 24" fill="none">
  //           <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
  //         </svg>
  //       );
  //   }
  // };

  return (
    <div className="popup-overlay">
      <div className="thank-you-container">
        <div className="thank-you-card">
          {/* Success Animation */}
          <div className="success-animation">
            {/* <div className="success-circle">
            {getTransactionIcon()}
          </div> */}
            <div className="success-checkmark">
              <svg width="100" height="100" viewBox="0 0 52 52">
                <circle
                  className="checkmark-circle"
                  cx="26"
                  cy="26"
                  r="25"
                  fill="none"
                />
                <path
                  className="checkmark-check"
                  fill="none"
                  d="M14.1 27.2l7.1 7.2 16.7-16.8"
                />
              </svg>
            </div>
          </div>

          {/* Thank You Message */}
          <div className="thank-you-content">
            <h1 className="thank-you-title">Thank You!</h1>
            <p className="thank-you-message">
              Your transaction was successful.
            </p>
          </div>

          {/* Transaction Details */}
          {/* <div className="transaction-details">
          <div className="detail-row">
            <span className="detail-label">Transaction Type</span>
            <span className="detail-value">{type}</span>
          </div>
          
          {amount > 0 && (
            <div className="detail-row highlight">
              <span className="detail-label">Amount</span>
              <span className="detail-value">₦{amount.toLocaleString()}</span>
            </div>
          )}
          
          {recipient && (
            <div className="detail-row">
              <span className="detail-label">Recipient</span>
              <span className="detail-value">{recipient}</span>
            </div>
          )}
          
          {network && (
            <div className="detail-row">
              <span className="detail-label">Network</span>
              <span className="detail-value">{network}</span>
            </div>
          )}
          
          <div className="detail-row">
            <span className="detail-label">Reference</span>
            <span className="detail-value reference">{reference}</span>
          </div>
          
          <div className="detail-row">
            <span className="detail-label">Date & Time</span>
            <span className="detail-value">{timestamp}</span>
          </div>
          
          <div className="detail-row status-row">
            <span className="detail-label">Status</span>
            <span className={`status-badge ${status}`}>
              {status === 'success' ? '✓ Successful' : status}
            </span>
          </div>
        </div> */}

          {/* Action Buttons */}
          <div className="action-buttons">
            <button
              className="btn-primary"
              onClick={() => navigate("/dashboard")}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path
                  d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Back To Dashboard
            </button>

            {/* <button 
            className="btn-secondary"
            onClick={() => navigate('/transactions')}
          >
            View Transaction History
          </button> */}

            {/* <button 
            className="btn-outline"
            onClick={() => window.print()}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M6 9V2H18V9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M6 18H4C3.46957 18 2.96086 17.7893 2.58579 17.4142C2.21071 17.0391 2 16.5304 2 16V11C2 10.4696 2.21071 9.96086 2.58579 9.58579C2.96086 9.21071 3.46957 9 4 9H20C20.5304 9 21.0391 9.21071 21.4142 9.58579C21.7893 9.96086 22 10.4696 22 11V16C22 16.5304 21.7893 17.0391 21.4142 17.4142C21.0391 17.7893 20.5304 18 20 18H18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M18 14H6V22H18V14Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Print Receipt
          </button> */}
          </div>

          {/* Footer Note */}
          {/* <div className="thank-you-footer">
          <p>A confirmation email has been sent to your registered email address.</p>
          <p className="support-text">
            Need help? Contact our <span className="link">support team</span>
          </p>
        </div> */}
        </div>
      </div>
    </div>
  );
};

export default ThankYou;
