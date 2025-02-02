import React, { useState } from "react";
import emailjs from "emailjs-com";
import "../css/Feedback.css";

const Feedback = () => {
  const [feedback, setFeedback] = useState({
    name: "",
    email: "",
    message: "",
    subject: "",
  });
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [focusedField, setFocusedField] = useState("");

  const handleChange = (e) => {
    setFeedback({ ...feedback, [e.target.name]: e.target.value });
    setErrorMessage("");
    setSuccessMessage("");
  };

  const handleFocus = (field) => {
    setFocusedField(field);
  };

  const handleBlur = () => {
    setFocusedField("");
  };

  const validateInput = () => {
    const { name, email, message } = feedback;

    if (name.trim().length < 2) {
      setErrorMessage("Name must be at least 2 characters.");
      return false;
    }
    if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      setErrorMessage("Please enter a valid email address.");
      return false;
    }
    if (message.trim().length < 10) {
      setErrorMessage("Message must be at least 10 characters.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateInput()) return;

    setLoading(true);
    try {
      await emailjs.send(
        "craftculture",
        "craftculture",
        feedback,
        "EoRYi1EIy1jYpdeHs"
      );
      setSuccessMessage(
        "Thank you for your feedback! We appreciate your input."
      );
      setFeedback({ name: "", email: "", message: "", subject: "" });
    } catch (error) {
      setErrorMessage("Oops! Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="feedback-container">
      <div className="feedback-content">
        <div className="feedback-header">
          <h1 className="feedback-title">Share Your Feedback</h1>
          <p className="feedback-subtitle">
            We value your input and are committed to improving your experience
          </p>
        </div>

        <form onSubmit={handleSubmit} className="feedback-form">
          {successMessage && (
            <div className="alert alert-success">
              <i className="fas fa-check-circle alert-icon"></i>
              <span>{successMessage}</span>
            </div>
          )}

          {errorMessage && (
            <div className="alert alert-danger">
              <i className="fas fa-exclamation-circle alert-icon"></i>
              <span>{errorMessage}</span>
            </div>
          )}

          <div className="form-grid">
            <div
              className={`form-group ${
                focusedField === "name" ? "focused" : ""
              }`}
            >
              <label htmlFor="name" className="form-label">
                <span>Name</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                className="form-input"
                placeholder="Enter your name"
                value={feedback.name}
                onChange={handleChange}
                onFocus={() => handleFocus("name")}
                onBlur={handleBlur}
                required
              />
            </div>

            <div
              className={`form-group ${
                focusedField === "email" ? "focused" : ""
              }`}
            >
              <label htmlFor="email" className="form-label">
                <span>Email</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="form-input"
                placeholder="Enter your email"
                value={feedback.email}
                onChange={handleChange}
                onFocus={() => handleFocus("email")}
                onBlur={handleBlur}
                required
              />
            </div>
          </div>

          <div
            className={`form-group ${
              focusedField === "subject" ? "focused" : ""
            }`}
          >
            <label htmlFor="subject" className="form-label">
              <span>Subject (Optional)</span>
            </label>
            <input
              type="text"
              id="subject"
              name="subject"
              className="form-input"
              placeholder="What's this about?"
              value={feedback.subject}
              onChange={handleChange}
              onFocus={() => handleFocus("subject")}
              onBlur={handleBlur}
            />
          </div>

          <div
            className={`form-group ${
              focusedField === "message" ? "focused" : ""
            }`}
          >
            <label htmlFor="message" className="form-label">
              <span>Message</span>
            </label>
            <textarea
              id="message"
              name="message"
              className="form-input"
              placeholder="Share your thoughts with us"
              rows="5"
              value={feedback.message}
              onChange={handleChange}
              onFocus={() => handleFocus("message")}
              onBlur={handleBlur}
              required
            ></textarea>
          </div>

          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? (
              <div className="button-content">
                <div className="spinner"></div>
                <span>Sending...</span>
              </div>
            ) : (
              <div className="button-content">
                <i className="fas fa-paper-plane button-icon"></i>
                <span>Send Feedback</span>
              </div>
            )}
          </button>

          <p className="privacy-notice">
            <i className="fas fa-shield-alt privacy-icon"></i>
            <span>
              Your feedback is confidential and helps us improve our services
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Feedback;
