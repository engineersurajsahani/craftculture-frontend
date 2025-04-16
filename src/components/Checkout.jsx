import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../constant";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

const Checkout = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
  });
  const [paymentErrors, setPaymentErrors] = useState({});
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: {
      street: "",
      city: "",
      state: "",
      postalCode: "",
      country: "India",
    },
    paymentMethod: "COD",
  });

  useEffect(() => {
    const username = localStorage.getItem("username");
    if (!username) {
      navigate("/login");
      return;
    }

    const cartData = JSON.parse(localStorage.getItem("cart")) || {};
    const userCart = cartData[username] || [];
    if (userCart.length === 0) {
      navigate("/cart");
      return;
    }

    setCart(userCart);
    calculateTotal(userCart);
  }, [navigate]);

  const calculateTotal = (cartItems) => {
    const total = cartItems.reduce((sum, item) => {
      const price = item.price * (item.quantity || 1);
      const discount = (price * (item.offer || 0)) / 100;
      return sum + (price - discount);
    }, 0);
    setTotalAmount(total);
  };

  const validateForm = () => {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\+?[\d\s-()]{8,}$/;

    if (!formData.fullName.trim()) {
      errors.fullName = "Full name is required";
    }

    if (!emailRegex.test(formData.email)) {
      errors.email = "Invalid email format";
    }

    if (!phoneRegex.test(formData.phone)) {
      errors.phone = "Invalid phone number format";
    }

    if (!formData.address.street.trim()) {
      errors.street = "Street address is required";
    }

    if (!formData.address.city.trim()) {
      errors.city = "City is required";
    }

    if (!formData.address.state.trim()) {
      errors.state = "State is required";
    }

    if (!formData.address.postalCode.trim()) {
      errors.postalCode = "Postal code is required";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validatePaymentDetails = () => {
    const errors = {};
    const cardRegex = /^\d{16}$/;
    const expiryRegex = /^(0[1-9]|1[0-2])\/?([0-9]{2})$/;
    const cvvRegex = /^\d{3,4}$/;

    if (!cardRegex.test(paymentDetails.cardNumber.replace(/\s/g, ""))) {
      errors.cardNumber = "Invalid card number (16 digits required)";
    }

    if (!expiryRegex.test(paymentDetails.expiryDate)) {
      errors.expiryDate = "Invalid expiry date (MM/YY format)";
    } else {
      // Check if expiry date is in the past
      const [month, year] = paymentDetails.expiryDate.split("/");
      const currentYear = new Date().getFullYear() % 100; // Get last 2 digits
      const currentMonth = new Date().getMonth() + 1; // Months are 0-indexed

      const expiryYear = parseInt(year, 10);
      const expiryMonth = parseInt(month, 10);

      if (
        expiryYear < currentYear ||
        (expiryYear === currentYear && expiryMonth < currentMonth)
      ) {
        errors.expiryDate = "Card has expired";
      }
    }

    if (!cvvRegex.test(paymentDetails.cvv)) {
      errors.cvv = "Invalid CVV (3-4 digits required)";
    }

    setPaymentErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
    // Clear validation error when user starts typing
    if (validationErrors[name]) {
      setValidationErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handlePaymentInputChange = (e) => {
    const { name, value } = e.target;

    let formattedValue = value;

    if (name === "expiryDate") {
      // Auto-insert slash after 2 digits
      formattedValue = value
        .replace(/\D/g, "") // Remove non-digits
        .replace(/^(\d{2})/, "$1/") // Add slash after 2 digits
        .substring(0, 5); // Limit to MM/YY format
    } else if (name === "cardNumber") {
      // Add spaces every 4 digits for better readability
      formattedValue = value
        .replace(/\D/g, "")
        .replace(/(\d{4})/g, "$1 ")
        .trim()
        .substring(0, 19);
    } else if (name === "cvv") {
      // Limit CVV to 4 digits
      formattedValue = value.replace(/\D/g, "").substring(0, 4);
    }

    setPaymentDetails((prev) => ({
      ...prev,
      [name]: formattedValue,
    }));

    // Clear validation error when user starts typing
    if (paymentErrors[name]) {
      setPaymentErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (formData.paymentMethod === "Online") {
      setShowPaymentModal(true);
      return;
    }

    await placeOrder();
  };

  const handlePaymentSubmit = async () => {
    if (!validatePaymentDetails()) {
      return;
    }

    setShowPaymentModal(false);
    await placeOrder();
  };

  const placeOrder = async () => {
    setLoading(true);

    try {
      const username = localStorage.getItem("username");
      const orderData = {
        ...formData,
        username,
        items: cart.map((item) => ({
          _id: item._id,
          name: item.name,
          price: item.price,
          quantity: item.quantity || 1,
          image: item.image,
          offer: item.offer || 0,
        })),
        totalAmount,
        status: "Pending",
        paymentDetails:
          formData.paymentMethod === "Online"
            ? {
                ...paymentDetails,
                status: "Completed",
              }
            : {
                status: "Pending",
              },
      };

      const response = await axios.post(`${API_URL}/api/orders`, orderData);

      if (response.status === 201) {
        // Clear user's cart
        const cartData = JSON.parse(localStorage.getItem("cart")) || {};
        delete cartData[username];
        localStorage.setItem("cart", JSON.stringify(cartData));

        // Show success message with estimated delivery date
        const { estimatedDelivery } = response.data;
        const deliveryDate = new Date(estimatedDelivery).toLocaleDateString();
        alert(`Order placed successfully! Estimated delivery: ${deliveryDate}`);

        navigate("/order");
      }
    } catch (error) {
      console.error("Error placing order:", error);
      const errorMessage =
        error.response?.data?.message ||
        "Failed to place order. Please try again.";
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container my-5">
      <div className="row">
        <div className="col-md-8">
          <div className="card shadow-sm">
            <div className="card-body">
              <h3 className="card-title mb-4">Checkout Details</h3>
              <form onSubmit={handleSubmit}>
                {/* Personal Information */}
                <div className="mb-4">
                  <h5>Personal Information</h5>
                  <div className="row g-3">
                    <div className="col-12">
                      <input
                        type="text"
                        className={`form-control ${
                          validationErrors.fullName ? "is-invalid" : ""
                        }`}
                        name="fullName"
                        placeholder="Full Name"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        required
                      />
                      {validationErrors.fullName && (
                        <div className="invalid-feedback">
                          {validationErrors.fullName}
                        </div>
                      )}
                    </div>
                    <div className="col-md-6">
                      <input
                        type="email"
                        className={`form-control ${
                          validationErrors.email ? "is-invalid" : ""
                        }`}
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                      />
                      {validationErrors.email && (
                        <div className="invalid-feedback">
                          {validationErrors.email}
                        </div>
                      )}
                    </div>
                    <div className="col-md-6">
                      <input
                        type="tel"
                        className={`form-control ${
                          validationErrors.phone ? "is-invalid" : ""
                        }`}
                        name="phone"
                        placeholder="Phone Number"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                      />
                      {validationErrors.phone && (
                        <div className="invalid-feedback">
                          {validationErrors.phone}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Shipping Address */}
                <div className="mb-4">
                  <h5>Shipping Address</h5>
                  <div className="row g-3">
                    <div className="col-12">
                      <input
                        type="text"
                        className={`form-control ${
                          validationErrors.street ? "is-invalid" : ""
                        }`}
                        name="address.street"
                        placeholder="Street Address"
                        value={formData.address.street}
                        onChange={handleInputChange}
                        required
                      />
                      {validationErrors.street && (
                        <div className="invalid-feedback">
                          {validationErrors.street}
                        </div>
                      )}
                    </div>
                    <div className="col-md-6">
                      <input
                        type="text"
                        className={`form-control ${
                          validationErrors.city ? "is-invalid" : ""
                        }`}
                        name="address.city"
                        placeholder="City"
                        value={formData.address.city}
                        onChange={handleInputChange}
                        required
                      />
                      {validationErrors.city && (
                        <div className="invalid-feedback">
                          {validationErrors.city}
                        </div>
                      )}
                    </div>
                    <div className="col-md-6">
                      <input
                        type="text"
                        className={`form-control ${
                          validationErrors.state ? "is-invalid" : ""
                        }`}
                        name="address.state"
                        placeholder="State"
                        value={formData.address.state}
                        onChange={handleInputChange}
                        required
                      />
                      {validationErrors.state && (
                        <div className="invalid-feedback">
                          {validationErrors.state}
                        </div>
                      )}
                    </div>
                    <div className="col-md-6">
                      <input
                        type="text"
                        className={`form-control ${
                          validationErrors.postalCode ? "is-invalid" : ""
                        }`}
                        name="address.postalCode"
                        placeholder="Postal Code"
                        value={formData.address.postalCode}
                        onChange={handleInputChange}
                        required
                      />
                      {validationErrors.postalCode && (
                        <div className="invalid-feedback">
                          {validationErrors.postalCode}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Payment Method */}
                <div className="mb-4">
                  <h5>Payment Method</h5>
                  <select
                    className="form-select"
                    name="paymentMethod"
                    value={formData.paymentMethod}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="Online">Online Payment</option>
                    <option value="COD">Cash on Delivery</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="btn btn-success w-100"
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
                    "Place Order"
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title mb-4">Order Summary</h5>
              {cart.map((item, index) => (
                <div
                  key={index}
                  className="d-flex justify-content-between mb-2"
                >
                  <span>
                    {item.name} × {item.quantity || 1}
                    {item.offer > 0 && (
                      <small className="text-success ms-2">
                        ({item.offer}% off)
                      </small>
                    )}
                  </span>
                  <span>
                    ₹
                    {(
                      item.price *
                      (item.quantity || 1) *
                      (1 - (item.offer || 0) / 100)
                    ).toFixed(2)}
                  </span>
                </div>
              ))}
              <hr />
              <div className="d-flex justify-content-between mb-2">
                <strong>Total Amount</strong>
                <strong>₹{totalAmount.toFixed(2)}</strong>
              </div>
              <small className="text-muted">
                Estimated delivery: 5 business days
              </small>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      <Modal show={showPaymentModal} onHide={() => setShowPaymentModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Payment Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="mb-3">
            <label htmlFor="cardNumber" className="form-label">
              Card Number
            </label>
            <input
              type="text"
              className={`form-control ${
                paymentErrors.cardNumber ? "is-invalid" : ""
              }`}
              id="cardNumber"
              name="cardNumber"
              placeholder="1234 5678 9012 3456"
              value={paymentDetails.cardNumber}
              onChange={handlePaymentInputChange}
              maxLength="19"
            />
            {paymentErrors.cardNumber && (
              <div className="invalid-feedback">{paymentErrors.cardNumber}</div>
            )}
          </div>
          <div className="row mb-3">
            <div className="col-md-6">
              <label htmlFor="expiryDate" className="form-label">
                Expiry Date (MM/YY)
              </label>
              <input
                type="text"
                className={`form-control ${
                  paymentErrors.expiryDate ? "is-invalid" : ""
                }`}
                id="expiryDate"
                name="expiryDate"
                placeholder="MM/YY"
                value={paymentDetails.expiryDate}
                onChange={handlePaymentInputChange}
                maxLength="5"
              />
              {paymentErrors.expiryDate && (
                <div className="invalid-feedback">
                  {paymentErrors.expiryDate}
                </div>
              )}
            </div>
            <div className="col-md-6">
              <label htmlFor="cvv" className="form-label">
                CVV
              </label>
              <input
                type="text"
                className={`form-control ${
                  paymentErrors.cvv ? "is-invalid" : ""
                }`}
                id="cvv"
                name="cvv"
                placeholder="123"
                value={paymentDetails.cvv}
                onChange={handlePaymentInputChange}
                maxLength="4"
              />
              {paymentErrors.cvv && (
                <div className="invalid-feedback">{paymentErrors.cvv}</div>
              )}
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowPaymentModal(false)}
          >
            Cancel
          </Button>
          <Button variant="primary" onClick={handlePaymentSubmit}>
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
              "Confirm Payment"
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Checkout;
