// routes/cart.js
import express from "express";
import { authMiddleware } from "../middleware/auth.js";
import { db } from "../db/index.js";
import {orders,  orderItems } from "../db/schema.js";

const router = express.Router();

router.post("/add", authMiddleware, async (req, res) => {
  try {
    const { menuItemId, quantity, price  } = req.body;
    const [order] = await db.insert(orders).values({
      customerName: req.user.name,  // or req.user.email
      status: "pending"
    }).returning();

    const [item] = await db.insert(orderItems).values({
      orderId: order.id,   // link to orders.id
      menuItemId,
      quantity,
      price
    }).returning();

    res.json({ message: "Order placed", order, item });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to place order" });
  }
});



export default router;  
