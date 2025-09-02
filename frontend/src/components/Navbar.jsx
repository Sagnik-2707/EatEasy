import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "../App.css";

function Navbar() {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [mode, setMode] = useState("login"); // "login" or "register"
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [user, setUser] = useState(null);
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async () => {
   try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        { email: formData.email, password: formData.password },
        { withCredentials: true }
      );
      setUser(res.data);
      setSuccess("Login successful!");
      setError("");
      setShowAuthModal(false);
      if (res.data.role === "admin") {
        window.location.href = "/admin/dashboard";
      }
    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials!");
      setSuccess("");
    }
  };

  const handleRegister = async () => {
    try {
      await axios.post("http://localhost:5000/api/auth/register", formData, { withCredentials: true });
      setSuccess("Registration successful! Please login.");
      setError("");
      setMode("login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed!");
      setSuccess("");
    }
  };

 const handleCloseModal = () => {
  setShowAuthModal(false);
  setFormData({ name: "", email: "", password: "" });
  setError("");
  setSuccess("");
};
  return (
    <>
      {/* Navbar */}
      <nav className="navbar">
        <Link to="/" div className="navbar-logo">🍔 EatEasy</Link>
        <div className="navbar-buttons">
          <button
            className="login-btn"
            onClick={() => {
              setMode("login");
              setShowAuthModal(true);
            }}
          >
            Log In
          </button>
          <button
            className="signup-btn"
            onClick={() => {
              setMode("register");
              setShowAuthModal(true);
            }}
          >
            Sign Up
          </button>
        </div>
      </nav>

      {/* Auth Modal (same classNames as UserPage) */}
      {showAuthModal && (
        <div className="auth-overlay">
          <div className="auth-modal">
            <h2 className="auth-heading">
              {mode === "login" ? "Welcome Back 👋" : "Join EatEasy 🍔"}
            </h2>

            {error && <p className="auth-error">{error}</p>}
            {success && <p className="auth-success">{success}</p>}

            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
              className="auth-input"
            />
            {mode === "register" && (
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                required
                className="auth-input"
              />
            )}
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
              className="auth-input"
            />

            <div className="auth-btns">
              <button
                onClick={mode === "login" ? handleLogin : handleRegister}
                className="auth-submit-btn"
              >
                {mode === "login" ? "Login" : "Register"}
              </button>
              <button
                onClick={handleCloseModal}
                className="auth-cancel-btn"
              >
                Cancel
              </button>
            </div>

            <p className="auth-switch">
              {mode === "login" ? (
                <>
                  New here?{" "}
                  <span
                    onClick={() => setMode("register")}
                    className="auth-switch-link"
                  >
                    Create account
                  </span>
                </>
              ) : (
                <>
                  Already a foodie?{" "}
                  <span
                    onClick={() => setMode("login")}
                    className="auth-switch-link"
                  >
                    Login
                  </span>
                </>
              )}
            </p>
          </div>
        </div>
      )}
    </>
  );
}

export default Navbar;
