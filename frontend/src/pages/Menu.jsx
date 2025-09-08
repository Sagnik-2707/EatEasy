import { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Snackbar,
  Alert,
  Card,
  CardContent,
  MenuItem,
} from "@mui/material";

//const categories = ["Burger", "Pizza", "Pasta", "Beverages"]; // example categories

const Menu = () => {
  const [formData, setFormData] = useState({
    menuName: "",
    price: "",
    description: "",
    category: "",
    image: null,
  });
  const [preview, setPreview] = useState(null);
  const [toast, setToast] = useState({ open: false, message: "", severity: "success" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, image: file });
    setPreview(file ? URL.createObjectURL(file) : null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("menuName", formData.menuName);
    data.append("price", formData.price);
    data.append("description", formData.description);
    data.append("category", formData.category);
    if (formData.image) data.append("image", formData.image);

    try {
      const res = await fetch("http://localhost:5000/api/menus", {
        method: "POST",
        body: data,
      });
      if (res.ok) {
        setToast({ open: true, message: "✅ Menu added successfully!", severity: "success" });
        setFormData({ menuName: "", price: "", description: "", category: "", image: null });
        setPreview(null);
      } else {
        setToast({ open: true, message: "❌ Failed to add menu", severity: "error" });
      }
    } catch (error) {
      console.error(error);
      setToast({ open: true, message: "⚠️ Something went wrong!", severity: "error" });
    }
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          minHeight: "80vh",
          backgroundColor: "#f8f9fa",
          pt: 5,
        }}
      >
        <Card sx={{ width: 400, borderRadius: 3, boxShadow: 3 }}>
          <CardContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Typography variant="h6" fontWeight="bold" textAlign="center">
              Add New Menu
            </Typography>

            <TextField
              label="Menu Name"
              name="menuName"
              value={formData.menuName}
              onChange={handleChange}
              fullWidth
              size="small"
            />

            <Box sx={{ display: "flex", gap: 1 }}>
              <TextField
                label="Price (₹)"
                name="price"
                type="number"
                value={formData.price}
                onChange={handleChange}
                fullWidth
                size="small"
              />
              {/* <TextField
                select
                label="Category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                fullWidth
                size="small"
              >
                {categories.map((cat) => (
                  <MenuItem key={cat} value={cat}>
                    {cat}
                  </MenuItem>
                ))}
              </TextField> */}
            </Box>


            <Button
              variant="outlined"
              component="label"
              sx={{ justifyContent: "flex-start" }}
            >
              Upload Image
              <input type="file" hidden accept="image/*" onChange={handleFileChange} />
            </Button>
            {formData.image && (
              <Typography variant="body2" color="text.secondary">
                {formData.image.name}
              </Typography>
            )}

            {preview && (
              <Box sx={{ mt: 1, borderRadius: 2, p: 1, textAlign: "center" }}>
                <img src={preview} alt="Preview" style={{ maxWidth: "100%", borderRadius: 8 }} />
              </Box>
            )}

            <Button
              type="submit"
              variant="contained"
              sx={{ mt: 1, backgroundColor: "#ff7c39", "&:hover": { backgroundColor: "#ff7020" } }}
              onClick={handleSubmit}
            >
              Submit
            </Button>
          </CardContent>
        </Card>
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
