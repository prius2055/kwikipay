import { useState } from "react";
import "./UpgradeModal.css";

const UpgradeModal = ({
  isOpen,
  onClose,
  onConfirm,
  walletBalance,
  upgradeFee = 1000,
}) => {
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await onConfirm();
    } catch (error) {
      console.error("Upgrade failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const hasInsufficientBalance = walletBalance < upgradeFee;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        {/* Icon */}
        <div className="modal-icon">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
        </div>

        {/* Header */}
        <div className="modal-header">
          <h2 className="modal-title">Upgrade to Reseller</h2>
          <p className="modal-subtitle">
            Unlock exclusive benefits and start earning more!
          </p>
        </div>

        {/* Body */}
        <div className="modal-body">
          {/* Upgrade Benefits */}
          <div className="benefits-section">
            <h3 className="benefits-title">What you'll get:</h3>
            <ul className="benefits-list">
              <li>
                <svg fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>
                  Life time Commision on data purchase from all referrals
                </span>
              </li>
              <li>
                <svg fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>
                  One time Referral Bonus from every upgraded referral
                </span>
              </li>
              <li>
                <svg fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Higher discount rates on all services</span>
              </li>
              <li>
                <svg fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Priority customer support</span>
              </li>

              <li>
                <svg fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Increased commission</span>
              </li>
            </ul>
          </div>

          {/* Pricing Info */}
          <div className="pricing-section">
            <div className="pricing-card">
              <div className="pricing-row">
                <span className="pricing-label">Upgrade Fee:</span>
                <span className="pricing-value">
                  ₦{upgradeFee.toLocaleString()}
                </span>
              </div>
              <div className="pricing-row">
                <span className="pricing-label">Your Balance:</span>
                <span
                  className={`pricing-value ${hasInsufficientBalance ? "insufficient" : "sufficient"}`}
                >
                  ₦{walletBalance.toLocaleString()}
                </span>
              </div>
              <div className="pricing-divider"></div>
              <div className="pricing-row total">
                <span className="pricing-label">Balance After Upgrade:</span>
                <span className="pricing-value">
                  ₦{Math.max(0, walletBalance - upgradeFee).toLocaleString()}
                  0.00
                </span>
              </div>
            </div>
          </div>

          {/* Warning Alert */}
          {hasInsufficientBalance ? (
            <div className="alert alert-error">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>
                Insufficient balance. Please fund your wallet with at least ₦
                {(upgradeFee - walletBalance).toLocaleString()} to proceed.
              </span>
            </div>
          ) : (
            <div className="alert alert-info">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>
                ₦{upgradeFee.toLocaleString()} will be deducted from your
                account balance.
              </span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <button
            className="upgrade-btn btn-cancel"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            className="upgrade-btn btn-confirm"
            onClick={handleConfirm}
            disabled={loading || hasInsufficientBalance}
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                Processing...
              </>
            ) : (
              <>
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Confirm Upgrade
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpgradeModal;
