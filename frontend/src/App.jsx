import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Banner from "./components/Banner";
import UserPage from "./pages/UserPage";
import AdminPage from "./pages/AdminPage";
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
      <Banner />
      <Routes>
        <Route path="/" element={<UserPage addOrder={addOrder} />} />
        <Route path="/admin" element={<AdminPage orders={orders} />} />
        {/* <Route
          path="/admin/dashboard"
          element={<Dashboard />}
        /> */}
      </Routes>
    </>
  );
}

export default App;
