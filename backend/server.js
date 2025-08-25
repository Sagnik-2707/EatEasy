// server.js
import express from "express";
import cors from "cors";
import menuRoutes from "./routes/menu.js";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api", menuRoutes);

app.listen(5000, () => console.log("Server running at http://localhost:5000"));
