import React, { useState } from "react";
import SideBar from "./SideBar";
import Header from "./Header";
import { useWallet } from "./walletContext";

import "./BuyData.css";

const CABLE_PLAN_MAP = {
  34: "GOtv Smallie - Monthly= N1900",
  16: "GOtv Jinja = N3900",
  35: " GOtv Smallie - Quarterly = N5100",
  17: "GOtv Jolli = N5800",
  2: "GOtv Max = N8500",
  47: "Gotv-supa monthly = N11400",
  36: "GOtv Smallie - Yearly = N15000",
};

const CableTv = () => {
  const [formData, setFormData] = useState({
    cableName: "",
    iucNumber: "",
    cablePlan: "",
    customerPhone: "",
    amount: "",
    customerName: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { cableValidation, cableRecharge } = useWallet();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleValidate = async (e) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!formData.cableName) {
      setError("Please select a cable tv provider");
      return;
    }

    if (!formData.cablePlan) {
      setError("Please select a cable plan");
      return;
    }

    if (!formData.customerPhone) {
      setError("Please enter customer phone number");
      return;
    }

    if (!formData.iucNumber) {
      setError("Please enter IUC number");
      return;
    }

    if (!formData.amount || formData.amount < 500) {
      setError("Please enter a valid amount (minimum ₦500)");
      return;
    }

    const payload = {
      cableName: formData.cableName,
      iucNumber: formData.iucNumber,
    };

    console.log(payload);

    setLoading(true);

    const result = await cableValidation(payload);

    console.log(result);

    if (result.status) {
      setLoading(false);
      setError(false);
      setFormData((prev) => ({
        ...prev,
        customerName: result.data.name,
      }));
    } else {
      return;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validation
    if (
      !formData.cableName ||
      !formData.iucNumber ||
      !formData.cablePlan ||
      !formData.amount
    ) {
      setError("Please a valid IUC number");
      return;
    }

    if (formData.amount < 0) {
      setError("Please enter a valid amount");
      return;
    }

    const payload = {
      cablename: formData.cableName,
      cableplan: formData.cablePlan,
      smart_card_number: formData.iucNumber,
      amount: Number(formData.amount),
      name: formData.customerName,
      customerNumber: formData.customerPhone,
    };

    console.log(payload);

    setLoading(true);

    const result = await cableRecharge(payload);

    console.log(result);

    if (result.status) {
      setLoading(false);
      setError(false);
      setFormData({
        cableName: "",
        iucNumber: "",
        cablePlan: "",
        customerPhone: "",
        amount: "",
        customerName: "",
      });
    } else {
      return;
    }
  };

  return (
    <div className="buy-data-container">
      <SideBar />
      <div className="buy-data-content">
        <Header />
        <div className="popup-container">
          <h2 className="popup-title">Cable Tv Subscription</h2>
          {!formData.customerName && (
            <form onSubmit={handleValidate} className="popup-form">
              <div className="form-row">
                {/* Left Column - Form */}

                <div className="form-column">
                  {error && <div className="form-error">{error}</div>}

                  {/* Cable Name */}
                  <div className="form-group">
                    <label htmlFor="cableName">
                      Cable Name<span className="required">*</span>
                    </label>
                    <select
                      id="cableName"
                      name="cableName"
                      value={formData.cableName}
                      onChange={handleChange}
                      required
                    >
                      <option value="">-- Cable Name --</option>
                      <option value="GOTV">GOTV</option>
                      <option value="DSTV">DSTV</option>
                      <option value="STARTIMES">STARTIMES</option>
                    </select>
                  </div>

                  {/* IUC Number */}
                  <div className="form-group">
                    <label htmlFor="iucNumber">
                      Smart Card number / IUC number
                      <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      id="iucNumber"
                      name="iucNumber"
                      value={formData.iucNumber}
                      onChange={handleChange}
                      placeholder="456781111111"
                      required
                    />
                  </div>

                  {/* Cable plan*/}
                  <div className="form-group">
                    <label htmlFor="cablePlan">
                      Cable Plan<span className="required">*</span>
                    </label>
                    <select
                      id="cablePlan"
                      name="cablePlan"
                      value={formData.cablePlan}
                      onChange={handleChange}
                      disabled={!formData.iucNumber}
                      required
                    >
                      <option value="">---------</option>
                      <option value="34">GOtv Smallie - Monthly = N1900</option>
                      <option value="16">GOtv Jinja = N3900</option>
                      <option value="35">
                        GOtv Smallie - Quarterly = N5100
                      </option>
                      <option value="17">GOtv Jolli = N5800</option>
                      <option value="2">GOtv Max = N8500</option>
                      <option value="47">Gotv-supa monthly = N11400</option>
                      <option value="36">GOtv Smallie - Yearly = N15000</option>
                    </select>
                    <small className="form-hint">Select Cable Plan</small>
                  </div>

                  {/* Display Customer Name and Address if available */}

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
                      placeholder="Enter Amount associated with the cable plan selected"
                    />
                  </div>

                  {/* Customer Phone */}
                  <div className="form-group">
                    <label htmlFor="customerPhone">
                      Customer Phone <span className="required">*</span>
                    </label>
                    <input
                      type="number"
                      id="customerPhone"
                      name="customerPhone"
                      value={formData.customerPhone}
                      onChange={handleChange}
                      placeholder="08012345678"
                      min={11}
                    />
                  </div>

                  {/* Submit Button */}

                  <button
                    type="submit"
                    className="btn-buy-now"
                    disabled={loading || !formData.iucNumber}
                  >
                    {loading ? "Processing..." : "Validate IUC Number"}
                  </button>
                </div>
                <div className="info-column">
                  <h3 className="info-title">Customer Care Numbers:</h3>
                  <div className="info-cards">
                    <div className="info-card mtn">
                      <strong>DSTV/GOtv Customers Care Numbers</strong>
                    </div>
                    <div className="info-card mtn">
                      <strong>01-2703232, 08039003788</strong>
                    </div>
                    <div className="info-card mtn">
                      <strong>GOTV/DSTV Toll Free Lines</strong>
                    </div>
                    <div className="info-card mtn">
                      <strong>08149860333, 07080630333, and 09090630333</strong>
                    </div>
                    <div className="info-card mtn">
                      <strong>STARTIMES Customers Care Numbers</strong>
                    </div>
                    <div className="info-card mtn">
                      <strong>094618888, 014618888</strong>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          )}

          {formData.customerName && (
            <form onSubmit={handleSubmit} className="popup-form">
              <div className="form-row">
                {/* Left Column - Form */}

                <div className="form-column">
                  {error && <div className="form-error">{error}</div>}

                  {/* Display Customer Name and Address if available */}
                  <div className="form-group">
                    <div className="customer-info">
                      <p>
                        <strong>Cable Name:</strong> {formData.cableName}
                      </p>
                      <p>
                        <strong>Smartcard / IUC Number:</strong>{" "}
                        {formData.iucNumber}
                      </p>
                      <p>
                        <strong>Cable Plan:</strong>
                        {CABLE_PLAN_MAP[formData.cablePlan]}
                      </p>
                      <p>
                        <strong>Name on Decoder:</strong>{" "}
                        {formData.customerName}
                      </p>
                      <p>
                        <strong>Amount To Pay:</strong> ₦{formData.amount}
                      </p>
                      <p>
                        <strong>Customer Phone Number:</strong>
                        {formData.customerPhone}
                      </p>
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="btn-buy-now"
                    disabled={loading || !formData.iucNumber}
                  >
                    {loading
                      ? "Processing..."
                      : `Buy Now - ₦${formData.amount || "0"}`}
                  </button>
                </div>

                <div className="info-column">
                  <h3 className="info-title">Customer Care Numbers:</h3>
                  <div className="info-cards">
                    <div className="info-card mtn">
                      <strong>DSTV/GOtv Customers Care Numbers</strong>
                    </div>
                    <div className="info-card mtn">
                      <strong>01-2703232, 08039003788</strong>
                    </div>
                    <div className="info-card mtn">
                      <strong>GOTV/DSTV Toll Free Lines</strong>
                    </div>
                    <div className="info-card mtn">
                      <strong>08149860333, 07080630333, and 09090630333</strong>
                    </div>
                    <div className="info-card mtn">
                      <strong>STARTIMES Customers Care Numbers</strong>
                    </div>
                    <div className="info-card mtn">
                      <strong>094618888, 014618888</strong>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default CableTv;
