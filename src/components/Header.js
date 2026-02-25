import React from "react";
import { useAuth } from "./authContext";
import { useMenu } from "./MenuContext";
import "./Dashboard2.css";

const Header = () => {
  const { logout } = useAuth();
  const { mobileMenu, toggleMobileMenu } = useMenu();

  const onMobileMenu = () => {
    toggleMobileMenu();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    logout();
  };

  return (
    <div className="top-header">
      <div
        className="mobile-menu-toggle"
        onClick={onMobileMenu}
        aria-label="Toggle menu"
      >
        {!mobileMenu ? "☰" : ""}
      </div>

      <button className="logout-btn" onClick={handleSubmit}>
        Logout
      </button>
    </div>
  );
};

export default Header;
