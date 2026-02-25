import React from "react";
import "./ServiceTable.css";

const ServiceTable = ({ dataPlans, role, loading }) => {
  const isAdmin = role === "admin";
  const isReseller = role === "reseller";
  const isUser = role === "user";

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
                  colSpan={isAdmin ? "7" : isReseller ? "6" : "4"}
                  className="network-header"
                >
                  {network} Data Plans
                </th>
              </tr>

              {/* Column Headers Row */}
              <tr>
                <th>Plan</th>
                <th>Validity</th>

                {/* ADMIN OR RESELLER ONLY */}
                {isAdmin && <th>Cost Price</th>}
                {(isAdmin || isReseller) && <th>Reseller Price</th>}
                {isUser ? <th>Price</th> : <th>Selling Price</th>}

                {/* ADMIN OR RESELLER ONLY */}
                {(isAdmin || isReseller) && <th>Profit</th>}

                <th>Status</th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody>
              {services.map((service) => {
                const profit = isAdmin
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

                    {/* Provider  Price (ADMIN ONLY) */}
                    {isAdmin && (
                      <td className="reseller-price">
                        {formatMoney(service.providerPrice)}
                      </td>
                    )}
                    {(isAdmin || isReseller) && (
                      <td className="reseller-price">
                        {formatMoney(service.resellerPrice)}
                      </td>
                    )}

                    {/* User Price */}

                    <td className="user-price">
                      <strong>{formatMoney(service.sellingPrice)}</strong>
                    </td>

                    {/* Profit (ADMIN AND RESELLER ONLY) */}
                    {(isAdmin || isReseller) && (
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
