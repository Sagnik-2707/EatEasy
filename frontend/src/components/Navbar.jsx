import React, {useState, useEffect} from "react";
import "../App.css";
import axios from "axios";
import { Link } from "react-router-dom";
import AdminPage from "../pages/AdminPage";
function Navbar() {
  const[menu, setMenu] = useState([]);
  const[showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    axios.get("http://localhost:5000/menu")
    .then(res => setMenu(res.data))
    .catch(err => console.error(err));

  }, []);
  return (
    <nav className="navbar">
      <div className="logo">🍔 EatEasy</div>
      
      <ul className="nav-links">
        <li><a href="#home">Home</a></li>
        <li><a href="#menu">Menu</a></li>
        <li><a href="#offers">Offers</a></li>
        <li><a href="#contact">Contact</a></li>
      </ul>

      <div className="order-container">
        <Link className="admin-btn" to='/admin'>Admin</Link>
          
      </div>
    </nav>
  );
}

export default Navbar;
