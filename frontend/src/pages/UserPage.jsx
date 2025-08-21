import React, {useState} from 'react'

import '../App.css';
function UserPage({addOrder}) {
    const menu = [
    {
      id: 1,
      name: "Cheese Burger",
      price: 199,
      image:
        "cheeseburger.jpg",
    },
    {
      id: 2,
      name: "Margherita Pizza",
      price: 299,
      image: "pizza.jpg"
        
    },
    {
      id: 3,
      name: "Pasta Alfredo",
      price: 249,
      image:
        "pasta.jpg",
    },
    {
      id: 4,
      name: "French Fries",
      price: 99,
      image:
        "frenchfry.jpg",
    },
    {
        id: 5,
        name: "Chicken Biriyani",
        price: 199,
        image: "ChickenBiriyani.jpg"

    },
    {
        id: 6,
        name: "Mutton Biriyani",
        price: 349,
        image: "MuttonBiriyani.jpg"
    },
    {
        id: 7,
        name: "Steamed Chicken Momo",
        price: 109,
        image: "steamed_chicken_momo.jpeg"
    },
    {
        id: 8,
        name: "Chicken Sandwich",
        price: 99,
        image: "chicken_sandwich.jpg"
    },
    {
        id: 9,
        name: "Mixed Fried Rice",
        price: 99,
        image: "mixed-fried-rice.jpg"
    },
    {
        id: 10,
        name: "Veg Roll",
        price: 39,
        image: "veg-roll.jpg"
    },
    {
        id: 11,
        name: "Chicken Kabab",
        price: 149,
        image: "Chicken-Kabab.jpg"
    },
    {
        id: 12,
        name: "Chilli Fish",
        price: 199,
        image: "Chilli-Fish.jpg"
    },
    {
        id: 13,
        name: "Masala Dosa",
        price: 49,
        image: "masala-dosa.jpg"
    },
    {
        id: 14,
        name: "Chicken Tandoori",
        price: 149,
        image: "Tandoori-Chicken.jpg"
    },
    {
        id: 15,
        name: "Chicken Hakka Noodles",
        price: 149,
        image: "chicken-hakka-noodles.jpg"
    },
    {
        id: 16,
        name: "Chicken Popcorn",
        price: 99,
        image: "chicken_popcorn.jpg"
    }
  ];
  const[selectedItem, setSelectedItem] = useState(null);
  const[formData, setFormData] = useState({name:"", email:"", quantity:1});
  const handleOrderClick = (item) => {
    setSelectedItem(item);
  };

  const handleClose = () => {
    setSelectedItem(null);
    setFormData({name:"", email: "", quantity: 1});
  };

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const newOrder = {
        item: selectedItem.name,
        price: selectedItem.price,
        image: selectedItem.image,
        ...formData,
        time: new Date().toLocaleString()
    };
    addOrder(newOrder);
    alert(`Order placed!\n\nItem: ${selectedItem.name}\nName: ${formData.name}\nEmail: ${formData.email}\nQuantity: ${formData.quantity}`);
    handleClose();
  }
  return (
    <div className="menu-grid">
        {menu.map((item) => (
            <div key={item.id} className="menu-card">
                <img src={item.image} alt={item.name} className="menu-img"/>
                <div className="menu-info">
                    <h2>{item.name}</h2>
                    <p className="price">Rs.{item.price}</p>
                    <button className="order-btn" onClick={() => handleOrderClick(item)}>Order Now</button>
                     
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
                            <button type="button" onClick={handleClose} className="cancel-btn">Cancel</button>
                        </div>
                    </form>
                </div>
            </div>
        )}
        
    </div>
  );
}

export default UserPage;
