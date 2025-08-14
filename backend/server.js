import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import menuRoutes from "./routes/menu.js";
import orderRoutes from "./routes/orders.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.use("/menu", menuRoutes);
app.use("/orders", orderRoutes);


app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env. PORT}`);
});