import { Router, type IRouter } from "express";
import { eq, count, gt, sum } from "drizzle-orm";
import { db, usersTable, coursesTable, lessonsTable, hadithsTable, liveClassesTable, qnaTable, activityLogTable, paymentsTable } from "@workspace/db";
import { sql } from "drizzle-orm";

const router: IRouter = Router();

router.get("/dashboard/stats", async (req, res): Promise<void> => {
  const [students, teachers, courses, lessons, hadiths, upcomingClasses, pendingQna, pendingVerifications, trialStudents] = await Promise.all([
    db.select({ count: count() }).from(usersTable).where(eq(usersTable.role, "male_student")),
    db.select({ count: count() }).from(usersTable).where(
      sql`${usersTable.role} IN ('teacher', 'female_teacher', 'qari')`
    ),
    db.select({ count: count() }).from(coursesTable),
    db.select({ count: count() }).from(lessonsTable),
    db.select({ count: count() }).from(hadithsTable),
    db.select({ count: count() }).from(liveClassesTable).where(eq(liveClassesTable.status, "scheduled")),
    db.select({ count: count() }).from(qnaTable).where(eq(qnaTable.status, "pending")),
    db.select({ count: count() }).from(usersTable).where(eq(usersTable.status, "pending")),
    db.select({ count: count() }).from(usersTable).where(eq(usersTable.status, "trial")),
  ]);

  const [maleStudents, femaleStudents, activeCourses] = await Promise.all([
    db.select({ count: count() }).from(usersTable).where(
      sql`${usersTable.role} = 'male_student'`
    ),
    db.select({ count: count() }).from(usersTable).where(
      sql`${usersTable.role} = 'female_student'`
    ),
    db.select({ count: count() }).from(coursesTable),
  ]);

  const totalStudents = (students[0]?.count ?? 0) + (femaleStudents[0]?.count ?? 0);

  res.json({
    totalStudents: totalStudents,
    boysCount: maleStudents[0]?.count ?? 0,
    girlsCount: femaleStudents[0]?.count ?? 0,
    totalTeachers: teachers[0]?.count ?? 0,
    totalCourses: courses[0]?.count ?? 0,
    activeCourses: activeCourses[0]?.count ?? 0,
    pendingVerifications: pendingVerifications[0]?.count ?? 0,
    upcomingClassesCount: upcomingClasses[0]?.count ?? 0,
    totalLessons: lessons[0]?.count ?? 0,
    totalHadiths: hadiths[0]?.count ?? 0,
    pendingQuestions: pendingQna[0]?.count ?? 0,
    trialStudents: trialStudents[0]?.count ?? 0,
  });
});

router.get("/dashboard/recent-activity", async (req, res): Promise<void> => {
  const activities = await db.select().from(activityLogTable).orderBy(sql`${activityLogTable.createdAt} DESC`).limit(20);
  res.json(activities.map(a => ({
    id: a.id,
    type: a.type,
    description: a.description,
    actorName: a.actorName,
    createdAt: a.createdAt.toISOString(),
  })));
});

router.get("/dashboard/enrollment-breakdown", async (req, res): Promise<void> => {
  const [bySection, byCourse] = await Promise.all([
    db.select({
      section: usersTable.section,
      count: count(),
    }).from(usersTable).where(
      sql`${usersTable.role} IN ('male_student', 'female_student')`
    ).groupBy(usersTable.section),
    db.select({
      courseType: coursesTable.type,
      count: count(),
    }).from(coursesTable).groupBy(coursesTable.type),
  ]);

  const levels = [1, 2, 3, 4, 5, 6];
  const byLevel = await Promise.all(levels.map(async (level) => {
    const [boys, girls] = await Promise.all([
      db.select({ count: count() }).from(usersTable).where(
        sql`${usersTable.role} = 'male_student' AND ${usersTable.level} = ${level}`
      ),
      db.select({ count: count() }).from(usersTable).where(
        sql`${usersTable.role} = 'female_student' AND ${usersTable.level} = ${level}`
      ),
    ]);
    return {
      level,
      boysCount: boys[0]?.count ?? 0,
      girlsCount: girls[0]?.count ?? 0,
    };
  }));

  res.json({
    bySection: bySection.map(s => ({
      section: s.section ?? "unassigned",
      count: s.count,
    })),
    byLevel,
    byCourse: byCourse.map(c => ({
      courseType: c.courseType,
      count: c.count,
    })),
  });
});

router.get("/dashboard/upcoming-classes", async (req, res): Promise<void> => {
  const classes = await db.select().from(liveClassesTable)
    .where(eq(liveClassesTable.status, "scheduled"))
    .orderBy(liveClassesTable.scheduledAt)
    .limit(10);

  res.json(classes.map(c => ({
    id: c.id,
    courseId: c.courseId,
    title: c.title,
    teacherId: c.teacherId,
    zoomLink: c.zoomLink ?? null,
    zoomMeetingId: c.zoomMeetingId ?? null,
    scheduledAt: c.scheduledAt.toISOString(),
    durationMinutes: c.durationMinutes,
    status: c.status,
    gender: c.gender,
    createdAt: c.createdAt.toISOString(),
    updatedAt: c.updatedAt.toISOString(),
  })));
});

router.get("/dashboard/admin-stats", async (req, res): Promise<void> => {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const [
    totalRevenueResult,
    monthlyRevenueResult,
    pendingPaymentsResult,
    approvedPaymentsResult,
    trialUsersResult,
    paidUsersResult,
    expiredTrialsResult,
    recentRegistrationsResult,
  ] = await Promise.all([
    db.select({ total: sum(paymentsTable.amount) }).from(paymentsTable).where(eq(paymentsTable.status, "approved")),
    db.select({ total: sum(paymentsTable.amount) }).from(paymentsTable).where(
      sql`${paymentsTable.status} = 'approved' AND ${paymentsTable.paidAt} >= ${startOfMonth.toISOString()}`
    ),
    db.select({ count: count() }).from(paymentsTable).where(eq(paymentsTable.status, "pending")),
    db.select({ count: count() }).from(paymentsTable).where(eq(paymentsTable.status, "approved")),
    db.select({ count: count() }).from(usersTable).where(eq(usersTable.status, "trial")),
    db.select({ count: count() }).from(usersTable).where(eq(usersTable.status, "active")),
    db.select({ count: count() }).from(usersTable).where(
      sql`${usersTable.status} = 'trial' AND ${usersTable.trialEndDate} < ${now.toISOString()}`
    ),
    db.select({ count: count() }).from(usersTable).where(
      sql`${usersTable.createdAt} >= ${startOfMonth.toISOString()}`
    ),
  ]);

  res.json({
    totalRevenue: Number(totalRevenueResult[0]?.total ?? 0),
    monthlyRevenue: Number(monthlyRevenueResult[0]?.total ?? 0),
    pendingPayments: pendingPaymentsResult[0]?.count ?? 0,
    approvedPayments: approvedPaymentsResult[0]?.count ?? 0,
    trialUsers: trialUsersResult[0]?.count ?? 0,
    paidUsers: paidUsersResult[0]?.count ?? 0,
    expiredTrials: expiredTrialsResult[0]?.count ?? 0,
    recentRegistrations: recentRegistrationsResult[0]?.count ?? 0,
  });
});

export default router;
