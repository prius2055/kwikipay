import React from 'react';
import './Loading.css';

const Loading = ({ message = 'Loading...', fullScreen = true, size = 'medium' }) => {
  const containerClass = fullScreen ? 'loading-container fullscreen' : 'loading-container';
  
  return (
    <div className={containerClass}>
      <div className="loading-content">
        {/* Spinner */}
        <div className={`spinner ${size}`}>
          <div className="spinner-ring"></div>
          <div className="spinner-ring"></div>
          <div className="spinner-ring"></div>
          <div className="spinner-logo">
            <span className="logo-text">Geotech</span>
          </div>
        </div>

        {/* Message */}
        {message && (
          <p className="loading-message">{message}</p>
        )}

        {/* Dots animation */}
        <div className="loading-dots">
          <span className="dot"></span>
          <span className="dot"></span>
          <span className="dot"></span>
        </div>
      </div>
    </div>
  );
};

// Alternative spinner variations you can use
export const LoadingSpinner = ({ size = 'medium' }) => (
  <div className={`simple-spinner ${size}`}>
    <div className="spinner-circle"></div>
  </div>
);

export const LoadingBar = () => (
  <div className="loading-bar-container">
    <div className="loading-bar">
      <div className="loading-bar-progress"></div>
    </div>
  </div>
);

export const LoadingPulse = ({ text = 'Loading' }) => (
  <div className="loading-pulse-container">
    <div className="pulse-circle"></div>
    <p className="pulse-text">{text}</p>
  </div>
);

export default Loading;