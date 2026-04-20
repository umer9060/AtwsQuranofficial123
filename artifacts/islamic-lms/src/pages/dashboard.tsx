import { useGetDashboardStats, useGetAdminStats, useListUsers, useListPayments } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, BookOpen, Video, BookText, CreditCard, TrendingUp, Clock, UserCheck, AlertTriangle, UserX, Activity, ArrowRight } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { Link } from "wouter";

export default function Dashboard() {
  const { data: stats, isLoading: statsLoading } = useGetDashboardStats();
  const { data: adminStats, isLoading: adminLoading } = useGetAdminStats();
  const { data: users } = useListUsers({});
  const { data: payments } = useListPayments({});

  const isLoading = statsLoading || adminLoading;

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Spinner className="w-8 h-8 text-primary" />
      </div>
    );
  }

  const recentStudents = users
    ?.filter(u => u.role === "male_student" || u.role === "female_student")
    .slice(0, 5) || [];

  const pendingPayments = payments?.filter(p => p.status === "pending").slice(0, 5) || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-3xl font-bold tracking-tight font-serif text-primary">Dashboard</h2>
        <p className="text-muted-foreground">AtwsQuranofficial — Academy Overview</p>
      </div>

      {/* Primary Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Students"
          value={stats?.totalStudents ?? 0}
          desc={`${stats?.boysCount ?? 0} Boys · ${stats?.girlsCount ?? 0} Girls`}
          icon={Users}
          color="blue"
        />
        <StatCard
          title="Total Teachers"
          value={stats?.totalTeachers ?? 0}
          desc="Male · Female · Qari"
          icon={UserCheck}
          color="green"
        />
        <StatCard
          title="Active Courses"
          value={stats?.activeCourses ?? 0}
          desc={`${stats?.totalLessons ?? 0} lessons total`}
          icon={BookOpen}
          color="purple"
        />
        <StatCard
          title="Live Classes"
          value={stats?.upcomingClassesCount ?? 0}
          desc="Scheduled upcoming"
          icon={Video}
          color="orange"
        />
      </div>

      {/* Admin Revenue Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <StatCard
          title="Total Revenue"
          value={`PKR ${(adminStats?.totalRevenue ?? 0).toLocaleString()}`}
          desc={`PKR ${(adminStats?.monthlyRevenue ?? 0).toLocaleString()} this month`}
          icon={TrendingUp}
          color="green"
        />
        <StatCard
          title="Trial Users"
          value={adminStats?.trialUsers ?? 0}
          desc={`${adminStats?.expiredTrials ?? 0} expired`}
          icon={Clock}
          color="orange"
        />
        <StatCard
          title="Paid Users"
          value={adminStats?.paidUsers ?? 0}
          desc={`${adminStats?.approvedPayments ?? 0} payments approved`}
          icon={CreditCard}
          color="blue"
        />
        <StatCard
          title="Pending Actions"
          value={(adminStats?.pendingPayments ?? 0) + (stats?.pendingVerifications ?? 0)}
          desc={`${adminStats?.pendingPayments ?? 0} payments · ${stats?.pendingVerifications ?? 0} verifications`}
          icon={AlertTriangle}
          color="red"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {/* Trial vs Paid breakdown */}
        <Card className="shadow-sm border-primary/10">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Student Status Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <StatusRow label="Active (Paid)" value={adminStats?.paidUsers ?? 0} color="bg-green-500" />
            <StatusRow label="Trial Users" value={adminStats?.trialUsers ?? 0} color="bg-yellow-500" />
            <StatusRow label="Expired Trials" value={adminStats?.expiredTrials ?? 0} color="bg-red-500" />
            <StatusRow label="Pending Verification" value={stats?.pendingVerifications ?? 0} color="bg-blue-500" />
            <div className="pt-2">
              <Link href="/admin/payments">
                <span className="text-xs text-primary hover:underline flex items-center gap-1">
                  View payment details <ArrowRight className="w-3 h-3" />
                </span>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Recent Registrations */}
        <Card className="shadow-sm border-primary/10">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center justify-between">
              Recent Registrations
              <Link href="/students">
                <span className="text-xs text-primary hover:underline">View all</span>
              </Link>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentStudents.length === 0 ? (
              <p className="text-sm text-muted-foreground">No students yet.</p>
            ) : (
              <div className="space-y-2">
                {recentStudents.map(s => (
                  <div key={s.id} className="flex items-center justify-between text-sm">
                    <div>
                      <p className="font-medium leading-none">{s.fullName}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{s.email}</p>
                    </div>
                    <Badge
                      variant={s.status === "active" ? "default" : s.status === "trial" ? "secondary" : "outline"}
                      className="capitalize text-xs"
                    >
                      {s.status}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pending Payments */}
        <Card className="shadow-sm border-primary/10">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center justify-between">
              Pending Payments
              <Link href="/admin/payments">
                <span className="text-xs text-primary hover:underline">View all</span>
              </Link>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {pendingPayments.length === 0 ? (
              <p className="text-sm text-muted-foreground">No pending payments.</p>
            ) : (
              <div className="space-y-2">
                {pendingPayments.map((p: any) => (
                  <div key={p.id} className="flex items-center justify-between text-sm">
                    <div>
                      <p className="font-medium leading-none">{p.userName || "Unknown"}</p>
                      <p className="text-xs text-muted-foreground mt-0.5 capitalize">{p.method} · PKR {Number(p.amount).toLocaleString()}</p>
                    </div>
                    <Badge variant="secondary" className="text-xs">Pending</Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Links */}
      <div className="grid gap-3 md:grid-cols-4">
        {[
          { label: "Verify Students", href: "/admin/verification", icon: UserCheck, desc: `${stats?.pendingVerifications ?? 0} pending` },
          { label: "Manage Payments", href: "/admin/payments", icon: CreditCard, desc: `${adminStats?.pendingPayments ?? 0} to approve` },
          { label: "Hadith Library", href: "/hadiths", icon: BookText, desc: `${stats?.totalHadiths ?? 0} entries` },
          { label: "Q&A Board", href: "/qna", icon: Activity, desc: `${stats?.pendingQuestions ?? 0} unanswered` },
        ].map(item => (
          <Link key={item.href} href={item.href}>
            <Card className="shadow-sm border-primary/10 hover:border-primary/30 hover:shadow-md transition-all cursor-pointer">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                  <item.icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-medium text-sm">{item.label}</p>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}

function StatCard({ title, value, desc, icon: Icon, color }: { title: string; value: string | number; desc: string; icon: any; color: string }) {
  const colorMap: Record<string, string> = {
    blue: "bg-blue-100 text-blue-600",
    green: "bg-green-100 text-green-600",
    purple: "bg-purple-100 text-purple-600",
    orange: "bg-orange-100 text-orange-600",
    red: "bg-red-100 text-red-600",
  };
  return (
    <Card className="shadow-sm border-primary/10">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${colorMap[color] || "bg-primary/10 text-primary"}`}>
          <Icon className="w-4 h-4" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-foreground">{value}</div>
        <p className="text-xs text-muted-foreground mt-1">{desc}</p>
      </CardContent>
    </Card>
  );
}

function StatusRow({ label, value, color }: { label: string; value: number; color: string }) {
  const total = Math.max(value, 1);
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium">{value}</span>
      </div>
      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full`} style={{ width: `${Math.min((value / Math.max(total, 10)) * 100, 100)}%` }} />
      </div>
    </div>
  );
}
