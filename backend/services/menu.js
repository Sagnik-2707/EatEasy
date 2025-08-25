// services/menu.js
import { db } from "../db/index.js";
import { menuItems } from "../db/schema.js";

// Add a menu item
export async function addMenuItem(name, description, price, category) {
  const [item] = await db.insert(menuItems).values({
    name,
    description,
    price,
    category,
  }).returning();  // returns inserted row
  return item;
}

// Get all menu items
export async function getMenuItems() {
  return await db.select().from(menuItems);
}
