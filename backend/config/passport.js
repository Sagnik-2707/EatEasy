// config/passport.js
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { db } from "../db/index.js";
import { users } from "../db/schema.js";
import { and, eq } from "drizzle-orm";
import dotenv from "dotenv";

dotenv.config();

async function findOrCreateGoogleUser(profile) {
  const provider = "google";
  const providerId = profile.id;
  const email = profile.emails?.[0]?.value?.toLowerCase() || null;
  const name = profile.displayName || "Unnamed";

  // 1) Find existing user by providerId
  const byProvider = await db
    .select()
    .from(users)
    .where(and(eq(users.provider, provider), eq(users.providerId, providerId)))
    .limit(1);

  if (byProvider[0]) return byProvider[0];

  // 2) If not found, link by email if user exists
  if (email) {
    const byEmail = await db.select().from(users).where(eq(users.email, email)).limit(1);
    if (byEmail[0]) {
      await db
        .update(users)
        .set({ provider, providerId })
        .where(eq(users.id, byEmail[0].id));
      return { ...byEmail[0], provider, providerId };
    }
  }

  // 3) Create a new user
  const inserted = await db
    .insert(users)
    .values({ email, name, provider, providerId, role: "user" })
    .returning();

  return inserted[0];
}

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const user = await findOrCreateGoogleUser(profile);
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

export { passport };
