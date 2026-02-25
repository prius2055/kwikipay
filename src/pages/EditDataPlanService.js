import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
// import axios from "axios";
import "./EditDataPlanService.css";
import SideBar from "../components/SideBar";
import Header from "../components/Header";

const EditDataPlanService = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [planToEdit, setPlanToEdit] = useState(null);
  const [error, setError] = useState(null);

  // console.log("plan to edit", planToEdit);

  const [formData, setFormData] = useState({
    price: "",
    status: "",
  });

  // const BASE_URL = `http://localhost:5000/api/v1`;
  const BASE_URL = `https://vtu-backend-wjn6.onrender.com/api/v1`;

  useEffect(() => {
    const fetchServices = async () => {
      const token = localStorage.getItem("token");
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`${BASE_URL}/admin/data`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const result = await response.json();

        // console.log("data plans", result);

        if (result.status === "success") {
          setLoading(false);

          // console.log("data plans", dataPlans);

          const foundPlan = result.data.find((plan) => plan._id === id);

          // console.log("Found Plan", foundPlan);

          if (!foundPlan) {
            setError("Selected plan not found");
          } else {
            setPlanToEdit(foundPlan);
          }
        }
      } catch (err) {
        console.error(err);
        setError("Failed to fetch data plans");
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [id, BASE_URL]);

  useEffect(() => {
    if (planToEdit) {
      setFormData({
        price: planToEdit.sellingPrice ?? "",
        status: planToEdit.isActive ? "true" : "false",
      });
    }
  }, [planToEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      newSellingPrice: Number(formData.price),
      newStatus: formData.status,
    };

    console.log(payload);
    setSaving(true);
    setError(null);

    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`${BASE_URL}/admin/data/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      const result = await response.json();

      console.log(result);

      if (result.status === "success") {
        setLoading(false);

        navigate("/admin/data");
      }
    } catch (error) {
      console.error("Error updating service:", error);
      setError(error.response?.data?.message || "Failed to update service");
      setSaving(false);
    }
  };

  return (
    <div className="edit-container">
      <SideBar />

      <div className="edit-service">
        <Header />

        <div className="edit-service-container">
          <div className="edit-service-card">
            {/* ERROR */}
            {error && (
              <div className="error-alert">
                <p className="error-text">{error}</p>
              </div>
            )}

            {/* LOADING STATE */}
            {loading && (
              <div className="loading-container">
                <div className="spinner"></div>
                <p>Loading selected data plan...</p>
              </div>
            )}

            {/* CONTENT ONLY WHEN DATA IS READY */}
            {!loading && planToEdit && (
              <>
                <div className="edit-service-header">
                  <h1 className="edit-service-title">Edit Data Plan</h1>
                </div>

                <table className="services-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Network</th>
                      <th>Plan</th>
                      <th>Validity</th>
                      <th>Cost Price</th>
                      <th>Selling Price</th>
                      <th>Profit</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{planToEdit.providerPlanId}</td>
                      <td>{planToEdit.network}</td>
                      <td>{planToEdit.planName}</td>
                      <td>{planToEdit.validity}</td>
                      <td>
                        ₦{planToEdit.providerPrice.toLocaleString("en-NG")}
                      </td>
                      <td>
                        ₦{planToEdit.sellingPrice.toLocaleString("en-NG")}
                      </td>
                      <td>
                        ₦
                        {(
                          planToEdit.sellingPrice - planToEdit.providerPrice
                        ).toLocaleString("en-NG")}
                      </td>
                      <td>
                        {planToEdit.isActive ? "Available" : "Not Available"}
                      </td>
                    </tr>
                  </tbody>
                </table>

                {/* FORM */}
                <form onSubmit={handleSubmit} className="edit-service-form">
                  <div className="form-group">
                    <label htmlFor="price" className="form-label required">
                      New Selling Price (₦)
                    </label>
                    <input
                      type="number"
                      id="price"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      min="0"
                      step="0.01"
                      className="form-input"
                      placeholder="0.00"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="status" className="form-label">
                      New Status
                    </label>
                    <select
                      id="status"
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      className="form-select"
                    >
                      <option value="true">Available</option>
                      <option value="false">Not Available</option>
                    </select>
                  </div>

                  <div className="form-actions">
                    <button
                      type="submit"
                      disabled={saving}
                      className={`btn btn-primary ${saving ? "btn-loading" : ""}`}
                    >
                      {saving ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditDataPlanService;
