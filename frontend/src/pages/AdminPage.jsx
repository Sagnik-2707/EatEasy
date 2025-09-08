import React, { useState } from "react";
import "../AdminPage.css";
import Dashboard from "./Dashboard";
import Menu from "./Menu";
import { IoIosAddCircle } from "react-icons/io";
import { MdDashboard } from "react-icons/md";
function AdminPage(props) {
  const [mycomponent, setmyComponent] = useState("Dashboard");

  return (
    <div className="admin-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <nav>
          <button
            className={`sidebar-btn ${mycomponent === "Dashboard" ? "active" : ""}`}
            onClick={() => setmyComponent("Dashboard")}
          >
           <MdDashboard /> 
           <span style={{marginLeft:"5px", marginTop:"2px"}}>Dashboard</span>
          </button>
          <button
            className={`sidebar-btn ${mycomponent === "Menu" ? "active" : ""}`}
            onClick={() => setmyComponent("Menu")}
          >
            <IoIosAddCircle /> 
            <span style={{marginLeft:"5px", marginTop:"2px"}}>Add to Menu</span>
          </button>
        </nav>
      </aside>

      {/* Main */}
      <main className="main-content">
        <header className="topbar">
          <h1>Admin Dashboard</h1>
        </header>

        <section>
          {mycomponent === "Dashboard" ? (
            <Dashboard orders={props.orders} />
          ) : (
            <Menu />
          )}
        </section>
      </main>
    </div>
  );
}

export default AdminPage;
