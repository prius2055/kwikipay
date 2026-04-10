// import React from "react";
// import { useWallet } from "../context/walletContext";
// import "./VirtualAccountModal.css";

// const VirtualAccountModal = ({ accounts, onClose }) => {
//   const copyAccount = (number) => {
//     navigator.clipboard.writeText(number);
//     alert("Account number copied!");
//   };

//   return (
//     <div className="vam-overlay">
//       <div className="vam-modal">
//         <div className="vam-header">
//           <h2>Fund Wallet</h2>
//           <button className="vam-close" onClick={onClose}>
//             ✕
//           </button>
//         </div>

//         <p className="vam-description">
//           Transfer money to any of the accounts below. Your wallet will be
//           credited automatically once payment is confirmed.
//         </p>

//         <div className="vam-accounts">
//           {accounts.map((account, index) => (
//             <div key={index} className="vam-account-card">
//               <div className="vam-bank">{account.bankName}</div>

//               <div className="vam-number">{account.accountNumber}</div>

//               <div className="vam-name">{account.accountName}</div>

//               <button
//                 className="vam-copy"
//                 onClick={() => copyAccount(account.accountNumber)}
//               >
//                 Copy Account
//               </button>
//             </div>
//           ))}
//         </div>

//         <div className="vam-footer">
//           <p>⚡ Funds reflect instantly after transfer</p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default VirtualAccountModal;

import React, { useState, useEffect, useRef } from "react";
import "./VirtualAccountModal.css";

const VirtualAccountModal = ({
  accounts,
  onClose,
  onBalanceRefresh,
  currentBalance,
}) => {
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [checking, setChecking] = useState(false);
  const [funded, setFunded] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const intervalRef = useRef(null);
  const prevBalanceRef = useRef(currentBalance);

  /* ── Poll for balance change every 10s ── */
  useEffect(() => {
    prevBalanceRef.current = currentBalance;

    intervalRef.current = setInterval(async () => {
      if (onBalanceRefresh) {
        setChecking(true);
        await onBalanceRefresh();
        setChecking(false);
      }
    }, 10000);

    return () => clearInterval(intervalRef.current);
  }, []);

  /* ── Detect balance increase → show success ── */
  useEffect(() => {
    if (currentBalance > prevBalanceRef.current) {
      clearInterval(intervalRef.current);
      setFunded(true);
    }
    if (!prevBalanceRef.current) {
      prevBalanceRef.current = currentBalance;
    }
  }, [currentBalance]);

  /* ── Countdown for auto-close after success ── */
  useEffect(() => {
    if (!funded) return;
    setCountdown(5);
    const t = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          clearInterval(t);
          onClose();
          return 0;
        }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [funded]);

  const copyToClipboard = async (text, index) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch {
      // fallback for older browsers
      const el = document.createElement("textarea");
      el.value = text;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    }
  };

  const bankColors = {
    PalmPay: { bg: "#e8f5e9", accent: "#2e7d32", icon: "🌴" },
    OPay: { bg: "#e3f2fd", accent: "#1565c0", icon: "💙" },
  };

  const getBankStyle = (bankName) =>
    bankColors[bankName] || { bg: "#f3f0ff", accent: "#5b21b6", icon: "🏦" };

  return (
    <div
      className="vam-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className={`vam-modal ${funded ? "vam-modal--funded" : ""}`}>
        {/* ── Header ── */}
        <div className="vam-header">
          <div className="vam-header-left">
            <div className="vam-header-icon">{funded ? "✅" : "💳"}</div>
            <div>
              <h2 className="vam-title">
                {funded ? "Payment Confirmed!" : "Fund Your Wallet"}
              </h2>
              <p className="vam-subtitle">
                {funded
                  ? `Closing in ${countdown}s...`
                  : "Transfer to any account below"}
              </p>
            </div>
          </div>
          <button className="vam-close" onClick={onClose} aria-label="Close">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* ── Success State ── */}
        {funded ? (
          <div className="vam-success">
            <div className="vam-success-animation">
              <div className="vam-checkmark">
                <svg viewBox="0 0 52 52">
                  <circle
                    className="vam-checkmark-circle"
                    cx="26"
                    cy="26"
                    r="25"
                    fill="none"
                  />
                  <path
                    className="vam-checkmark-check"
                    fill="none"
                    d="M14.1 27.2l7.1 7.2 16.7-16.8"
                  />
                </svg>
              </div>
            </div>
            <p className="vam-success-text">Your wallet has been credited!</p>
            <p className="vam-success-sub">Balance updated successfully</p>
          </div>
        ) : (
          <>
            {/* ── Instruction ── */}
            <div className="vam-instruction">
              <div className="vam-instruction-steps">
                <div className="vam-step">
                  <span className="vam-step-num">1</span>
                  <span>Choose any bank below</span>
                </div>
                <div className="vam-step-divider">→</div>
                <div className="vam-step">
                  <span className="vam-step-num">2</span>
                  <span>Copy the account number</span>
                </div>
                <div className="vam-step-divider">→</div>
                <div className="vam-step">
                  <span className="vam-step-num">3</span>
                  <span>Transfer any amount</span>
                </div>
              </div>
            </div>

            {/* ── Account Cards ── */}
            <div className="vam-accounts">
              {accounts?.length > 0 ? (
                accounts.map((account, index) => {
                  const style = getBankStyle(account.bankName);
                  return (
                    <div
                      key={index}
                      className="vam-account-card"
                      style={{
                        "--bank-bg": style.bg,
                        "--bank-accent": style.accent,
                      }}
                    >
                      <div className="vam-account-top">
                        <div className="vam-bank-badge">
                          <span className="vam-bank-icon">{style.icon}</span>
                          <span className="vam-bank-name">
                            {account.bankName}
                          </span>
                        </div>
                        <div className="vam-account-type">Virtual Account</div>
                      </div>

                      <div className="vam-account-number-row">
                        <span className="vam-account-number">
                          {account.accountNumber}
                        </span>
                        <button
                          className={`vam-copy-btn ${copiedIndex === index ? "vam-copy-btn--copied" : ""}`}
                          onClick={() =>
                            copyToClipboard(account.accountNumber, index)
                          }
                        >
                          {copiedIndex === index ? (
                            <>
                              <svg
                                width="14"
                                height="14"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.5"
                              >
                                <polyline points="20 6 9 17 4 12" />
                              </svg>
                              Copied!
                            </>
                          ) : (
                            <>
                              <svg
                                width="14"
                                height="14"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                              >
                                <rect
                                  x="9"
                                  y="9"
                                  width="13"
                                  height="13"
                                  rx="2"
                                  ry="2"
                                />
                                <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
                              </svg>
                              Copy
                            </>
                          )}
                        </button>
                      </div>

                      <div className="vam-account-name">
                        {account.accountName}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="vam-empty">
                  <div className="vam-spinner" />
                  <p>Loading your account details...</p>
                </div>
              )}
            </div>

            {/* ── Footer ── */}
            <div className="vam-footer">
              <div className="vam-pulse-dot" />
              <span>
                {checking
                  ? "Checking for payment..."
                  : "Waiting for your transfer · auto-updates every 10s"}
              </span>
            </div>

            <p className="vam-note">
              ⚠️ These account numbers are unique to you. Do not share them.
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default VirtualAccountModal;
