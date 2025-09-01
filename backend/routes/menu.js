import express from "express";
import multer from "multer";
import { db } from "../db/index.js";
import { orderItems, orders, menuItems } from "../db/schema.js";
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
router.post("/menus", upload.single("image"), async (req, res) => {
  try {
    const { menuName, price } = req.body;
   const imageBase64 = req.file ? req.file.buffer.toString("base64") : null;

    const [item] = await db
      .insert(menuItems)
      .values({
        name: menuName,
        price: price,
        image: imageBase64, 
      })
      .returning();

    res.json({ message: "Menu item added", item });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to add menu item" });
  }
});

router.patch("/menus/:id/approve", async (req, res) => {
  try {
    const { id } = req.params;
    const [updated] = await db.update(menuItems)
      .set({ status: "yes" })
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
router.delete("/menus/:id", async (req, res) => {
  console.log("Hi");
  const { id } = req.params;

  try {
    // 1. Check if there are pending orders for this menu
    const pendingOrders = await db
      .select()
      .from(orderItems)
      .innerJoin(orders, eq(orderItems.orderId, orders.id))
      .where(
        and(
          eq(orderItems.menuItemId, id),
          eq(orders.status, "pending")
        )
      );
      console.log(1);
    if (pendingOrders.length > 0) {
      return res
        .status(400)
        .json({ error: "Cannot delete menu, it has active pending orders." });
    }

    // 2. Delete related orderItems first
    await db.delete(orderItems).where(eq(orderItems.menuItemId, id));
    console.log(2);
    // 3. Optionally delete orphaned orders (those with no items left)
    await db.delete(orders).where(
      notInArray(
        orders.id,
        db.select(orderItems.orderId).from(orderItems) // keep orders still having items
      )
    );
    console.log(3);
    // 4. Finally delete the menu itself
    await db.delete(menuItems).where(eq(menuItems.id, id));

    res.json({ message: "Menu and related orders deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete menu" });
    console.log(4);
  }
});

export default router;
