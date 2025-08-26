// server.js
import express from "express";
import cors from "cors";
import menuRoutes from "./routes/menu.js";
import authRoutes from "./routes/auth.js";

import { authMiddleware, roleMiddleware } from "./middleware/auth.js";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api", menuRoutes);
app.use("/api/auth", authRoutes);

app.listen(5000, () => console.log("Server running at http://localhost:5000"));

