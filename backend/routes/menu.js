import express from "express";
import multer from "multer";
import { db } from "../db/index.js";
import { menuItems } from "../db/schema.js";
import { eq } from "drizzle-orm";
const router = express.Router();
const upload = multer(); // stores file in memory


router.get("/menus", async (req, res) => {
  console.log("someones knocking")
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
  try {
    const { id } = req.params;
    const [deleted] = await db.delete(menuItems)
      .where(eq(menuItems.id, id))
      .returning();

    if (!deleted) return res.status(404).json({ message: "Menu not found" });

    res.json({ message: "Menu deleted", menu: deleted });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete menu" });
  }
});

export default router;
