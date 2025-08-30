import express from "express";
import { db } from "../db/index.js";
import { orders, orderItems, menuItems } from "../db/schema.js";
import { eq } from "drizzle-orm";

const router = express.Router();

// Get all orders (with items and user info)
router.get("/", async (req, res) => {
  try {
    const allOrders = await db
      .select({
        orderId: orders.id,
        customerName: orders.customerName,
        status: orders.status,
        createdAt: orders.createdAt,
        itemId: orderItems.id,
        menuItemId: orderItems.menuItemId,
        quantity: orderItems.quantity,
        price: orderItems.price,
        menuName: menuItems.name,
        menuImage: menuItems.image,
      })
      .from(orders)
      .leftJoin(orderItems, eq(orderItems.orderId, orders.id))
      .leftJoin(menuItems, eq(menuItems.id, orderItems.menuItemId));

    res.json(allOrders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

// Delete an order (and its items)
router.delete("/remove/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Step 1: Delete orderItems related to this order
    await db.delete(orderItems).where(eq(orderItems.orderId, id));

    // Step 2: Delete the order itself
    const deletedOrder = await db.delete(orders).where(eq(orders.id, id)).returning();

    if (deletedOrder.length === 0) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.json({ message: "Order deleted successfully", deletedOrder });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete order" });
  }
});

export default router;
