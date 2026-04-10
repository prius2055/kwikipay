import React from "react";
import { Pencil } from "lucide-react";
import { useNavigate, useLocation } from "react-router";

import "./ServiceTable2.css";

const ServiceTable = ({ dataPlans, role, loading }) => {
  const isMarketer = role === "marketer";
  const isReseller = role === "reseller";
  const isUser = role === "user";

  const navigate = useNavigate();
  const { pathname } = useLocation();

  const formatMoney = (amount) => `₦${Number(amount).toLocaleString("en-NG")}`;

  // Loading State
  if (loading) {
    return (
      <div className="loading-state">
        <div className="spinner"></div>
        <p>Loading Data services...</p>
      </div>
    );
  }

  // Empty State
  if (!Object.keys(dataPlans).length) {
    return (
      <div className="table-responsive">
        <table className="services-table">
          <thead>
            <tr>
              <th>Plan</th>
              <th>Validity</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan="5" className="no-data">
                No services found
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }

  // Main Content
  return (
    <div className="services-table-container">
      {Object.entries(dataPlans).map(([network, services]) => (
        <div key={network} className="table-responsive">
          <table className="services-table">
            {/* Table Header */}
            <thead>
              {/* Network Header Row */}
              <tr>
                <th
                  colSpan={isMarketer ? "8" : isReseller ? "6" : "4"}
                  className="network-header"
                >
                  {network} Data Plans
                </th>
              </tr>

              {/* Column Headers Row */}
              <tr>
                <th>Plan</th>
                <th>Validity</th>

                {/* marketer OR RESELLER ONLY */}
                {isMarketer && <th>Cost Price</th>}
                {(isMarketer || isReseller) && <th>Reseller Price</th>}
                {isUser ? <th>Price</th> : <th>Selling Price</th>}

                {/* marketer OR RESELLER ONLY */}
                {(isMarketer || isReseller) && <th>Profit</th>}

                <th>Status</th>
                {isMarketer && pathname.endsWith("/marketer/data") && (
                  <th>Action</th>
                )}
              </tr>
            </thead>

            {/* Table Body */}
            <tbody>
              {services.map((service) => {
                const profit = isMarketer
                  ? service.sellingPrice - service.providerPrice
                  : isReseller
                    ? service.sellingPrice - service.resellerPrice
                    : 0;

                return (
                  <tr key={service._id}>
                    {/* Plan Name */}
                    <td className="plan-name">{service.planName}</td>

                    {/* Validity */}
                    <td className="validity">{service.validity}</td>

                    {/* Provider  Price (marketer ONLY) */}
                    {isMarketer && (
                      <td className="reseller-price">
                        {formatMoney(service.providerPrice)}
                      </td>
                    )}
                    {(isMarketer || isReseller) && (
                      <td className="reseller-price">
                        {formatMoney(service.resellerPrice)}
                      </td>
                    )}

                    {/* User Price */}

                    <td className="user-price">
                      <strong>{formatMoney(service.sellingPrice)}</strong>
                    </td>

                    {/* Profit (marketer AND RESELLER ONLY) */}
                    {(isMarketer || isReseller) && (
                      <td className="profit">{formatMoney(profit)}</td>
                    )}

                    {/* Status */}
                    <td className="status-cell">
                      <span
                        className={`status-toggle ${
                          service.isActive ? "active" : "inactive"
                        }`}
                      >
                        {service.isActive ? "Available" : "Not Available"}
                      </span>
                    </td>
                    {/* marketer ONLY */}
                    {isMarketer && pathname.endsWith("/marketer/data") && (
                      <td>
                        <div className="service-management-action-buttons">
                          <button
                            className="btn-icon btn-edit"
                            title="Edit"
                            onClick={() =>
                              navigate(`/marketer/data/${service._id}/edit`, {
                                state: service,
                              })
                            }
                          >
                            ✏️
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
};

export default ServiceTable;
