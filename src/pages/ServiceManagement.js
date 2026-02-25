import React, { useState, useEffect } from "react";
import SideBar from "../components/SideBar";
import Header from "../components/Header";
import { useNavigate } from "react-router";
import "./ServiceManagement.css";

const networkOrder = {
  MTN: 1,
  AIRTEL: 2,
  GLO: 3,
  "9MOBILE": 4,
};

// const BASE_URL = `http://localhost:5000/api/v1`;
const BASE_URL = `https://vtu-backend-wjn6.onrender.com/api/v1`;

const ServiceManagement = () => {
  const [dataPlans, setDataPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    syncDataPlans();
  }, []);

  const syncDataPlans = async () => {
    const token = localStorage.getItem("token");
    // console.log(token);
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${BASE_URL}/admin/data`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const result = await response.json();

      console.log(result);

      if (result.status === "success") {
        setLoading(false);

        setDataPlans(result.data);
      }
    } catch (error) {
      console.error("Error fetching data plans:", error);
      setError("Failed to fetch data plans");
    }
  };

  // Step 1: Group plans by service_name

  const sortedPlans = dataPlans.sort((a, b) => {
    const orderA = networkOrder[a.network?.toUpperCase()] ?? 99;
    const orderB = networkOrder[b.network?.toUpperCase()] ?? 99;

    return orderA - orderB;
  });

  const groupedByNetwork = sortedPlans.reduce((acc, plan) => {
    acc[plan.network] = acc[plan.network] || [];
    acc[plan.network].push(plan);
    return acc;
  }, {});

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
            <button className="btn-add">
              {/* <button className="btn-add" onClick={openAddModal}> */}
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 5V19M5 12H19"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
              Add Service
            </button>
          </div>

          {/* Services Table */}
          {loading ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Loading Data services...</p>
            </div>
          ) : (
            <div className="services-table-container">
              {Object.entries(groupedByNetwork).length === 0 ? (
                /* -------- EMPTY STATE -------- */
                <table className="services-table">
                  <thead>
                    <tr>
                      <th>id</th>
                      <th>Plan</th>
                      <th>Plan Validity</th>
                      <th>Cost Price</th>
                      <th>Reseller Price</th>
                      <th>Selling Price</th>
                      <th colSpan="2">Profit</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                    <tr>
                      <th></th>
                      <th></th>
                      <th></th>
                      <th></th>
                      <th></th>
                      <th></th>
                      <th>Admin</th>
                      <th>Reseller</th>
                      <th></th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td colSpan="8" className="no-data">
                        No services found. Add your first service!
                      </td>
                    </tr>
                  </tbody>
                </table>
              ) : (
                /* -------- GROUPED TABLES -------- */
                Object.entries(groupedByNetwork).map(([network, services]) => (
                  <table className="services-table" key={network}>
                    <thead>
                      <tr>
                        <th colSpan="10" className="network-header">
                          {network} Data Plans
                        </th>
                      </tr>
                      <tr>
                        <th>id</th>
                        <th>Plan</th>
                        <th>Plan Validity</th>
                        <th>Cost Price</th>
                        <th>Reseller Price</th>
                        <th>Selling Price</th>
                        <th colSpan="2">Profit</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                      <tr>
                        <th></th>
                        <th></th>
                        <th></th>
                        <th></th>
                        <th></th>
                        <th></th>
                        <th>Admin</th>
                        <th>Reseller</th>
                        <th></th>
                        <th></th>
                      </tr>
                    </thead>

                    <tbody>
                      {services.map((service) => (
                        <tr key={service._id}>
                          <td>{service.providerPlanId}</td>

                          <td>
                            <span className={`network-badge`}>
                              {service.planName}
                            </span>
                          </td>

                          <td>
                            <div className="plan-info">
                              <strong>{service.validity}</strong>
                            </div>
                          </td>

                          <td className="price">
                            ₦{service.providerPrice.toLocaleString("en-NG")}
                          </td>

                          <td>
                            <div className="profit-info">
                              <strong>
                                ₦
                                {Math.ceil(
                                  service.resellerPrice.toLocaleString("en-NG"),
                                )}
                              </strong>
                            </div>
                          </td>
                          <td>
                            <div className="profit-info">
                              <strong>
                                ₦{service.sellingPrice.toLocaleString("en-NG")}
                              </strong>
                            </div>
                          </td>
                          <td>
                            <div className="profit-info">
                              <strong>
                                ₦
                                {Math.ceil(
                                  service.sellingPrice - service.providerPrice,
                                ).toLocaleString("en-NG")}
                              </strong>
                            </div>
                          </td>
                          <td>
                            <div className="profit-info">
                              <strong>
                                ₦
                                {Math.ceil(
                                  service.sellingPrice - service.resellerPrice,
                                ).toLocaleString("en-NG")}
                              </strong>
                            </div>
                          </td>

                          <td>
                            <button
                              className={`status-toggle ${
                                service.isActive ? "active" : "inactive"
                              }`}
                            >
                              {service.isActive ? "Available" : "Not Available"}
                            </button>
                          </td>

                          <td>
                            <div className="service-management-action-buttons">
                              <button
                                className="btn-icon btn-edit"
                                title="Edit"
                                onClick={() =>
                                  navigate(`/admin/data/${service._id}/edit`, {
                                    state: service,
                                  })
                                }
                              >
                                ✏️
                              </button>
                              {/* <button
                                className="btn-icon btn-delete"
                                title="Delete"
                                // onClick={onServiceEdit}
                              >
                                🗑️
                              </button> */}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ServiceManagement;
