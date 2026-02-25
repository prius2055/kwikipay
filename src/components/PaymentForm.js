import React, { useState } from "react";
import { useWallet } from "./walletContext";
import SideBar from "./SideBar";
import Header from "./Header";
import { formatCurrency } from "../utils/helperFunctions";
import "./PaymentForm.css";

const PaymentForm = () => {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const { balance, fundWallet } = useWallet();

  const handleFundWallet = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    // Validation
    if (!amount || parseFloat(amount) <= 0) {
      setError("Please enter a valid amount");
      return;
    }

    if (parseFloat(amount) < 100) {
      setError("Minimum amount is ₦100");
      return;
    }

    if (parseFloat(amount) > 1000000) {
      setError("Maximum amount is ₦1,000,000");
      return;
    }

    const result = await fundWallet(parseFloat(amount));

    console.log(result);

    // if (result.status) {
    //   setLoading(false);
    //   setError(false);
    //   navigate("/success", { replace: true });
    // }
  };

  return (
    <div className="funding-container">
      <SideBar />
      <div className="funding">
        <Header />
        <div className="wallet-container">
          <div className="wallet-header">
            <h1>My Wallet</h1>
          </div>

          {/* Wallet Balance Card */}
          <div className="payment-balance-card">
            <div className="balance-info">
              <p className="balance-label">Available Balance</p>
              <h2 className="payment-balance-amount">
                {formatCurrency(balance)}
              </h2>
            </div>
            <div className="balance-icon">
              <svg width="60" height="60" viewBox="0 0 24 24" fill="none">
                <path
                  d="M21 18V19C21 20.1 20.1 21 19 21H5C3.89 21 3 20.1 3 19V5C3 3.9 3.89 3 5 3H19C20.1 3 21 3.9 21 5V6H12C10.89 6 10 6.9 10 8V16C10 17.1 10.89 18 12 18H21ZM12 16H22V8H12V16ZM16 13.5C15.17 13.5 14.5 12.83 14.5 12C14.5 11.17 15.17 10.5 16 10.5C16.83 10.5 17.5 11.17 17.5 12C17.5 12.83 16.83 13.5 16 13.5Z"
                  fill="currentColor"
                />
              </svg>
            </div>
          </div>

          {/* Fund Wallet Form */}
          <div className="fund-wallet-card">
            <h3>Fund Wallet</h3>

            {error && <div className="alert alert-error">{error}</div>}

            {success && <div className="alert alert-success">{success}</div>}

            <form onSubmit={handleFundWallet}>
              <div className="form-group">
                <label htmlFor="amount">Amount (₦)</label>
                <input
                  type="number"
                  id="amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter amount (min: ₦100)"
                  min="100"
                  step="100"
                />
                <small className="form-hint">
                  Minimum: ₦100 | Maximum: ₦1,000,000
                </small>
              </div>

              <button type="submit" className="btn-fund" disabled={loading}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 17H11V15H13V17ZM13 13H11V7H13V13Z"
                    fill="currentColor"
                  />
                </svg>
                {loading ? "Processing Payment" : "Fund Wallet with Paystack"}
              </button>
            </form>

            <div className="payment-info">
              <p>🔒 Secure payment powered by Paystack</p>
            </div>
          </div>

          {/* Transaction History */}
          {/* <div className="transactions-card">
        <h3>Recent Transactions</h3>
        
        {transactions.length === 0 ? (
          <div className="no-transactions">
            <p>No transactions yet</p>
          </div>
        ) : (
          <div className="transactions-list">
            {transactions.map((transaction) => (
              <div key={transaction._id} className="transaction-item">
                <div className="transaction-icon">
                  {transaction.type === 'credit' ? (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path d="M7 14L12 9L17 14H7Z" fill="#4CAF50"/>
                    </svg>
                  ) : (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path d="M7 10L12 15L17 10H7Z" fill="#F44336"/>
                    </svg>
                  )}
                </div>
                <div className="transaction-details">
                  <p className="transaction-description">{transaction.description}</p>
                  <p className="transaction-date">{formatDate(transaction.createdAt)}</p>
                </div>
                <div className={`transaction-amount ${transaction.type}`}>
                  {transaction.type === 'credit' ? '+' : '-'}
                  {formatCurrency(transaction.amount)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div> */}
        </div>
      </div>
    </div>
  );
};

export default PaymentForm;
