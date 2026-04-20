import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
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

router.post("/auth/login", async (req, res): Promise<void> => {
  const parsed = LoginBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [user] = await db.select().from(usersTable).where(eq(usersTable.email, parsed.data.email));
  if (!user) {
    res.status(401).json({ error: "Invalid credentials" });
    return;
  }

  const expectedHash = `hashed_${parsed.data.password}`;
  if (user.passwordHash !== expectedHash) {
    res.status(401).json({ error: "Invalid credentials" });
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
