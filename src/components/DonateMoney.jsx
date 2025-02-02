import React, { useState } from "react";
import axios from "axios";
import { API_URL } from "../constant";
import "../css/DonateMoney.css";

const DonateMoney = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    amount: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
  });
  const [errors, setErrors] = useState({});
  const [showPopup, setShowPopup] = useState(false);
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    // Phone validation
    const phoneRegex = /^\+?[\d\s-()]{8,}$/;
    if (!phoneRegex.test(formData.phone.trim())) {
      newErrors.phone = "Please enter a valid phone number";
    }

    // Amount validation
    const amount = parseFloat(formData.amount);
    if (!amount || amount <= 0) {
      newErrors.amount = "Please enter a valid amount";
    }

    // Card number validation (16 digits, can have spaces)
    const cardNumber = formData.cardNumber.replace(/\s/g, "");
    if (!/^\d{16}$/.test(cardNumber)) {
      newErrors.cardNumber = "Please enter a valid 16-digit card number";
    }

    // Expiry date validation (MM/YY format)
    const expiryRegex = /^(0[1-9]|1[0-2])\/([0-9]{2})$/;
    if (!expiryRegex.test(formData.expiryDate)) {
      newErrors.expiryDate = "Please enter a valid expiry date (MM/YY)";
    } else {
      // Check if card is not expired
      const [month, year] = formData.expiryDate.split("/");
      const expiry = new Date(2000 + parseInt(year), parseInt(month) - 1);
      const today = new Date();
      if (expiry < today) {
        newErrors.expiryDate = "Card has expired";
      }
    }

    // CVV validation (3 digits)
    if (!/^\d{3}$/.test(formData.cvv)) {
      newErrors.cvv = "Please enter a valid 3-digit CVV";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }

    // Format card number with spaces
    if (name === "cardNumber") {
      const formatted =
        value
          .replace(/\s/g, "")
          .match(/.{1,4}/g)
          ?.join(" ") || value;
      setFormData((prev) => ({ ...prev, [name]: formatted }));
    }
    // Format expiry date
    else if (name === "expiryDate") {
      let formatted = value.replace(/\D/g, "");
      if (formatted.length >= 2) {
        formatted = formatted.slice(0, 2) + "/" + formatted.slice(2, 4);
      }
      setFormData((prev) => ({ ...prev, [name]: formatted }));
    }
    // Limit CVV to 3 digits
    else if (name === "cvv") {
      const formatted = value.slice(0, 3);
      setFormData((prev) => ({ ...prev, [name]: formatted }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      // Only send name, phone, and donation amount to the backend
      const donationData = {
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        amount: parseFloat(formData.amount), // Convert to number
      };

      await axios.post(`${API_URL}/api/donate-money/donate`, donationData);

      setShowPopup(true);
      setFormData({
        name: "",
        phone: "",
        amount: "",
        cardNumber: "",
        expiryDate: "",
        cvv: "",
      });
      setErrors({});
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "An error occurred while processing your donation";
      setErrors((prev) => ({ ...prev, submit: errorMessage }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="donate-money-page">
      <div className="container py-5">
        <h2 className="text-center fw-bold mb-4">Donate Money</h2>
        <p className="text-center mb-5">
          Your contribution helps us continue our mission of sustainability and
          community support.
        </p>

        {errors.submit && (
          <div className="alert alert-danger text-center mb-4">
            {errors.submit}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="donate-form mx-auto shadow p-4 rounded"
        >
          <div className="mb-3">
            <label htmlFor="name" className="form-label">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              className={`form-control ${errors.name ? "is-invalid" : ""}`}
              placeholder="Enter your name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            {errors.name && (
              <div className="invalid-feedback">{errors.name}</div>
            )}
          </div>

          <div className="mb-3">
            <label htmlFor="phone" className="form-label">
              Phone
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              className={`form-control ${errors.phone ? "is-invalid" : ""}`}
              placeholder="Enter your phone number"
              value={formData.phone}
              onChange={handleChange}
              required
            />
            {errors.phone && (
              <div className="invalid-feedback">{errors.phone}</div>
            )}
          </div>

          <div className="mb-3">
            <label htmlFor="amount" className="form-label">
              Donation Amount (₹)
            </label>
            <input
              type="number"
              id="amount"
              name="amount"
              className={`form-control ${errors.amount ? "is-invalid" : ""}`}
              placeholder="Enter donation amount"
              value={formData.amount}
              onChange={handleChange}
              min="1"
              step="any"
              required
            />
            {errors.amount && (
              <div className="invalid-feedback">{errors.amount}</div>
            )}
          </div>

          <div className="mb-3">
            <label htmlFor="cardNumber" className="form-label">
              Card Number
            </label>
            <input
              type="text"
              id="cardNumber"
              name="cardNumber"
              className={`form-control ${
                errors.cardNumber ? "is-invalid" : ""
              }`}
              placeholder="Enter your 16-digit card number"
              value={formData.cardNumber}
              onChange={handleChange}
              maxLength="19"
              required
            />
            {errors.cardNumber && (
              <div className="invalid-feedback">{errors.cardNumber}</div>
            )}
          </div>

          <div className="mb-3">
            <label htmlFor="expiryDate" className="form-label">
              Expiry Date
            </label>
            <input
              type="text"
              id="expiryDate"
              name="expiryDate"
              className={`form-control ${
                errors.expiryDate ? "is-invalid" : ""
              }`}
              placeholder="MM/YY"
              value={formData.expiryDate}
              onChange={handleChange}
              maxLength="5"
              required
            />
            {errors.expiryDate && (
              <div className="invalid-feedback">{errors.expiryDate}</div>
            )}
          </div>

          <div className="mb-3">
            <label htmlFor="cvv" className="form-label">
              CVV
            </label>
            <input
              type="password"
              id="cvv"
              name="cvv"
              className={`form-control ${errors.cvv ? "is-invalid" : ""}`}
              placeholder="Enter 3-digit CVV"
              value={formData.cvv}
              onChange={handleChange}
              maxLength="3"
              required
            />
            {errors.cvv && <div className="invalid-feedback">{errors.cvv}</div>}
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100"
            disabled={loading}
          >
            {loading ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                  aria-hidden="true"
                ></span>
                Processing...
              </>
            ) : (
              "Donate Now"
            )}
          </button>
        </form>
      </div>

      {/* Thank-You Popup */}
      {showPopup && (
        <div className="thank-you-popup">
          <div className="popup-content">
            <span role="img" aria-label="Thank you" className="thank-you-icon">
              🎉
            </span>
            <h3>Thank you for your donation!</h3>
            <p>Your support makes a difference.</p>
            <button
              className="btn btn-secondary"
              onClick={() => setShowPopup(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DonateMoney;
