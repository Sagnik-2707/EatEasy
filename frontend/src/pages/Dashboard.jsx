import React, { useEffect, useState } from "react";

function Dashboard() {
  const [menus, setMenus] = useState([]);
  const [orders, setOrders] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [menuToDelete, setMenuToDelete] = useState(null);
  const [orderToDelete, setOrderToDelete] = useState(null);
  const [deleteType, setDeleteType] = useState(null);
  // Fetch menus
  useEffect(() => {
    fetch("http://localhost:5000/api/menus")
      .then(res => res.json())
      .then(data => setMenus(data))
      .catch(err => console.error("Failed to load menus", err));
  }, []);

  // Fetch orders
  useEffect(() => {
    fetch("http://localhost:5000/api/orders")
      .then(res => res.json())
      .then(data => setOrders(data))
      .catch(err => console.error("Failed to load orders", err));
  }, []);

  const removeOrders = async (id) => {
    await fetch(`http://localhost:5000/api/orders/remove/${id}`, { method: "DELETE"});
     setOrders(orders.filter(o => o.orderId !== id));
     setShowDeleteModal(false);
     setOrderToDelete(null);
  }
  

  // Approve menu
  const toggleMenuStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === "yes" ? "no" : "yes";

    await fetch(`http://localhost:5000/api/menus/${id}/approve`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus })
    });

    setMenus(menus.map(m => 
      m.id === id ? { ...m, status: newStatus } : m
    ));
  };

  // Delete menu
  const deleteMenu = async (id) => {
    //  if (!res.ok) {
    //   const err = await res.json();
    //   alert(err.error); // ❌ Show message if menu is in pending order
    //   return;
    // }
    await fetch(`http://localhost:5000/api/menus/${id}`, { method: "DELETE" });
    setMenus(menus.filter(m => m.id !== id));
    setShowDeleteModal(false);
    setMenuToDelete(null);
  };

  return (
    <div className="admin-page">
      <h1>Admin Dashboard</h1>

      {/* ---------- ORDERS SECTION ---------- */}
      <h2>All Orders</h2>
      <br />
      {orders?.length === 0 ? (
        <p>orders loading ...</p>
      ) : (
        <div className="orders-container">
          {orders.map((order, index) => (
            <div key={index} className="order-item">
              <div className="order-info">
                <h3>{order.menuName} - {order.quantity} pcs</h3>
                <p>By: {order.customerName}</p>
                <p>Status: {order.status}</p>
                <p>Time: {new Date(order.createdAt).toLocaleString()}</p>
                <button 
                  className="remove-btn"
                  onClick={() => { 
                        setShowDeleteModal(true); 
                        setDeleteType("order"); 
                        setOrderToDelete(order.orderId); 
                      }}
                      >
                      Remove
                      </button>
                <div className="total-amount">
                  <span>Total:</span>
                  <span className="amount">₹{order.price * order.quantity}</span>
                </div>
              </div>
              <img
                src={`data:image/jpeg;base64,${order.menuImage}`}
                alt={order.menuName}
                className="order-img"
              />
            </div>
          ))}
        </div>
      )}

      <br /><hr /><br />

      {/* ---------- MENUS SECTION ---------- */}
      <h2>Menus Pending Approval</h2>
      <br />
      {menus.length === 0 ? (
        <p>No Menus Found</p>
      ) : (
        <div className="menus-container">
          {menus.map(menu => (
            <div key={menu.id} className="menu-item">
              <div className="menu-info">
                <h3>{menu.name} - ₹{menu.price}</h3>
                <p>Status: {menu.status}</p>
                {menu.status === "no" ? (
                  <button onClick={() => toggleMenuStatus(menu.id, menu.status)}>Approve</button>
                ) : (
                  <button onClick={() => toggleMenuStatus(menu.id, menu.status)}>Unapprove</button>
                )}
                <button 
                onClick={() => { 
                setShowDeleteModal(true); 
                setDeleteType("menu"); 
                setMenuToDelete(menu.id); 
                }}>
                Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ---------- DELETE CONFIRMATION MODAL ---------- */}
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Are you sure you want to delete?</h3>
            <div className="modal-buttons">
              <button 
                className="yes-btn" 
                onClick={() => {
                    if (deleteType === "menu") {
                      deleteMenu(menuToDelete);
                    } else if (deleteType === "order") {
                      removeOrders(orderToDelete);
                    }
                  }}>Yes</button>
              <button className="no-btn" onClick={() => setShowDeleteModal(false)}>No</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
