// auth.js
import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { db } from "../db/index.js";
import { users } from "../db/schema.js";
import { eq } from "drizzle-orm";

const router = express.Router();

// ============================
// REGISTER (Normal Users)
// ============================
router.post("/register", async (req, res) => {
  try {
    const { email, name, password } = req.body;

    if (!email || !name || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existing = await db.select().from(users).where(eq(users.email, email));
    if (existing.length > 0) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await db.insert(users).values({ email, name, password: hashedPassword, role: "user" });

    res.json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await db.select().from(users).where(eq(users.email, email));

    if (user.length === 0) return res.status(400).json({ message: "User not found" });
    if (user[0].role === "admin")
    {
      const isMatch = (password === user[0].password);
      if(!isMatch) return res.status(400).json({ message: "Invalid password" });
    }
    else
    {
      const isMatch = await bcrypt.compare(password, user[0].password);
      if (!isMatch) return res.status(400).json({ message: "Invalid password" });
    }
      const token = jwt.sign(
        { id: user[0].id, email: user[0].email, role: user[0].role },
        process.env.JWT_SECRET,
        { expiresIn: "1m" } // Token validity
      );
    // Set auth cookie
    res.cookie("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 1000 // 1 minute cookie
    });

    res.json({ message: "Login successful", role: user[0].role });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ============================
// VERIFY USER (Check Cookie)
// ============================
router.get("/me", async (req, res) => {
  try {
    const token = req.cookies?.auth_token;
    if (!token) return res.status(401).json({ message: "Not logged in" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await db.select().from(users).where(eq(users.id, decoded.id));

    if (user.length === 0) return res.status(401).json({ message: "User not found" });

    res.json({ id: user[0].id, email: user[0].email, name: user[0].name, role: user[0].role });
  } catch (err) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
});

// ============================
// LOGOUT (Clear Cookie)
// ============================
router.post("/logout", (req, res) => {
  res.clearCookie("auth_token");
  res.json({ message: "Logged out successfully" });
});

// ============================
// ADMIN LOGIN
// ============================
// router.post("/admin-login", async (req, res) => {
//   try {
//     const { email, name } = req.body;
//     const user = await db.select().from(users).where(eq(users.email, email));

//     if (user.length === 0) return res.status(400).json({ message: "No such user" });
//     if (user[0].role !== "admin") return res.status(403).json({ message: "Not an admin" });
//     if (user[0].name !== name) return res.status(400).json({ message: "Name mismatch" });

//     const token = jwt.sign(
//       { id: user[0].id, email: user[0].email, role: user[0].role },
//       process.env.JWT_SECRET,
//       { expiresIn: "2h" }
//     );

//     res.cookie("auth_token", token, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === "production",
//       sameSite: "strict",
//       maxAge: 2 * 60 * 60 * 1000
//     });

//     res.json({ message: "Admin login successful", role: user[0].role });
//   } catch (err) {
//     res.status(500).json({ message: "Server error", error: err.message });
//   }
// });

export default router;
