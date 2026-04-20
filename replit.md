# AtwsQuranofficial - Islamic LMS

## Overview

Full-stack Islamic Learning Management System (LMS) for AtwsQuranofficial. Built with React + Vite frontend and Express API backend.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **Frontend**: React + Vite, TailwindCSS, shadcn/ui, Wouter (routing)
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Features

- **Landing page** in Urdu/Arabic with Islamic branding
- **Authentication** (login/register) with role-based access (token stored in localStorage as `auth_token`)
- **Dashboard** with stats (students, courses, teachers, etc.)
- **Students & Teachers** management
- **Courses** with full CRUD (Qaida, Quran, Hifz, Tajweed, Hadith, Fiqh)
- **Lessons** management per course
- **Hadiths** library (Arabic + Urdu/English translations)
- **Live Classes** scheduling with Zoom links
- **Q&A Board** with student question submission + teacher answers
- **Payments** management
- **Student Verification** workflow
- **Global Search**
- **Mobile navigation** with hamburger sidebar

## Student Admission Form (register.tsx)

3-step wizard with:
1. Personal Details: fullName, username, email, phone, password, fatherName, age, gender, currentClass, lastEducation
2. Documents & Photo: profile photo upload (base64), CNIC/B-Form upload (base64)
   - Age < 18 → B-Form required (conditional label + text change)
   - Age ≥ 18 → CNIC required with format validation (XXXXX-XXXXXXX-X)
3. Review & Submit: summary of all data before final submission

## Teacher Profile Form (teachers.tsx AddTeacherDialog)

3-step dialog:
1. Basic Info: name, email, password, role, phone, bio, profile photo upload
2. Qualifications: education checkboxes, subject checkboxes, teaching experience, languages
3. Demo Videos: minimum 5 video URL links required (YouTube/Google Drive/etc.)

## Google Sheets Integration

Set `GOOGLE_SHEETS_WEBHOOK_URL` environment variable to a Google Apps Script web app URL.
All new student registrations auto-POST: name, email, phone, age, fatherName, cnicNumber, documentFileUrl, currentClass, lastEducation, role, status, registeredAt.

## Extended User DB Fields

New columns added to users table:
- `age`, `father_name`, `username`, `current_class`, `last_education`
- `profile_image_url`, `document_file_url` (base64 data URLs)
- `bio`, `teaching_experience`, `languages_spoken` (JSON array), `courses_studied`, `demo_video_urls` (JSON array)

## Roles

- `admin` — full access
- `teacher` / `female_teacher` / `qari` — manage courses, lessons, classes, hadiths
- `male_student` / `female_student` — view content

## Login Credentials (Demo)

- Admin: `admin@atwsquran.com` / `admin123`
- Teacher: `teacher@atwsquran.com` / `teacher123`
- Student: `student@atwsquran.com` / `student123`

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally
- `pnpm --filter @workspace/islamic-lms run dev` — run frontend locally

## Architecture

- `artifacts/islamic-lms/` — React Vite frontend
- `artifacts/api-server/` — Express API server
- `lib/api-spec/openapi.yaml` — OpenAPI spec (source of truth)
- `lib/api-client-react/` — Generated React Query hooks
- `lib/api-zod/` — Generated Zod schemas for validation
- `lib/db/` — Drizzle ORM database schemas
