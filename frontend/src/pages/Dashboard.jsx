import React, { useEffect, useState } from "react";
import "../AdminPage.css";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";
import PeopleIcon from "@mui/icons-material/People";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";

function Dashboard() {
  const [menus, setMenus] = useState([]);
  const [orders, setOrders] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [menuToDelete, setMenuToDelete] = useState(null);
  const [orderToDelete, setOrderToDelete] = useState(null);
  const [deleteType, setDeleteType] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5000/api/menus")
      .then(res => res.json())
      .then(data => setMenus(data))
      .catch(err => console.error("Failed to load menus", err));

    fetch("http://localhost:5000/api/orders")
      .then(res => res.json())
      .then(data => setOrders(data))
      .catch(err => console.error("Failed to load orders", err));
  }, []);

  const removeOrders = async (id) => {
    await fetch(`http://localhost:5000/api/orders/remove/${id}`, { method: "DELETE" });
    setOrders(orders.filter(o => o.orderId !== id));
    setShowDeleteModal(false);
  };

  const toggleMenuStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === "yes" ? "no" : "yes";
    await fetch(`http://localhost:5000/api/menus/${id}/approve`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    setMenus(menus.map(m => (m.id === id ? { ...m, status: newStatus } : m)));
  };

  const deleteMenu = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/menus/${id}`, { method: "DELETE" });
      if (res.ok) {
        setMenus(menus.filter(m => m.id !== id));
      }
      setShowDeleteModal(false);
    } catch (err) {
      console.error("Delete menu request failed:", err);
    }
  };

  // ---------- KPI SUMMARY DATA ----------
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(o => o.status === "Pending").length;
  const approvedMenus = menus.filter(m => m.status === "yes").length;
  const totalRevenue = orders.reduce((sum, o) => sum + (o.price * o.quantity), 0);

  return (
    <div className="dashboard">
      {/* ---------- SUMMARY CARDS ---------- */}
      <div className="summary-cards">
        <div className="summary-card">
          <div className="icon-box"><ShoppingCartIcon /></div>
          <div className="card-info">
            <h4>Total Orders</h4>
            <p>{totalOrders}</p>
          </div>
        </div>

        <div className="summary-card">
          <div className="icon-box"><RestaurantMenuIcon /></div>
          <div className="card-info">
            <h4>Total Menus</h4>
            <p>{menus.length}</p>
          </div>
        </div>

        <div className="summary-card">
          <div className="icon-box"><PeopleIcon /></div>
          <div className="card-info">
            <h4>Approved Menus</h4>
            <p>{approvedMenus}</p>
          </div>
        </div>

        <div className="summary-card">
          <div className="icon-box"><TrendingUpIcon /></div>
          <div className="card-info">
            <h4>Total Revenue</h4>
            <p>₹{totalRevenue}</p>
          </div>
        </div>
      </div>

      {/* ---------- ORDERS SECTION ---------- */}
      <h2>All Orders</h2>
      <div className="card-grid">
        {orders.length === 0 ? (
          <p>No orders found</p>
        ) : (
          orders.map((order, index) => (
            <div key={index} className="card">
              <img src={`data:image/jpeg;base64,${order.menuImage}`} alt={order.menuName} />
              <div className="card-content">
                <h3>{order.menuName} - {order.quantity} pcs</h3>
                <p>By: {order.customerName}</p>
                <p>Status: <span className={`status ${order.status}`}>{order.status}</span></p>
                <p>{new Date(order.createdAt).toLocaleString()}</p>
                <div className="card-footer">
                  <span className="price">₹{order.price * order.quantity}</span>
                  <button
                    className="danger"
                    onClick={() => { setShowDeleteModal(true); setDeleteType("order"); setOrderToDelete(order.orderId); }}
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ---------- MENUS SECTION ---------- */}
      <h2>Menus Pending Approval</h2>
      <div className="card-grid">
        {menus.length === 0 ? (
          <p>No menus found</p>
        ) : (
          menus.map(menu => (
            <div key={menu.id} className="card">
              <div className="card-content">
                <h3>{menu.name} - ₹{menu.price}</h3>
                <p>Status: {menu.status}</p>
                <div className="card-footer">
                  <button onClick={() => toggleMenuStatus(menu.id, menu.status)}>
                    {menu.status === "no" ? "Approve" : "Unapprove"}
                  </button>
                  <button
                    className="danger"
                    onClick={() => { setShowDeleteModal(true); setDeleteType("menu"); setMenuToDelete(menu.id); }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ---------- DELETE MODAL ---------- */}
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Are you sure you want to delete?</h3>
            <div className="modal-actions">
              <button
                className="danger"
                onClick={() => {
                  if (deleteType === "menu") deleteMenu(menuToDelete);
                  if (deleteType === "order") removeOrders(orderToDelete);
                }}
              >
                Yes
              </button>
              <button onClick={() => setShowDeleteModal(false)}>No</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
