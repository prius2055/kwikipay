import React from "react";
import { useAuth } from "../context/authContext";
import { useMenu } from "../context/MenuContext";
import { Link } from "react-router";

import Logo from "../img/logo.png";

import "./../pages/Dashboard.css";

const Header = () => {
  const { logout, loggingOut } = useAuth();
  const { mobileMenu, toggleMobileMenu } = useMenu();

  const onMobileMenu = () => {
    toggleMobileMenu();
  };

  const closeMobileMenu = () => {
    if (mobileMenu) toggleMobileMenu();
  };

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
    <div className="top-header">
      <div
        className="mobile-menu-toggle"
        onClick={onMobileMenu}
        aria-label="Toggle menu"
      >
        {!mobileMenu ? "☰" : ""}
      </div>

      <Link to="/">
        <img src={Logo} alt="Subadex Logo" className="logo" />
      </Link>

      {/* <div
        className="mobile-menu-toggle"
        onClick={closeMobileMenu}
        aria-label="Close menu"
      >
        ✕
      </div> */}

      {/* <button className="logout-btn" onClick={logout}>
        Logout
      </button> */}
    </div>
  );
};

export default Header;
