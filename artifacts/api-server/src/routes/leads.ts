import { Router, type IRouter } from "express";
import { eq, desc, and } from "drizzle-orm";
import { db, leadsTable } from "@workspace/db";

const router: IRouter = Router();

function toLead(l: typeof leadsTable.$inferSelect) {
  return {
    id: l.id,
    name: l.name,
    phone: l.phone,
    age: l.age ?? null,
    city: l.city ?? null,
    gender: l.gender,
    course: l.course,
    currentLevel: l.currentLevel ?? null,
    note: l.note ?? null,
    formType: l.formType ?? null,
    utmSource: l.utmSource ?? null,
    utmCampaign: l.utmCampaign ?? null,
    status: l.status,
    createdAt: l.createdAt.toISOString(),
  };
}

const COURSE_LABELS: Record<string, string> = {
  noorani: "نورانی قاعدہ",
  naazira: "ناظرہ قرآن",
  tajweed: "تجوید قرآن",
  hifz: "حفظ قرآن",
  alim: "درس نظامی / عالم",
  other: "دیگر",
};

router.post("/leads", async (req, res): Promise<void> => {
  const { name, phone, age, city, gender, course, currentLevel, note, formType, utmSource, utmCampaign } = req.body;
  if (!name || !phone || !gender || !course) {
    res.status(400).json({ error: "name, phone, gender, course are required" });
    return;
  }
  const [lead] = await db.insert(leadsTable).values({
    name: String(name).trim(),
    phone: String(phone).trim(),
    age: age ? parseInt(age) : null,
    city: city ? String(city).trim() : null,
    gender: String(gender),
    course: String(course),
    currentLevel: currentLevel ? String(currentLevel).trim() : null,
    note: note ? String(note).trim() : null,
    formType: formType ? String(formType) : null,
    utmSource: utmSource ? String(utmSource) : null,
    utmCampaign: utmCampaign ? String(utmCampaign) : null,
  }).returning();

  // Google Sheets webhook (reuse existing env var pattern)
  const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL;
  if (webhookUrl) {
    fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "lead",
        id: lead.id,
        name: lead.name,
        phone: lead.phone,
        age: lead.age,
        city: lead.city,
        gender: lead.gender,
        course: COURSE_LABELS[lead.course] ?? lead.course,
        currentLevel: lead.currentLevel,
        formType: lead.formType,
        utmSource: lead.utmSource,
        utmCampaign: lead.utmCampaign,
        submittedAt: lead.createdAt.toISOString(),
      }),
    }).catch(() => {});
  }

  res.status(201).json(toLead(lead));
});

router.get("/leads", async (req, res): Promise<void> => {
  const { gender, course, status } = req.query as Record<string, string>;
  const conditions = [];
  if (gender) conditions.push(eq(leadsTable.gender, gender));
  if (course) conditions.push(eq(leadsTable.course, course));
  if (status) conditions.push(eq(leadsTable.status, status));

  const leads = conditions.length > 0
    ? await db.select().from(leadsTable).where(and(...conditions)).orderBy(desc(leadsTable.createdAt))
    : await db.select().from(leadsTable).orderBy(desc(leadsTable.createdAt));

  res.json(leads.map(toLead));
});

router.patch("/leads/:id", async (req, res): Promise<void> => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }
  const { status, note } = req.body;
  const updates: Record<string, unknown> = {};
  if (status) updates.status = status;
  if (note !== undefined) updates.note = note;
  const [lead] = await db.update(leadsTable).set(updates).where(eq(leadsTable.id, id)).returning();
  if (!lead) { res.status(404).json({ error: "Not found" }); return; }
  res.json(toLead(lead));
});

router.delete("/leads/:id", async (req, res): Promise<void> => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }
  const [lead] = await db.delete(leadsTable).where(eq(leadsTable.id, id)).returning();
  if (!lead) { res.status(404).json({ error: "Not found" }); return; }
  res.sendStatus(204);
});

router.get("/leads/export/csv", async (req, res): Promise<void> => {
  const { gender, course, status } = req.query as Record<string, string>;
  const conditions = [];
  if (gender) conditions.push(eq(leadsTable.gender, gender));
  if (course) conditions.push(eq(leadsTable.course, course));
  if (status) conditions.push(eq(leadsTable.status, status));

  const leads = conditions.length > 0
    ? await db.select().from(leadsTable).where(and(...conditions)).orderBy(desc(leadsTable.createdAt))
    : await db.select().from(leadsTable).orderBy(desc(leadsTable.createdAt));

  const headers = ["ID", "نام", "فون", "عمر", "شہر", "جنس", "کورس", "موجودہ سطح", "نوٹ", "فارم", "UTM Source", "UTM Campaign", "Status", "تاریخ"];
  const courseLabel = (c: string) => COURSE_LABELS[c] ?? c;
  const genderLabel = (g: string) => g === "boys" ? "لڑکا" : "لڑکی";

  const rows = leads.map(l => [
    l.id,
    `"${(l.name ?? "").replace(/"/g, '""')}"`,
    `"${(l.phone ?? "").replace(/"/g, '""')}"`,
    l.age ?? "",
    `"${(l.city ?? "").replace(/"/g, '""')}"`,
    genderLabel(l.gender),
    courseLabel(l.course),
    `"${(l.currentLevel ?? "").replace(/"/g, '""')}"`,
    `"${(l.note ?? "").replace(/"/g, '""')}"`,
    l.formType ?? "",
    l.utmSource ?? "",
    l.utmCampaign ?? "",
    l.status,
    new Date(l.createdAt).toLocaleString("ur-PK"),
  ].join(","));

  const csv = "\uFEFF" + [headers.join(","), ...rows].join("\n");
  res.setHeader("Content-Type", "text/csv; charset=utf-8");
  res.setHeader("Content-Disposition", `attachment; filename="leads_${Date.now()}.csv"`);
  res.send(csv);
});

export default router;
