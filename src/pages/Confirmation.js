import React from 'react';
import { useNavigate } from 'react-router';
import './Confirmation.css';

const Confirmation = () => {
  const navigate = useNavigate();

  return (
    <div className="confirmation-container">
      <div className="confirmation-card">
        <div className="success-icon">
          <svg viewBox="0 0 52 52" className="checkmark">
            <circle className="checkmark-circle" cx="26" cy="26" r="25" fill="none"/>
            <path className="checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
          </svg>
        </div>

        <h1 className="confirmation-title">Registration Successful!</h1>
        
        <div className="confirmation-message">
          <p className="message-primary">
            Your account has been created successfully.
          </p>
          <p className="message-secondary">
            Please check your email to verify your account before signing in.
          </p>
        </div>

        <div className="confirmation-details">
          <div className="detail-item">
            <svg className="detail-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <span>Verification email sent</span>
          </div>
          
          <div className="detail-item">
            <svg className="detail-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Account ready to activate</span>
          </div>
        </div>

        <div className="confirmation-actions">
          <button 
            className="btn-primary-confirmation"
            onClick={() => navigate('/login')}
          >
            Go to Sign In
          </button>
          
          <button 
            className="btn-secondary"
            onClick={() => navigate('/')}
          >
            Back to Home
          </button>
        </div>

        <div className="help-text">
          <p>Didn't receive the email?</p>
          <button className="resend-link">Resend verification email</button>
        </div>
      </div>
    </div>
  );
};

export default Confirmation;