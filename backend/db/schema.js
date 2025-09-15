import {
  pgTable,
  serial,
  integer,
  varchar,
  text,
  numeric,
  timestamp,
  pgEnum,
  uniqueIndex,
  boolean,
} from "drizzle-orm/pg-core";

export const roleEnum = pgEnum("role_enum", [
  "super_admin",
  "restaurant_admin",
  "delivery_boy",
  "user",
]);

export const orderStatusEnum = pgEnum("order_status_enum", [
  "pending",
  "preparing",
  "assigned",
  "on_the_way",
  "delivered",
  "cancelled",
]);
export const restaurantStatusEnum = pgEnum("restaurant_status_enum", ["yes", "no"]);

export const statusEnum = pgEnum("status_enum", ["yes", "no"]);

// ---------------- USERS ----------------
export const users = pgTable(
  "users",
  {
    id: serial("id").primaryKey(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    name: varchar("name", { length: 255 }).notNull(),
    password: varchar("password", { length: 255 }), // null if OAuth user
    role: roleEnum("role").default("user").notNull(),
    provider: varchar("provider", { length: 50 }), // "google", "github", "local"
    providerId: varchar("provider_id", { length: 255 }),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (t) => ({
    providerProviderIdIdx: uniqueIndex("users_provider_providerId_idx").on(
      t.provider,
      t.providerId
    ),
  })
);

export const restaurants = pgTable("restaurants", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  location: text("location"),
  adminId: integer("admin_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }), // ✅ each restaurant has an admin
  createdAt: timestamp("created_at").defaultNow(),
  status: restaurantStatusEnum("status").default("no").notNull()
});

export const deliveryBoys = pgTable("delivery_boys", {
  id: integer("id")
    .primaryKey()
    .references(() => users.id, { onDelete: "cascade" }), // ✅ each delivery boy is a user
  isAvailable: boolean("is_available").default(true),
  currentLocation: text("current_location"),
});

// ---------------- MENU ITEMS ----------------
export const menuItems = pgTable("menu_items", {
  id: serial("id").primaryKey(),
  restaurantId: integer("restaurant_id")
    .notNull()
    .references(() => restaurants.id, { onDelete: "cascade" }), // ✅ belongs to a restaurant
  name: varchar("name", { length: 255 }).notNull(),
  price: numeric("price", 10, 2).notNull(),
  image: text("image"),
  status: statusEnum("status").default("no").notNull(),
});

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  customerName: varchar("customer_name", { length: 255 }).notNull(), // ✅ unchanged
  status: varchar("status", { length: 255 }).notNull(), // ✅ unchanged
  createdAt: timestamp("created_at").defaultNow(),

  // 🔗 Extra relational fields (optional, won’t break existing code)
  userId: integer("user_id").references(() => users.id, { onDelete: "cascade" }),
  restaurantId: integer("restaurant_id").references(() => restaurants.id, { onDelete: "cascade" }),
  deliveryBoyId: integer("delivery_boy_id").references(() => users.id, { onDelete: "set null" }),
});

export const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id")
    .notNull()
    .references(() => orders.id, { onDelete: "cascade" }), // ✅ linked to orders
  menuItemId: integer("menu_item_id")
    .notNull()
    .references(() => menuItems.id, { onDelete: "cascade" }), // ✅ linked to menu items
  quantity: integer("quantity").notNull(),
  price: integer("price").notNull(), // ✅ unchanged
});

