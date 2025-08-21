import mysql from "mysql2/promise";
import { drizzle } from "drizzle-orm/mysql2";
import * as schema from "./schema.js";
import dotenv from "dotenv";
dotenv.config();

async function connectDB() {
  const poolConnection = await mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  return drizzle(poolConnection, { schema });
}

export const db = await connectDB();
