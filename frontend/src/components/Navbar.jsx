// Navbar.jsx
import React, { useState } from "react";
import "../App.css";
import axios from "axios";

function Navbar() {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [mode, setMode] = useState("login"); // "login" | "register"
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ✅ Register
  const handleRegister = async () => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/register",
        formData,
        { withCredentials: true }
      );

      setSuccess("Registration successful!");
      setError("");
      setShowAuthModal(false);

      if (res.data.role === "admin") {
        window.location.href = "/admin/dashboard";
      } else {
        window.location.href = "/";
      }
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed!");
      setSuccess("");
    }
  };

  // ✅ Login
  const handleLogin = async () => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        {
          email: formData.email,
          password: formData.password,
        },
        { withCredentials: true }
      );

      localStorage.setItem("role", res.data.role);

      setSuccess("Login successful!");
      setError("");
      setShowAuthModal(false);

      if (res.data.role === "admin") {
        window.location.href = "/admin/dashboard";
      } else {
        window.location.href = "/";
      }
    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials!");
      setSuccess("");
    }
  };

  return (
    <>
      {/* ✅ Navbar */}
      <nav
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "18px 50px",
          background: "#fff",
          color: "#333",
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          zIndex: 1000,
          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          borderRadius: "0 0 20px 20px",
        }}
      >
        {/* Logo */}
        <div
          style={{
            fontSize: "2rem",
            fontWeight: "bold",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          🍔 <span style={{ fontFamily: "Poppins, sans-serif", color: "#ff4d4d" }}>EatEasy</span>
        </div>

        {/* Right Side Buttons */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <button
            style={{
              padding: "8px 20px",
              border: "1px solid #ff944d",
              borderRadius: "25px",
              background: "transparent",
              color: "#ff944d",
              fontWeight: "600",
              cursor: "pointer",
              fontFamily: "Poppins, sans-serif",
              transition: "0.3s",
            }}
            onMouseOver={(e) => {
              e.target.style.background = "#ff944d";
              e.target.style.color = "#fff";
            }}
            onMouseOut={(e) => {
              e.target.style.background = "transparent";
              e.target.style.color = "#ff944d";
            }}
            onClick={() => {
              setMode("login");
              setShowAuthModal(true);
            }}
          >
            Log In
          </button>

          <button
            style={{
              padding: "8px 20px",
              borderRadius: "25px",
              background: "linear-gradient(90deg, #ff4d4d, #ff944d)",
              color: "#fff",
              fontWeight: "600",
              border: "none",
              cursor: "pointer",
              fontFamily: "Poppins, sans-serif",
              transition: "0.3s",
            }}
            onMouseOver={(e) => {
              e.target.style.opacity = "0.85";
            }}
            onMouseOut={(e) => {
              e.target.style.opacity = "1";
            }}
            onClick={() => {
              setMode("register");
              setShowAuthModal(true);
            }}
          >
            Sign Up
          </button>
        </div>
      </nav>

      {/* ✅ Auth Modal */}
      {showAuthModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 2000,
          }}
        >
          <div
            style={{
              background: "#fff",
              padding: "30px",
              borderRadius: "16px",
              width: "400px",
              boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
              fontFamily: "Poppins, sans-serif",
            }}
          >
            <h2 style={{ marginBottom: "20px", textAlign: "center", color: "#333" }}>
              {mode === "login" ? "Login" : "Sign Up"}
            </h2>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                mode === "login" ? handleLogin() : handleRegister();
              }}
              style={{ display: "flex", flexDirection: "column", gap: "12px" }}
            >
              {mode === "register" && (
                <input
                  type="text"
                  placeholder="Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  style={{ padding: "10px", borderRadius: "8px", border: "1px solid #ccc" }}
                />
              )}

              <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                style={{ padding: "10px", borderRadius: "8px", border: "1px solid #ccc" }}
              />

              <input
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                style={{ padding: "10px", borderRadius: "8px", border: "1px solid #ccc" }}
              />

              <button
                type="submit"
                style={{
                  marginTop: "10px",
                  padding: "10px",
                  borderRadius: "8px",
                  background: "linear-gradient(90deg, #ff4d4d, #ff944d)",
                  color: "#fff",
                  border: "none",
                  cursor: "pointer",
                  fontWeight: "600",
                }}
              >
                {mode === "login" ? "Login" : "Register"}
              </button>
            </form>

            {/* ✅ Error / Success Messages */}
            {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}
            {success && <p style={{ color: "green", marginTop: "10px" }}>{success}</p>}

            <button
              onClick={() => setShowAuthModal(false)}
              style={{
                marginTop: "15px",
                background: "transparent",
                border: "none",
                color: "#666",
                cursor: "pointer",
                fontSize: "14px",
                display: "block",
                marginLeft: "auto",
                marginRight: "auto",
              }}
            >
              ✖ Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default Navbar;
