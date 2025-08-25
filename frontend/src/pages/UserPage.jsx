import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import "../App.css";

function UserPage({ addOrder }) {
  const [menu, setMenu] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [formData, setFormData] = useState({ name: "", email: "", quantity: 1 });

  // Fetch menu items from backend
  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/menus");
        const data = await res.json();
        setMenu(data);
      } catch (err) {
        console.error("Failed to fetch menu", err);
      }
    };
    fetchMenu();
  }, []);

  const handleOrderClick = (item) => {
    setSelectedItem(item);
  };

  const handleClose = () => {
    setSelectedItem(null);
    setFormData({ name: "", email: "", quantity: 1 });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newOrder = {
      item: selectedItem.name,
      price: selectedItem.price,
      image: selectedItem.image,
      ...formData,
      time: new Date().toLocaleString(),
    };
    addOrder(newOrder);
    alert(
      `Order placed!\n\nItem: ${selectedItem.name}\nName: ${formData.name}\nEmail: ${formData.email}\nQuantity: ${formData.quantity}`
    );
    handleClose();
  };

  return (
    <>
      <div className="menu-grid">
        {menu.map((item) => (
          <div key={item.id} className="menu-card">
            <img src={item.image} alt={item.name} className="menu-img" />
            <div className="menu-info">
              <h2>{item.name}</h2>
              <p className="price">Rs.{item.price}</p>
              <button
                className="order-btn"
                onClick={() => handleOrderClick(item)}
              >
                Order Now
              </button>
            </div>
          </div>
        ))}

        {selectedItem && (
          <div className="modal-overlay">
            <div className="modal">
              <h2>Order {selectedItem.name}</h2>
              <form onSubmit={handleSubmit}>
                <label>Name:</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
                <label>Email:</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
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
                  <button
                    type="button"
                    onClick={handleClose}
                    className="cancel-btn"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default UserPage;
