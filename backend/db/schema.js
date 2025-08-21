import { mysqlTable, int, varchar, text, decimal, datetime } from "drizzle-orm/mysql-core";

export const menuItems = mysqlTable("menu items", {
    id:int(id).autoincrement().primaryKey(),
    name: varchar("name", {length: 255}).notNull(),
    description: text("description"),
    price: decimal(price, 10, 2).notNull(),
    category: varchar("category", {length : 100})
});

export const orders = mysqlTable("orders",{
    id: int(id).autoincrement().primaryKey(),
    customerName: varchar("customerName", {length: 255}).notNull(),
    customerAddress: text("customerAddress").notNull(),
    status: varchar(status, {length: 255}).notNull(),
    createdAt: datetime(createdAt).defaultNow()
});

export const orderItems = mysqlTable("orderItems", {
    id: int(id).autoincrement().primaryKey(),
    orderId: int(orderId).notNull(),
    menuItemId: int(menuItemId).notNull(),
    quantity: int(quantity).notNull()
});


