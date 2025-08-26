// auth.js
import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { db } from "../db/index.js";
import { users } from "../db/schema.js";
import { eq } from "drizzle-orm";

const router = express.Router();

// Register (for normal users)
router.post("/register", async (req, res) => {
  const { email, name, password } = req.body;

  const existing = await db.select().from(users).where(eq(users.email, email));
  if (existing.length > 0) return res.status(400).json({ message: "User already exists" });

  const hashedPassword = password ? await bcrypt.hash(password, 10) : null;
  await db.insert(users).values({ email, name, password: hashedPassword });

  res.json({ message: "User registered successfully" });
});

// Normal login (if you want email+password login)
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await db.select().from(users).where(eq(users.email, email));

  if (user.length === 0) return res.status(400).json({ message: "User not found" });

  const isMatch = await bcrypt.compare(password, user[0].password);
  if (!isMatch) return res.status(400).json({ message: "Invalid password" });

  const token = jwt.sign(
    { id: user[0].id, email: user[0].email, role: user[0].role },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );
  res.json({ token });
});

// Admin login (email + name only)
router.post("/admin-login", async (req, res) => {
  const { email, name } = req.body;
  const user = await db.select().from(users).where(eq(users.email, email));

  if (user.length === 0) return res.status(400).json({ message: "No such user" });

  if (user[0].role !== "admin") return res.status(403).json({ message: "Not an admin" });

  if (user[0].name !== name) return res.status(400).json({ message: "Name mismatch" });

  const token = jwt.sign(
    { id: user[0].id, email: user[0].email, role: user[0].role },
    process.env.JWT_SECRET,
    { expiresIn: "2h" }
  );
  res.json({ token });
});

export default router;
