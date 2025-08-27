// server.js
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser"; 
import menuRoutes from "./routes/menu.js";
import authRoutes from "./routes/auth.js";

import { authMiddleware, roleMiddleware } from "./middleware/auth.js";

const app = express();

app.use(cors({
  origin: "http://localhost:5173", // if using Vite
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());
app.use("/api", menuRoutes);
app.use("/api/auth", authRoutes);

app.listen(5000, () => console.log("Server running at http://localhost:5000"));
