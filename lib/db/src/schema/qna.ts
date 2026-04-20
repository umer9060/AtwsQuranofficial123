import { pgTable, text, serial, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const qnaTable = pgTable("qna", {
  id: serial("id").primaryKey(),
  courseId: integer("course_id"),
  studentId: integer("student_id").notNull(),
  teacherId: integer("teacher_id"),
  question: text("question").notNull(),
  answer: text("answer"),
  status: text("status").notNull().default("pending"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const insertQnaSchema = createInsertSchema(qnaTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertQna = z.infer<typeof insertQnaSchema>;
export type Qna = typeof qnaTable.$inferSelect;
