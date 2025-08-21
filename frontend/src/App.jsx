import React, {useState} from 'react';
import {Routes, Route} from 'react-router-dom';
import Banner from './components/Banner';
import Navbar from './components/Navbar';
import UserPage from './pages/UserPage';
import AdminPage from './pages/AdminPage';
import './App.css';

    import '@fontsource/roboto/300.css';
    import '@fontsource/roboto/400.css';
    import '@fontsource/roboto/500.css';
    import '@fontsource/roboto/700.css';

function App() {
  const [orders, setOrders] = useState([]);
  const addOrder = (order) => {
    setOrders((prevOrders) => [...prevOrders, order]);
  };
  return (
    <>
      <Banner />
      <Navbar/>
      <Routes>
        <Route path="/" element={<UserPage  addOrder={addOrder} />} />
        <Route path="/admin" element={<AdminPage orders={orders} />} />
      </Routes>
      
    </>
  );
}

export default App;
