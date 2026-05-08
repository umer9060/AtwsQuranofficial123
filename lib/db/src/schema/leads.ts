import { pgTable, text, serial, timestamp, integer } from "drizzle-orm/pg-core";

export const leadsTable = pgTable("leads", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  phone: text("phone").notNull(),
  age: integer("age"),
  city: text("city"),
  gender: text("gender").notNull(),
  course: text("course").notNull(),
  currentLevel: text("current_level"),
  note: text("note"),
  formType: text("form_type"),
  utmSource: text("utm_source"),
  utmCampaign: text("utm_campaign"),
  status: text("status").notNull().default("new"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type Lead = typeof leadsTable.$inferSelect;
