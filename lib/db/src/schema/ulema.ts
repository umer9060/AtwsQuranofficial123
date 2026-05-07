import { pgTable, text, serial, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const ulemaTable = pgTable("ulema", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  title: text("title"),
  facebookUrl: text("facebook_url"),
  youtubeUrl: text("youtube_url"),
  bio: text("bio"),
  imageUrl: text("image_url"),
  orderNum: integer("order_num").default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const ulemaBooksTable = pgTable("ulema_books", {
  id: serial("id").primaryKey(),
  ulemId: integer("ulem_id").notNull().references(() => ulemaTable.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description"),
  fileUrl: text("file_url"),
  coverImageUrl: text("cover_image_url"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertUlemSchema = createInsertSchema(ulemaTable).omit({ id: true, createdAt: true, updatedAt: true });
export const insertUlemBookSchema = createInsertSchema(ulemaBooksTable).omit({ id: true, createdAt: true });
export type InsertUlem = z.infer<typeof insertUlemSchema>;
export type InsertUlemBook = z.infer<typeof insertUlemBookSchema>;
export type Ulem = typeof ulemaTable.$inferSelect;
export type UlemBook = typeof ulemaBooksTable.$inferSelect;
