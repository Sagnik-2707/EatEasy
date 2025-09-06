import { pgTable, serial, integer, varchar, text, numeric, timestamp, pgEnum } from "drizzle-orm/pg-core";

export const statusEnum = pgEnum("status_enum", ["yes", "no"]);

export const menuItems = pgTable("menu_items", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  price: numeric("price", 10, 2).notNull(),
  image: text("image"),
  status: statusEnum("status").default("no").notNull()
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

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  password: varchar("password", { length: 255 }), // null if OAuth user
  role: varchar("role", { length: 50 }).default("user"),

  // 🔑 New fields for OAuth
  provider: varchar("provider", { length: 50 }), // e.g., "google", "github", "local"
  providerId: varchar("provider_id", { length: 255 }), // the user ID from provider
  createdAt: timestamp("created_at").defaultNow()
});
