import { Router, type IRouter } from "express";
import { eq, asc } from "drizzle-orm";
import { db, ulemaTable, ulemaBooksTable } from "@workspace/db";

const router: IRouter = Router();

function toUlemResponse(u: typeof ulemaTable.$inferSelect) {
  return {
    id: u.id,
    name: u.name,
    title: u.title ?? null,
    facebookUrl: u.facebookUrl ?? null,
    youtubeUrl: u.youtubeUrl ?? null,
    bio: u.bio ?? null,
    imageUrl: u.imageUrl ?? null,
    orderNum: u.orderNum ?? 0,
    createdAt: u.createdAt.toISOString(),
    updatedAt: u.updatedAt.toISOString(),
  };
}

function toBookResponse(b: typeof ulemaBooksTable.$inferSelect) {
  return {
    id: b.id,
    ulemId: b.ulemId,
    title: b.title,
    description: b.description ?? null,
    fileUrl: b.fileUrl ?? null,
    coverImageUrl: b.coverImageUrl ?? null,
    createdAt: b.createdAt.toISOString(),
  };
}

router.get("/ulema", async (_req, res): Promise<void> => {
  const ulema = await db.select().from(ulemaTable).orderBy(asc(ulemaTable.orderNum), asc(ulemaTable.id));
  res.json(ulema.map(toUlemResponse));
});

router.post("/ulema", async (req, res): Promise<void> => {
  const { name, title, facebookUrl, youtubeUrl, bio, imageUrl, orderNum } = req.body;
  if (!name || typeof name !== "string") {
    res.status(400).json({ error: "name is required" });
    return;
  }
  const [ulem] = await db.insert(ulemaTable).values({
    name: name.trim(),
    title: title?.trim() || null,
    facebookUrl: facebookUrl?.trim() || null,
    youtubeUrl: youtubeUrl?.trim() || null,
    bio: bio?.trim() || null,
    imageUrl: imageUrl?.trim() || null,
    orderNum: typeof orderNum === "number" ? orderNum : 0,
  }).returning();
  res.status(201).json(toUlemResponse(ulem));
});

router.patch("/ulema/:id", async (req, res): Promise<void> => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }
  const { name, title, facebookUrl, youtubeUrl, bio, imageUrl, orderNum } = req.body;
  const updates: Record<string, unknown> = {};
  if (name !== undefined) updates.name = name?.trim();
  if (title !== undefined) updates.title = title?.trim() || null;
  if (facebookUrl !== undefined) updates.facebookUrl = facebookUrl?.trim() || null;
  if (youtubeUrl !== undefined) updates.youtubeUrl = youtubeUrl?.trim() || null;
  if (bio !== undefined) updates.bio = bio?.trim() || null;
  if (imageUrl !== undefined) updates.imageUrl = imageUrl?.trim() || null;
  if (orderNum !== undefined) updates.orderNum = typeof orderNum === "number" ? orderNum : 0;
  const [ulem] = await db.update(ulemaTable).set(updates).where(eq(ulemaTable.id, id)).returning();
  if (!ulem) { res.status(404).json({ error: "Not found" }); return; }
  res.json(toUlemResponse(ulem));
});

router.delete("/ulema/:id", async (req, res): Promise<void> => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }
  const [ulem] = await db.delete(ulemaTable).where(eq(ulemaTable.id, id)).returning();
  if (!ulem) { res.status(404).json({ error: "Not found" }); return; }
  res.sendStatus(204);
});

router.get("/ulema/:id/books", async (req, res): Promise<void> => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }
  const books = await db.select().from(ulemaBooksTable)
    .where(eq(ulemaBooksTable.ulemId, id))
    .orderBy(asc(ulemaBooksTable.createdAt));
  res.json(books.map(toBookResponse));
});

router.post("/ulema/:id/books", async (req, res): Promise<void> => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }
  const { title, description, fileUrl, coverImageUrl } = req.body;
  if (!title || typeof title !== "string") {
    res.status(400).json({ error: "title is required" });
    return;
  }
  const [book] = await db.insert(ulemaBooksTable).values({
    ulemId: id,
    title: title.trim(),
    description: description?.trim() || null,
    fileUrl: fileUrl?.trim() || null,
    coverImageUrl: coverImageUrl?.trim() || null,
  }).returning();
  res.status(201).json(toBookResponse(book));
});

router.patch("/ulema/books/:bookId", async (req, res): Promise<void> => {
  const bookId = parseInt(req.params.bookId);
  if (isNaN(bookId)) { res.status(400).json({ error: "Invalid id" }); return; }
  const { title, description, fileUrl, coverImageUrl } = req.body;
  const updates: Record<string, unknown> = {};
  if (title !== undefined) updates.title = title?.trim();
  if (description !== undefined) updates.description = description?.trim() || null;
  if (fileUrl !== undefined) updates.fileUrl = fileUrl?.trim() || null;
  if (coverImageUrl !== undefined) updates.coverImageUrl = coverImageUrl?.trim() || null;
  const [book] = await db.update(ulemaBooksTable).set(updates)
    .where(eq(ulemaBooksTable.id, bookId)).returning();
  if (!book) { res.status(404).json({ error: "Not found" }); return; }
  res.json(toBookResponse(book));
});

router.delete("/ulema/books/:bookId", async (req, res): Promise<void> => {
  const bookId = parseInt(req.params.bookId);
  if (isNaN(bookId)) { res.status(400).json({ error: "Invalid id" }); return; }
  const [book] = await db.delete(ulemaBooksTable).where(eq(ulemaBooksTable.id, bookId)).returning();
  if (!book) { res.status(404).json({ error: "Not found" }); return; }
  res.sendStatus(204);
});

export default router;
