import React from 'react'
import '../AdminPage.css';


function AdminPage({orders}) {
    console.log(orders);
  return (
    <div className="admin-page">
        <h1>All Orders</h1>
        <br/> <br/>
      
    
          
      
        {orders.length === 0 ? (
            <p>No Orders Yet</p>
        ):(
                orders.map((order, index) => {
                    return(
                     <div key={index} className="order-item">
                        <div className="order-info">
                            <h2>{order.item} - {order.quantity} pcs </h2>
                            <p>By: {order.name} </p>
                            <p>Email: {order.email}</p>
                            <p>Time: {order.time}</p>
                            <div>
                                <button className="remove-btn">Remove</button>
                            </div>
                            <br/><br/>
                            <div className="total-amount">
                                <span>Total Amount:</span>
                                <span className="amount">₹{order.price * order.quantity}</span>
                            </div>
                        </div>
                            <img
                                src={order.image}
                                alt={order.item}
                                className="order-img"
                            />
                     </div>
                     
                    );
                })
            
        )}
        
    </div>
  );
}

export default AdminPage;