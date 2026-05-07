import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { Badge } from "@/components/ui/badge";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter
} from "@/components/ui/dialog";
import {
  Plus, Pencil, Trash2, BookOpen, ChevronDown, ChevronUp,
  Facebook, Youtube, Star, X
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Ulem {
  id: number;
  name: string;
  title: string | null;
  facebookUrl: string | null;
  youtubeUrl: string | null;
  bio: string | null;
  imageUrl: string | null;
  orderNum: number;
}

interface UlemBook {
  id: number;
  ulemId: number;
  title: string;
  description: string | null;
  fileUrl: string | null;
  coverImageUrl: string | null;
}

const API = "/api";

function useUlemaAdmin() {
  const [data, setData] = useState<Ulem[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    setLoading(true);
    fetch(`${API}/ulema`).then(r => r.json()).then(setData).finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);
  return { data, loading, reload: load };
}

function UlemFormDialog({
  open, onClose, onSaved, initial
}: {
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
  initial?: Ulem | null;
}) {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: initial?.name ?? "",
    title: initial?.title ?? "",
    facebookUrl: initial?.facebookUrl ?? "",
    youtubeUrl: initial?.youtubeUrl ?? "",
    bio: initial?.bio ?? "",
    imageUrl: initial?.imageUrl ?? "",
    orderNum: initial?.orderNum ?? 0,
  });

  useEffect(() => {
    if (initial) {
      setForm({
        name: initial.name,
        title: initial.title ?? "",
        facebookUrl: initial.facebookUrl ?? "",
        youtubeUrl: initial.youtubeUrl ?? "",
        bio: initial.bio ?? "",
        imageUrl: initial.imageUrl ?? "",
        orderNum: initial.orderNum,
      });
    } else {
      setForm({ name: "", title: "", facebookUrl: "", youtubeUrl: "", bio: "", imageUrl: "", orderNum: 0 });
    }
  }, [initial, open]);

  const save = async () => {
    if (!form.name.trim()) { toast({ title: "نام لازمی ہے", variant: "destructive" }); return; }
    setSaving(true);
    try {
      const body = {
        name: form.name.trim(),
        title: form.title.trim() || undefined,
        facebookUrl: form.facebookUrl.trim() || undefined,
        youtubeUrl: form.youtubeUrl.trim() || undefined,
        bio: form.bio.trim() || undefined,
        imageUrl: form.imageUrl.trim() || undefined,
        orderNum: Number(form.orderNum) || 0,
      };
      const url = initial ? `${API}/ulema/${initial.id}` : `${API}/ulema`;
      const method = initial ? "PATCH" : "POST";
      const r = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      if (!r.ok) throw new Error("خرابی");
      toast({ title: initial ? "عالم اپڈیٹ ہو گئے" : "عالم شامل ہو گئے" });
      onSaved();
      onClose();
    } catch {
      toast({ title: "خرابی ہوئی", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={v => !v && onClose()}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-right font-serif" dir="rtl">
            {initial ? "عالم تبدیل کریں" : "نئے عالم شامل کریں"}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label className="text-right block font-serif" dir="rtl">نام (لازمی)</Label>
            <Input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
              placeholder="مثلاً: حضرت العلامہ مولانا..." className="text-right font-serif" dir="rtl" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-right block font-serif" dir="rtl">لقب / عہدہ</Label>
            <Input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
              placeholder="مثلاً: شیخ القرآن والحدیث" className="text-right font-serif" dir="rtl" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-right block font-serif" dir="rtl">مختصر تعارف</Label>
            <Textarea value={form.bio} onChange={e => setForm(p => ({ ...p, bio: e.target.value }))}
              placeholder="عالم کا مختصر تعارف..." rows={3} className="text-right font-serif" dir="rtl" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-right block font-serif" dir="rtl">
              <Facebook className="inline w-4 h-4 text-blue-600 mr-1" />
              Facebook لنک
            </Label>
            <Input value={form.facebookUrl} onChange={e => setForm(p => ({ ...p, facebookUrl: e.target.value }))}
              placeholder="https://facebook.com/..." dir="ltr" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-right block font-serif" dir="rtl">
              <Youtube className="inline w-4 h-4 text-red-600 mr-1" />
              YouTube لنک
            </Label>
            <Input value={form.youtubeUrl} onChange={e => setForm(p => ({ ...p, youtubeUrl: e.target.value }))}
              placeholder="https://youtube.com/..." dir="ltr" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-right block font-serif" dir="rtl">تصویر URL</Label>
            <Input value={form.imageUrl} onChange={e => setForm(p => ({ ...p, imageUrl: e.target.value }))}
              placeholder="https://..." dir="ltr" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-right block font-serif" dir="rtl">ترتیب نمبر</Label>
            <Input type="number" value={form.orderNum} onChange={e => setForm(p => ({ ...p, orderNum: parseInt(e.target.value) || 0 }))}
              className="w-24" />
          </div>
        </div>
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose} disabled={saving}>منسوخ</Button>
          <Button onClick={save} disabled={saving} className="gap-2">
            {saving && <Spinner className="w-4 h-4" />}
            {initial ? "اپڈیٹ کریں" : "شامل کریں"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function BookFormDialog({
  open, onClose, onSaved, ulemId, initial
}: {
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
  ulemId: number;
  initial?: UlemBook | null;
}) {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: initial?.title ?? "",
    description: initial?.description ?? "",
    fileUrl: initial?.fileUrl ?? "",
    coverImageUrl: initial?.coverImageUrl ?? "",
  });

  useEffect(() => {
    if (initial) {
      setForm({ title: initial.title, description: initial.description ?? "", fileUrl: initial.fileUrl ?? "", coverImageUrl: initial.coverImageUrl ?? "" });
    } else {
      setForm({ title: "", description: "", fileUrl: "", coverImageUrl: "" });
    }
  }, [initial, open]);

  const save = async () => {
    if (!form.title.trim()) { toast({ title: "کتاب کا نام لازمی ہے", variant: "destructive" }); return; }
    setSaving(true);
    try {
      const body = {
        title: form.title.trim(),
        description: form.description.trim() || undefined,
        fileUrl: form.fileUrl.trim() || undefined,
        coverImageUrl: form.coverImageUrl.trim() || undefined,
      };
      const url = initial ? `${API}/ulema/books/${initial.id}` : `${API}/ulema/${ulemId}/books`;
      const method = initial ? "PATCH" : "POST";
      const r = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      if (!r.ok) throw new Error();
      toast({ title: initial ? "کتاب اپڈیٹ ہو گئی" : "کتاب شامل ہو گئی" });
      onSaved();
      onClose();
    } catch {
      toast({ title: "خرابی ہوئی", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={v => !v && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-right font-serif" dir="rtl">
            {initial ? "کتاب تبدیل کریں" : "نئی کتاب شامل کریں"}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label className="text-right block font-serif" dir="rtl">کتاب کا نام (لازمی)</Label>
            <Input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
              placeholder="مثلاً: فتاویٰ دارالعلوم..." className="text-right font-serif" dir="rtl" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-right block font-serif" dir="rtl">تفصیل</Label>
            <Textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
              placeholder="کتاب کے بارے میں..." rows={2} className="text-right font-serif" dir="rtl" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-right block font-serif" dir="rtl">کتاب کا لنک (PDF/Drive)</Label>
            <Input value={form.fileUrl} onChange={e => setForm(p => ({ ...p, fileUrl: e.target.value }))}
              placeholder="https://drive.google.com/..." dir="ltr" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-right block font-serif" dir="rtl">سرورق تصویر URL</Label>
            <Input value={form.coverImageUrl} onChange={e => setForm(p => ({ ...p, coverImageUrl: e.target.value }))}
              placeholder="https://..." dir="ltr" />
          </div>
        </div>
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose} disabled={saving}>منسوخ</Button>
          <Button onClick={save} disabled={saving} className="gap-2">
            {saving && <Spinner className="w-4 h-4" />}
            {initial ? "اپڈیٹ کریں" : "شامل کریں"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function UlemRow({ ulem, onEdit, onDelete, onReload }: {
  ulem: Ulem;
  onEdit: (u: Ulem) => void;
  onDelete: (id: number) => void;
  onReload: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [books, setBooks] = useState<UlemBook[]>([]);
  const [booksLoading, setBooksLoading] = useState(false);
  const [addBookOpen, setAddBookOpen] = useState(false);
  const [editBook, setEditBook] = useState<UlemBook | null>(null);
  const { toast } = useToast();

  const loadBooks = useCallback(() => {
    setBooksLoading(true);
    fetch(`${API}/ulema/${ulem.id}/books`).then(r => r.json()).then(setBooks).finally(() => setBooksLoading(false));
  }, [ulem.id]);

  const toggleOpen = () => {
    if (!open) loadBooks();
    setOpen(v => !v);
  };

  const deleteBook = async (bookId: number) => {
    if (!confirm("کیا آپ یہ کتاب حذف کرنا چاہتے ہیں؟")) return;
    await fetch(`${API}/ulema/books/${bookId}`, { method: "DELETE" });
    toast({ title: "کتاب حذف ہو گئی" });
    loadBooks();
  };

  return (
    <div className="border border-border rounded-lg overflow-hidden">
      <div className="flex items-center gap-3 p-4 bg-card">
        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm shrink-0">
          {ulem.orderNum}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-right text-sm font-serif leading-snug" dir="rtl">{ulem.name}</p>
          {ulem.title && <p className="text-xs text-muted-foreground text-right font-serif" dir="rtl">{ulem.title}</p>}
          <div className="flex gap-1.5 mt-1 justify-end">
            {ulem.facebookUrl && <Badge variant="outline" className="text-xs text-blue-600 border-blue-200"><Facebook className="w-3 h-3 mr-1" />FB</Badge>}
            {ulem.youtubeUrl && <Badge variant="outline" className="text-xs text-red-600 border-red-200"><Youtube className="w-3 h-3 mr-1" />YT</Badge>}
          </div>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <Button size="icon" variant="ghost" className="w-8 h-8" onClick={toggleOpen} title="کتابیں">
            <BookOpen className="w-4 h-4 text-primary" />
          </Button>
          <Button size="icon" variant="ghost" className="w-8 h-8" onClick={() => onEdit(ulem)} title="ترمیم">
            <Pencil className="w-4 h-4 text-amber-600" />
          </Button>
          <Button size="icon" variant="ghost" className="w-8 h-8" onClick={() => onDelete(ulem.id)} title="حذف">
            <Trash2 className="w-4 h-4 text-red-500" />
          </Button>
          <Button size="icon" variant="ghost" className="w-8 h-8" onClick={toggleOpen}>
            {open ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      {open && (
        <div className="border-t border-border bg-muted/30 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <Button size="sm" onClick={() => setAddBookOpen(true)} className="gap-1.5 h-8">
              <Plus className="w-3.5 h-3.5" />
              کتاب شامل کریں
            </Button>
            <p className="text-sm font-semibold text-right font-serif" dir="rtl">
              کتابیں ({books.length})
            </p>
          </div>
          {booksLoading ? (
            <div className="flex justify-center py-4"><Spinner className="w-5 h-5 text-primary" /></div>
          ) : books.length === 0 ? (
            <p className="text-center text-sm text-muted-foreground py-2 font-serif" dir="rtl">ابھی کوئی کتاب نہیں</p>
          ) : (
            <div className="space-y-2">
              {books.map(book => (
                <div key={book.id} className="flex items-center gap-2 bg-card rounded-md p-3 border border-border">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-right font-serif" dir="rtl">{book.title}</p>
                    {book.description && (
                      <p className="text-xs text-muted-foreground text-right font-serif" dir="rtl">{book.description}</p>
                    )}
                    {book.fileUrl && (
                      <a href={book.fileUrl} target="_blank" rel="noopener noreferrer"
                        className="text-xs text-primary hover:underline block text-right mt-0.5 truncate" dir="ltr">
                        {book.fileUrl}
                      </a>
                    )}
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <Button size="icon" variant="ghost" className="w-7 h-7" onClick={() => setEditBook(book)}>
                      <Pencil className="w-3 h-3 text-amber-600" />
                    </Button>
                    <Button size="icon" variant="ghost" className="w-7 h-7" onClick={() => deleteBook(book.id)}>
                      <Trash2 className="w-3 h-3 text-red-500" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <BookFormDialog
        open={addBookOpen}
        onClose={() => setAddBookOpen(false)}
        onSaved={loadBooks}
        ulemId={ulem.id}
      />
      <BookFormDialog
        open={!!editBook}
        onClose={() => setEditBook(null)}
        onSaved={loadBooks}
        ulemId={ulem.id}
        initial={editBook}
      />
    </div>
  );
}

export default function AdminUlema() {
  const { data: ulema, loading, reload } = useUlemaAdmin();
  const [addOpen, setAddOpen] = useState(false);
  const [editUlem, setEditUlem] = useState<Ulem | null>(null);
  const { toast } = useToast();

  const deleteUlem = async (id: number) => {
    if (!confirm("کیا آپ اس عالم کو حذف کرنا چاہتے ہیں؟ ان کی تمام کتابیں بھی حذف ہو جائیں گی۔")) return;
    const r = await fetch(`${API}/ulema/${id}`, { method: "DELETE" });
    if (r.ok) { toast({ title: "عالم حذف ہو گئے" }); reload(); }
    else toast({ title: "خرابی ہوئی", variant: "destructive" });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight font-serif text-primary" dir="rtl">علماء کرام</h2>
          <p className="text-muted-foreground font-serif" dir="rtl">
            علماء کی پروفائلز اور کتابیں منظم کریں
          </p>
        </div>
        <Button onClick={() => setAddOpen(true)} className="gap-2">
          <Plus className="w-4 h-4" />
          نئے عالم
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="w-5 h-5 text-primary" />
            <span className="font-serif" dir="rtl">تمام علماء کرام</span>
            <Badge variant="secondary" className="ml-auto">{ulema.length}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-12"><Spinner className="w-8 h-8 text-primary" /></div>
          ) : ulema.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground font-serif" dir="rtl">
              ابھی کوئی عالم شامل نہیں
            </div>
          ) : (
            <div className="space-y-3">
              {ulema.map(ulem => (
                <UlemRow
                  key={ulem.id}
                  ulem={ulem}
                  onEdit={setEditUlem}
                  onDelete={deleteUlem}
                  onReload={reload}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <UlemFormDialog open={addOpen} onClose={() => setAddOpen(false)} onSaved={reload} />
      <UlemFormDialog open={!!editUlem} onClose={() => setEditUlem(null)} onSaved={reload} initial={editUlem} />
    </div>
  );
}
