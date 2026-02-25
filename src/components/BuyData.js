import React, { useState, useMemo, useEffect } from "react";
import { useWallet } from "./walletContext";
import { useNavigate } from "react-router-dom";
import SideBar from "./SideBar";
import Header from "./Header";
import "./BuyData.css";

const BuyData = () => {
  const navigate = useNavigate();
  const {
    dataPlans,
    buyData,
    loading: walletLoading,
    fetchDataPlans,
  } = useWallet();

  useEffect(() => {
    fetchDataPlans();
  }, [fetchDataPlans]);

  // console.log("data plans for buy data", dataPlans);

  const [formData, setFormData] = useState({
    network: "",
    dataType: "",
    dataPlan: "",
    mobileNumber: "",
    bypassValidator: false,
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  /* -----------------------------
     DERIVED DATA (SAFE)
 ------------------------------ */

  const plansReady =
    dataPlans && Object.keys(dataPlans).length > 0 && !walletLoading;

  const normalizedNetwork = formData.network?.toUpperCase();

  const availablePlans = useMemo(() => {
    if (!plansReady || !normalizedNetwork || !formData.dataType) return [];

    const networkPlans = dataPlans[normalizedNetwork];

    if (!Array.isArray(networkPlans)) return [];

    return networkPlans.filter((plan) => plan.planType === formData.dataType);
  }, [plansReady, normalizedNetwork, formData.dataType, dataPlans]);

  const selectedPlan = useMemo(() => {
    if (!formData.dataPlan) return null;

    return availablePlans.find(
      (p) => String(p.providerPlanId) === String(formData.dataPlan)
    );
  }, [formData.dataPlan, availablePlans]);

  /* -----------------------------
     RESET DEPENDENCIES
  ------------------------------ */

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      dataPlan: "",
    }));
  }, [formData.network, formData.dataType]);

  /* -----------------------------
     HANDLERS
  ------------------------------ */

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!selectedPlan) {
      setError("Please select a valid data plan");
      return;
    }

    if (!formData.mobileNumber) {
      setError("Please enter mobile number");
      return;
    }

    const payload = {
      network: Number(selectedPlan.providerNetworkId),
      plan: Number(selectedPlan.providerPlanId),
      mobile_number: formData.mobileNumber,
      amount: selectedPlan.sellingPrice,
      Ported_number: true,
    };

    setSubmitting(true);

    const result = await buyData(payload);

    if (result?.success) {
      navigate("/success", { replace: true });
    } else {
      setError(result?.message || "Transaction failed");
    }

    setSubmitting(false);
  };

  /* -----------------------------
    UI
 ------------------------------ */

  return (
    <div className="buy-data-container">
      <SideBar />
      <div className="buy-data-content">
        <Header />

        <div className="popup-container">
          <h2 className="popup-title">Buy Data Plan</h2>

          {!plansReady && (
            <div className="loading-banner">
              ⏳ Loading available data plans...
            </div>
          )}

          <form onSubmit={handleSubmit} className="popup-form">
            <div className="buy-data-form-row">
              {/* Left Column - Form */}
              <div className="form-column">
                {error && <div className="form-error">{error}</div>}
                {/* NETWORK */}
                <div className="form-group">
                  <label>Network *</label>
                  <select
                    name="network"
                    value={formData.network}
                    onChange={handleChange}
                    disabled={!plansReady}
                  >
                    <option value="">-- Select Network --</option>
                    <option value="MTN">MTN</option>
                    <option value="AIRTEL">AIRTEL</option>
                    <option value="GLO">GLO</option>
                    <option value="9MOBILE">9MOBILE</option>
                  </select>
                </div>
                {/* DATA TYPE */}
                <div className="form-group">
                  <label>Data Type *</label>
                  <select
                    name="dataType"
                    value={formData.dataType}
                    onChange={handleChange}
                    disabled={!formData.network || !plansReady}
                  >
                    <option value="">-- Select Data Type --</option>
                    <option value="SME">SME</option>
                    <option value="GIFTING">GIFTING</option>
                    <option value="CORPORATE_GIFTING">CORPORATE GIFTING</option>
                    <option value="DATA_SHARE">DATA SHARE</option>
                  </select>
                </div>
                {/* DATA PLAN */}
                <div className="form-group">
                  <label>Data Plan *</label>
                  <select
                    name="dataPlan"
                    value={formData.dataPlan}
                    onChange={handleChange}
                    disabled={availablePlans.length === 0}
                  >
                    <option value="">-- Select Data Plan --</option>
                    {availablePlans.map((plan) => (
                      <option
                        key={plan.providerPlanId}
                        value={plan.providerPlanId}
                      >
                        {plan.planName} - ₦{plan.sellingPrice} ({plan.validity})
                        {plan.planType}
                      </option>
                    ))}
                  </select>

                  {formData.dataType && availablePlans.length === 0 && (
                    <small className="text-warning">
                      No plans available for this selection
                    </small>
                  )}
                </div>
                {/* MOBILE */}
                <div className="form-group">
                  <label>Mobile Number *</label>
                  <input
                    type="tel"
                    name="mobileNumber"
                    value={formData.mobileNumber}
                    onChange={handleChange}
                    maxLength="11"
                  />
                </div>
                {/* AMOUNT */}
                <div className="form-group">
                  <label>Amount (₦)</label>
                  <input readOnly value={selectedPlan?.sellingPrice || ""} />
                </div>
                <button
                  type="submit"
                  disabled={!selectedPlan || submitting}
                  className="btn-buy-now"
                >
                  {submitting
                    ? "Processing..."
                    : `Buy Now ₦${selectedPlan?.sellingPrice || 0}`}
                </button>
              </div>

              {/* Right Column - Info */}
              <div className="info-column">
                <h3 className="info-title">Codes for Data Balance:</h3>
                <div className="info-cards">
                  <div className="info-card mtn">
                    <strong>MTN [SME]</strong> *461*4#
                  </div>
                  <div className="info-card mtn">
                    <strong>MTN [Gifting]</strong> *323#
                  </div>
                  <div className="info-card mtn">
                    <strong>MTN [Corporate Gifting]</strong> *323*1#
                  </div>
                  <div className="info-card mtn">
                    <strong>MTN [data coupon]</strong> send 2 to 312 as a text,
                    it's called promo data
                  </div>
                  <div className="info-card nine-mobile">
                    <strong>9mobile [C.G and Gifting]</strong> *323#
                  </div>
                  <div className="info-card airtel">
                    <strong>Airtel [Gifting]</strong> *323#
                  </div>
                  <div className="info-card airtel">
                    <strong>Airtel [C.G.]</strong> *323#. it's called edu data.
                  </div>
                  <div className="info-card glo">
                    <strong>Glo [C.G and Gifting]</strong> *323#
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BuyData;
