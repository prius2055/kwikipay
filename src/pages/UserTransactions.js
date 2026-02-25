import React, { useState, useEffect } from "react";
import SideBar from "../components/SideBar";
import Header from "../components/Header";
import "./ServiceManagement.css";

// const BASE_URL = "http://localhost:5000/api/v1";
const BASE_URL = "https://vtu-backend-wjn6.onrender.com/api/v1";

const UserTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [limit] = useState(15);
  const [totalPages, setTotalPages] = useState(1);

  const [error, setError] = useState("");

  // const navigate = useNavigate();

  useEffect(() => {
    const syncTransactions = async () => {
      const token = localStorage.getItem("token");
      // console.log(token);
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `${BASE_URL}/transactions?page=${page}&limit=${limit}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          },
        );
        const result = await response.json();

        console.log(result);

        if (result.status === "success") {
          setTransactions(result.data);
          setTotalPages(result.meta.totalPages);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching data plans:", error);
        setError("Failed to fetch data plans");
      }
    };
    syncTransactions();
  }, [page, limit]);

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
          <div className="header-content">
            <h1>My Transactions</h1>
            <p>All Transactions</p>
          </div>

          {/* Services Table */}
          {loading ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Loading Transactions...</p>
            </div>
          ) : (
            <div className="services-table-container">
              <table className="services-table">
                <thead>
                  <tr>
                    <th>Reference ID.</th>

                    <th>Transaction Type</th>
                    <th>Description</th>
                    <th>Amount</th>
                    <th>Date</th>
                    <th>Status</th>
                    {/* <th>Action</th> */}
                  </tr>
                </thead>

                <tbody>
                  {/* -------- EMPTY STATE -------- */}
                  {transactions.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="no-data">
                        No Transactions Found.
                      </td>
                    </tr>
                  ) : (
                    /* -------- TRANSACTIONS -------- */
                    transactions.map((service) => (
                      <tr key={service._id}>
                        <td>{service.reference}</td>

                        <td>
                          <span className="network-badge">{service.type}</span>
                        </td>

                        <td>
                          <div className="plan-info">
                            <strong>{service.description}</strong>
                          </div>
                        </td>

                        <td className="price">
                          ₦{service.amount.toLocaleString("en-NG")}
                        </td>
                        <td className="price">
                          {new Date(service.createdAt).toLocaleString()}
                        </td>

                        <td>
                          <span className={`status ${service.status}`}>
                            {service.status}
                          </span>
                        </td>
                        {/* 
                        <td>
                          <div className="service-management-action-buttons">
                            <button
                              className="btn-icon btn-edit"
                              title="View"
                              onClick={() =>
                                navigate(`/admin/transactions/${service._id}`, {
                                  state: service,
                                })
                              }
                            >
                              👁️
                            </button>
                          </div>
                        </td> */}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
          {/* Pagination */}
          <div className="pagination">
            <button
              disabled={page === 1}
              onClick={() => setPage((prev) => prev - 1)}
            >
              ◀ Prev
            </button>

            <span>
              Page <strong>{page}</strong> of <strong>{totalPages}</strong>
            </span>

            <button
              disabled={page === totalPages}
              onClick={() => setPage((prev) => prev + 1)}
            >
              Next ▶
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserTransactions;
