import express from "express";
import { db } from "../db/index.js"
import { menuItems } from "../db/schema";
import { eq } from "drizzle-orm";
import  { adminAuth } from "../middleware/auth.js";

const router = express.Router();

router.get("/", async(req, res) => {
    const items = await db.select().from(menuItems);
    res.json(items);
});

export default router;