import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import UserPage from "./pages/UserPage";
import AdminPage from "./pages/AdminPage";
import Navbar from "./components/Navbar";
import "./App.css";

import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

import Dashboard  from "./pages/Dashboard";

function App() {
  const [orders, setOrders] = useState([]);
  const addOrder = (order) => {
    setOrders((prevOrders) => [...prevOrders, order]);
  };
  return (
    <>
      <Navbar/>
      <Routes>
        <Route path="/" element={<UserPage addOrder={addOrder} />} />
        <Route path="/admin/dashboard" element={<AdminPage orders={orders} />} />
        <Route path="/admin/menu" element={<AdminPage orders={orders} />} />
      </Routes>
    </>
  );
}

export default App;
