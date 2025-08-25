// import express from "express";
// import { db } from "../db/index.js";
// import { order, orderItems } from "../db/schema.js";
// import { eq } from "drizzle-orm";
// import { adminAuth} from "../middleware/auth.js";

// const router = express.Router();

// // router.post("/", async(req,res) => {
// //     const {customerName, customerAddress, items} = req.body;
// //     const[order] = await db.insert(order).values({customerName, customerAddress }).$returningId();
// //     for(let item of items)
// //     {
// //         await db.insert(orderItems).values({
// //             orderId: order.id,
// //             menuItemId: item.menuItemId,
// //             quantity: item.quantity
// //         });
// //     }
// //         res.json({ message: "Order placed", orderId: order.id });
// // });

// router.get("/", adminAuth, async(req, res) => {
//     const allOrders = await db.select().from(order);
//     res.json(allOrders);
// });

// router.put("/:id/status", adminAuth, async(req, res) => {
//     const { status } = req.body;
//     await db.update(order).set({status}.where(eq(order.id, Number(req.params.id))));
// });

// export default router;