import { db } from "../db/index.js";
import { users } from "../db/schema.js";
import { eq } from "drizzle-orm";

export const getDashboardStats = async(req, res) => {
    try
    {
        const totalOrdersResult = await db
            .select({ count: db.raw("count(*)") })
            .from(orders);
        const totalOrders = Number(totalOrdersResult[0].count);

        const approvedMenusResult = await db
            .select({ count: db.raw("count(*)")})
            .from(orders_)
            .where(eq(menus.status, "yes"));
        const approvedMenus = Number(approvedMenusResult[0].count);
        const totalMenusResult = await db
            .select({ count: db.raw("count(*)") })
            .from(menus);
        const totalMenus = Number(totalMenusResult[0].count);

        const revenueResult = await db
            .select({ total: db.raw("coalesce(sum(order_items.quantity * order_items.price), 0)") })
            .from(order_items)
        const totalRevenue = Number(revenueResult[0].total);
     res.json({ totalOrders, approvedOrders, totalMenus, totalRevenue });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}
