import { useListUsers, useUpdateUser, useDeleteUser } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { Spinner } from "@/components/ui/spinner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { Users, UserCheck, Clock, ShieldOff, Search, Trash2 } from "lucide-react";

export default function Students() {
  const [search, setSearch] = useState("");
  const [genderFilter, setGenderFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [levelFilter, setLevelFilter] = useState("all");

  const { data: users, isLoading, refetch } = useListUsers({
    search: search || undefined,
    gender: genderFilter !== "all" ? genderFilter : undefined,
  });

  const updateMutation = useUpdateUser();
  const deleteMutation = useDeleteUser();
  const { toast } = useToast();

  const allStudents = users?.filter(u => u.role === "male_student" || u.role === "female_student") || [];

  const students = allStudents.filter(s => {
    if (statusFilter !== "all" && s.status !== statusFilter) return false;
    if (levelFilter !== "all" && String(s.level) !== levelFilter) return false;
    return true;
  });

  const maleCount = allStudents.filter(s => s.role === "male_student").length;
  const femaleCount = allStudents.filter(s => s.role === "female_student").length;
  const trialCount = allStudents.filter(s => s.status === "trial").length;
  const activeCount = allStudents.filter(s => s.status === "active").length;
  const pendingCount = allStudents.filter(s => s.status === "pending").length;

  const handleStatusChange = (userId: number, status: string) => {
    updateMutation.mutate(
      { id: userId, data: { status: status as any } },
      {
        onSuccess: () => { toast({ title: `Student ${status}` }); refetch(); },
        onError: (e) => toast({ title: "Failed", description: e.message, variant: "destructive" }),
      }
    );
  };

  const handleDelete = (userId: number, name: string) => {
    if (confirm(`Delete ${name}? This cannot be undone.`)) {
      deleteMutation.mutate(
        { id: userId },
        {
          onSuccess: () => { toast({ title: "Student deleted" }); refetch(); },
          onError: (e) => toast({ title: "Failed", description: e.message, variant: "destructive" }),
        }
      );
    }
  };

  const statusConfig: Record<string, { label: string; className: string }> = {
    active: { label: "Active", className: "bg-green-100 text-green-700 border-green-200" },
    trial: { label: "Trial", className: "bg-yellow-100 text-yellow-700 border-yellow-200" },
    pending: { label: "Pending", className: "bg-blue-100 text-blue-700 border-blue-200" },
    suspended: { label: "Suspended", className: "bg-red-100 text-red-700 border-red-200" },
    verified: { label: "Verified", className: "bg-green-100 text-green-700 border-green-200" },
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight font-serif text-primary">Students</h2>
        <p className="text-muted-foreground">Manage enrolled students — Boys and Girls sections.</p>
      </div>

      {/* Summary */}
      <div className="grid gap-3 md:grid-cols-5">
        <SummaryTile label="Total" value={allStudents.length} icon={Users} color="blue" onClick={() => { setGenderFilter("all"); setStatusFilter("all"); }} />
        <SummaryTile label="Boys" value={maleCount} icon={Users} color="blue" onClick={() => setGenderFilter("male")} />
        <SummaryTile label="Girls" value={femaleCount} icon={Users} color="pink" onClick={() => setGenderFilter("female")} />
        <SummaryTile label="Trial" value={trialCount} icon={Clock} color="yellow" onClick={() => setStatusFilter("trial")} />
        <SummaryTile label="Pending" value={pendingCount} icon={UserCheck} color="orange" onClick={() => setStatusFilter("pending")} />
      </div>

      {/* Filters */}
      <Card className="border-primary/10">
        <CardContent className="pt-4 pb-3">
          <div className="flex flex-col md:flex-row gap-3 items-start md:items-center">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                className="pl-9"
                placeholder="Search by name, email..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              <Select value={genderFilter} onValueChange={setGenderFilter}>
                <SelectTrigger className="w-32 h-9 text-sm"><SelectValue placeholder="Gender" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Genders</SelectItem>
                  <SelectItem value="male">Boys</SelectItem>
                  <SelectItem value="female">Girls</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32 h-9 text-sm"><SelectValue placeholder="Status" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="trial">Trial</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
              <Select value={levelFilter} onValueChange={setLevelFilter}>
                <SelectTrigger className="w-28 h-9 text-sm"><SelectValue placeholder="Level" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  {[1,2,3,4,5,6].map(l => <SelectItem key={l} value={String(l)}>Level {l}</SelectItem>)}
                </SelectContent>
              </Select>
              {(genderFilter !== "all" || statusFilter !== "all" || levelFilter !== "all" || search) && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-9 text-xs text-muted-foreground"
                  onClick={() => { setGenderFilter("all"); setStatusFilter("all"); setLevelFilter("all"); setSearch(""); }}
                >
                  Clear filters
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="border-primary/10">
        <CardHeader>
          <CardTitle className="text-base">
            {students.length} student{students.length !== 1 ? "s" : ""}
            {statusFilter !== "all" && ` · ${statusFilter}`}
            {genderFilter !== "all" && ` · ${genderFilter === "male" ? "Boys" : "Girls"}`}
            {levelFilter !== "all" && ` · Level ${levelFilter}`}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center p-8"><Spinner className="text-primary w-8 h-8" /></div>
          ) : students.length === 0 ? (
            <div className="text-center p-10 text-muted-foreground">
              <Users className="w-10 h-10 mx-auto mb-3 opacity-20" />
              <p>No students found matching your filters.</p>
            </div>
          ) : (
            <div className="rounded-md border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50 border-b">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Student</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Section</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Level</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Federation Code</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Status</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {students.map(student => {
                      const isFemale = student.role === "female_student";
                      const sc = statusConfig[student.status] || { label: student.status, className: "bg-gray-100 text-gray-700 border-gray-200" };
                      return (
                        <tr key={student.id} className="hover:bg-muted/20 transition-colors">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${isFemale ? "bg-pink-100 text-pink-600" : "bg-blue-100 text-blue-600"}`}>
                                {student.fullName[0]}
                              </div>
                              <div>
                                <p className="font-medium">{student.fullName}</p>
                                <p className="text-xs text-muted-foreground">{student.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${isFemale ? "bg-pink-50 text-pink-600" : "bg-blue-50 text-blue-600"}`}>
                              {isFemale ? "Girls" : "Boys"}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-muted-foreground">{student.level ? `Level ${student.level}` : "—"}</td>
                          <td className="px-4 py-3 font-mono text-xs text-primary">{student.federationCode || "—"}</td>
                          <td className="px-4 py-3">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${sc.className}`}>
                              {sc.label}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center justify-end gap-1">
                              {student.status === "pending" && (
                                <Button size="sm" onClick={() => handleStatusChange(student.id, "active")} className="h-7 text-xs bg-green-600 hover:bg-green-700 text-white">
                                  Approve
                                </Button>
                              )}
                              {student.status !== "suspended" ? (
                                <Button size="sm" variant="outline" onClick={() => handleStatusChange(student.id, "suspended")} className="h-7 text-xs text-red-600 border-red-200 hover:bg-red-50">
                                  <ShieldOff className="w-3 h-3" />
                                </Button>
                              ) : (
                                <Button size="sm" variant="outline" onClick={() => handleStatusChange(student.id, "active")} className="h-7 text-xs text-green-600 border-green-200 hover:bg-green-50">
                                  Unblock
                                </Button>
                              )}
                              <Link href={`/students/${student.id}`}>
                                <Button size="sm" variant="ghost" className="h-7 text-xs text-primary">Profile</Button>
                              </Link>
                              <Button size="sm" variant="ghost" onClick={() => handleDelete(student.id, student.fullName)} className="h-7 w-7 p-0 text-muted-foreground hover:text-red-600">
                                <Trash2 className="w-3.5 h-3.5" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function SummaryTile({ label, value, icon: Icon, color, onClick }: { label: string; value: number; icon: any; color: string; onClick: () => void }) {
  const colorMap: Record<string, string> = {
    blue: "bg-blue-50 border-blue-100 hover:border-blue-300",
    pink: "bg-pink-50 border-pink-100 hover:border-pink-300",
    yellow: "bg-yellow-50 border-yellow-100 hover:border-yellow-300",
    orange: "bg-orange-50 border-orange-100 hover:border-orange-300",
  };
  const textMap: Record<string, string> = {
    blue: "text-blue-600",
    pink: "text-pink-600",
    yellow: "text-yellow-600",
    orange: "text-orange-600",
  };
  return (
    <button onClick={onClick} className={`rounded-lg border p-3 text-left transition-all cursor-pointer w-full ${colorMap[color]}`}>
      <div className={`text-2xl font-bold ${textMap[color]}`}>{value}</div>
      <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
        <Icon className={`w-3 h-3 ${textMap[color]}`} />
        {label}
      </div>
    </button>
  );
}
