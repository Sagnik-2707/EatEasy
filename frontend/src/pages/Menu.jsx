import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  MenuItem,
  Typography,
} from "@mui/material";

const Menu= () => {
  const [formData, setFormData] = useState({
    menuName: "",
    price: "",
    description: "",
    date: "",
  });

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Menu Data Submitted:", formData);

    // Here you can call API to save menu data
    // axios.post("/api/menus", formData).then(...)
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        maxWidth: 400,
        margin: "auto",
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      <Typography variant="h5" fontWeight="bold">
        Add Menu
      </Typography>

      {/* Menu Type */}
      <TextField
        label="Menu Name"
        name="menuName"
        value={formData.menuType}
        onChange={handleChange}
        fullWidth
      >
      </TextField>

      {/* Price */}
      <TextField
        label="Price"
        name="price"
        type="number"
        value={formData.price}
        onChange={handleChange}
        fullWidth
      />

      {/* Category */}

      {/* Description */}
      <TextField
        label="Description"
        name="description"
        multiline
        rows={3}
        value={formData.description}
        onChange={handleChange}
        fullWidth
      />

      {/* Date */}
      <TextField
        label="Available From"
        name="date"
        type="date"
        value={formData.date}
        onChange={handleChange}
        InputLabelProps={{ shrink: true }}
        fullWidth
      />

      {/* Submit Button */}
      <Button type="submit" variant="contained" color="primary">
        Submit
      </Button>
    </Box>
  );
};

export default Menu;
