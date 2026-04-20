import { Router, type IRouter } from "express";
import { eq, and } from "drizzle-orm";
import { db, liveClassesTable, activityLogTable } from "@workspace/db";
import {
  ListClassesQueryParams,
  CreateClassBody,
  GetClassParams,
  UpdateClassParams,
  UpdateClassBody,
  DeleteClassParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

function toClassResponse(c: typeof liveClassesTable.$inferSelect) {
  return {
    id: c.id,
    courseId: c.courseId,
    title: c.title,
    teacherId: c.teacherId,
    zoomLink: c.zoomLink ?? null,
    zoomMeetingId: c.zoomMeetingId ?? null,
    scheduledAt: c.scheduledAt.toISOString(),
    durationMinutes: c.durationMinutes,
    status: c.status,
    gender: c.gender,
    createdAt: c.createdAt.toISOString(),
    updatedAt: c.updatedAt.toISOString(),
  };
}

router.get("/classes", async (req, res): Promise<void> => {
  const params = ListClassesQueryParams.safeParse(req.query);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const conditions = [];
  if (params.data.courseId) conditions.push(eq(liveClassesTable.courseId, params.data.courseId));
  if (params.data.status) conditions.push(eq(liveClassesTable.status, params.data.status));
  if (params.data.gender) conditions.push(eq(liveClassesTable.gender, params.data.gender));

  const classes = conditions.length > 0
    ? await db.select().from(liveClassesTable).where(and(...conditions)).orderBy(liveClassesTable.scheduledAt)
    : await db.select().from(liveClassesTable).orderBy(liveClassesTable.scheduledAt);

  res.json(classes.map(toClassResponse));
});

router.post("/classes", async (req, res): Promise<void> => {
  const parsed = CreateClassBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [liveClass] = await db.insert(liveClassesTable).values({
    ...parsed.data,
    scheduledAt: new Date(parsed.data.scheduledAt),
  }).returning();

  await db.insert(activityLogTable).values({
    type: "class_scheduled",
    description: `Live class scheduled: ${liveClass.title}`,
    actorName: "Teacher",
  });

  res.status(201).json(toClassResponse(liveClass));
});

router.get("/classes/:id", async (req, res): Promise<void> => {
  const params = GetClassParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [liveClass] = await db.select().from(liveClassesTable).where(eq(liveClassesTable.id, params.data.id));
  if (!liveClass) {
    res.status(404).json({ error: "Class not found" });
    return;
  }

  res.json(toClassResponse(liveClass));
});

router.patch("/classes/:id", async (req, res): Promise<void> => {
  const params = UpdateClassParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const parsed = UpdateClassBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const updateData: Record<string, unknown> = { ...parsed.data };
  if (parsed.data.scheduledAt) {
    updateData.scheduledAt = new Date(parsed.data.scheduledAt);
  }

  const [liveClass] = await db.update(liveClassesTable).set(updateData).where(eq(liveClassesTable.id, params.data.id)).returning();
  if (!liveClass) {
    res.status(404).json({ error: "Class not found" });
    return;
  }

  res.json(toClassResponse(liveClass));
});

router.delete("/classes/:id", async (req, res): Promise<void> => {
  const params = DeleteClassParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [liveClass] = await db.delete(liveClassesTable).where(eq(liveClassesTable.id, params.data.id)).returning();
  if (!liveClass) {
    res.status(404).json({ error: "Class not found" });
    return;
  }

  res.sendStatus(204);
});

export default router;
