// Navbar.jsx
import React, { useState } from "react";
import "../App.css";
import axios from "axios";
import { Link } from "react-router-dom";

function Navbar() {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [mode, setMode] = useState("register"); // "register" | "login"
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Register function
 const handleRegister = async () => {
  try {
    const res = await axios.post(
      "http://localhost:5000/api/auth/register",
      formData,
      { withCredentials: true } // ✅ allow cookies to be sent/received
    );

    setSuccess("Registration successful!");
    setError("");
    setShowAuthModal(false);

    // ✅ Redirect based on role (same as login)
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

const handleLogin = async () => {
  try {
    const res = await axios.post(
      "http://localhost:5000/api/auth/login",
      {
        email: formData.email,
        password: formData.password,
      },
      {
        withCredentials: true, // ✅ allow cookies to be stored in browser
      }
    );

    // Backend sets cookie, so no need to save token in localStorage
    // But you can still save role if you want quick access
    localStorage.setItem("role", res.data.role);

    setSuccess("Login successful!");
    setError("");
    setShowAuthModal(false);

    // Redirect based on role
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
      <nav className="navbar">
        <div
          className="logo"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          🍔 EatEasy
        </div>

        <ul className="nav-links">
          <li><Link to="/">Home</Link></li>
          <li><a href="#menu">Menu</a></li>
          <li><a href="#offers">Offers</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>

      </nav>

      {/* Auth Modal */}
      
    </>
  );
}

export default Navbar;
