import React, {useState, useEffect} from "react";
import "../App.css";
import axios from "axios";
import { Link } from "react-router-dom";

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
      <div className="logo" onClick={() => window.scrollTo({top:0, behavior: "smooth"})}>🍔 EatEasy</div>
      
      <ul className="nav-links">
        <li>
          <Link to='./'>Home</Link>
        </li>
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
