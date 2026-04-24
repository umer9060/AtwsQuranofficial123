import { pgTable, text, serial, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const usersTable = pgTable("users", {
  id: serial("id").primaryKey(),
  fullName: text("full_name").notNull(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  phone: text("phone"),
  role: text("role").notNull().default("male_student"),
  gender: text("gender").notNull().default("male"),
  section: text("section"),
  level: integer("level"),
  status: text("status").notNull().default("pending"),
  federationCode: text("federation_code").unique(),
  cnicNumber: text("cnic_number"),
  trialStartDate: timestamp("trial_start_date", { withTimezone: true }),
  trialEndDate: timestamp("trial_end_date", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
  age: integer("age"),
  fatherName: text("father_name"),
  username: text("username").unique(),
  currentClass: text("current_class"),
  lastEducation: text("last_education"),
  profileImageUrl: text("profile_image_url"),
  documentFileUrl: text("document_file_url"),
  bio: text("bio"),
  teachingExperience: text("teaching_experience"),
  languagesSpoken: text("languages_spoken"),
  coursesStudied: text("courses_studied"),
  demoVideoUrls: text("demo_video_urls"),
  // ─── Admin assignment fields ───
  assignedTeacherId: integer("assigned_teacher_id"),
  whatsappGroupLink: text("whatsapp_group_link"),
  classLink: text("class_link"),
  classPlatform: text("class_platform"),  // zoom | meet | teams | telegram | imo
  feeStatus: text("fee_status").notNull().default("unpaid"),  // paid | unpaid
  course: text("course"),
  qualification: text("qualification"),
  experience: text("experience"),
  languagePreference: text("language_preference").notNull().default("ur"),
});

export const insertUserSchema = createInsertSchema(usersTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof usersTable.$inferSelect;
