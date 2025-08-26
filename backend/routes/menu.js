import express from "express";
import multer from "multer";
import { db } from "../db/index.js";
import { menuItems } from "../db/schema.js";

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
        image: imageBase64, // <-- stored as BLOB
      })
      .returning();

    res.json({ message: "Menu item added", item });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to add menu item" });
  }
});

export default router;
