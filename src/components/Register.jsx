import React, { useState } from "react";
import axios from "axios";
import { API_URL } from "../constant";
import { useNavigate, Link } from "react-router-dom";
import "../css/Login.css"; // Using the same CSS as Login

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const showSuccessToast = (message) => {
    const toastContainer = document.createElement("div");
    toastContainer.className = "toast-container";
    toastContainer.innerHTML = `
      <div class="custom-toast success animate-slide-in">
        <div class="toast-content">
          <i class="fas fa-check-circle"></i>
          <span>${message}</span>
        </div>
      </div>
    `;
    document.body.appendChild(toastContainer);

    setTimeout(() => {
      const toast = toastContainer.querySelector(".custom-toast");
      toast.classList.replace("animate-slide-in", "animate-slide-out");
      setTimeout(() => {
        document.body.removeChild(toastContainer);
        navigate("/login");
      }, 300);
    }, 2000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post(`${API_URL}/api/users/register`, formData);
      showSuccessToast("Registration successful! Please log in.");
    } catch (error) {
      const backendMessage = error.response?.data?.message;
      let userFriendlyError = "";

      switch (backendMessage) {
        case "Username is already taken":
          userFriendlyError =
            "This username is already taken. Please choose another one.";
          break;
        case "Email is already registered":
          userFriendlyError =
            "This email is already registered. Please use another email or log in.";
          break;
        case "Invalid email format":
          userFriendlyError = "Please enter a valid email address.";
          break;
        default:
          userFriendlyError =
            "An unexpected error occurred. Please try again later.";
      }

      setError(userFriendlyError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modern-login-page">
      <div className="animated-background">
        <div className="light-effect"></div>
      </div>

      <div className="login-container animate-fade-in">
        <div className="login-card animate-scale-in">
          <div className="login-header animate-slide-down">
            <div className="logo-container">
              <div className="logo animate-rotate">
                <i className="fas fa-user-plus"></i>
              </div>
            </div>
            <h2>Create Account</h2>
            <p>Join us to start your journey</p>
          </div>

          {error && (
            <div className="error-message animate-shake">
              <i className="fas fa-exclamation-circle me-2"></i>
              {error}
              <button className="close-btn" onClick={() => setError("")}>
                <i className="fas fa-times"></i>
              </button>
            </div>
          )}

          <form onSubmit={handleSubmit} className="animate-slide-up">
            <div className="form-group">
              <div className="input-container">
                <i className="fas fa-user input-icon"></i>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Username"
                  required
                  className="modern-input"
                  minLength="3"
                />
                <div className="input-focus-effect"></div>
              </div>
            </div>

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
                <div className="input-focus-effect"></div>
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
                  minLength="6"
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
                <div className="input-focus-effect"></div>
              </div>
            </div>

            <button
              type="submit"
              className="login-button animate-hover"
              disabled={loading}
            >
              {loading ? (
                <div className="loader-container">
                  <div className="loader"></div>
                  <span>Creating Account...</span>
                </div>
              ) : (
                <>
                  <span>Register</span>
                  <i className="fas fa-arrow-right"></i>
                </>
              )}
            </button>

            <div className="additional-options">
              <Link to="/login" className="register-link">
                <span>Already have an account? Login</span>
                <i className="fas fa-sign-in-alt ms-2"></i>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
