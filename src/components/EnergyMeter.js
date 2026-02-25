import React, { useState } from "react";
import SideBar from "./SideBar";
import Header from "./Header";
import { useWallet } from "./walletContext";
import { capitalize } from "../utils/helperFunctions";

import "./BuyData.css";

const DISCO_NAME_MAP = {
  "ikeja-electric": 1,
  "eko-electric": 2,
  "abuja-electric": 3,
  "kano-electric": 4,
  "enugu-electric": 5,
  "portharcourt-electric": 6,
  "ibadan-electric": 7,
  "kaduna-electric": 8,
  "jos-electric": 9,
  "benin-electric": 10,
  "yola-electric": 11,
};

const EnergyMeter = () => {
  const [formData, setFormData] = useState({
    discoName: "",
    meterNumber: "",
    meterType: "",
    customerPhone: "",
    amount: "",
    customerName: "",
    customerAddress: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { meterValidation, meterRecharge } = useWallet();

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
    if (!formData.discoName) {
      setError("Please select a disco");
      return;
    }

    if (!formData.meterType) {
      setError("Please select a meter type");
      return;
    }

    if (!formData.customerPhone) {
      setError("Please enter customer phone number");
      return;
    }

    if (!formData.meterNumber) {
      setError("Please enter meter number");
      return;
    }

    if (!formData.amount || formData.amount < 500) {
      setError("Please enter a valid amount (minimum ₦500)");
      return;
    }

    const payload = {
      disco_name: formData.discoName,
      amount: Number(formData.amount),
      meter_number: formData.meterNumber,
      MeterType: formData.meterType,
      customer_number: formData.customerPhone,
    };

    console.log(payload);

    setLoading(true);

    const result = await meterValidation(payload);

    console.log(result);

    if (result.status) {
      setLoading(false);
      setError(false);
      setFormData((prev) => ({
        ...prev,
        customerName: result.data.name,
        customerAddress: result.data.address,
      }));
    } else {
      return;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!formData.discoName) {
      setError("Please select a disco");
      return;
    }

    if (!formData.meterType) {
      setError("Please select a meter type");
      return;
    }

    if (!formData.customerPhone) {
      setError("Please enter customer phone number");
      return;
    }

    if (!formData.meterNumber) {
      setError("Please enter meter number");
      return;
    }
    if (!formData.customerName || !formData.customerAddress) {
      setError("Please validate meter number first");
      return;
    }

    if (!formData.amount || formData.amount < 500) {
      setError("Please enter a valid amount (minimum ₦500)");
      return;
    }

    const payload = {
      disco_name: DISCO_NAME_MAP[formData.discoName],
      amount: Number(formData.amount),
      meter_number: formData.meterNumber,
      MeterType: capitalize(formData.meterType),
      customer_number: formData.customerPhone,
      meter_name: formData.customerName,
      meter_address: formData.customerAddress,
    };

    console.log(payload);

    setLoading(true);

    const result = await meterRecharge(payload);

    console.log(result);

    if (result.status) {
      setLoading(false);
      setError(false);
      setFormData({
        discoName: "",
        meterNumber: "",
        meterType: "",
        customerPhone: "",
        amount: "",
        customerName: "",
        customerAddress: "",
      });
    } else {
      setLoading(false);
      setError(result.message);
      return;
    }
  };

  return (
    <div className="buy-data-container">
      <SideBar />
      <div className="buy-data-content">
        <Header />
        <div className="popup-container">
          <h2 className="popup-title">Electricity Bill Payment</h2>
          {!formData.customerName && !formData.customerAddress && (
            <form onSubmit={handleValidate} className="popup-form">
              <div className="form-row">
                {/* Left Column - Form */}

                <div className="form-column">
                  {error && <div className="form-error">{error}</div>}

                  {/* Disco */}
                  <div className="form-group">
                    <label htmlFor="discoName">
                      Disco<span className="required">*</span>
                    </label>
                    <select
                      id="discoName"
                      name="discoName"
                      value={formData.discoName}
                      onChange={handleChange}
                      required
                    >
                      <option value="">-- Select Disco --</option>
                      <option value="ikeja-electric">Ikeja Electric</option>
                      <option value="eko-electric">Eko Electric</option>
                      <option value="abuja-electric">Abuja Electric</option>
                      <option value="kano-electric">Kano Electric</option>
                      <option value="enugu-electric">Enugu Electric</option>
                      <option value="portharcourt-electric">
                        Port Harcourt Electric
                      </option>
                      <option value="ibadan-electric">Ibadan Electric</option>
                      <option value="kaduna-electric">Kaduna Electric</option>
                      <option value="jos-electric">Jos Electric</option>
                      <option value="benin-electric">Benin Electric</option>
                      <option value="yola-electric">Yola Electric</option>
                    </select>
                  </div>

                  {/* Meter Number */}
                  <div className="form-group">
                    <label htmlFor="meterNumber">
                      Meter Number<span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      id="meterNumber"
                      name="meterNumber"
                      value={formData.meterNumber}
                      onChange={handleChange}
                      placeholder="0123456781111111"
                      required
                    />
                  </div>

                  {/* Meter Type */}
                  <div className="form-group">
                    <label htmlFor="airtimeType">
                      Meter Type<span className="required">*</span>
                    </label>
                    <select
                      id="meterType"
                      name="meterType"
                      value={formData.meterType}
                      onChange={handleChange}
                      disabled={!formData.meterNumber}
                      required
                    >
                      <option value="">-- Select Meter Type --</option>
                      <option value="prepaid">PREPAID</option>
                      <option value="postpaid">POSTPAID</option>
                    </select>
                    <small className="form-hint">
                      Select Meter Type: PREPAID or POSTPAID
                    </small>
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
                      placeholder="Minimum of ₦500"
                      min={500}
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
                    disabled={loading || !formData.meterNumber}
                  >
                    {loading ? "Processing..." : "Validate Meter Number"}
                  </button>
                </div>
                <div className="info-column">
                  <h3 className="info-title">How To Recharge Meter:</h3>
                  <div className="info-cards">
                    <div className="info-card mtn">
                      <strong>Enter the token sent to the phone number</strong>
                    </div>
                    <div className="info-card mtn">
                      <strong>Press Enter on the Keypad</strong>
                    </div>
                    <div className="info-card mtn">
                      <strong>Wait for the confirmation message</strong>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          )}

          {formData.customerName && formData.customerAddress && (
            <form onSubmit={handleSubmit} className="popup-form">
              <div className="form-row">
                {/* Left Column - Form */}

                <div className="form-column">
                  {error && <div className="form-error">{error}</div>}

                  {/* Display Customer Name and Address if available */}
                  <div className="form-group">
                    <div className="customer-info">
                      <p>
                        <strong>Disco Name:</strong> {formData.discoName}
                      </p>
                      <p>
                        <strong>Meter Number:</strong> {formData.meterNumber}
                      </p>
                      <p>
                        <strong>Meter Type:</strong> {formData.meterType}
                      </p>
                      <p>
                        <strong>Name on Meter:</strong> {formData.customerName}
                      </p>
                      <p>
                        <strong>Address on Meter:</strong>{" "}
                        {formData.customerAddress}
                      </p>
                      <p>
                        <strong>Amount To Pay:</strong> ₦{formData.amount}
                      </p>
                      <p>
                        <strong>Customer Phone Number:</strong>{" "}
                        {formData.customerPhone}
                      </p>
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="btn-buy-now"
                    disabled={loading || !formData.meterNumber}
                  >
                    {loading
                      ? "Processing..."
                      : `Buy Now - ₦${formData.amount || "0"}`}
                  </button>
                </div>

                <div className="info-column">
                  <h3 className="info-title">How To Recharge Meter:</h3>
                  <div className="info-cards">
                    <div className="info-card mtn">
                      <strong>Enter the token sent to the phone number</strong>
                    </div>
                    <div className="info-card mtn">
                      <strong>Press Enter on the Keypad</strong>
                    </div>
                    <div className="info-card mtn">
                      <strong>Wait for the confirmation message</strong>
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

export default EnergyMeter;
