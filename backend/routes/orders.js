import express from "express";
import { db } from "../db/index.js";
import { order, orderItems } from "../db/schema.js";
import { eq } from "drizzle-orm";
import { adminAuth} from "../middleware";

const router = express.router();

router.post("/", async(req,res) => {
    const {customerName, customerAddress, items} = req.body;
    const[order] = await db.insert(orders).values({customerName, customerAddress }).$returningId();
    for(let item of items)
    {
        await db.insert(orderItems).values({
            orderId: order.id,
            menuItemId: item.menuItemId,
            quantity: item.quantity
        });
    }
        res.json({ message: "Order placed", orderId: order.id });
});

router.get("/", adminAuth, async(req, res) => {
    const allOrders = await db.select().from(orders);
    res.json(allOrders);
});

router.put("/:id/status", adminAuth, async(req, res) => {
    const { status } = req.body;
    await db.update(orders).set({status}.where(eq(orders.id, Number(req.params.id))));
});

export default router;