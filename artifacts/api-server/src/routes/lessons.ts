import { Router, type IRouter } from "express";
import { eq, and, ilike } from "drizzle-orm";
import { db, lessonsTable, coursesTable, activityLogTable } from "@workspace/db";
import {
  ListLessonsQueryParams,
  CreateLessonBody,
  GetLessonParams,
  UpdateLessonParams,
  UpdateLessonBody,
  DeleteLessonParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

function toLessonResponse(l: typeof lessonsTable.$inferSelect) {
  return {
    id: l.id,
    courseId: l.courseId,
    title: l.title,
    content: l.content ?? null,
    videoUrl: l.videoUrl ?? null,
    pdfUrl: l.pdfUrl ?? null,
    isPrivate: l.isPrivate,
    orderIndex: l.orderIndex,
    createdAt: l.createdAt.toISOString(),
    updatedAt: l.updatedAt.toISOString(),
  };
}

router.get("/lessons", async (req, res): Promise<void> => {
  const params = ListLessonsQueryParams.safeParse(req.query);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const conditions = [];
  if (params.data.courseId) conditions.push(eq(lessonsTable.courseId, params.data.courseId));
  if (params.data.search) conditions.push(ilike(lessonsTable.title, `%${params.data.search}%`));

  const lessons = conditions.length > 0
    ? await db.select().from(lessonsTable).where(and(...conditions)).orderBy(lessonsTable.orderIndex)
    : await db.select().from(lessonsTable).orderBy(lessonsTable.orderIndex);

  res.json(lessons.map(toLessonResponse));
});

router.post("/lessons", async (req, res): Promise<void> => {
  const parsed = CreateLessonBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [lesson] = await db.insert(lessonsTable).values(parsed.data).returning();

  await db.update(coursesTable)
    .set({ lessonCount: (await db.select().from(lessonsTable).where(eq(lessonsTable.courseId, parsed.data.courseId))).length })
    .where(eq(coursesTable.id, parsed.data.courseId));

  await db.insert(activityLogTable).values({
    type: "lesson_added",
    description: `New lesson added: ${lesson.title}`,
    actorName: "Teacher",
  });

  res.status(201).json(toLessonResponse(lesson));
});

router.get("/lessons/:id", async (req, res): Promise<void> => {
  const params = GetLessonParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [lesson] = await db.select().from(lessonsTable).where(eq(lessonsTable.id, params.data.id));
  if (!lesson) {
    res.status(404).json({ error: "Lesson not found" });
    return;
  }

  res.json(toLessonResponse(lesson));
});

router.patch("/lessons/:id", async (req, res): Promise<void> => {
  const params = UpdateLessonParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const parsed = UpdateLessonBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [lesson] = await db.update(lessonsTable).set(parsed.data).where(eq(lessonsTable.id, params.data.id)).returning();
  if (!lesson) {
    res.status(404).json({ error: "Lesson not found" });
    return;
  }

  res.json(toLessonResponse(lesson));
});

router.delete("/lessons/:id", async (req, res): Promise<void> => {
  const params = DeleteLessonParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [lesson] = await db.delete(lessonsTable).where(eq(lessonsTable.id, params.data.id)).returning();
  if (!lesson) {
    res.status(404).json({ error: "Lesson not found" });
    return;
  }

  res.sendStatus(204);
});

export default router;
