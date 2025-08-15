import React from "react";
import "./App.css";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="logo">🍔 EatEasy</div>
      
      <ul className="nav-links">
        <li><a href="#home">Home</a></li>
        <li><a href="#menu">Menu</a></li>
        <li><a href="#offers">Offers</a></li>
        <li><a href="#contact">Contact</a></li>
      </ul>

      <button className="order-btn">Order Now</button>
    </nav>
  );
}

export default Navbar;
