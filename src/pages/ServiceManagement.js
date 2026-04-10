import React, { useState, useEffect } from "react";
import SideBar from "../components/SideBar";
import Header from "../components/Header";
import ServiceTable from "../components/ServiceTable";
import { useNavigate } from "react-router";
import { useWallet } from "../context/walletContext";
import { useAuth } from "../context/authContext";

import "./ServiceManagement.css";

const ServiceManagement = () => {
  const { loading, error, dataPlans, fetchDataPlans } = useWallet();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchDataPlans();
  }, [fetchDataPlans]);

  console.log(loading, error, dataPlans, user);

  return (
    <div className="service-container">
      <SideBar />
      <div className="service">
        <Header />

        {error && (
          <div className="error-alert">
            <p className="error-text">{error}</p>
          </div>
        )}

        <div className="service-management">
          <div className="management-header">
            <div className="header-content">
              <h1>Service Management</h1>
              <p>Manage your VTU services, prices, and availability</p>
            </div>
          </div>

          {/* Services Table */}
          {loading ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Loading Data services...</p>
            </div>
          ) : (
            <ServiceTable
              dataPlans={dataPlans}
              role={user?.role}
              loading={loading}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ServiceManagement;
