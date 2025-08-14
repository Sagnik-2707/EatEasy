import express from "express";
import { db } from "../db/index.js";
import { order, orderItems } from "../db/schema.js";
import { eq } from "drizzle-orm";
