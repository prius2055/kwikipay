import React from 'react';
import './Loading.css';

const Loading = ({ message = 'Loading...', fullScreen = true, size = 'medium' }) => {
  const containerClass = fullScreen ? 'loading-container fullscreen' : 'loading-container';

  const sizes = { small: 64, medium: 96, large: 128 };
  const d  = sizes[size] || 96;
  const cx = d / 2;
  const r1 = d * 0.458;
  const r2 = d * 0.375;
  const r3 = d * 0.281;
  const circ = (r) => +(2 * Math.PI * r).toFixed(1);
  const dash  = (r, pct) => +(circ(r) * pct).toFixed(1);

  return (
    <div className={containerClass}>
      <div className="loading-content">

        <div className="spinner-wrap" style={{ width: d, height: d }}>

          {/* Outer ring — gold clockwise */}
          <svg width={d} height={d} viewBox={`0 0 ${d} ${d}`} className="ring ring-1">
            <circle cx={cx} cy={cx} r={r1} fill="none" stroke="#C9A84C"
              strokeWidth={d * 0.036} strokeLinecap="round"
              strokeDasharray={circ(r1)} strokeDashoffset={dash(r1, 0.77)} />
          </svg>

          {/* Middle ring — dark green counter-clockwise */}
          <svg width={d} height={d} viewBox={`0 0 ${d} ${d}`} className="ring ring-2">
            <circle cx={cx} cy={cx} r={r2} fill="none" stroke="#1A3A2A"
              strokeWidth={d * 0.031} strokeLinecap="round"
              strokeDasharray={circ(r2)} strokeDashoffset={dash(r2, 0.75)} />
          </svg>

          {/* Inner ring — gold faint clockwise */}
          <svg width={d} height={d} viewBox={`0 0 ${d} ${d}`} className="ring ring-3">
            <circle cx={cx} cy={cx} r={r3} fill="none" stroke="#C9A84C"
              strokeWidth={d * 0.026} strokeLinecap="round"
              strokeDasharray={circ(r3)} strokeDashoffset={dash(r3, 0.79)}
              opacity="0.5" />
          </svg>

          {/* Letter centre */}
          <div className="spinner-center">
            <span className={`logo-letter logo-${size}`}>S</span>
          </div>
        </div>

        <p className="spinner-brand">Subadex</p>

        {message && <p className="loading-message">{message}</p>}

        <div className="loading-dots">
          <span className="dot"></span>
          <span className="dot"></span>
          <span className="dot"></span>
        </div>

      </div>
    </div>
  );
};

export const LoadingSpinner = ({ size = 'medium' }) => {
  const d = { small: 24, medium: 40, large: 60 }[size] || 40;
  const r = d / 2 - 3;
  const circ = +(2 * Math.PI * r).toFixed(1);
  return (
    <svg width={d} height={d} viewBox={`0 0 ${d} ${d}`} className="simple-ring">
      <circle cx={d/2} cy={d/2} r={r} fill="none" stroke="#e2ebe5" strokeWidth="3" />
      <circle cx={d/2} cy={d/2} r={r} fill="none" stroke="#1A3A2A"
        strokeWidth="3" strokeLinecap="round"
        strokeDasharray={circ} strokeDashoffset={+(circ * 0.75).toFixed(1)} />
    </svg>
  );
};

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