import { useGetUser, useUpdateUser, useListPayments, useCreatePayment, useUpdatePayment } from "@workspace/api-client-react";
import { useParams, Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Shield, ShieldOff, CheckCircle, AlertTriangle, CreditCard, UserCheck, Clock } from "lucide-react";
import { useState } from "react";

export default function StudentDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: user, isLoading, refetch } = useGetUser({ id: parseInt(id) });
  const { data: payments, refetch: refetchPayments } = useListPayments({ userId: parseInt(id) });
  const updateMutation = useUpdateUser();
  const updatePaymentMutation = useUpdatePayment();
  const { toast } = useToast();

  const handleStatusUpdate = (status: string) => {
    updateMutation.mutate(
      { id: parseInt(id), data: { status: status as any } },
      {
        onSuccess: () => { toast({ title: `Status updated to ${status}` }); refetch(); },
        onError: (e) => toast({ title: "Failed", description: e.message, variant: "destructive" }),
      }
    );
  };

  const handleLevelUpdate = (level: string) => {
    updateMutation.mutate(
      { id: parseInt(id), data: { level: parseInt(level) } },
      {
        onSuccess: () => { toast({ title: `Level updated to ${level}` }); refetch(); },
        onError: (e) => toast({ title: "Failed", description: e.message, variant: "destructive" }),
      }
    );
  };

  const handleFederationCode = () => {
    const section = user?.role === "female_student" ? "G" : "B";
    const year = new Date().getFullYear();
    const code = `WIF-${year}-${section}${String(user?.id).padStart(3, "0")}`;
    updateMutation.mutate(
      { id: parseInt(id), data: { federationCode: code, status: "verified" as any } },
      {
        onSuccess: () => { toast({ title: "Federation code assigned!", description: code }); refetch(); },
        onError: (e) => toast({ title: "Failed", description: e.message, variant: "destructive" }),
      }
    );
  };

  const handlePaymentApprove = (paymentId: number) => {
    updatePaymentMutation.mutate(
      { id: paymentId, data: { status: "approved" as any } },
      {
        onSuccess: () => {
          toast({ title: "Payment approved — activating student" });
          handleStatusUpdate("active");
          refetchPayments();
        },
      }
    );
  };

  const handlePaymentRefund = (paymentId: number) => {
    updatePaymentMutation.mutate(
      { id: paymentId, data: { status: "refunded" as any } },
      { onSuccess: () => { toast({ title: "Payment refunded" }); refetchPayments(); } }
    );
  };

  if (isLoading) {
    return <div className="flex h-[50vh] items-center justify-center"><Spinner className="w-8 h-8 text-primary" /></div>;
  }

  if (!user) {
    return (
      <div className="text-center p-8">
        <p className="text-muted-foreground">Student not found.</p>
        <Link href="/students"><Button variant="link">Back to Students</Button></Link>
      </div>
    );
  }

  const isFemale = user.role === "female_student";

  const statusColors: Record<string, string> = {
    active: "bg-green-100 text-green-800 border-green-200",
    trial: "bg-yellow-100 text-yellow-800 border-yellow-200",
    pending: "bg-blue-100 text-blue-800 border-blue-200",
    suspended: "bg-red-100 text-red-800 border-red-200",
    verified: "bg-green-100 text-green-800 border-green-200",
  };

  const trialDaysLeft = user.trialEndDate
    ? Math.max(0, Math.ceil((new Date(user.trialEndDate).getTime() - Date.now()) / 86400000))
    : null;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/students">
          <Button variant="ghost" size="icon"><ArrowLeft className="w-5 h-5" /></Button>
        </Link>
        <div>
          <h2 className="text-3xl font-bold tracking-tight font-serif text-primary">{user.fullName}</h2>
          <p className="text-muted-foreground">Student Profile & Management</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Profile Card */}
        <Card className="md:col-span-1 border-primary/10">
          <CardHeader><CardTitle className="text-base">Profile</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <div className={`w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold ${isFemale ? "bg-pink-100 text-pink-600" : "bg-blue-100 text-blue-600"}`}>
                {user.fullName[0]}
              </div>
              <div>
                <p className="font-semibold">{user.fullName}</p>
                <p className="text-xs text-muted-foreground capitalize">{user.role.replace("_", " ")}</p>
              </div>
            </div>

            <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${statusColors[user.status] || "bg-gray-100 text-gray-800 border-gray-200"}`}>
              {user.status === "trial" && <Clock className="w-3 h-3" />}
              {user.status === "active" && <CheckCircle className="w-3 h-3" />}
              {user.status === "suspended" && <ShieldOff className="w-3 h-3" />}
              {user.status === "pending" && <AlertTriangle className="w-3 h-3" />}
              <span className="capitalize">{user.status}</span>
            </div>

            {trialDaysLeft !== null && (
              <div className={`rounded-md p-3 text-sm border ${trialDaysLeft === 0 ? "bg-red-50 border-red-200" : "bg-yellow-50 border-yellow-200"}`}>
                <p className={`font-medium ${trialDaysLeft === 0 ? "text-red-800" : "text-yellow-800"}`}>
                  {trialDaysLeft === 0 ? "Trial Expired!" : `${trialDaysLeft} trial days left`}
                </p>
                {user.trialEndDate && <p className="text-xs text-muted-foreground mt-0.5">Expires: {new Date(user.trialEndDate).toLocaleDateString()}</p>}
              </div>
            )}

            <div className="space-y-2 text-sm divide-y">
              <InfoRow label="Email" value={user.email} />
              <InfoRow label="Phone" value={user.phone || "—"} />
              <InfoRow label="Gender" value={isFemale ? "Female / Girls Section" : "Male / Boys Section"} />
              <InfoRow label="Level" value={user.level ? `Level ${user.level}` : "Not assigned"} />
              <InfoRow label="CNIC" value={user.cnicNumber || "Not provided"} />
              <InfoRow label="Federation Code" value={user.federationCode || "Not assigned"} />
              <InfoRow label="Joined" value={user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "—"} />
            </div>
          </CardContent>
        </Card>

        {/* Right column */}
        <div className="md:col-span-2 space-y-4">
          {/* Action Bar */}
          <Card className="border-primary/10">
            <CardHeader className="pb-3"><CardTitle className="text-base">Admin Actions</CardTitle></CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {user.status !== "active" && (
                  <Button size="sm" onClick={() => handleStatusUpdate("active")} className="bg-green-600 hover:bg-green-700 text-white">
                    <CheckCircle className="w-3.5 h-3.5 mr-1" /> Approve
                  </Button>
                )}
                {user.status === "pending" && (
                  <Button size="sm" variant="outline" onClick={() => handleStatusUpdate("trial")} className="text-yellow-700 border-yellow-300 hover:bg-yellow-50">
                    <Clock className="w-3.5 h-3.5 mr-1" /> Start Trial
                  </Button>
                )}
                {user.status !== "suspended" ? (
                  <Button size="sm" variant="outline" onClick={() => handleStatusUpdate("suspended")} className="text-red-600 border-red-200 hover:bg-red-50">
                    <ShieldOff className="w-3.5 h-3.5 mr-1" /> Block
                  </Button>
                ) : (
                  <Button size="sm" variant="outline" onClick={() => handleStatusUpdate("active")} className="text-green-600 border-green-200 hover:bg-green-50">
                    <Shield className="w-3.5 h-3.5 mr-1" /> Unblock
                  </Button>
                )}
                {!user.federationCode && (
                  <Button size="sm" variant="outline" onClick={handleFederationCode} className="text-primary border-primary/30 hover:bg-primary/5">
                    <UserCheck className="w-3.5 h-3.5 mr-1" /> Assign Federation Code
                  </Button>
                )}
                <AssignLevelDialog currentLevel={user.level} onAssign={handleLevelUpdate} />
                <AddPaymentDialog userId={user.id} onAdded={refetchPayments} />
              </div>
            </CardContent>
          </Card>

          {/* Tabs */}
          <Tabs defaultValue="payments">
            <TabsList className="w-full justify-start">
              <TabsTrigger value="payments">Payments</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
              <TabsTrigger value="access">Access Rules</TabsTrigger>
            </TabsList>

            <TabsContent value="payments">
              <Card className="border-primary/10">
                <CardHeader><CardTitle className="text-base">Payment History</CardTitle></CardHeader>
                <CardContent>
                  {!payments || payments.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground text-sm">No payments recorded yet.</div>
                  ) : (
                    <div className="space-y-3">
                      {payments.map((p: any) => (
                        <div key={p.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/30">
                          <div className="space-y-0.5">
                            <p className="text-sm font-medium capitalize">{p.method} — PKR {Number(p.amount).toLocaleString()}</p>
                            <p className="text-xs text-muted-foreground">
                              {p.transactionId && `TxID: ${p.transactionId} · `}
                              {new Date(p.createdAt).toLocaleDateString()}
                            </p>
                            {p.notes && <p className="text-xs text-muted-foreground italic">{p.notes}</p>}
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge
                              variant={p.status === "approved" ? "default" : p.status === "refunded" ? "secondary" : p.status === "rejected" ? "destructive" : "outline"}
                              className="capitalize text-xs"
                            >
                              {p.status}
                            </Badge>
                            {p.status === "pending" && (
                              <Button size="sm" onClick={() => handlePaymentApprove(p.id)} className="h-7 text-xs bg-green-600 hover:bg-green-700 text-white">
                                Approve
                              </Button>
                            )}
                            {p.status === "approved" && (
                              <Button size="sm" variant="outline" onClick={() => handlePaymentRefund(p.id)} className="h-7 text-xs text-red-600 border-red-200 hover:bg-red-50">
                                Refund
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="documents">
              <Card className="border-primary/10">
                <CardHeader><CardTitle className="text-base">Verification Documents</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <DocumentCard label="CNIC Copy" />
                    <DocumentCard label="Birth Certificate" />
                  </div>
                  {user.cnicNumber && (
                    <div className="bg-muted/50 rounded p-3 text-sm">
                      <p className="font-medium">CNIC on file: <span className="text-primary font-mono">{user.cnicNumber}</span></p>
                    </div>
                  )}
                  {user.federationCode ? (
                    <div className="bg-green-50 border border-green-200 rounded p-3 text-sm">
                      <p className="font-medium text-green-800">Verified — Federation Code: <span className="font-mono">{user.federationCode}</span></p>
                    </div>
                  ) : (
                    <div className="bg-amber-50 border border-amber-200 rounded p-3 text-sm">
                      <p className="text-amber-800">No federation code assigned. Verify documents then click "Assign Federation Code".</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="access">
              <Card className="border-primary/10">
                <CardHeader><CardTitle className="text-base">Content Access Rules</CardTitle></CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      {
                        title: "Live Zoom Classes",
                        desc: "Access to scheduled live sessions",
                        allowed: user.status === "active" || user.status === "trial",
                      },
                      {
                        title: "Recorded Lectures",
                        desc: isFemale ? "Private — Female teachers only, time-restricted access" : "Standard access during class window",
                        allowed: user.status === "active",
                      },
                      {
                        title: "PDF / Study Materials",
                        desc: "Course books, notes, worksheets",
                        allowed: user.status === "active" || user.status === "trial",
                      },
                      {
                        title: "Q&A Board",
                        desc: "Ask and view questions",
                        allowed: user.status === "active" || user.status === "trial",
                      },
                    ].map(rule => (
                      <div key={rule.title} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="text-sm font-medium">{rule.title}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{rule.desc}</p>
                        </div>
                        <Badge variant={rule.allowed ? "default" : "secondary"} className={rule.allowed ? "bg-green-600" : ""}>
                          {rule.allowed ? "Allowed" : "Blocked"}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-start py-1.5 text-sm">
      <span className="text-muted-foreground shrink-0">{label}</span>
      <span className="font-medium text-right break-all ml-2">{value}</span>
    </div>
  );
}

function DocumentCard({ label }: { label: string }) {
  return (
    <div className="border-2 border-dashed border-border rounded-lg p-4 text-center space-y-2">
      <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center mx-auto">
        <CreditCard className="w-5 h-5 text-muted-foreground" />
      </div>
      <p className="text-sm font-medium">{label}</p>
      <p className="text-xs text-muted-foreground">No document uploaded</p>
      <Button size="sm" variant="outline" className="text-xs h-7">Upload</Button>
    </div>
  );
}

function AssignLevelDialog({ currentLevel, onAssign }: { currentLevel?: number | null; onAssign: (l: string) => void }) {
  const [open, setOpen] = useState(false);
  const [level, setLevel] = useState(String(currentLevel || "1"));
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="text-purple-600 border-purple-200 hover:bg-purple-50">Assign Level</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-xs">
        <DialogHeader><DialogTitle>Assign Enrollment Level</DialogTitle></DialogHeader>
        <div className="space-y-4 pt-2">
          <Select value={level} onValueChange={setLevel}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {[1,2,3,4,5,6].map(l => <SelectItem key={l} value={String(l)}>Level {l}</SelectItem>)}
            </SelectContent>
          </Select>
          <Button className="w-full" onClick={() => { onAssign(level); setOpen(false); }}>Assign Level {level}</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function AddPaymentDialog({ userId, onAdded }: { userId: number; onAdded: () => void }) {
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("easypaisa");
  const [txId, setTxId] = useState("");
  const [notes, setNotes] = useState("");
  const createMutation = useCreatePayment();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(
      { data: { userId, amount: parseFloat(amount), currency: "PKR", method: method as any, transactionId: txId || null, notes: notes || null } },
      {
        onSuccess: () => { toast({ title: "Payment recorded" }); setOpen(false); setAmount(""); setTxId(""); setNotes(""); onAdded(); },
        onError: (e) => toast({ title: "Failed", description: e.message, variant: "destructive" }),
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="text-blue-600 border-blue-200 hover:bg-blue-50">
          <CreditCard className="w-3.5 h-3.5 mr-1" /> Record Payment
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader><DialogTitle>Record Payment</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-2">
            <Label>Amount (PKR)</Label>
            <Input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="e.g. 2500" required min="1" />
          </div>
          <div className="space-y-2">
            <Label>Method</Label>
            <Select value={method} onValueChange={setMethod}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="easypaisa">Easypaisa</SelectItem>
                <SelectItem value="jazzcash">JazzCash</SelectItem>
                <SelectItem value="stripe">Stripe</SelectItem>
                <SelectItem value="manual">Manual / Cash</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Transaction ID (optional)</Label>
            <Input value={txId} onChange={e => setTxId(e.target.value)} placeholder="e.g. EP-123456" />
          </div>
          <div className="space-y-2">
            <Label>Notes (optional)</Label>
            <Input value={notes} onChange={e => setNotes(e.target.value)} placeholder="Any notes..." />
          </div>
          <Button type="submit" className="w-full" disabled={createMutation.isPending}>
            {createMutation.isPending ? "Recording..." : "Record Payment"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
