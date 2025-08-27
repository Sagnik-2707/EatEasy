import React, { useEffect, useState } from "react";

function Dashboard({ orders }) {
  const [menus, setMenus] = useState([]);

  // Fetch all menus for admin
  useEffect(() => {
  const res = fetch("http://localhost:5000/api/menus")
    .then(res => res.json())
    .then(data => setMenus(data))
    .catch(err => console.error("Failed to load menus", err));
}, []);


  // Approve menu
  const approveMenu = async (id) => {
    await fetch(`http://localhost:5000/api/menus/${id}/approve`, { method: "PATCH" });
    setMenus(menus.map(m => m.id === id ? { ...m, status: "yes" } : m));
  };

  // (Optional) Reject / Delete menu
  const deleteMenu = async (id) => {
    await fetch(`http://localhost:5000/api/menus/${id}`, { method: "DELETE" });
    setMenus(menus.filter(m => m.id !== id));
  };

  return (
    <div className="admin-page">
      <h1>Admin Dashboard</h1>

      {/* ---------- ORDERS SECTION ---------- */}
      <h2>All Orders</h2>
      <br />
      {orders?.length === 0 ? (
        <p>No Orders Yet</p>
      ) : (
        orders.map((order, index) => (
          <div key={index} className="order-item">
            <div className="order-info">
              <h3>
                {order.item} - {order.quantity} pcs
              </h3>
              <p>By: {order.name}</p>
              <p>Email: {order.email}</p>
              <p>Time: {order.time}</p>
              <div>
                <button className="remove-btn">Remove</button>
              </div>
              <br />
              <div className="total-amount">
                <span>Total Amount:</span>
                <span className="amount">
                  ₹{order.price * order.quantity}
                </span>
              </div>
            </div>
            <img
              src={order.image}
              alt={order.item}
              className="order-img"
            />
          </div>
        ))
      )}

      <br /><hr /><br />

      <h2>Menus Pending Approval</h2>
      <br />
      {menus.length === 0 ? (
        <p>No Menus Found</p>
      ) : (
        menus.map(menu => (
          <div key={menu.id} className="menu-item">
            <div className="menu-info">
              <h3>{menu.name} - ₹{menu.price}</h3>
              <p>Status: {menu.status}</p>
              {menu.status === "no" ? (
                <button onClick={() => approveMenu(menu.id)}>Approve</button>
              ) : (
                <span>✅ Approved</span>
              )}
              <button onClick={() => deleteMenu(menu.id)} style={{ marginLeft: "10px" }}>
                Delete
              </button>
            </div>
            
          </div>
        ))
      )}
    </div>
  );
}

export default Dashboard;
