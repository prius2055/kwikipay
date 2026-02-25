import React from "react";
import {
  Home,
  BarChart2,
  Phone,
  Lightbulb,
  Wallet,
  DollarSign,
  UserPlus,
  Settings,
  Code,
  Monitor,
  MonitorCog,
  ArrowRightLeft,
  Signal,
} from "lucide-react";
import { useWallet } from "./walletContext";
import { useAuth } from "./authContext";
import { useMenu } from "./MenuContext";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { formatCurrency } from "../utils/helperFunctions";

import "./Dashboard2.css";

const SideBar = () => {
  const { user } = useAuth();
  const { balance } = useWallet();
  const { mobileMenu, toggleMobileMenu } = useMenu();

  const navigate = useNavigate();

  const closeMobileMenu = () => {
    if (mobileMenu) toggleMobileMenu();
  };

  const { username, role, referralCode } = user ?? {};

  const safeUsername = username ?? "Guest";
  const safeRole = role ?? "user";
  const safeReferralCode = referralCode ?? null;

  return (
    <div className={`sidebar ${mobileMenu ? "open" : ""}`}>
      <div className="sidebar-header">
        <h2>
          <Link to="/" className="home-btn">
            Home
          </Link>
        </h2>

        <div
          className="mobile-menu-toggle"
          onClick={closeMobileMenu}
          aria-label="Close menu"
        >
          ✕
        </div>
      </div>

      <div className="user-info">
        <div className="user-avatar" onClick={() => navigate("/profile")}>
          👤
        </div>

        <div className="user-name">Hello, {safeUsername}</div>
        <div className="user-balance">
          Balance: {balance !== null ? formatCurrency(balance) : "Loading..."}
        </div>
        <div className="user-balance">Referral Code: {safeReferralCode}</div>
      </div>

      <nav className="nav-menu" onClick={closeMobileMenu}>
        <NavLink className={`nav-item`} to="/dashboard">
          <Home size={20} />
          <span>Dashboard</span>
        </NavLink>
        <NavLink className="nav-item" to="/buy-data">
          <BarChart2 size={20} />
          <span>Buy Data</span>
        </NavLink>

        <NavLink className="nav-item" to="/buy-airtime">
          <Phone size={20} />
          <span>Buy Airtime</span>
        </NavLink>

        <NavLink className="nav-item" to="/utilities/recharge-meter">
          <Lightbulb size={20} />
          <span>Energy Meter Recharge</span>
        </NavLink>

        <NavLink className="nav-item" to="/utilities/recharge-cable">
          <Monitor size={18} />
          <span>Cable Subscription</span>
        </NavLink>

        {/* <div className="utilities">
          <div
            className="nav-item"
            onClick={() => setShowUtilities((prev) => !prev)}
          >
            <Lightbulb size={20} />
            <span>Utilities Payment</span>
            <ChevronDown
              size={20}
              className={`nav-item-utils ${showUtilities ? "open" : ""}`}
            />
          </div>
          {showUtilities && (
            <div className="nav-children">
              <NavLink className="nav-child" to="/utilities/recharge-meter">
                <Zap size={18} />
                <span>Energy Meter Recharge</span>
              </NavLink>
              <NavLink className="nav-child" to="/utilities/recharge-cable">
                <Monitor size={18} />
                <span>Cable Subscription</span>
              </NavLink>
            </div>
          )}
        </div> */}

        <NavLink to="/funding" className="nav-item">
          <Wallet size={20} />
          <span>Fund Wallet</span>
        </NavLink>
        <div className="nav-item">
          <DollarSign size={20} />
          <span>Pricing</span>
        </div>
        <div className="nav-item">
          <UserPlus size={20} />
          <span>Account</span>
        </div>
        <div className="nav-item">
          <Settings size={20} />
          <span>Change Pin</span>
        </div>
        <div className="nav-item">
          <Settings size={20} />
          <span>Setting</span>
        </div>
        <div className="nav-item">
          <Code size={20} />
          <span>Developer's API</span>
        </div>

        {safeRole === "admin" && (
          <div className="admin-nav">
            <div className="admin-nav-header">
              <MonitorCog size={20} />
              <h3>Admin</h3>
            </div>

            <div className="admin-nav-links">
              <NavLink to="/admin/data" className="nav-item">
                <Signal size={20} />
                <span>Edit Price</span>
              </NavLink>

              <NavLink to="/admin/transactions" className="nav-item">
                <ArrowRightLeft size={20} />
                <span>Transactions</span>
              </NavLink>
            </div>
          </div>
        )}
      </nav>

      <div className="sidebar-footer">Version 7.6</div>
    </div>
  );
};

export default SideBar;
