// AdminModal.jsx
import React, { useState } from "react";
import axios from "axios";

function AdminModal({ onClose, onSuccess }) {
  const [form, setForm] = useState({ email: "", name: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/auth/admin-login", form);
      localStorage.setItem("token", res.data.token);
      onSuccess(); // redirect to admin dashboard
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="modal">
      <h2>Admin Login</h2>
      <input
        type="email"
        name="email"
        placeholder="Admin Email"
        value={form.email}
        onChange={handleChange}
      />
      <input
        type="text"
        name="name"
        placeholder="Admin Name"
        value={form.name}
        onChange={handleChange}
      />
      <button onClick={handleSubmit}>Login</button>
      <button onClick={onClose}>Close</button>
    </div>
  );
}

export default AdminModal;
