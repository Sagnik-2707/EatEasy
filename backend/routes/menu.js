import express from "express";
import { db } from "../db/index.js"
//import { menuItems } from "../db/schema";
//import { eq } from "drizzle-orm";
import  { adminAuth } from "../middleware/auth.js";

const router = express.Router();
const menuItems = [
  { id: 1, name: "Pizza", price: 250 },
  { id: 2, name: "Burger", price: 150 },
  { id: 3, name: "Pasta", price: 200 },
];

router.get("/", async(req, res) => {
    const items = await db.select().from(menuItems);
    res.json(items);
});

export default router;

