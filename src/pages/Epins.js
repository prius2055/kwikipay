import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router";

import "./Epins.css";

const BASE_URL = "http://localhost:5000/api/v1"; // change to prod later

const Epins = () => {
  const [formData, setFormData] = useState({
    network: "",
    amount: "",
    quantity: "",
  });
  const [pins, setPins] = useState([]);
  const [selected, setSelected] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const printRef = useRef();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.network) {
      setError("Please select a network provider");
      return;
    }

    if (!formData.amount) {
      setError("Please select a pin amount");
      return;
    }

    if (!formData.quantity) {
      setError("Enter quantity of pin slips  or card you intend to print");
      return;
    }

    const payload = {
      network: formData.network,
      amount: Number(formData.amount),
      quantity: Number(formData.quantity),
    };

    console.log(payload);

    setSubmitting(true);

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${BASE_URL}/epins/buy`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      console.log(data);
    } catch (err) {
      console.error(err);
    }

    // if (result?.success) {
    //   navigate("/success", { replace: true });
    // } else {
    //   setError(result?.message || "Transaction failed");
    // }

    setSubmitting(false);
  };

  /* ===============================
     Fetch Pins
  =============================== */
  useEffect(() => {
    fetchPins();
  }, []);

  const fetchPins = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${BASE_URL}/epins`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      setPins(data.pins || []);
    } catch (err) {
      console.error(err);
    }
  };

  /* ===============================
     Select logic
  =============================== */
  const toggleSelect = (pin) => {
    if (selected.includes(pin)) {
      setSelected(selected.filter((p) => p !== pin));
    } else {
      setSelected([...selected, pin]);
    }
  };

  const selectAll = () => {
    setSelected(pins.map((p) => p.pin));
  };

  const clearAll = () => setSelected([]);

  /* ===============================
     Print
  =============================== */
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="epin-page">
      <h2 className="epin-title">Recharge Card Printing</h2>

      <form onSubmit={handleSubmit} className="popup-form">
        <div className="form-row">
          {/* Left Column - Form */}

          <div className="form-column">
            {error && <div className="form-error">{error}</div>}

            {/* Cable Name */}
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
                <option value="mtn">MTN</option>
                <option value="airtel">AIRTEL</option>
                <option value="glo">GLO</option>
                <option value="9mobile">9MOBILE</option>
              </select>
            </div>

            {/* Cable plan*/}
            <div className="form-group">
              <label htmlFor="amount">
                Pin Amount<span className="required">*</span>
              </label>
              <select
                id="amount"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                required
              >
                <option value="">----Select Pin Amount-----</option>
                <option value="100">100</option>
                <option value="200">200</option>
                <option value="500">500</option>
              </select>
            </div>

            {/* Display Customer Name and Address if available */}

            {/* Amount */}
            <div className="form-group">
              <label htmlFor="quantity">
                Quantity<span className="required">*</span>
              </label>
              <input
                type="number"
                id="quantity"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                placeholder="Enter quantity of card you want to print"
              />
              <small className="form-hint">
                Enter quantity, between 1 - 40
              </small>
            </div>

            {/* Submit Button */}

            <button
              type="submit"
              className="btn-buy-now"
              disabled={
                loading ||
                !formData.network ||
                !formData.amount ||
                !formData.quantity
              }
            >
              {loading ? "Processing..." : "Continue"}
            </button>
          </div>
        </div>
      </form>

      {/* Controls */}
      <div className="epin-controls no-print">
        <button onClick={selectAll}>Select All</button>
        <button onClick={clearAll}>Clear</button>
        <button className="print-btn" onClick={handlePrint}>
          Print Selected
        </button>
      </div>

      {/* List Table */}
      <table className="epin-table no-print">
        <thead>
          <tr>
            <th></th>
            <th>Network</th>
            <th>Amount</th>
            <th>PIN</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {pins.map((item) => (
            <tr key={item._id}>
              <td>
                <input
                  type="checkbox"
                  checked={selected.includes(item.pin)}
                  onChange={() => toggleSelect(item.pin)}
                />
              </td>
              <td>{item.network}</td>
              <td>₦{item.amount}</td>
              <td>{item.pin}</td>
              <td>{item.used ? "Used" : "Unused"}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ===============================
          PRINT AREA
      =============================== */}
      <div className="print-area" ref={printRef}>
        {selected.map((pin, i) => (
          <div key={i} className="print-card">
            <h3>Recharge Card</h3>
            <p className="print-pin">{pin}</p>
            <p className="print-note">Dial *123*PIN# to recharge</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Epins;
