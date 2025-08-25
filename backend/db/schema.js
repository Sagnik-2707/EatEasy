import { pgTable, serial, integer, varchar, text, numeric, timestamp, pgEnum 
 } from "drizzle-orm/pg-core";
export const StatusEnum = pgEnum("status_enum", ["yes", "no"]);
export const menuItems = pgTable("menu_items", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  price: numeric("price", 10, 2).notNull(),
  image: text("image"), // <-- to store BLOB
  status : StatusEnum("status").notNull(),
});

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  customerName: varchar("customer_name", { length: 255 }).notNull(),
  status: varchar("status", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow()
});

export const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").notNull(),
  menuItemId: integer("menu_item_id").notNull(),
  quantity: integer("quantity").notNull(),
  price: integer("price").notNull()
});
