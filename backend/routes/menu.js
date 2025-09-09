import express from "express";
import multer from "multer";
import { db } from "../db/index.js";
import { orderItems, orders, menuItems, restaurants } from "../db/schema.js";
import { eq, and, notInArray } from "drizzle-orm";
const router = express.Router();
const upload = multer(); // stores file in memory


router.get("/menus", async (req, res) => {
  try{
    const items = await db.select().from(menuItems);
    
    const formatted = items.map(item => ({
      id:item.id, 
      name: item.name,
      price: item.price,
      image: item.image ? `data:image/jpeg;base64,${item.image.toString("base64")}` : null,
      status: item.status
    }));
  res.json(formatted);
}
  catch(error){
  console.error(error);
  res.status(500).json({error: "Failed to fetch"});
  }
});

router.get("/approved", async (req, res) => {
  try {
    const approvedMenus = await db
      .select()
      .from(menuItems)
      .where(eq(menuItems.status, "yes"));

    const formatted = approvedMenus.map(item => ({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image
        ? `data:image/jpeg;base64,${item.image.toString("base64")}`
        : null,
      status: item.status
    }));

    res.json(formatted);  // always send an array
  } catch (err) {
    console.error("Fetch Approved Menus Error:", err);
    res.status(500).json({ message: "Server Error" });
  }
});

// POST /menus
router.post(
  "/",
  authMiddleware,
  requireRole("restaurant_admin"),
  upload.single("image"), 
  async (req, res) => {
    try 
    {
      const { name, price } = req.body;
      const imageBase64 = req.file ? req.file.buffer.toString("base64") : null;

      const restaurant = await db.query.restaurants.findFirst({
        where: eq(restaurants.adminId, req.user.id),
      });

      if (!restaurant) {
        return res.status(403).json({ message: "No restaurant assigned" });
      }

      const [newMenuItem] = await db
        .insert(menuItems)
        .values({
          restaurantId: restaurant.id,
          name,
          price,
          image: imageBase64, // stored as base64 string
        })
        .returning();

      res.json({ message: "Menu item added", item: newMenuItem });
    } 
    catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to add menu item" });
    }
  }
);

router.patch("/menus/:id/approve", async (req, res) => {
  try {
    const { id } = req.params;
    const [updated] = await db.update(menuItems)
      .set({ status: req.body.status})
      .where(eq(menuItems.id, id))
      .returning();

    if (!updated) return res.status(404).json({ message: "Menu not found" });

    res.json({ message: "Menu approved", menu: updated });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to approve menu" });
  }
});

// ❌ DELETE a menu
// DELETE a menu safely
router.delete("/menus/:id", async (req, res) => {
  const { id } = req.params;
  const menuId = parseInt(id, 10); // ✅ ensure it's a number

  try {
    // 1. Check if there are pending orders for this menu
    const pendingOrders = await db
      .select()
      .from(orderItems)
      .innerJoin(orders, eq(orderItems.orderId, orders.id))
      .where(
        and(
          eq(orderItems.menuItemId, menuId),
          eq(orders.status, "pending")
        )
      );

    if (pendingOrders.length > 0) {
      return res
        .status(400)
        .json({ error: "❌ Cannot delete menu, it has active pending orders." });
    }

    // 2. Delete related orderItems first
    await db.delete(orderItems).where(eq(orderItems.menuItemId, menuId));

    // 3. Find orphaned orders (orders with no items left)
    const orphanOrders = await db
      .select()
      .from(orders)
      .leftJoin(orderItems, eq(orderItems.orderId, orders.id));

    const orphanOrderIds = orphanOrders
      .filter(o => o.orderItems === null) // no items linked
      .map(o => o.orders.id);

    if (orphanOrderIds.length > 0) {
      await db.delete(orders).where(eq(orders.id, orphanOrderIds));
    }

    // 4. Finally delete the menu itself
    await db.delete(menuItems).where(eq(menuItems.id, menuId));

    res.json({ message: "✅ Menu and related orders deleted successfully" });
  } catch (err) {
    console.error("Delete menu error:", err);
    res.status(500).json({ error: "Failed to delete menu" });
  }
});


export default router;
