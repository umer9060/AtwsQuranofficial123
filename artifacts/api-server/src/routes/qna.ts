import { Router, type IRouter } from "express";
import { eq, and } from "drizzle-orm";
import { db, qnaTable, activityLogTable } from "@workspace/db";
import {
  ListQnaQueryParams,
  CreateQnaBody,
  GetQnaParams,
  AnswerQnaParams,
  AnswerQnaBody,
} from "@workspace/api-zod";

const router: IRouter = Router();

function toQnaResponse(q: typeof qnaTable.$inferSelect) {
  return {
    id: q.id,
    courseId: q.courseId ?? null,
    studentId: q.studentId,
    teacherId: q.teacherId ?? null,
    question: q.question,
    answer: q.answer ?? null,
    status: q.status,
    createdAt: q.createdAt.toISOString(),
    updatedAt: q.updatedAt.toISOString(),
  };
}

router.get("/qna", async (req, res): Promise<void> => {
  const params = ListQnaQueryParams.safeParse(req.query);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const conditions = [];
  if (params.data.courseId) conditions.push(eq(qnaTable.courseId, params.data.courseId));
  if (params.data.studentId) conditions.push(eq(qnaTable.studentId, params.data.studentId));
  if (params.data.status) conditions.push(eq(qnaTable.status, params.data.status));

  const entries = conditions.length > 0
    ? await db.select().from(qnaTable).where(and(...conditions)).orderBy(qnaTable.createdAt)
    : await db.select().from(qnaTable).orderBy(qnaTable.createdAt);

  res.json(entries.map(toQnaResponse));
});

router.post("/qna", async (req, res): Promise<void> => {
  const parsed = CreateQnaBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [entry] = await db.insert(qnaTable).values(parsed.data).returning();

  await db.insert(activityLogTable).values({
    type: "question_asked",
    description: `New question submitted`,
    actorName: "Student",
  });

  res.status(201).json(toQnaResponse(entry));
});

router.get("/qna/:id", async (req, res): Promise<void> => {
  const params = GetQnaParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [entry] = await db.select().from(qnaTable).where(eq(qnaTable.id, params.data.id));
  if (!entry) {
    res.status(404).json({ error: "Q&A entry not found" });
    return;
  }

  res.json(toQnaResponse(entry));
});

router.patch("/qna/:id/answer", async (req, res): Promise<void> => {
  const params = AnswerQnaParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const parsed = AnswerQnaBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [entry] = await db.update(qnaTable)
    .set({
      answer: parsed.data.answer,
      teacherId: parsed.data.teacherId,
      status: "answered",
    })
    .where(eq(qnaTable.id, params.data.id))
    .returning();

  if (!entry) {
    res.status(404).json({ error: "Q&A entry not found" });
    return;
  }

  await db.insert(activityLogTable).values({
    type: "question_answered",
    description: `Question answered by teacher`,
    actorName: "Teacher",
  });

  res.json(toQnaResponse(entry));
});

export default router;
