import { Router, type IRouter } from "express";
import { eq, and, ilike } from "drizzle-orm";
import { db, coursesTable } from "@workspace/db";
import {
  ListCoursesQueryParams,
  CreateCourseBody,
  GetCourseParams,
  UpdateCourseParams,
  UpdateCourseBody,
  DeleteCourseParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

function toCourseResponse(c: typeof coursesTable.$inferSelect) {
  return {
    id: c.id,
    title: c.title,
    type: c.type,
    description: c.description ?? null,
    level: c.level ?? null,
    gender: c.gender,
    teacherId: c.teacherId ?? null,
    lessonCount: c.lessonCount,
    createdAt: c.createdAt.toISOString(),
    updatedAt: c.updatedAt.toISOString(),
  };
}

router.get("/courses", async (req, res): Promise<void> => {
  const params = ListCoursesQueryParams.safeParse(req.query);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const conditions = [];
  if (params.data.type) conditions.push(eq(coursesTable.type, params.data.type));
  if (params.data.gender) conditions.push(eq(coursesTable.gender, params.data.gender));
  if (params.data.level) conditions.push(eq(coursesTable.level, params.data.level));
  if (params.data.search) conditions.push(ilike(coursesTable.title, `%${params.data.search}%`));

  const courses = conditions.length > 0
    ? await db.select().from(coursesTable).where(and(...conditions)).orderBy(coursesTable.createdAt)
    : await db.select().from(coursesTable).orderBy(coursesTable.createdAt);

  res.json(courses.map(toCourseResponse));
});

router.post("/courses", async (req, res): Promise<void> => {
  const parsed = CreateCourseBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [course] = await db.insert(coursesTable).values(parsed.data).returning();
  res.status(201).json(toCourseResponse(course));
});

router.get("/courses/:id", async (req, res): Promise<void> => {
  const params = GetCourseParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [course] = await db.select().from(coursesTable).where(eq(coursesTable.id, params.data.id));
  if (!course) {
    res.status(404).json({ error: "Course not found" });
    return;
  }

  res.json(toCourseResponse(course));
});

router.patch("/courses/:id", async (req, res): Promise<void> => {
  const params = UpdateCourseParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const parsed = UpdateCourseBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [course] = await db.update(coursesTable).set(parsed.data).where(eq(coursesTable.id, params.data.id)).returning();
  if (!course) {
    res.status(404).json({ error: "Course not found" });
    return;
  }

  res.json(toCourseResponse(course));
});

router.delete("/courses/:id", async (req, res): Promise<void> => {
  const params = DeleteCourseParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [course] = await db.delete(coursesTable).where(eq(coursesTable.id, params.data.id)).returning();
  if (!course) {
    res.status(404).json({ error: "Course not found" });
    return;
  }

  res.sendStatus(204);
});

export default router;
