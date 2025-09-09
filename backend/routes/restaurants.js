import express from "express";
import { db } from "../db/index.js";
import { restaurants, users } from "../db/schema.js";
import { authMiddleware, requireRole } from "../middleware/auth.js";
import { eq } from "drizzle-orm";

const router = express.Router();
router.post("/", async(req, res) => {
    const{name, location, adminId} = req.body;

    const admin = await db.query.users.findFirst({
        where: eq(users.id, adminId),
    });
    if(!admin || admin.role !== "restaurant_admin"){
        return res.status(400).json({message: "Invalid Admin ID"});
    }
    const newRestaurant = await db.insert(restaurants).values({name, location, adminId}).returning();

    res.json(newRestaurant[0]);
})

router.delete("/:id", authMiddleware, requireRole("super_admin"), async (req, res) => {
  const { id } = req.params;

  await db.delete(restaurants).where(eq(restaurants.id, id));
  res.json({ message: "Restaurant deleted" });
});

