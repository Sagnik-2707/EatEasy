// drizzle.config.js
import 'dotenv/config';

export default {
  schema: "./db/schema.js",   // your schema file
  out: "./drizzle",               // migrations folder
  dialect: "postgresql",          // ✅ instead of driver
  dbCredentials: {
    url: process.env.DATABASE_URL, // ✅ note: use "url" not "connectionString"
  },
};
