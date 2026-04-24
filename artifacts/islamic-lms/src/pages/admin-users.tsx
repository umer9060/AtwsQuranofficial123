import { useListUsers, useCreateUser, useUpdateUser, useDeleteUser, CreateUserBodyRole, CreateUserBodyGender, UpdateUserBodyStatus } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Spinner } from "@/components/ui/spinner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Search, UserPlus, ShieldAlert, Trash2, Settings, KeyRound, DollarSign } from "lucide-react";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "";

async function adminUpdate(id: number, data: Record<string, unknown>) {
  const token = localStorage.getItem("auth_token") || "";
  const res = await fetch(`${API_BASE}/users/${id}/admin-update`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const e = await res.json().catch(() => ({}));
    throw new Error(e.error || `Request failed (${res.status})`);
  }
  return res.json();
}

export default function AdminUsers() {
  const [search, setSearch] = useState("");
  const { data: users, isLoading, refetch } = useListUsers({ search: search || undefined });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight font-serif text-primary">User Management</h2>
          <p className="text-muted-foreground">Admin control panel for all platform users.</p>
        </div>
        <CreateUserDialog onCreated={refetch} />
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <CardTitle>All Users</CardTitle>
            <div className="relative w-full md:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                className="pl-8"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center p-8"><Spinner className="w-8 h-8 text-primary" /></div>
          ) : !users || users.length === 0 ? (
            <div className="text-center p-8 text-muted-foreground">No users found.</div>
          ) : (
            <div className="rounded-md border">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-muted-foreground bg-muted/50 border-b">
                    <tr>
                      <th className="px-4 py-3 font-medium">Name</th>
                      <th className="px-4 py-3 font-medium">Role</th>
                      <th className="px-4 py-3 font-medium">Status</th>
                      <th className="px-4 py-3 font-medium text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {users.map((user) => (
                      <tr key={user.id} className="hover:bg-muted/30">
                        <td className="px-4 py-3">
                          <div className="font-medium text-foreground">{user.fullName}</div>
                          <div className="text-muted-foreground text-xs">{user.email}</div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="capitalize">{user.role.replace("_", " ")}</span>
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant={user.status === "active" || user.status === "verified" ? "default" : user.status === "suspended" ? "destructive" : "secondary"}>
                            {user.status}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <UserActions user={user} onUpdate={refetch} />
                        </td>
                      </tr>
                    ))}
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

function CreateUserDialog({ onCreated }: { onCreated: () => void }) {
  const [open, setOpen] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<CreateUserBodyRole>("male_student");
  const [gender, setGender] = useState<CreateUserBodyGender>("male");
  
  const createMutation = useCreateUser();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(
      {
        data: {
          fullName,
          email,
          password,
          role,
          gender,
          section: role === "male_student" ? "boys" : role === "female_student" ? "girls" : null
        }
      },
      {
        onSuccess: () => {
          toast({ title: "User created successfully" });
          setOpen(false);
          setFullName("");
          setEmail("");
          setPassword("");
          onCreated();
        },
        onError: (err) => {
          toast({ title: "Creation failed", description: err.message, variant: "destructive" });
        }
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2"><UserPlus className="w-4 h-4" /> Add User</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New User</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" value={fullName} onChange={e => setFullName(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Role</Label>
              <Select value={role} onValueChange={(v: CreateUserBodyRole) => setRole(v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="teacher">Teacher</SelectItem>
                  <SelectItem value="female_teacher">Female Teacher</SelectItem>
                  <SelectItem value="qari">Qari</SelectItem>
                  <SelectItem value="male_student">Male Student</SelectItem>
                  <SelectItem value="female_student">Female Student</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Gender</Label>
              <Select value={gender} onValueChange={(v: CreateUserBodyGender) => setGender(v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-end pt-4">
            <Button type="submit" disabled={createMutation.isPending}>
              {createMutation.isPending ? "Creating..." : "Create User"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function UserActions({ user, onUpdate }: { user: any, onUpdate: () => void }) {
  const updateMutation = useUpdateUser();
  const deleteMutation = useDeleteUser();
  const { toast } = useToast();

  const handleStatusChange = (status: UpdateUserBodyStatus) => {
    updateMutation.mutate(
      { id: user.id, data: { status } },
      {
        onSuccess: () => {
          toast({ title: `User marked as ${status}` });
          onUpdate();
        },
        onError: (err) => {
          toast({ title: "Update failed", description: err.message, variant: "destructive" });
        }
      }
    );
  };

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this user?")) {
      deleteMutation.mutate(
        { id: user.id },
        {
          onSuccess: () => {
            toast({ title: "User deleted" });
            onUpdate();
          }
        }
      );
    }
  };

  const handleFeeToggle = async () => {
    const newStatus = user.feeStatus === "paid" ? "unpaid" : "paid";
    try {
      await adminUpdate(user.id, { feeStatus: newStatus });
      toast({ title: `Fee marked as ${newStatus}` });
      onUpdate();
    } catch (e: any) {
      toast({ title: "Failed", description: e.message, variant: "destructive" });
    }
  };

  return (
    <div className="flex items-center justify-end gap-1.5 flex-wrap">
      {user.status === "pending" && (
        <Button variant="outline" size="sm" onClick={() => handleStatusChange("active")} className="h-8 px-2 text-green-700 border-green-300 hover:bg-green-50">
          ✓ Approve
        </Button>
      )}
      {user.status !== "suspended" ? (
        <Button variant="outline" size="sm" onClick={() => handleStatusChange("suspended")} className="h-8 px-2 text-destructive border-destructive/20 hover:bg-destructive/10">
          <ShieldAlert className="w-4 h-4 mr-1" /> Block
        </Button>
      ) : (
        <Button variant="outline" size="sm" onClick={() => handleStatusChange("active")} className="h-8 px-2 text-green-600 border-green-200 hover:bg-green-50">
          Unblock
        </Button>
      )}
      <Button
        variant="outline"
        size="sm"
        onClick={handleFeeToggle}
        className={`h-8 px-2 ${user.feeStatus === "paid" ? "text-green-700 border-green-200 bg-green-50" : "text-amber-700 border-amber-200 bg-amber-50"}`}
        title="Toggle fee status"
      >
        <DollarSign className="w-3.5 h-3.5 mr-0.5" />
        {user.feeStatus === "paid" ? "Paid" : "Unpaid"}
      </Button>
      <AssignDialog user={user} onSaved={onUpdate} />
      <ResetPasswordDialog user={user} />
      <Button variant="ghost" size="icon" onClick={handleDelete} className="h-8 w-8 text-muted-foreground hover:text-destructive">
        <Trash2 className="w-4 h-4" />
      </Button>
    </div>
  );
}

function AssignDialog({ user, onSaved }: { user: any; onSaved: () => void }) {
  const [open, setOpen] = useState(false);
  const [teacherId, setTeacherId] = useState<string>(user.assignedTeacherId?.toString() ?? "none");
  const [whatsappLink, setWhatsappLink] = useState(user.whatsappGroupLink ?? "");
  const [classLink, setClassLink] = useState(user.classLink ?? "");
  const [classPlatform, setClassPlatform] = useState(user.classPlatform ?? "zoom");
  const [course, setCourse] = useState(user.course ?? "");
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();
  const { data: allUsers } = useListUsers({ role: "teacher" });

  const handleSave = async () => {
    setSaving(true);
    try {
      await adminUpdate(user.id, {
        assignedTeacherId: teacherId === "none" ? null : parseInt(teacherId, 10),
        whatsappGroupLink: whatsappLink.trim(),
        classLink: classLink.trim(),
        classPlatform,
        course: course.trim(),
      });
      toast({ title: "Assignment saved" });
      setOpen(false);
      onSaved();
    } catch (e: any) {
      toast({ title: "Save failed", description: e.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 px-2 text-blue-700 border-blue-200 hover:bg-blue-50">
          <Settings className="w-3.5 h-3.5 mr-1" /> Assign
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Assign — {user.fullName}</DialogTitle>
        </DialogHeader>
        <div className="space-y-3 py-2">
          <div className="space-y-1">
            <Label>Teacher</Label>
            <Select value={teacherId} onValueChange={setTeacherId}>
              <SelectTrigger><SelectValue placeholder="Select teacher" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                {allUsers?.filter((u: any) => u.role?.includes("teacher") || u.role === "qari").map((t: any) => (
                  <SelectItem key={t.id} value={String(t.id)}>{t.fullName} ({t.role})</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label>Course</Label>
            <Input value={course} onChange={e => setCourse(e.target.value)} placeholder="e.g. Noorani Qaida, Nazra, Tajweed" />
          </div>
          <div className="space-y-1">
            <Label>WhatsApp Group Link</Label>
            <Input value={whatsappLink} onChange={e => setWhatsappLink(e.target.value)} placeholder="https://chat.whatsapp.com/..." dir="ltr" />
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div className="space-y-1 col-span-1">
              <Label>Platform</Label>
              <Select value={classPlatform} onValueChange={setClassPlatform}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="zoom">Zoom</SelectItem>
                  <SelectItem value="meet">Google Meet</SelectItem>
                  <SelectItem value="teams">MS Teams</SelectItem>
                  <SelectItem value="telegram">Telegram</SelectItem>
                  <SelectItem value="imo">IMO</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1 col-span-2">
              <Label>Class Link</Label>
              <Input value={classLink} onChange={e => setClassLink(e.target.value)} placeholder="https://..." dir="ltr" />
            </div>
          </div>
          <Button onClick={handleSave} disabled={saving} className="w-full">
            {saving ? "Saving..." : "Save Assignment"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function ResetPasswordDialog({ user }: { user: any }) {
  const [open, setOpen] = useState(false);
  const [pw, setPw] = useState("");
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const handleReset = async () => {
    if (pw.length < 6) {
      toast({ title: "Password must be 6+ characters", variant: "destructive" });
      return;
    }
    setSaving(true);
    try {
      await adminUpdate(user.id, { newPassword: pw });
      toast({ title: "Password reset successfully" });
      setOpen(false);
      setPw("");
    } catch (e: any) {
      toast({ title: "Reset failed", description: e.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-blue-600" title="Reset password">
          <KeyRound className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Reset Password — {user.fullName}</DialogTitle>
        </DialogHeader>
        <div className="space-y-3 py-2">
          <div className="space-y-1">
            <Label>New Password</Label>
            <Input type="text" value={pw} onChange={e => setPw(e.target.value)} placeholder="Min. 6 characters" dir="ltr" autoFocus />
          </div>
          <Button onClick={handleReset} disabled={saving} className="w-full">
            {saving ? "Resetting..." : "Reset Password"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
