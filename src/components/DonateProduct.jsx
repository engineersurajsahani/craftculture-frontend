import React, { useState } from "react";
import axios from "axios";
import { API_URL } from "../constant";
import "../css/DonateMoney.css"; // Reusing the same CSS

const DonateProduct = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    category: "",
    quantity: "",
    description: "",
  });

  const [errors, setErrors] = useState({});
  const [showPopup, setShowPopup] = useState(false);
  const [loading, setLoading] = useState(false);

  const categories = [
    "Frames",
    "Wall Hanging",
    "Bag",
    "Pen Stand",
    "Jewellery",
    "Diyas",
    "Bottle Art",
  ];

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

    // Category validation
    if (!formData.category) {
      newErrors.category = "Please select a category";
    }

    // Quantity validation
    const quantity = parseInt(formData.quantity);
    if (!quantity || quantity <= 0 || !Number.isInteger(quantity)) {
      newErrors.quantity = "Please enter a valid quantity (whole number)";
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

    // For quantity, only allow positive integers
    if (name === "quantity") {
      const numValue = value.replace(/\D/g, "");
      setFormData((prev) => ({ ...prev, [name]: numValue }));
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
      const donationData = {
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        category: formData.category,
        quantity: parseInt(formData.quantity),
      };

      await axios.post(`${API_URL}/api/donate-product/donate`, donationData);

      setShowPopup(true);
      setFormData({
        name: "",
        phone: "",
        category: "",
        quantity: "",
        description: "",
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
        <h2 className="text-center fw-bold mb-4">Donate Products</h2>
        <p className="text-center mb-5">
          Your product donations help us support our community and promote
          sustainability.
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
            <label htmlFor="category" className="form-label">
              Product Category
            </label>
            <select
              id="category"
              name="category"
              className={`form-select ${errors.category ? "is-invalid" : ""}`}
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            {errors.category && (
              <div className="invalid-feedback">{errors.category}</div>
            )}
          </div>

          <div className="mb-3">
            <label htmlFor="quantity" className="form-label">
              Quantity
            </label>
            <input
              type="number"
              id="quantity"
              name="quantity"
              className={`form-control ${errors.quantity ? "is-invalid" : ""}`}
              placeholder="Enter quantity"
              value={formData.quantity}
              onChange={handleChange}
              min="1"
              step="1"
              required
            />
            {errors.quantity && (
              <div className="invalid-feedback">{errors.quantity}</div>
            )}
          </div>

          <div className="mb-3">
            <label htmlFor="description" className="form-label">
              Description (Optional)
            </label>
            <textarea
              id="description"
              name="description"
              className="form-control"
              placeholder="Enter any additional details about your donation"
              value={formData.description}
              onChange={handleChange}
              rows="3"
            />
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
              "Submit Donation"
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
            <p>Your support makes a difference in our community.</p>
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

export default DonateProduct;
