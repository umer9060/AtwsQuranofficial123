import { useListUsers, useUpdateUser } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, XCircle, UserCheck, Clock, AlertTriangle, Eye } from "lucide-react";
import { Link } from "wouter";

export default function Verification() {
  const { data: users, isLoading, refetch } = useListUsers({});
  const updateMutation = useUpdateUser();
  const { toast } = useToast();

  const pendingStudents = users?.filter(u =>
    (u.role === "male_student" || u.role === "female_student") &&
    (u.status === "pending" || u.status === "trial")
  ) || [];

  const verifiedStudents = users?.filter(u =>
    (u.role === "male_student" || u.role === "female_student") && u.federationCode
  ) || [];

  const handleVerify = (user: any) => {
    const section = user.role === "female_student" ? "G" : "B";
    const year = new Date().getFullYear();
    const code = `WIF-${year}-${section}${String(user.id).padStart(3, "0")}`;
    updateMutation.mutate(
      { id: user.id, data: { federationCode: code, status: "verified" as any } },
      {
        onSuccess: () => { toast({ title: "Student verified!", description: `Federation code: ${code}` }); refetch(); },
        onError: (e) => toast({ title: "Failed", description: e.message, variant: "destructive" }),
      }
    );
  };

  const handleReject = (userId: number) => {
    updateMutation.mutate(
      { id: userId, data: { status: "suspended" as any } },
      {
        onSuccess: () => { toast({ title: "Verification rejected" }); refetch(); },
        onError: (e) => toast({ title: "Failed", description: e.message, variant: "destructive" }),
      }
    );
  };

  const handleActivate = (userId: number) => {
    updateMutation.mutate(
      { id: userId, data: { status: "active" as any } },
      {
        onSuccess: () => { toast({ title: "Student activated" }); refetch(); },
        onError: (e) => toast({ title: "Failed", description: e.message, variant: "destructive" }),
      }
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight font-serif text-primary">Student Verification</h2>
        <p className="text-muted-foreground">Review and verify student identity documents. Assign federation codes.</p>
      </div>

      {/* Summary */}
      <div className="grid gap-4 md:grid-cols-3">
        <SummaryCard
          icon={AlertTriangle}
          color="yellow"
          label="Awaiting Verification"
          count={pendingStudents.length}
          sub="Pending + Trial students"
        />
        <SummaryCard
          icon={UserCheck}
          color="green"
          label="Verified Students"
          count={verifiedStudents.length}
          sub="With federation codes"
        />
        <SummaryCard
          icon={Clock}
          color="blue"
          label="Total Students"
          count={(users?.filter(u => u.role === "male_student" || u.role === "female_student") || []).length}
          sub="All enrolled"
        />
      </div>

      {/* Pending Verification Queue */}
      <Card className="border-primary/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-yellow-500" />
            Pending Verification ({pendingStudents.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center p-8"><Spinner className="w-8 h-8 text-primary" /></div>
          ) : pendingStudents.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              <CheckCircle className="w-10 h-10 mx-auto mb-3 text-green-400" />
              <p className="font-medium">All students verified!</p>
              <p className="text-sm mt-1">No pending verifications.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {pendingStudents.map(student => (
                <div key={student.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/30 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${student.role === "female_student" ? "bg-pink-100 text-pink-600" : "bg-blue-100 text-blue-600"}`}>
                      {student.fullName[0]}
                    </div>
                    <div>
                      <p className="font-medium">{student.fullName}</p>
                      <p className="text-xs text-muted-foreground">{student.email} · {student.role === "female_student" ? "Girls Section" : "Boys Section"}</p>
                      {student.cnicNumber && <p className="text-xs text-muted-foreground">CNIC: {student.cnicNumber}</p>}
                      {student.phone && <p className="text-xs text-muted-foreground">Phone: {student.phone}</p>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className={student.status === "trial" ? "border-yellow-300 text-yellow-700 bg-yellow-50" : "border-blue-300 text-blue-700 bg-blue-50"}
                    >
                      {student.status === "trial" ? <><Clock className="w-3 h-3 mr-1" />Trial</> : <><AlertTriangle className="w-3 h-3 mr-1" />Pending</>}
                    </Badge>
                    <Link href={`/students/${student.id}`}>
                      <Button size="sm" variant="ghost" className="h-8 text-xs text-primary">
                        <Eye className="w-3.5 h-3.5 mr-1" /> View Profile
                      </Button>
                    </Link>
                    <Button
                      size="sm"
                      onClick={() => handleVerify(student)}
                      disabled={updateMutation.isPending}
                      className="h-8 text-xs bg-green-600 hover:bg-green-700 text-white"
                    >
                      <CheckCircle className="w-3.5 h-3.5 mr-1" /> Verify & Assign Code
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleReject(student.id)}
                      disabled={updateMutation.isPending}
                      className="h-8 text-xs text-red-600 border-red-200 hover:bg-red-50"
                    >
                      <XCircle className="w-3.5 h-3.5 mr-1" /> Reject
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Verified Students */}
      <Card className="border-primary/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-500" />
            Verified Students ({verifiedStudents.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {verifiedStudents.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-6">No verified students yet.</p>
          ) : (
            <div className="rounded-md border overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-muted/50 border-b">
                  <tr>
                    <th className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground">Name</th>
                    <th className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground">Section</th>
                    <th className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground">Level</th>
                    <th className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground">Federation Code</th>
                    <th className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground">Status</th>
                    <th className="px-4 py-2.5 text-right text-xs font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {verifiedStudents.map(s => (
                    <tr key={s.id} className="hover:bg-muted/20">
                      <td className="px-4 py-3">
                        <p className="font-medium">{s.fullName}</p>
                        <p className="text-xs text-muted-foreground">{s.email}</p>
                      </td>
                      <td className="px-4 py-3 capitalize">{s.section || (s.role === "female_student" ? "Girls" : "Boys")}</td>
                      <td className="px-4 py-3">{s.level ? `Level ${s.level}` : "—"}</td>
                      <td className="px-4 py-3 font-mono text-xs text-primary">{s.federationCode}</td>
                      <td className="px-4 py-3">
                        <Badge
                          variant={s.status === "active" ? "default" : "secondary"}
                          className={`capitalize ${s.status === "active" ? "bg-green-600" : ""}`}
                        >
                          {s.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          {s.status !== "active" && (
                            <Button size="sm" onClick={() => handleActivate(s.id)} className="h-7 text-xs bg-green-600 hover:bg-green-700 text-white">
                              Activate
                            </Button>
                          )}
                          <Link href={`/students/${s.id}`}>
                            <Button size="sm" variant="ghost" className="h-7 text-xs text-primary">Profile</Button>
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function SummaryCard({ icon: Icon, color, label, count, sub }: { icon: any; color: string; label: string; count: number; sub: string }) {
  const colorMap: Record<string, string> = {
    yellow: "bg-yellow-100 text-yellow-600",
    green: "bg-green-100 text-green-600",
    blue: "bg-blue-100 text-blue-600",
  };
  return (
    <Card className="border-primary/10">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${colorMap[color]}`}>
          <Icon className="w-4 h-4" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">{count}</div>
        <p className="text-xs text-muted-foreground mt-1">{sub}</p>
      </CardContent>
    </Card>
  );
}
