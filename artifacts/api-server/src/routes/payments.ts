import { Router, type IRouter } from "express";
import { eq, sql, and } from "drizzle-orm";
import { db, paymentsTable, usersTable } from "@workspace/db";

const router: IRouter = Router();

router.get("/payments", async (req, res): Promise<void> => {
  const { userId, status, method } = req.query as Record<string, string>;
  let query = db.select({
    id: paymentsTable.id,
    userId: paymentsTable.userId,
    amount: paymentsTable.amount,
    currency: paymentsTable.currency,
    method: paymentsTable.method,
    status: paymentsTable.status,
    transactionId: paymentsTable.transactionId,
    notes: paymentsTable.notes,
    paidAt: paymentsTable.paidAt,
    createdAt: paymentsTable.createdAt,
    updatedAt: paymentsTable.updatedAt,
    userName: usersTable.fullName,
    userEmail: usersTable.email,
    userRole: usersTable.role,
  })
  .from(paymentsTable)
  .leftJoin(usersTable, eq(paymentsTable.userId, usersTable.id));

  const conditions: ReturnType<typeof eq>[] = [];
  if (userId) conditions.push(eq(paymentsTable.userId, parseInt(userId)));
  if (status) conditions.push(eq(paymentsTable.status, status));
  if (method) conditions.push(eq(paymentsTable.method, method));

  const results = conditions.length > 0
    ? await query.where(and(...conditions) as any)
    : await query;

  res.json(results.map(p => ({
    id: p.id,
    userId: p.userId,
    amount: Number(p.amount),
    currency: p.currency,
    method: p.method,
    status: p.status,
    transactionId: p.transactionId ?? null,
    notes: p.notes ?? null,
    paidAt: p.paidAt?.toISOString() ?? null,
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
    userName: p.userName ?? null,
    userEmail: p.userEmail ?? null,
    userRole: p.userRole ?? null,
  })));
});

router.post("/payments", async (req, res): Promise<void> => {
  const { userId, amount, currency, method, transactionId, notes } = req.body;
  if (!userId || !amount || !method) {
    res.status(400).json({ message: "userId, amount, and method are required" });
    return;
  }

  const [payment] = await db.insert(paymentsTable).values({
    userId,
    amount: String(amount),
    currency: currency || "PKR",
    method,
    transactionId: transactionId || null,
    notes: notes || null,
    status: "pending",
  }).returning();

  res.status(201).json({
    id: payment.id,
    userId: payment.userId,
    amount: Number(payment.amount),
    currency: payment.currency,
    method: payment.method,
    status: payment.status,
    transactionId: payment.transactionId ?? null,
    notes: payment.notes ?? null,
    paidAt: payment.paidAt?.toISOString() ?? null,
    createdAt: payment.createdAt.toISOString(),
    updatedAt: payment.updatedAt.toISOString(),
  });
});

router.get("/payments/:id", async (req, res): Promise<void> => {
  const id = parseInt(req.params.id);
  const [payment] = await db.select().from(paymentsTable).where(eq(paymentsTable.id, id));
  if (!payment) { res.status(404).json({ message: "Not found" }); return; }
  res.json({
    id: payment.id,
    userId: payment.userId,
    amount: Number(payment.amount),
    currency: payment.currency,
    method: payment.method,
    status: payment.status,
    transactionId: payment.transactionId ?? null,
    notes: payment.notes ?? null,
    paidAt: payment.paidAt?.toISOString() ?? null,
    createdAt: payment.createdAt.toISOString(),
    updatedAt: payment.updatedAt.toISOString(),
  });
});

router.patch("/payments/:id", async (req, res): Promise<void> => {
  const id = parseInt(req.params.id);
  const { status, transactionId, notes, paidAt } = req.body;

  const updates: Record<string, any> = {};
  if (status) updates.status = status;
  if (transactionId !== undefined) updates.transactionId = transactionId;
  if (notes !== undefined) updates.notes = notes;
  if (paidAt !== undefined) updates.paidAt = paidAt ? new Date(paidAt) : null;
  if (status === "approved") updates.paidAt = new Date();

  const [updated] = await db.update(paymentsTable).set(updates).where(eq(paymentsTable.id, id)).returning();
  if (!updated) { res.status(404).json({ message: "Not found" }); return; }

  res.json({
    id: updated.id,
    userId: updated.userId,
    amount: Number(updated.amount),
    currency: updated.currency,
    method: updated.method,
    status: updated.status,
    transactionId: updated.transactionId ?? null,
    notes: updated.notes ?? null,
    paidAt: updated.paidAt?.toISOString() ?? null,
    createdAt: updated.createdAt.toISOString(),
    updatedAt: updated.updatedAt.toISOString(),
  });
});

export default router;
