import React, { useState } from "react";
import axios from "axios";
import { API_URL } from "../constant";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import "../css/Login.css";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axios.post(`${API_URL}/api/users/login`, formData);

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("username", response.data.username);
      localStorage.setItem("userRole", response.data.userRole);
      localStorage.setItem("email", response.data.email);

      const role =
        response.data.userRole === "ADMIN" ? "Administrator" : "User";

      // Animated success message
      const SuccessToast = ({ message }) => (
        <motion.div
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 100, opacity: 0 }}
          className="custom-toast success"
        >
          <div className="toast-content">
            <i className="fas fa-check-circle"></i>
            <span>{message}</span>
          </div>
        </motion.div>
      );

      // Render success toast
      const toastContainer = document.createElement("div");
      toastContainer.className = "toast-container";
      document.body.appendChild(toastContainer);

      setTimeout(() => {
        document.body.removeChild(toastContainer);
        if (response.data.userRole === "ADMIN") {
          window.location.href = "/admin";
        } else {
          window.location.href = "/";
        }
      }, 2000);
    } catch (error) {
      let errorMessage = "An unexpected error occurred. Please try again.";

      if (error.response?.data?.message) {
        switch (error.response.data.message) {
          case "User not found":
            errorMessage =
              "No account found with this email. Please check your email or register.";
            break;
          case "Invalid credentials":
            errorMessage = "Incorrect password. Please try again.";
            break;
          case "Account disabled":
            errorMessage =
              "Your account has been disabled. Please contact support.";
            break;
          default:
            errorMessage = error.response.data.message;
        }
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modern-login-page">
      <div className="animated-background">
        <div className="light-effect"></div>
      </div>

      <motion.div
        className="login-container"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="login-card">
          <motion.div
            className="login-header"
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="logo-container">
              <motion.div
                className="logo"
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <i className="fas fa-shopping-bag"></i>
              </motion.div>
            </div>
            <h2>Welcome Back</h2>
            <p>Log in to your account to continue</p>
          </motion.div>

          {error && (
            <motion.div
              className="error-message"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
            >
              <i className="fas fa-exclamation-circle me-2"></i>
              {error}
              <button className="close-btn" onClick={() => setError("")}>
                <i className="fas fa-times"></i>
              </button>
            </motion.div>
          )}

          <motion.form
            onSubmit={handleSubmit}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <div className="form-group">
              <div className="input-container">
                <i className="fas fa-envelope input-icon"></i>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email address"
                  required
                  className="modern-input"
                />
                <motion.span
                  className="input-focus-effect"
                  whileHover={{ scaleX: 1 }}
                  transition={{ duration: 0.2 }}
                />
              </div>
            </div>

            <div className="form-group">
              <div className="input-container">
                <i className="fas fa-lock input-icon"></i>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Password"
                  required
                  className="modern-input"
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <i
                    className={`fas fa-eye${showPassword ? "-slash" : ""}`}
                  ></i>
                </button>
                <motion.span
                  className="input-focus-effect"
                  whileHover={{ scaleX: 1 }}
                  transition={{ duration: 0.2 }}
                />
              </div>
            </div>

            <motion.button
              type="submit"
              className="login-button"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {loading ? (
                <div className="loader-container">
                  <div className="loader"></div>
                  <span>Logging in...</span>
                </div>
              ) : (
                <>
                  <span>Login</span>
                  <i className="fas fa-arrow-right"></i>
                </>
              )}
            </motion.button>

            <motion.div
              className="additional-options"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <Link to="/register" className="register-link">
                <motion.span whileHover={{ color: "#007bff" }}>
                  Create an account
                  <i className="fas fa-user-plus ms-2"></i>
                </motion.span>
              </Link>
            </motion.div>
          </motion.form>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
