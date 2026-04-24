import { Router, type IRouter } from "express";
import { eq, or } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { db, usersTable } from "@workspace/db";
import { LoginBody } from "@workspace/api-zod";

const router: IRouter = Router();

function toUserResponse(u: typeof usersTable.$inferSelect) {
  return {
    id: u.id,
    fullName: u.fullName,
    email: u.email,
    phone: u.phone ?? null,
    role: u.role,
    gender: u.gender,
    section: u.section ?? null,
    level: u.level ?? null,
    status: u.status,
    federationCode: u.federationCode ?? null,
    cnicNumber: u.cnicNumber ?? null,
    trialStartDate: u.trialStartDate ? u.trialStartDate.toISOString() : null,
    trialEndDate: u.trialEndDate ? u.trialEndDate.toISOString() : null,
    createdAt: u.createdAt.toISOString(),
    updatedAt: u.updatedAt.toISOString(),
  };
}

/**
 * Verify password — supports both bcrypt and the legacy `hashed_<pw>` format
 * (so users created before bcrypt was added can still log in).
 */
async function verifyPassword(plain: string, stored: string): Promise<boolean> {
  if (stored.startsWith("$2")) {
    return bcrypt.compare(plain, stored);
  }
  // Legacy format
  return stored === `hashed_${plain}`;
}

/**
 * POST /auth/login
 * `email` field accepts: email | CNIC (12345-1234567-1) | phone (03XXXXXXXXX)
 */
router.post("/auth/login", async (req, res): Promise<void> => {
  const parsed = LoginBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid request — لاگ ان معلومات غلط ہیں" });
    return;
  }

  const id = parsed.data.email.trim();

  const [user] = await db
    .select()
    .from(usersTable)
    .where(
      or(
        eq(usersTable.email, id.toLowerCase()),
        eq(usersTable.cnicNumber, id),
        eq(usersTable.phone, id),
        eq(usersTable.username, id),
      ),
    );

  if (!user) {
    res.status(401).json({ error: "Account not found — اکاؤنٹ موجود نہیں" });
    return;
  }

  const ok = await verifyPassword(parsed.data.password, user.passwordHash);
  if (!ok) {
    res.status(401).json({ error: "Password incorrect — پاسورڈ غلط ہے" });
    return;
  }

  // ─── Block login until admin verifies ───
  const ACTIVE = new Set(["active", "verified", "trial"]);
  if (!ACTIVE.has(user.status)) {
    if (user.status === "suspended") {
      res.status(403).json({ error: "Account suspended — اکاؤنٹ معطل کر دیا گیا ہے" });
      return;
    }
    res.status(403).json({
      error: "Account not verified yet — اکاؤنٹ ابھی verify نہیں ہوا، براہ کرم پہلے ٹیسٹ مکمل کریں",
    });
    return;
  }

  const token = Buffer.from(`${user.id}:${user.email}:${Date.now()}`).toString("base64");

  res.json({
    user: toUserResponse(user),
    token,
  });
});

router.post("/auth/logout", async (_req, res): Promise<void> => {
  res.sendStatus(204);
});

router.get("/auth/me", async (req, res): Promise<void> => {
  const auth = req.headers.authorization;
  if (!auth) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }

  try {
    const decoded = Buffer.from(auth.replace("Bearer ", ""), "base64").toString();
    const [idStr] = decoded.split(":");
    const id = parseInt(idStr, 10);

    const [user] = await db.select().from(usersTable).where(eq(usersTable.id, id));
    if (!user) {
      res.status(401).json({ error: "Not authenticated" });
      return;
    }

    res.json(toUserResponse(user));
  } catch {
    res.status(401).json({ error: "Not authenticated" });
  }
});

export default router;
