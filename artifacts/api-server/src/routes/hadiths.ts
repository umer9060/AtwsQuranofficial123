import { Router, type IRouter } from "express";
import { eq, and, ilike, or } from "drizzle-orm";
import { db, hadithsTable, activityLogTable } from "@workspace/db";
import {
  ListHadithsQueryParams,
  CreateHadithBody,
  GetHadithParams,
  UpdateHadithParams,
  UpdateHadithBody,
  DeleteHadithParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

function toHadithResponse(h: typeof hadithsTable.$inferSelect) {
  return {
    id: h.id,
    courseId: h.courseId ?? null,
    arabicText: h.arabicText,
    urduTranslation: h.urduTranslation ?? null,
    englishTranslation: h.englishTranslation ?? null,
    narrator: h.narrator ?? null,
    source: h.source ?? null,
    status: h.status,
    keywords: h.keywords ?? null,
    createdAt: h.createdAt.toISOString(),
    updatedAt: h.updatedAt.toISOString(),
  };
}

router.get("/hadiths", async (req, res): Promise<void> => {
  const params = ListHadithsQueryParams.safeParse(req.query);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const conditions = [];
  if (params.data.status) conditions.push(eq(hadithsTable.status, params.data.status));
  if (params.data.courseId) conditions.push(eq(hadithsTable.courseId, params.data.courseId));
  if (params.data.search) {
    const s = `%${params.data.search}%`;
    conditions.push(
      or(
        ilike(hadithsTable.arabicText, s),
        ilike(hadithsTable.englishTranslation, s),
        ilike(hadithsTable.urduTranslation, s),
        ilike(hadithsTable.keywords, s),
        ilike(hadithsTable.narrator, s),
      )!
    );
  }

  const hadiths = conditions.length > 0
    ? await db.select().from(hadithsTable).where(and(...conditions)).orderBy(hadithsTable.createdAt)
    : await db.select().from(hadithsTable).orderBy(hadithsTable.createdAt);

  res.json(hadiths.map(toHadithResponse));
});

router.post("/hadiths", async (req, res): Promise<void> => {
  const parsed = CreateHadithBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [hadith] = await db.insert(hadithsTable).values(parsed.data).returning();

  await db.insert(activityLogTable).values({
    type: "hadith_added",
    description: `New hadith added (${hadith.status})`,
    actorName: "Teacher",
  });

  res.status(201).json(toHadithResponse(hadith));
});

router.get("/hadiths/:id", async (req, res): Promise<void> => {
  const params = GetHadithParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [hadith] = await db.select().from(hadithsTable).where(eq(hadithsTable.id, params.data.id));
  if (!hadith) {
    res.status(404).json({ error: "Hadith not found" });
    return;
  }

  res.json(toHadithResponse(hadith));
});

router.patch("/hadiths/:id", async (req, res): Promise<void> => {
  const params = UpdateHadithParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const parsed = UpdateHadithBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [hadith] = await db.update(hadithsTable).set(parsed.data).where(eq(hadithsTable.id, params.data.id)).returning();
  if (!hadith) {
    res.status(404).json({ error: "Hadith not found" });
    return;
  }

  res.json(toHadithResponse(hadith));
});

router.delete("/hadiths/:id", async (req, res): Promise<void> => {
  const params = DeleteHadithParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [hadith] = await db.delete(hadithsTable).where(eq(hadithsTable.id, params.data.id)).returning();
  if (!hadith) {
    res.status(404).json({ error: "Hadith not found" });
    return;
  }

  res.sendStatus(204);
});

export default router;
