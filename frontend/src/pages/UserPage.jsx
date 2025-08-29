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

  // useEffect(() => {
  //   const fetchUser = async () => {
  //     try {
  //       const res = await fetch("http://localhost:5000/api/auth/me", {
  //         credentials: "include",
  //       });
  //       if (res.ok) {
  //         const data = await res.json();
  //         setUser(data);
  //       } else {
  //         setUser(null);
  //       }
  //     } catch {
  //       setUser(null);
  //     }
  //   };
  //   fetchUser();
  // }, []);

  useEffect(() => {
  const fetchMenu = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/approved", {
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
  try {
    const res = await axios.post(
      "http://localhost:5000/api/cart/add",
      {
        menuItemId: item.id,
        quantity: 1,
        price: item.price,
      },
      { withCredentials: true }
    );

    // If successful → order placed
    setSelectedItem(item);
  } catch (err) {
    if (err.response?.status === 401) {
      // Unauthorized → show login modal
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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const res = await axios.post(
      "http://localhost:5000/api/cart/add",
      {
        menuItemId: selectedItem.id,
        quantity: formData.quantity,
        price: selectedItem.price,
        // image: selectedItem.image
      },
      { withCredentials: true }
    );

    // Update parent/local state if needed
    if (addOrder) {
      addOrder(res.data); // assuming backend returns the created order
    }

    alert(`✅ Order placed!\n\nItem: ${selectedItem.name}\nQuantity: ${formData.quantity}`);

    handleClose(); // close modal and reset form
  } catch (err) {
    if (err.response?.status === 401) {
      // not logged in → show login modal
      setShowAuthModal(true);
    } else {
      console.error(err);
      alert("❌ Failed to place order. Please try again.");
    }
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
       <div
  style={{
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    background: "rgba(0,0,0,0.5)", // overlay
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
  }}
>
  <div
    style={{
      background: "#fff",
      borderRadius: "20px",
      padding: "40px 50px",
      width: "400px",
      boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
      textAlign: "center",
      fontFamily: "Arial, sans-serif",
      animation: "fadeIn 0.3s ease-in-out",
    }}
  >
    {/* Heading */}
    <h2
      style={{
        marginBottom: "20px",
        fontSize: "1.8rem",
        fontWeight: "bold",
        color: "#ff6f3c", // food vibe 🍔
      }}
    >
      {mode === "login" ? "Welcome Back 👋" : "Join EatEasy 🍔"}
    </h2>

    {/* Error / Success */}
    {error && <p style={{ color: "red", marginBottom: "10px" }}>{error}</p>}
    {success && (
      <p style={{ color: "green", marginBottom: "10px" }}>{success}</p>
    )}

    {/* Inputs */}
    <input
      type="email"
      name="email"
      placeholder="Enter your email"
      value={formData.email}
      onChange={handleChange}
      required
      style={{
        width: "100%",
        padding: "12px",
        marginBottom: "15px",
        borderRadius: "10px",
        border: "1px solid #ddd",
        fontSize: "1rem",
      }}
    />
    {mode === "register" && (
      <input
        type="text"
        name="name"
        placeholder="Full Name"
        value={formData.name}
        onChange={handleChange}
        required
        style={{
          width: "100%",
          padding: "12px",
          marginBottom: "15px",
          borderRadius: "10px",
          border: "1px solid #ddd",
          fontSize: "1rem",
        }}
      />
    )}
    <input
      type="password"
      name="password"
      placeholder="Enter your password"
      value={formData.password}
      onChange={handleChange}
      required
      style={{
        width: "100%",
        padding: "12px",
        marginBottom: "20px",
        borderRadius: "10px",
        border: "1px solid #ddd",
        fontSize: "1rem",
      }}
    />

    {/* Buttons */}
    <div style={{ display: "flex", gap: "10px", marginBottom: "15px" }}>
      <button
        onClick={mode === "login" ? handleLogin : handleRegister}
        style={{
          flex: 1,
          padding: "12px",
          background: "linear-gradient(90deg, #ff6f3c, #ff9a3c)",
          color: "white",
          border: "none",
          borderRadius: "10px",
          fontSize: "1rem",
          fontWeight: "bold",
          cursor: "pointer",
          transition: "0.3s",
        }}
        onMouseOver={(e) => (e.target.style.opacity = "0.85")}
        onMouseOut={(e) => (e.target.style.opacity = "1")}
      >
        {mode === "login" ? "Login" : "Register"}
      </button>
      <button
        className="cancel-btn"
        onClick={() => setShowAuthModal(false)}
        style={{
          flex: 1,
          padding: "12px",
          background: "#f4f4f4",
          color: "#333",
          border: "1px solid #ddd",
          borderRadius: "10px",
          fontSize: "1rem",
          cursor: "pointer",
          transition: "0.3s",
        }}
        onMouseOver={(e) => {
          e.target.style.background = "#eaeaea";
        }}
        onMouseOut={(e) => {
          e.target.style.background = "#f4f4f4";
        }}
      >
        Cancel
      </button>
    </div>

    {/* Switch Mode */}
    <p style={{ fontSize: "0.9rem", color: "#555" }}>
      {mode === "login" ? (
        <>
          New here?{" "}
          <span
            style={{
              color: "#ff6f3c",
              cursor: "pointer",
              fontWeight: "bold",
            }}
            onClick={() => setMode("register")}
          >
            Create account
          </span>
        </>
      ) : (
        <>
          Already a foodie?{" "}
          <span
            style={{
              color: "#ff6f3c",
              cursor: "pointer",
              fontWeight: "bold",
            }}
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
