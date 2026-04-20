import { pgTable, text, serial, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const hadithsTable = pgTable("hadiths", {
  id: serial("id").primaryKey(),
  courseId: integer("course_id"),
  arabicText: text("arabic_text").notNull(),
  urduTranslation: text("urdu_translation"),
  englishTranslation: text("english_translation"),
  narrator: text("narrator"),
  source: text("source"),
  status: text("status").notNull().default("sahih"),
  keywords: text("keywords"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const insertHadithSchema = createInsertSchema(hadithsTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertHadith = z.infer<typeof insertHadithSchema>;
export type Hadith = typeof hadithsTable.$inferSelect;
