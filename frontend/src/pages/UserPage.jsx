import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import "../App.css";

function UserPage({ addOrder }) {
  const [menu, setMenu] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [formData, setFormData] = useState({ name: "", email: "", password: "", quantity: 1 });
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [mode, setMode] = useState("login"); // "login" | "register"
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [user, setUser] = useState(null);

 
  const handleRegister = async () => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/register",
        formData,
        { withCredentials: true }
      );

      setSuccess("Registration successful! Please login.");
      setError("");
      setMode("login"); // switch to login after registration
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

      setUser(res.data); // Save user info
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
    const fetchUser = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/auth/me", {
          credentials: "include",
        });
        if (res.ok) {
          const data = await res.json();
          setUser(data);
        } else {
          setUser(null);
        }
      } catch {
        setUser(null);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
  const fetchMenu = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/menus", {
        credentials: "include"
      });
      const data = await res.json();
      setMenu(data);
    } catch (err) {
      console.error("Failed to fetch menu", err);
    }
  };

  fetchMenu();
}, []);

  const handleOrderClick = async (item) => {
    if (!user) {
      setShowAuthModal(true);
    } else {
      setSelectedItem(item);
    }
  };

  const handleClose = () => {
    setSelectedItem(null);
    setFormData({ name: "", email: "", password: "", quantity: 1 });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    const res = await axios.post(
      "http://localhost:5000/api/cart/add",
      {
        menuItemId: selectedItem.id,
        quantity: formData.quantity,
        price: selectedItem.price
      },
      { withCredentials: true } 
    );

    alert(`Order placed!\n\nItem: ${selectedItem.name}\nQuantity: ${formData.quantity}`);
    addOrder(res.data.item); // update local state if needed
    handleClose();

  } catch (err) {
    console.error(err);
    alert("Failed to place order. Please try again.");
  }
};

  return (
    <>
      <Navbar />
      <div className="menu-grid">
        {menu?.map((item) => (
          <div key={item.id} className="menu-card">
            <img src={item.image} alt={item.name} className="menu-img" />
            <div className="menu-info">
              <h2>{item.name}</h2>
              <p className="price">Rs.{item.price}</p>
              <button
                className="order-btn"
                onClick={() => handleOrderClick(item)}
              >
                Add To Cart
              </button>
            </div>
          </div>
        ))}
      </div>

      {showAuthModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>{mode === "login" ? "Login" : "Register"}</h2>

            {error && <p className="error">{error}</p>}
            {success && <p className="success">{success}</p>}

            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            {mode === "register" && (
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            )}
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />

            <div className="modal-buttons">
              {mode === "login" ? (
                <button onClick={handleLogin}>Login</button>
              ) : (
                <button onClick={handleRegister}>Register</button>
              )}
              <button
                className="cancel-btn"
                onClick={() => setShowAuthModal(false)}
              >
                Cancel
              </button>
            </div>

            <p>
              {mode === "login" ? (
                <>
                  New user?{" "}
                  <span
                    className="link"
                    onClick={() => setMode("register")}
                  >
                    Create account
                  </span>
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <span
                    className="link"
                    onClick={() => setMode("login")}
                  >
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
