// routes/cart.js
import express from "express";
import { authMiddleware } from "../middleware/auth.js";
import { db } from "../db/index.js";
import { orderItems } from "../db/schema.js";

const router = express.Router();

router.post("/add", authMiddleware, async (req, res) => {
  try {
    const { menuItemId, quantity, price } = req.body;
    const orderId = req.user.id;

    const [item] = await db.insert(orderItems).values({
      orderId,
      menuItemId,
      quantity,
      price
    }).returning();

    res.json({ message: "Item added to cart", item });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to add to cart" });
  }
});

export default router;  
