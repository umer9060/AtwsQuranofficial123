import { useState, useEffect } from "react";
import { ChevronDown, ChevronUp, BookOpen, Facebook, Youtube, Search, ExternalLink, Star } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Link } from "wouter";

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

function useUlema() {
  const [data, setData] = useState<Ulem[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetch("/api/ulema").then(r => r.json()).then(setData).finally(() => setLoading(false));
  }, []);
  return { data, loading };
}

function useBooks(ulemId: number | null) {
  const [data, setData] = useState<UlemBook[]>([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (!ulemId) return;
    setLoading(true);
    fetch(`/api/ulema/${ulemId}/books`).then(r => r.json()).then(setData).finally(() => setLoading(false));
  }, [ulemId]);
  return { data, loading };
}

function UlemCard({ ulem }: { ulem: Ulem }) {
  const [open, setOpen] = useState(false);
  const { data: books, loading: booksLoading } = useBooks(open ? ulem.id : null);

  const initials = ulem.name.split(" ").slice(-2).map(w => w[0]).join("");

  return (
    <div className="border border-primary/20 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow bg-white">
      <div className="p-5">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary/80 to-primary flex items-center justify-center shrink-0 text-white font-bold text-lg shadow-md">
            {ulem.imageUrl ? (
              <img src={ulem.imageUrl} alt={ulem.name} className="w-14 h-14 rounded-full object-cover" />
            ) : (
              <Star className="w-6 h-6" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-bold text-right text-primary leading-snug font-serif" dir="rtl">
              {ulem.name}
            </h3>
            {ulem.title && (
              <p className="text-sm text-muted-foreground text-right mt-0.5 font-serif" dir="rtl">{ulem.title}</p>
            )}
            {ulem.bio && (
              <p className="text-sm text-muted-foreground text-right mt-2 leading-relaxed font-serif" dir="rtl">{ulem.bio}</p>
            )}
            <div className="flex items-center gap-2 mt-3 justify-end flex-wrap">
              {ulem.facebookUrl && (
                <a href={ulem.facebookUrl} target="_blank" rel="noopener noreferrer">
                  <Button size="sm" variant="outline" className="h-8 gap-1.5 text-blue-600 border-blue-200 hover:bg-blue-50">
                    <Facebook className="w-3.5 h-3.5" />
                    Facebook
                  </Button>
                </a>
              )}
              {ulem.youtubeUrl && (
                <a href={ulem.youtubeUrl} target="_blank" rel="noopener noreferrer">
                  <Button size="sm" variant="outline" className="h-8 gap-1.5 text-red-600 border-red-200 hover:bg-red-50">
                    <Youtube className="w-3.5 h-3.5" />
                    YouTube
                  </Button>
                </a>
              )}
              <Button
                size="sm"
                variant="outline"
                onClick={() => setOpen(v => !v)}
                className="h-8 gap-1.5 text-primary border-primary/30 hover:bg-primary/10"
              >
                <BookOpen className="w-3.5 h-3.5" />
                کتابیں
                {open ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {open && (
        <div className="border-t border-primary/10 bg-primary/5 px-5 py-4">
          {booksLoading ? (
            <div className="flex justify-center py-4"><Spinner className="w-5 h-5 text-primary" /></div>
          ) : books.length === 0 ? (
            <p className="text-center text-sm text-muted-foreground py-3 font-serif" dir="rtl">
              ابھی کوئی کتاب شامل نہیں ہے
            </p>
          ) : (
            <div className="space-y-2">
              <p className="text-xs font-semibold text-primary mb-3 text-right font-serif" dir="rtl">
                کتابیں ({books.length})
              </p>
              {books.map(book => (
                <div key={book.id} className="flex items-center justify-between gap-3 bg-white rounded-lg p-3 border border-primary/10">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-right text-foreground font-serif" dir="rtl">{book.title}</p>
                    {book.description && (
                      <p className="text-xs text-muted-foreground text-right mt-0.5 font-serif" dir="rtl">{book.description}</p>
                    )}
                  </div>
                  {book.fileUrl && (
                    <a href={book.fileUrl} target="_blank" rel="noopener noreferrer" className="shrink-0">
                      <Button size="sm" variant="outline" className="h-7 gap-1 text-xs text-primary border-primary/30">
                        <ExternalLink className="w-3 h-3" />
                        پڑھیں
                      </Button>
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function UlemaPage() {
  const { data: ulema, loading } = useUlema();
  const [search, setSearch] = useState("");

  useEffect(() => {
    document.title = "علماء کرام — AtwsQuranofficial";
  }, []);

  const filtered = ulema.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    (u.bio?.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 via-white to-white">
      <div className="border-b border-primary/10 bg-white/80 backdrop-blur sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <Link href="/">
            <Button variant="ghost" size="sm" className="text-primary">← واپس</Button>
          </Link>
          <h1 className="text-xl font-bold text-primary font-serif" dir="rtl">علماء کرام</h1>
          <div className="w-16" />
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        <div className="text-center space-y-3">
          <div className="flex justify-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Star className="w-8 h-8 text-primary" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-primary font-serif" dir="rtl">
            ہمارے علماء کرام
          </h2>
          <p className="text-muted-foreground font-serif" dir="rtl">
            ان علمائے دین کی کتابیں، دروس اور مواد یہاں دستیاب ہے
          </p>
          <Badge variant="outline" className="border-primary/30 text-primary">
            {ulema.length} علماء کرام
          </Badge>
        </div>

        <div className="relative max-w-md mx-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="نام سے تلاش کریں..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9 text-right font-serif"
            dir="rtl"
          />
        </div>

        {loading ? (
          <div className="flex justify-center py-16"><Spinner className="w-10 h-10 text-primary" /></div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground font-serif" dir="rtl">
            کوئی عالم نہیں ملا
          </div>
        ) : (
          <div className="grid gap-4">
            {filtered.map((ulem, idx) => (
              <div key={ulem.id} className="flex gap-3 items-start">
                <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold shrink-0 mt-3">
                  {idx + 1}
                </div>
                <div className="flex-1">
                  <UlemCard ulem={ulem} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
