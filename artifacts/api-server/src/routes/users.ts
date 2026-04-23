import { Router, type IRouter } from "express";
import { eq, or, ilike, and } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { db, usersTable, activityLogTable } from "@workspace/db";

// ─── Pakistan format validators ───
const CNIC_RE = /^\d{5}-\d{7}-\d$/;          // 12345-1234567-1
const PHONE_RE = /^(?:\+92|0)?3\d{9}$/;       // 03XXXXXXXXX or +923XXXXXXXXX

function normalizePhone(p?: string | null): string | null {
  if (!p) return null;
  const digits = p.replace(/[^\d]/g, "");
  if (digits.startsWith("92") && digits.length === 12) return "0" + digits.slice(2);
  if (digits.length === 10 && digits.startsWith("3")) return "0" + digits;
  return digits.startsWith("0") ? digits : null;
}
import {
  ListUsersQueryParams,
  CreateUserBody,
  GetUserParams,
  UpdateUserParams,
  UpdateUserBody,
  DeleteUserParams,
  VerifyStudentParams,
  VerifyStudentBody,
} from "@workspace/api-zod";

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
    age: u.age ?? null,
    fatherName: u.fatherName ?? null,
    username: u.username ?? null,
    currentClass: u.currentClass ?? null,
    lastEducation: u.lastEducation ?? null,
    profileImageUrl: u.profileImageUrl ?? null,
    documentFileUrl: u.documentFileUrl ?? null,
    bio: u.bio ?? null,
    teachingExperience: u.teachingExperience ?? null,
    languagesSpoken: u.languagesSpoken ?? null,
    coursesStudied: u.coursesStudied ?? null,
    demoVideoUrls: u.demoVideoUrls ?? null,
  };
}

router.get("/users", async (req, res): Promise<void> => {
  const params = ListUsersQueryParams.safeParse(req.query);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  let query = db.select().from(usersTable);
  const conditions = [];

  if (params.data.role) {
    conditions.push(eq(usersTable.role, params.data.role));
  }
  if (params.data.gender) {
    conditions.push(eq(usersTable.gender, params.data.gender));
  }
  if (params.data.status) {
    conditions.push(eq(usersTable.status, params.data.status));
  }
  if (params.data.search) {
    const s = `%${params.data.search}%`;
    conditions.push(
      or(
        ilike(usersTable.fullName, s),
        ilike(usersTable.email, s),
        ilike(usersTable.federationCode, s),
        ilike(usersTable.cnicNumber, s),
      )!
    );
  }

  const users = conditions.length > 0
    ? await db.select().from(usersTable).where(and(...conditions)).orderBy(usersTable.createdAt)
    : await db.select().from(usersTable).orderBy(usersTable.createdAt);

  res.json(users.map(toUserResponse));
});

async function sendToGoogleSheets(data: Record<string, unknown>) {
  const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL;
  if (!webhookUrl) return;
  try {
    await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  } catch {
    // Non-critical: Google Sheets logging failed silently
  }
}

router.post("/users", async (req, res): Promise<void> => {
  const parsed = CreateUserBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { password, ...rest } = parsed.data;

  // ─── Pakistan format validation ───
  if (rest.cnicNumber && !CNIC_RE.test(rest.cnicNumber)) {
    res.status(400).json({ error: "Invalid CNIC format — غلط شناختی کارڈ نمبر (12345-1234567-1)" });
    return;
  }

  const phone = normalizePhone(rest.phone ?? null);
  if (rest.phone && (!phone || !PHONE_RE.test(phone))) {
    res.status(400).json({ error: "Invalid phone — غلط فون نمبر (03XXXXXXXXX)" });
    return;
  }

  // ─── Uniqueness checks ───
  const dupes = await db
    .select({ id: usersTable.id, email: usersTable.email, cnic: usersTable.cnicNumber, phone: usersTable.phone })
    .from(usersTable)
    .where(
      or(
        eq(usersTable.email, rest.email.toLowerCase()),
        rest.cnicNumber ? eq(usersTable.cnicNumber, rest.cnicNumber) : undefined,
        phone ? eq(usersTable.phone, phone) : undefined,
      ),
    );

  if (dupes.length) {
    const d = dupes[0];
    if (d.email === rest.email.toLowerCase()) {
      res.status(409).json({ error: "Email already used — یہ ای میل پہلے سے رجسٹرڈ ہے" });
      return;
    }
    if (rest.cnicNumber && d.cnic === rest.cnicNumber) {
      res.status(409).json({ error: "CNIC already registered — یہ شناختی کارڈ پہلے سے رجسٹرڈ ہے" });
      return;
    }
    if (phone && d.phone === phone) {
      res.status(409).json({ error: "Phone already registered — یہ فون نمبر پہلے سے رجسٹرڈ ہے" });
      return;
    }
  }

  const trialStart = new Date();
  const trialEnd = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  const [user] = await db.insert(usersTable).values({
    ...rest,
    email: rest.email.toLowerCase(),
    phone,
    passwordHash: await bcrypt.hash(password, 10),
    status: "trial",
    trialStartDate: trialStart,
    trialEndDate: trialEnd,
  }).returning();

  await db.insert(activityLogTable).values({
    type: "student_registered",
    description: `New user registered: ${user.fullName}`,
    actorName: user.fullName,
  });

  sendToGoogleSheets({
    name: user.fullName,
    email: user.email,
    phone: user.phone,
    age: user.age,
    fatherName: user.fatherName,
    cnicNumber: user.cnicNumber,
    documentFileUrl: user.documentFileUrl ? "Uploaded" : "Not provided",
    currentClass: user.currentClass,
    lastEducation: user.lastEducation,
    role: user.role,
    status: user.status,
    registeredAt: user.createdAt.toISOString(),
  });

  res.status(201).json(toUserResponse(user));
});

router.get("/users/:id", async (req, res): Promise<void> => {
  const params = GetUserParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [user] = await db.select().from(usersTable).where(eq(usersTable.id, params.data.id));
  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }

  res.json(toUserResponse(user));
});

router.patch("/users/:id", async (req, res): Promise<void> => {
  const params = UpdateUserParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const parsed = UpdateUserBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [user] = await db.update(usersTable).set(parsed.data).where(eq(usersTable.id, params.data.id)).returning();
  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }

  res.json(toUserResponse(user));
});

router.delete("/users/:id", async (req, res): Promise<void> => {
  const params = DeleteUserParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [user] = await db.delete(usersTable).where(eq(usersTable.id, params.data.id)).returning();
  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }

  res.sendStatus(204);
});

router.patch("/users/:id/verify", async (req, res): Promise<void> => {
  const params = VerifyStudentParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const parsed = VerifyStudentBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [user] = await db.update(usersTable)
    .set({
      status: parsed.data.status,
      federationCode: parsed.data.federationCode,
    })
    .where(eq(usersTable.id, params.data.id))
    .returning();

  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }

  await db.insert(activityLogTable).values({
    type: "student_verified",
    description: `Student verified: ${user.fullName} (${parsed.data.federationCode})`,
    actorName: "Admin",
  });

  res.json(toUserResponse(user));
});

export default router;
