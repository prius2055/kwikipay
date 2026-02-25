import React, { useState } from "react";
import { useWallet } from "./walletContext";
import { useNavigate } from "react-router-dom";
import SideBar from "./SideBar";
import Header from "./Header";

import "./BuyData.css";

const BuyAirtime = () => {
  const [formData, setFormData] = useState({
    network: "",
    airtimeType: "",
    mobileNumber: "",
    amount: "",
    // bypassValidator: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { buyAirtime } = useWallet();
  const navigate = useNavigate();

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

    // Validation
    if (!formData.network) {
      setError("Please select a network");
      return;
    }
    if (!formData.airtimeType) {
      setError("Please select an airtime type");
      return;
    }
    if (!formData.mobileNumber) {
      setError("Please enter mobile number");
      return;
    }

    if (!formData.amount || formData.amount < 100) {
      setError("Please enter a valid amount (minimum ₦100)");
      return;
    }

    const payload = {
      network: formData.network,
      airtime_type: formData.airtimeType,
      mobile_number: formData.mobileNumber,
      amount: Number(formData.amount),
      // bypass_validator: formData.bypassValidator,
    };

    setLoading(true);

    const result = await buyAirtime(payload);

    console.log(result);

    if (result.status) {
      setLoading(false);
      setError(false);
      navigate("/success", { replace: true });
    } else {
      setLoading(false);
      setError(result?.message || "Transaction failed");
      return;
    }
  };

  return (
    <div className="buy-data-container">
      <SideBar />
      <div className="buy-data-content">
        <Header />
        <div className="popup-container">
          <h2 className="popup-title">Buy Data Plan</h2>

          <form onSubmit={handleSubmit} className="popup-form">
            <div className="buy-data-form-row">
              {/* Left Column - Form */}
              <div className="form-column">
                {error && <div className="form-error">{error}</div>}

                {/* Network */}
                <div className="form-group">
                  <label htmlFor="network">
                    Network<span className="required">*</span>
                  </label>
                  <select
                    id="network"
                    name="network"
                    value={formData.network}
                    onChange={handleChange}
                    required
                  >
                    <option value="">-- Select Network --</option>
                    <option value="MTN">MTN</option>
                    <option value="AIRTEL">AIRTEL</option>
                    <option value="GLO">GLO</option>
                    <option value="9MOBILE">9MOBILE</option>
                  </select>
                </div>

                {/* Airtime Type */}
                <div className="form-group">
                  <label htmlFor="airtimeType">
                    Airtime Type<span className="required">*</span>
                  </label>
                  <select
                    id="airtimeType"
                    name="airtimeType"
                    value={formData.airtimeType}
                    onChange={handleChange}
                    disabled={!formData.network}
                    required
                  >
                    <option value="">-- Select Airtime Type --</option>
                    <option value="VTU">VTU</option>
                    <option value="SHARE AND SELL">SHARE AND SELL</option>
                  </select>
                  <small className="form-hint">
                    Select Airtime Type: VTU or SHARE AND SELL
                  </small>
                </div>

                {/* Mobile Number */}
                <div className="form-group">
                  <label htmlFor="mobileNumber">
                    Mobile Number<span className="required">*</span>
                  </label>
                  <input
                    type="tel"
                    id="mobileNumber"
                    name="mobileNumber"
                    value={formData.mobileNumber}
                    onChange={handleChange}
                    placeholder="08012345678"
                    maxLength="11"
                    required
                  />
                </div>

                {/* Amount */}
                <div className="form-group">
                  <label htmlFor="amount">
                    Amount To Pay (₦) <span className="required">*</span>
                  </label>
                  <input
                    type="number"
                    id="amount"
                    name="amount"
                    value={formData.amount}
                    onChange={handleChange}
                    placeholder="Minimum of ₦100"
                    min={100}
                  />
                </div>

                {/* Bypass Validator */}
                {/* <div className="form-group checkbox-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="bypassValidator"
                    checked={formData.bypassValidator}
                    onChange={handleChange}
                  />
                  <span>Bypass number validator</span>
                </label>
              </div> */}

                {/* Submit Button */}
                <button
                  type="submit"
                  className="btn-buy-now"
                  // disabled={loading || !formData.amount}
                >
                  {loading
                    ? "Processing..."
                    : `Buy Now - ₦${formData.amount || "0"}`}
                </button>
              </div>

              {/* Right Column - Info */}
              <div className="info-column">
                <h3 className="info-title">Codes for AirtimeBalance:</h3>
                <div className="info-cards">
                  <div className="info-card mtn">
                    <strong>MTN</strong> *461*4#
                  </div>
                  <div className="info-card nine-mobile">
                    <strong>9mobile</strong> *323#
                  </div>
                  <div className="info-card airtel">
                    <strong>Airtel</strong> *323#
                  </div>
                  <div className="info-card glo">
                    <strong>Glo</strong> *323#
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

export default BuyAirtime;
