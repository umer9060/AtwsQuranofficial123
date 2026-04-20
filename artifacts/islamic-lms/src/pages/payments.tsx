import { useListPayments, useUpdatePayment, useCreatePayment, useListUsers } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/spinner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { CreditCard, CheckCircle, XCircle, RotateCcw, Plus, TrendingUp, Clock, DollarSign } from "lucide-react";
import { Link } from "wouter";

const METHOD_ICONS: Record<string, string> = {
  easypaisa: "🟢",
  jazzcash: "🔴",
  stripe: "💳",
  manual: "💵",
};

export default function Payments() {
  const [statusFilter, setStatusFilter] = useState("all");
  const [methodFilter, setMethodFilter] = useState("all");

  const { data: payments, isLoading, refetch } = useListPayments({
    status: statusFilter !== "all" ? statusFilter : undefined,
    method: methodFilter !== "all" ? methodFilter : undefined,
  });

  const updateMutation = useUpdatePayment();
  const { toast } = useToast();

  const handleApprove = (id: number) => {
    updateMutation.mutate(
      { id, data: { status: "approved" as any } },
      { onSuccess: () => { toast({ title: "Payment approved" }); refetch(); },
        onError: (e) => toast({ title: "Failed", description: e.message, variant: "destructive" }) }
    );
  };

  const handleReject = (id: number) => {
    updateMutation.mutate(
      { id, data: { status: "rejected" as any } },
      { onSuccess: () => { toast({ title: "Payment rejected" }); refetch(); } }
    );
  };

  const handleRefund = (id: number) => {
    if (confirm("Are you sure you want to issue a refund?")) {
      updateMutation.mutate(
        { id, data: { status: "refunded" as any } },
        { onSuccess: () => { toast({ title: "Payment refunded" }); refetch(); } }
      );
    }
  };

  const allPayments = payments || [];
  const pending = allPayments.filter((p: any) => p.status === "pending");
  const approved = allPayments.filter((p: any) => p.status === "approved");
  const totalRevenue = approved.reduce((sum: number, p: any) => sum + Number(p.amount), 0);
  const pendingAmount = pending.reduce((sum: number, p: any) => sum + Number(p.amount), 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight font-serif text-primary">Payment Management</h2>
          <p className="text-muted-foreground">Manage Easypaisa, JazzCash, Stripe and manual payments.</p>
        </div>
        <RecordPaymentDialog onCreated={refetch} />
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <SummaryCard icon={TrendingUp} color="green" title="Total Revenue" value={`PKR ${totalRevenue.toLocaleString()}`} sub={`${approved.length} approved payments`} />
        <SummaryCard icon={Clock} color="yellow" title="Pending" value={`PKR ${pendingAmount.toLocaleString()}`} sub={`${pending.length} awaiting approval`} />
        <SummaryCard icon={CheckCircle} color="blue" title="Easypaisa" value={allPayments.filter((p: any) => p.method === "easypaisa").length} sub="transactions" />
        <SummaryCard icon={CreditCard} color="purple" title="JazzCash" value={allPayments.filter((p: any) => p.method === "jazzcash").length} sub="transactions" />
      </div>

      {/* Filters */}
      <Card className="border-primary/10">
        <CardContent className="pt-4 pb-3">
          <div className="flex flex-wrap gap-3 items-center">
            <div className="flex items-center gap-2">
              <Label className="text-xs text-muted-foreground whitespace-nowrap">Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="h-8 text-xs w-32"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="refunded">Refunded</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <Label className="text-xs text-muted-foreground whitespace-nowrap">Method</Label>
              <Select value={methodFilter} onValueChange={setMethodFilter}>
                <SelectTrigger className="h-8 text-xs w-36"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Methods</SelectItem>
                  <SelectItem value="easypaisa">Easypaisa</SelectItem>
                  <SelectItem value="jazzcash">JazzCash</SelectItem>
                  <SelectItem value="stripe">Stripe</SelectItem>
                  <SelectItem value="manual">Manual/Cash</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payments Table */}
      <Card className="border-primary/10">
        <CardHeader>
          <CardTitle>Payment Records</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center p-8"><Spinner className="w-8 h-8 text-primary" /></div>
          ) : allPayments.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <CreditCard className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p>No payments found.</p>
            </div>
          ) : (
            <div className="rounded-md border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50 border-b">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Student</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Method</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Amount</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Tx ID</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Status</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Date</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {allPayments.map((p: any) => (
                      <tr key={p.id} className="hover:bg-muted/20">
                        <td className="px-4 py-3">
                          <div className="font-medium">{p.userName || `User #${p.userId}`}</div>
                          {p.userEmail && <div className="text-xs text-muted-foreground">{p.userEmail}</div>}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1.5">
                            <span>{METHOD_ICONS[p.method] || "💰"}</span>
                            <span className="capitalize">{p.method}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 font-semibold">PKR {Number(p.amount).toLocaleString()}</td>
                        <td className="px-4 py-3 text-muted-foreground font-mono text-xs">{p.transactionId || "—"}</td>
                        <td className="px-4 py-3">
                          <PaymentStatusBadge status={p.status} />
                        </td>
                        <td className="px-4 py-3 text-xs text-muted-foreground">
                          {new Date(p.createdAt).toLocaleDateString()}
                          {p.paidAt && <div className="text-green-600">Paid: {new Date(p.paidAt).toLocaleDateString()}</div>}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-1">
                            {p.status === "pending" && (
                              <>
                                <Button size="sm" onClick={() => handleApprove(p.id)} className="h-7 text-xs bg-green-600 hover:bg-green-700 text-white">
                                  <CheckCircle className="w-3 h-3 mr-1" /> Approve
                                </Button>
                                <Button size="sm" variant="outline" onClick={() => handleReject(p.id)} className="h-7 text-xs text-red-600 border-red-200 hover:bg-red-50">
                                  <XCircle className="w-3 h-3 mr-1" /> Reject
                                </Button>
                              </>
                            )}
                            {p.status === "approved" && (
                              <Button size="sm" variant="outline" onClick={() => handleRefund(p.id)} className="h-7 text-xs text-orange-600 border-orange-200 hover:bg-orange-50">
                                <RotateCcw className="w-3 h-3 mr-1" /> Refund
                              </Button>
                            )}
                            {p.userId && (
                              <Link href={`/students/${p.userId}`}>
                                <Button size="sm" variant="ghost" className="h-7 text-xs text-primary hover:underline">Profile</Button>
                              </Link>
                            )}
                          </div>
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

function PaymentStatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; className: string }> = {
    pending: { label: "Pending", className: "bg-yellow-100 text-yellow-800 border-yellow-200" },
    approved: { label: "Approved", className: "bg-green-100 text-green-800 border-green-200" },
    rejected: { label: "Rejected", className: "bg-red-100 text-red-800 border-red-200" },
    refunded: { label: "Refunded", className: "bg-gray-100 text-gray-800 border-gray-200" },
  };
  const s = map[status] || { label: status, className: "bg-gray-100 text-gray-800" };
  return <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${s.className}`}>{s.label}</span>;
}

function SummaryCard({ icon: Icon, color, title, value, sub }: { icon: any; color: string; title: string; value: string | number; sub: string }) {
  const colorMap: Record<string, string> = {
    green: "bg-green-100 text-green-600",
    yellow: "bg-yellow-100 text-yellow-600",
    blue: "bg-blue-100 text-blue-600",
    purple: "bg-purple-100 text-purple-600",
  };
  return (
    <Card className="border-primary/10">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${colorMap[color]}`}>
          <Icon className="w-4 h-4" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground mt-1">{sub}</p>
      </CardContent>
    </Card>
  );
}

function RecordPaymentDialog({ onCreated }: { onCreated: () => void }) {
  const [open, setOpen] = useState(false);
  const [userId, setUserId] = useState("");
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("easypaisa");
  const [txId, setTxId] = useState("");
  const [notes, setNotes] = useState("");
  const createMutation = useCreatePayment();
  const { data: users } = useListUsers({});
  const { toast } = useToast();
  const students = users?.filter(u => u.role === "male_student" || u.role === "female_student") || [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(
      { data: { userId: parseInt(userId), amount: parseFloat(amount), currency: "PKR", method: method as any, transactionId: txId || null, notes: notes || null } },
      {
        onSuccess: () => { toast({ title: "Payment recorded" }); setOpen(false); setAmount(""); setUserId(""); setTxId(""); setNotes(""); onCreated(); },
        onError: (e) => toast({ title: "Failed", description: e.message, variant: "destructive" }),
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2"><Plus className="w-4 h-4" /> Record Payment</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader><DialogTitle>Record New Payment</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-2">
            <Label>Student</Label>
            <Select value={userId} onValueChange={setUserId}>
              <SelectTrigger><SelectValue placeholder="Select student..." /></SelectTrigger>
              <SelectContent>
                {students.map(s => <SelectItem key={s.id} value={String(s.id)}>{s.fullName}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Amount (PKR)</Label>
            <Input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="e.g. 2500" required min="1" />
          </div>
          <div className="space-y-2">
            <Label>Payment Method</Label>
            <Select value={method} onValueChange={setMethod}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="easypaisa">🟢 Easypaisa</SelectItem>
                <SelectItem value="jazzcash">🔴 JazzCash</SelectItem>
                <SelectItem value="stripe">💳 Stripe</SelectItem>
                <SelectItem value="manual">💵 Manual / Cash</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Transaction ID (optional)</Label>
            <Input value={txId} onChange={e => setTxId(e.target.value)} placeholder="e.g. EP-123456" />
          </div>
          <div className="space-y-2">
            <Label>Notes (optional)</Label>
            <Input value={notes} onChange={e => setNotes(e.target.value)} placeholder="Additional notes..." />
          </div>
          <Button type="submit" className="w-full" disabled={createMutation.isPending || !userId || !amount}>
            {createMutation.isPending ? "Recording..." : "Record Payment"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
