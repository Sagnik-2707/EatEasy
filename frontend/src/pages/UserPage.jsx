import React, { useState, useEffect } from "react";
import axios from "axios";

import "../App.css";

function UserPage({ addOrder }) {
  const [menu, setMenu] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [formData, setFormData] = useState({ name: "", email: "", password: "", quantity: 1 });
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [mode, setMode] = useState("login"); 
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [user, setUser] = useState(null);

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

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/approved", { credentials: "include" });
        const data = await res.json();
        setMenu(data);
      } catch (err) {
        console.error("Failed to fetch menu", err);
      }
    };
    fetchMenu();
  }, []);

  const handleOrderClick = async (item) => {
    try {
      await axios.post(
        "http://localhost:5000/api/cart/add",
        { menuItemId: item.id, quantity: 1, price: item.price },
        { withCredentials: true }
      );
      setSelectedItem(item);
    } catch (err) {
      if (err.response?.status === 401) {
        setShowAuthModal(true);
      } else {
        alert("Something went wrong!");
      }
    }
  };

  const handleClose = () => {
    setSelectedItem(null);
    setFormData({ name: "", email: "", password: "", quantity: 1 });
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:5000/api/cart/add",
        {
          menuItemId: selectedItem.id,
          quantity: formData.quantity,
          price: selectedItem.price,
        },
        { withCredentials: true }
      );
      if (addOrder) addOrder(res.data);
      alert(`✅ Order placed!\n\nItem: ${selectedItem.name}\nQuantity: ${formData.quantity}`);
      handleClose();
    } catch (err) {
      if (err.response?.status === 401) {
        setShowAuthModal(true);
      } else {
        console.error(err);
        alert("❌ Failed to place order. Please try again.");
      }
    }
  };

  return (
    <>

      <div className="menu-grid">
        {menu?.map((item) => (
          <div key={item.id} className="menu-card">
            <img src={item.image} alt={item.name} className="menu-img" />
            <div className="menu-info">
              <h2>{item.name}</h2>
              <p className="price">Rs.{item.price}</p>
              <button className="order-btn" onClick={() => handleOrderClick(item)}>
                Add To Cart
              </button>
            </div>
          </div>
        ))}
      </div>

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
              <button onClick={mode === "login" ? handleLogin : handleRegister} className="auth-submit-btn">
                {mode === "login" ? "Login" : "Register"}
              </button>
              <button onClick={() => setShowAuthModal(false)} className="auth-cancel-btn">
                Cancel
              </button>
            </div>

            <p className="auth-switch">
              {mode === "login" ? (
                <>
                  New here?{" "}
                  <span onClick={() => setMode("register")} className="auth-switch-link">
                    Create account
                  </span>
                </>
              ) : (
                <>
                  Already a foodie?{" "}
                  <span onClick={() => setMode("login")} className="auth-switch-link">
                    Login
                  </span>
                </>
              )}
            </p>
          </div>
        </div>
      )}

      {selectedItem && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Order {selectedItem.name}</h2>
            <form onSubmit={handleSubmit}>
              <label>Quantity:</label>
              <input
                type="number"
                name="quantity"
                min="1"
                value={formData.quantity}
                onChange={handleChange}
                required
              />
              <div className="modal-buttons">
                <button type="submit">Confirm Order</button>
                <button type="button" onClick={handleClose} className="cancel-btn">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default UserPage;
