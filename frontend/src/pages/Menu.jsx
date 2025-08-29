import { useState } from "react";
import { Box, Typography, TextField, Button, Snackbar, Alert } from "@mui/material";

const Menu = () => {
  const [formData, setFormData] = useState({
    menuName: "",
    price: "",
    image: null, // store file object
  });
    const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success", // success | error | warning | info
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

 const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("menuName", formData.menuName);
    data.append("price", formData.price);
    if (formData.image) {
      data.append("image", formData.image);
    }

    try {
      const res = await fetch("http://localhost:5000/api/menus", {
        method: "POST",
        body: data,
      });

      if (res.ok) {
        setToast({ open: true, message: "Menu added successfully!", severity: "success" });
        setFormData({ menuName: "", price: "", image: null }); // reset form
      } else {
        setToast({ open: true, message: "Failed to add menu", severity: "error" });
      }
    } catch (error) {
      console.error(error);
      setToast({ open: true, message: "Something went wrong!", severity: "error" });
    }
  };
  return (
    <>
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

      {/* Menu Name */}
      <TextField
        label="Menu Name"
        name="menuName"   // ✅ match backend
        value={formData.menuName}
        onChange={handleChange}
        fullWidth
      />

      {/* Price */}
      <TextField
        label="Price"
        name="price"
        type="number"
        value={formData.price}
        onChange={handleChange}
        fullWidth
      />

      {/* Image Upload */}
      <Button variant="contained" component="label">
        Upload Image
        <input
          type="file"
          hidden
          accept="image/*"
          onChange={handleFileChange}
        />
      </Button>
      {formData.image && (
        <Typography variant="body2">{formData.image.name}</Typography>
      )}

      {/* Submit Button */}
      <Button type="submit" variant="contained" color="primary">
        Submit
      </Button>
    </Box>
    <Snackbar
        open={toast.open}
        autoHideDuration={3000}
        onClose={() => setToast({ ...toast, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          severity={toast.severity}
          onClose={() => setToast({ ...toast, open: false })}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default Menu;
