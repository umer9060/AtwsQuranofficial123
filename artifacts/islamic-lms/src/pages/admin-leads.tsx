import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";
import {
  Download, Users, Phone, MapPin, BookOpen,
  Trash2, RefreshCw, ExternalLink, Filter
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Lead {
  id: number;
  name: string;
  phone: string;
  age: number | null;
  city: string | null;
  gender: string;
  course: string;
  currentLevel: string | null;
  note: string | null;
  formType: string | null;
  utmSource: string | null;
  utmCampaign: string | null;
  status: string;
  createdAt: string;
}

const COURSE_LABELS: Record<string, string> = {
  noorani: "نورانی قاعدہ",
  naazira: "ناظرہ قرآن",
  tajweed: "تجوید قرآن",
  hifz: "حفظ قرآن",
  alim: "درس نظامی / عالم",
};

const STATUS_COLORS: Record<string, string> = {
  new: "bg-blue-100 text-blue-700 border-blue-200",
  contacted: "bg-amber-100 text-amber-700 border-amber-200",
  enrolled: "bg-green-100 text-green-700 border-green-200",
  not_interested: "bg-red-100 text-red-700 border-red-200",
};

const STATUS_LABELS: Record<string, string> = {
  new: "نئی لیڈ",
  contacted: "رابطہ ہو گیا",
  enrolled: "داخل ہو گیا",
  not_interested: "دلچسپی نہیں",
};

export default function AdminLeads() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterGender, setFilterGender] = useState("all");
  const [filterCourse, setFilterCourse] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [search, setSearch] = useState("");
  const { toast } = useToast();

  const load = useCallback(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (filterGender !== "all") params.set("gender", filterGender);
    if (filterCourse !== "all") params.set("course", filterCourse);
    if (filterStatus !== "all") params.set("status", filterStatus);
    fetch(`/api/leads?${params}`).then(r => r.json()).then(setLeads).finally(() => setLoading(false));
  }, [filterGender, filterCourse, filterStatus]);

  useEffect(() => { load(); }, [load]);

  const updateStatus = async (id: number, status: string) => {
    await fetch(`/api/leads/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setLeads(prev => prev.map(l => l.id === id ? { ...l, status } : l));
    toast({ title: "اسٹیٹس اپڈیٹ ہو گیا" });
  };

  const deleteLead = async (id: number) => {
    if (!confirm("کیا آپ یہ لیڈ حذف کرنا چاہتے ہیں؟")) return;
    await fetch(`/api/leads/${id}`, { method: "DELETE" });
    setLeads(prev => prev.filter(l => l.id !== id));
    toast({ title: "لیڈ حذف ہو گئی" });
  };

  const exportCSV = () => {
    const params = new URLSearchParams();
    if (filterGender !== "all") params.set("gender", filterGender);
    if (filterCourse !== "all") params.set("course", filterCourse);
    if (filterStatus !== "all") params.set("status", filterStatus);
    window.open(`/api/leads/export/csv?${params}`, "_blank");
  };

  const filtered = leads.filter(l =>
    !search ||
    l.name.toLowerCase().includes(search.toLowerCase()) ||
    l.phone.includes(search) ||
    (l.city?.toLowerCase().includes(search.toLowerCase()))
  );

  const stats = {
    total: leads.length,
    new: leads.filter(l => l.status === "new").length,
    contacted: leads.filter(l => l.status === "contacted").length,
    enrolled: leads.filter(l => l.status === "enrolled").length,
    boys: leads.filter(l => l.gender === "boys").length,
    girls: leads.filter(l => l.gender === "girls").length,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-3xl font-bold tracking-tight font-serif text-primary">Lead Management</h2>
          <p className="text-muted-foreground font-serif" dir="rtl">تمام lead فارم کی درخواستیں</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={load} size="sm" className="gap-2">
            <RefreshCw className="w-4 h-4" />
            Refresh
          </Button>
          <Button onClick={exportCSV} size="sm" className="gap-2 bg-green-600 hover:bg-green-700 text-white">
            <Download className="w-4 h-4" />
            CSV / Excel Download
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { label: "کل لیڈز", value: stats.total, color: "text-primary" },
          { label: "نئی", value: stats.new, color: "text-blue-600" },
          { label: "رابطہ ہوا", value: stats.contacted, color: "text-amber-600" },
          { label: "داخل", value: stats.enrolled, color: "text-green-600" },
          { label: "لڑکے", value: stats.boys, color: "text-blue-700" },
          { label: "لڑکیاں", value: stats.girls, color: "text-pink-600" },
        ].map(s => (
          <Card key={s.label} className="text-center">
            <CardContent className="py-3 px-2">
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-muted-foreground font-serif">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <div className="flex flex-wrap gap-3 items-center">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="نام، فون، شہر تلاش کریں..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="max-w-xs text-right font-serif"
              dir="rtl"
            />
            <Select value={filterGender} onValueChange={setFilterGender}>
              <SelectTrigger className="w-36">
                <SelectValue placeholder="جنس" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">تمام</SelectItem>
                <SelectItem value="boys">لڑکے</SelectItem>
                <SelectItem value="girls">لڑکیاں</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterCourse} onValueChange={setFilterCourse}>
              <SelectTrigger className="w-44">
                <SelectValue placeholder="کورس" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">تمام کورسز</SelectItem>
                {Object.entries(COURSE_LABELS).map(([k, v]) => (
                  <SelectItem key={k} value={k} className="font-serif">{v}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="اسٹیٹس" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">تمام</SelectItem>
                {Object.entries(STATUS_LABELS).map(([k, v]) => (
                  <SelectItem key={k} value={k} className="font-serif">{v}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-12"><Spinner className="w-8 h-8 text-primary" /></div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground font-serif" dir="rtl">
              کوئی لیڈ نہیں ملی
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.map(lead => (
                <div key={lead.id} className="border border-border rounded-xl p-4 bg-card hover:shadow-sm transition-shadow">
                  <div className="flex flex-wrap gap-3 items-start justify-between">
                    <div className="flex-1 min-w-0 space-y-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-foreground font-serif">{lead.name}</span>
                        <Badge variant="outline" className={lead.gender === "boys" ? "text-blue-600 border-blue-200" : "text-pink-600 border-pink-200"}>
                          {lead.gender === "boys" ? "👦 لڑکا" : "👧 لڑکی"}
                        </Badge>
                        <Badge variant="outline" className="font-serif text-xs">
                          {COURSE_LABELS[lead.course] ?? lead.course}
                        </Badge>
                        <Badge variant="outline" className={`text-xs ${STATUS_COLORS[lead.status] ?? ""}`}>
                          {STATUS_LABELS[lead.status] ?? lead.status}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          <a href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, "")}`} target="_blank" rel="noopener noreferrer"
                            className="text-green-600 hover:underline font-medium">
                            {lead.phone}
                          </a>
                          <ExternalLink className="w-3 h-3 text-green-500" />
                        </span>
                        {lead.city && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{lead.city}</span>}
                        {lead.age && <span className="flex items-center gap-1"><Users className="w-3 h-3" />عمر: {lead.age}</span>}
                        {lead.currentLevel && <span className="flex items-center gap-1"><BookOpen className="w-3 h-3" />{lead.currentLevel}</span>}
                      </div>
                      {lead.note && (
                        <p className="text-xs text-muted-foreground bg-muted/50 rounded px-2 py-1 text-right font-serif" dir="rtl">
                          💬 {lead.note}
                        </p>
                      )}
                      <div className="flex gap-2 flex-wrap text-xs text-muted-foreground">
                        {lead.utmSource && <span>📣 {lead.utmSource}</span>}
                        {lead.utmCampaign && <span>🎯 {lead.utmCampaign}</span>}
                        <span>🕐 {new Date(lead.createdAt).toLocaleString("ur-PK", { dateStyle: "short", timeStyle: "short" })}</span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 shrink-0">
                      <Select value={lead.status} onValueChange={v => updateStatus(lead.id, v)}>
                        <SelectTrigger className="h-8 w-40 text-xs font-serif">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(STATUS_LABELS).map(([k, v]) => (
                            <SelectItem key={k} value={k} className="text-xs font-serif">{v}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                        onClick={() => deleteLead(lead.id)}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
