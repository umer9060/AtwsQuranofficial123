import { useState, useMemo, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BookOpen, Search, GraduationCap, Filter } from "lucide-react";

/* ─── SEO ─── */
function useMeta(title: string, description: string) {
  useEffect(() => {
    document.title = title;
    let meta = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
    if (!meta) { meta = document.createElement("meta"); meta.name = "description"; document.head.appendChild(meta); }
    meta.content = description;
  }, [title, description]);
}

/* ─── Curriculum Data ─── */
export type Section = "banin" | "banat";
export interface Book { name: string; nameAr?: string; tag?: string; href?: string; }
export interface Darja { id: string; name: string; nameUrdu: string; books: Book[]; }

const DARJA_ORDER = ["khasa-awal", "khasa-dom", "aaliyah-awal", "aaliyah-dom", "mawqoof-alaih", "dawra-hadith"];

const BANIN_DARJAT: Darja[] = [
  {
    id: "khasa-awal",
    name: "Khasa Awal",
    nameUrdu: "خاصہ اول",
    books: [
      { name: "Quran Majeed (Nazra)", nameAr: "قرآن مجید (ناظرہ)", tag: "Quran" },
      { name: "Noorani Qaida", nameAr: "نورانی قاعدہ" },
      { name: "Tuhfa tul Atfal", nameAr: "تحفۃ الاطفال" },
      { name: "Muallim ul Insha (Part 1)", nameAr: "معلم الانشاء (حصہ اول)" },
      { name: "Mizan ul Sarf", nameAr: "میزان الصرف" },
      { name: "Munshib", nameAr: "منشعب" },
      { name: "Panj Surah wa Kalimaat", nameAr: "پنج سورہ و کلمات" },
      { name: "Dini Taleem", nameAr: "دینی تعلیم" },
    ],
  },
  {
    id: "khasa-dom",
    name: "Khasa Dom",
    nameUrdu: "خاصہ دوم",
    books: [
      { name: "Quran Majeed (Nazra)", nameAr: "قرآن مجید (ناظرہ)", tag: "Quran" },
      { name: "Miftah ul Sarf", nameAr: "مفتاح الصرف" },
      { name: "Muallim ul Insha (Part 2)", nameAr: "معلم الانشاء (حصہ دوم)" },
      { name: "Sab'a Muallaqat", nameAr: "سبعہ معلقات" },
      { name: "Ilm ul Sarf (Tasreef)", nameAr: "علم الصرف (تصریف)" },
      { name: "Aqeedah Tahawiyyah", nameAr: "عقیدہ طحاویہ" },
      { name: "Dars-e-Quran", nameAr: "درسِ قرآن" },
    ],
  },
  {
    id: "aaliyah-awal",
    name: "Aaliyah Awal",
    nameUrdu: "عالیہ اول",
    books: [
      { name: "Quran Majeed", nameAr: "قرآن مجید", tag: "Quran" },
      { name: "Hidayat ul Nahw", nameAr: "ہدایۃ النحو" },
      { name: "Kafiya (Al-Kafiyah)", nameAr: "الکافیہ" },
      { name: "Sharh Tahzeeb (Mantiq)", nameAr: "شرح تہذیب (منطق)" },
      { name: "Mukhtar us Sihah", nameAr: "مختار الصحاح" },
      { name: "Sarf Mir", nameAr: "صرف میر" },
      { name: "Tasheel ul Aqaid", nameAr: "تسہیل العقائد" },
      { name: "Mulla Jami (Fiqh)", nameAr: "ملا جامی" },
    ],
  },
  {
    id: "aaliyah-dom",
    name: "Aaliyah Dom",
    nameUrdu: "عالیہ دوم",
    books: [
      { name: "Quran Majeed", nameAr: "قرآن مجید", tag: "Quran" },
      { name: "Tafsir Jalalayn", nameAr: "تفسیر جلالین" },
      { name: "Nur ul Anwar", nameAr: "نور الانوار" },
      { name: "Al-Manar (Usool ul Fiqh)", nameAr: "المنار (اصول الفقہ)" },
      { name: "Sharh Aqaid ul Nasafiyyah", nameAr: "شرح العقائد النسفیہ" },
      { name: "Mulla Hassan (Balagha)", nameAr: "ملا حسن (بلاغت)" },
      { name: "Sharah Miata Amil", nameAr: "شرح مائۃ عامل" },
      { name: "Mishkat ul Masabih (Introduction)", nameAr: "مشکاۃ المصابیح (تعارف)", tag: "Hadith" },
    ],
  },
  {
    id: "mawqoof-alaih",
    name: "Mawqoof Alaih",
    nameUrdu: "موقوف علیہ",
    books: [
      { name: "Quran Majeed", nameAr: "قرآن مجید", tag: "Quran" },
      { name: "Sahih Bukhari (Vol. 1)", nameAr: "صحیح بخاری (جلد اول)", tag: "Sahih Bukhari" },
      { name: "Mishkat ul Masabih (Complete)", nameAr: "مشکاۃ المصابیح (مکمل)", tag: "Hadith" },
      { name: "Al-Hidayah (Vol. 1–2)", nameAr: "الہدایہ (جلد اول و دوم)" },
      { name: "Sharh Wiqayah", nameAr: "شرح الوقایہ" },
      { name: "Usool ul Shashi", nameAr: "اصول الشاشی" },
      { name: "Noorul Anwar (Part 2)", nameAr: "نور الانوار (حصہ دوم)" },
      { name: "Sab'a Sanabil", nameAr: "سبعہ سنابل" },
    ],
  },
  {
    id: "dawra-hadith",
    name: "Dawra Hadith",
    nameUrdu: "دورہ حدیث",
    books: [
      { name: "Quran Majeed", nameAr: "قرآن مجید", tag: "Quran" },
      { name: "Sahih Bukhari (Complete)", nameAr: "صحیح البخاری (مکمل)", tag: "Sahih Bukhari" },
      { name: "Sahih Muslim (Complete)", nameAr: "صحیح مسلم (مکمل)", tag: "Sahih Muslim" },
      { name: "Sunan Abu Dawood", nameAr: "سنن ابی داود", tag: "Hadith" },
      { name: "Jami al-Tirmidhi", nameAr: "جامع الترمذی", tag: "Hadith" },
      { name: "Sunan al-Nasa'i", nameAr: "سنن النسائی", tag: "Hadith" },
      { name: "Sunan Ibn Majah", nameAr: "سنن ابن ماجہ", tag: "Hadith" },
      { name: "Muwatta Imam Malik", nameAr: "موطا امام مالک", tag: "Hadith" },
      { name: "Muwatta Imam Muhammad", nameAr: "موطا امام محمد", tag: "Hadith" },
      { name: "Sharh Maani al-Athar", nameAr: "شرح معانی الآثار", tag: "Hadith" },
    ],
  },
];

const BANAT_DARJAT: Darja[] = [
  {
    id: "khasa-awal",
    name: "Khasa Awal",
    nameUrdu: "خاصہ اول",
    books: [
      { name: "Quran Majeed (Nazra)", nameAr: "قرآن مجید (ناظرہ)", tag: "Quran" },
      { name: "Noorani Qaida", nameAr: "نورانی قاعدہ" },
      { name: "Tuhfa tul Atfal", nameAr: "تحفۃ الاطفال" },
      { name: "Muallim ul Insha (Part 1)", nameAr: "معلم الانشاء (حصہ اول)" },
      { name: "Mizan ul Sarf", nameAr: "میزان الصرف" },
      { name: "Panj Surah wa Kalimaat", nameAr: "پنج سورہ و کلمات" },
      { name: "Dini Taleem", nameAr: "دینی تعلیم" },
    ],
  },
  {
    id: "khasa-dom",
    name: "Khasa Dom",
    nameUrdu: "خاصہ دوم",
    books: [
      { name: "Quran Majeed (Nazra)", nameAr: "قرآن مجید (ناظرہ)", tag: "Quran" },
      { name: "Miftah ul Sarf", nameAr: "مفتاح الصرف" },
      { name: "Muallim ul Insha (Part 2)", nameAr: "معلم الانشاء (حصہ دوم)" },
      { name: "Aqeedah Tahawiyyah", nameAr: "عقیدہ طحاویہ" },
      { name: "Ilm ul Sarf (Tasreef)", nameAr: "علم الصرف (تصریف)" },
      { name: "Dars-e-Quran", nameAr: "درسِ قرآن" },
    ],
  },
  {
    id: "aaliyah-awal",
    name: "Aaliyah Awal",
    nameUrdu: "عالیہ اول",
    books: [
      { name: "Quran Majeed", nameAr: "قرآن مجید", tag: "Quran" },
      { name: "Hidayat ul Nahw", nameAr: "ہدایۃ النحو" },
      { name: "Kafiya (Al-Kafiyah)", nameAr: "الکافیہ" },
      { name: "Sharh Tahzeeb (Mantiq)", nameAr: "شرح تہذیب (منطق)" },
      { name: "Tasheel ul Aqaid", nameAr: "تسہیل العقائد" },
      { name: "Mukhtar us Sihah", nameAr: "مختار الصحاح" },
      { name: "Al-Amthilat ul Mukhtalifah", nameAr: "الامثلۃ المختلفۃ" },
    ],
  },
  {
    id: "aaliyah-dom",
    name: "Aaliyah Dom",
    nameUrdu: "عالیہ دوم",
    books: [
      { name: "Quran Majeed", nameAr: "قرآن مجید", tag: "Quran" },
      { name: "Tafsir Jalalayn", nameAr: "تفسیر جلالین" },
      { name: "Nur ul Anwar", nameAr: "نور الانوار" },
      { name: "Sharh Aqaid ul Nasafiyyah", nameAr: "شرح العقائد النسفیہ" },
      { name: "Mulla Hassan (Balagha)", nameAr: "ملا حسن (بلاغت)" },
      { name: "Mishkat ul Masabih (Selected)", nameAr: "مشکاۃ المصابیح (منتخب)", tag: "Hadith" },
    ],
  },
  {
    id: "mawqoof-alaih",
    name: "Mawqoof Alaih",
    nameUrdu: "موقوف علیہ",
    books: [
      { name: "Quran Majeed", nameAr: "قرآن مجید", tag: "Quran" },
      { name: "Sahih Bukhari (Vol. 1)", nameAr: "صحیح بخاری (جلد اول)", tag: "Sahih Bukhari" },
      { name: "Mishkat ul Masabih (Complete)", nameAr: "مشکاۃ المصابیح (مکمل)", tag: "Hadith" },
      { name: "Al-Hidayah (Vol. 1–2)", nameAr: "الہدایہ (جلد اول و دوم)" },
      { name: "Sharh Wiqayah", nameAr: "شرح الوقایہ" },
      { name: "Usool ul Shashi", nameAr: "اصول الشاشی" },
    ],
  },
  {
    id: "dawra-hadith",
    name: "Dawra Hadith",
    nameUrdu: "دورہ حدیث",
    books: [
      { name: "Quran Majeed", nameAr: "قرآن مجید", tag: "Quran" },
      { name: "Sahih Bukhari (Complete)", nameAr: "صحیح البخاری (مکمل)", tag: "Sahih Bukhari" },
      { name: "Sahih Muslim (Complete)", nameAr: "صحیح مسلم (مکمل)", tag: "Sahih Muslim" },
      { name: "Sunan Abu Dawood", nameAr: "سنن ابی داود", tag: "Hadith" },
      { name: "Jami al-Tirmidhi", nameAr: "جامع الترمذی", tag: "Hadith" },
      { name: "Sunan al-Nasa'i", nameAr: "سنن النسائی", tag: "Hadith" },
      { name: "Sunan Ibn Majah", nameAr: "سنن ابن ماجہ", tag: "Hadith" },
      { name: "Muwatta Imam Malik", nameAr: "موطا امام مالک", tag: "Hadith" },
      { name: "Muwatta Imam Muhammad", nameAr: "موطا امام محمد", tag: "Hadith" },
    ],
  },
];

/* ─── Tag colours ─── */
const TAG_STYLES: Record<string, string> = {
  "Quran":        "bg-emerald-100 text-emerald-700 border-emerald-200",
  "Sahih Bukhari":"bg-amber-100  text-amber-700  border-amber-200",
  "Sahih Muslim": "bg-blue-100   text-blue-700   border-blue-200",
  "Hadith":       "bg-purple-100 text-purple-700 border-purple-200",
};
const SECTION_BADGE: Record<Section, string> = {
  banin: "bg-sky-100 text-sky-700 border-sky-200",
  banat: "bg-rose-100 text-rose-700 border-rose-200",
};

/* ─── Component ─── */
export default function DarseNizami() {
  useMeta(
    "Dars-e-Nizami Books for Boys & Girls – Wifaq ul Madaris",
    "Complete Dars-e-Nizami book list for Boys (Banin) and Girls (Banat) from Khasa Awal to Dawra Hadith — Wifaq ul Madaris curriculum."
  );

  const [activeSection, setActiveSection] = useState<Section>("banin");
  const [search, setSearch] = useState("");
  const [darjaFilter, setDarjaFilter] = useState("all");

  const darjat = activeSection === "banin" ? BANIN_DARJAT : BANAT_DARJAT;

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return darjat
      .filter(d => darjaFilter === "all" || d.id === darjaFilter)
      .map(d => ({
        ...d,
        books: q
          ? d.books.filter(b => b.name.toLowerCase().includes(q) || (b.nameAr ?? "").includes(q))
          : d.books,
      }))
      .filter(d => d.books.length > 0);
  }, [darjat, search, darjaFilter]);

  const totalBooks = darjat.reduce((sum, d) => sum + d.books.length, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ─── Hero Header ─── */}
      <div className="bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-10 text-center">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium mb-4">
            <GraduationCap className="w-4 h-4" />
            Wifaq ul Madaris Al-Arabia Pakistan
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 font-serif">
            Dars-e-Nizami Books Library
          </h1>
          <p className="text-gray-500 text-base max-w-2xl mx-auto">
            Complete book list for Boys <span className="text-sky-600 font-medium">(Banin)</span> and Girls <span className="text-rose-500 font-medium">(Banat)</span> — from <em>Khasa Awal</em> to <em>Dawra Hadith</em>
          </p>
          <p className="text-xs text-gray-400 mt-2" dir="rtl">دارالعلوم — دورۂ حدیث تک مکمل نصاب</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
        {/* ─── Section Tabs (Boys / Girls) ─── */}
        <div className="flex gap-2 justify-center">
          {(["banin", "banat"] as Section[]).map((sec) => (
            <button
              key={sec}
              onClick={() => { setActiveSection(sec); setDarjaFilter("all"); setSearch(""); }}
              className={`px-6 py-2.5 rounded-full font-semibold text-sm transition-all border ${
                activeSection === sec
                  ? sec === "banin"
                    ? "bg-sky-600 text-white border-sky-600 shadow-md shadow-sky-200"
                    : "bg-rose-500 text-white border-rose-500 shadow-md shadow-rose-200"
                  : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
              }`}
            >
              {sec === "banin" ? "👦 Boys (Banin)" : "👧 Girls (Banat)"}
            </button>
          ))}
        </div>

        {/* ─── Stats bar ─── */}
        <div className="flex items-center justify-center gap-6 text-sm text-gray-500">
          <span><strong className="text-gray-800">{darjat.length}</strong> Darjaat</span>
          <span className="w-px h-4 bg-gray-200" />
          <span><strong className="text-gray-800">{totalBooks}</strong> Total Books</span>
          <span className="w-px h-4 bg-gray-200" />
          <span className={`font-medium ${activeSection === "banin" ? "text-sky-600" : "text-rose-500"}`}>
            {activeSection === "banin" ? "Banin Section" : "Banat Section"}
          </span>
        </div>

        {/* ─── Search & Filter Bar ─── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search books by name…"
                className="pl-9 bg-gray-50 border-gray-200 rounded-xl h-10 text-sm"
              />
            </div>
            <div className="flex gap-2 items-center">
              <Filter className="w-4 h-4 text-gray-400 shrink-0" />
              <Select value={darjaFilter} onValueChange={setDarjaFilter}>
                <SelectTrigger className="w-52 h-10 rounded-xl bg-gray-50 border-gray-200 text-sm">
                  <SelectValue placeholder="Filter by Darja" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Darjaat</SelectItem>
                  {darjat.map(d => (
                    <SelectItem key={d.id} value={d.id}>{d.name} — {d.nameUrdu}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          {search && (
            <p className="text-xs text-gray-400 mt-2 ml-1">
              {filtered.reduce((s, d) => s + d.books.length, 0)} result(s) for "<strong>{search}</strong>"
            </p>
          )}
        </div>

        {/* ─── Darja Cards ─── */}
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="text-lg font-medium">No books found</p>
            <p className="text-sm">Try a different search or filter</p>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {filtered.map((darja, idx) => (
              <DarjaCard key={darja.id} darja={darja} section={activeSection} index={idx} />
            ))}
          </div>
        )}

        {/* ─── Legend ─── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Book Tags</h3>
          <div className="flex flex-wrap gap-2">
            {Object.entries(TAG_STYLES).map(([tag, cls]) => (
              <span key={tag} className={`text-xs px-2.5 py-1 rounded-full border font-medium ${cls}`}>{tag}</span>
            ))}
            <span className={`text-xs px-2.5 py-1 rounded-full border font-medium ${SECTION_BADGE.banin}`}>BANIN</span>
            <span className={`text-xs px-2.5 py-1 rounded-full border font-medium ${SECTION_BADGE.banat}`}>BANAT</span>
          </div>
          <p className="text-xs text-gray-400 mt-3">
            Curriculum based on Wifaq ul Madaris Al-Arabia Pakistan. Book PDFs and additional materials will be added soon.
          </p>
        </div>
      </div>
    </div>
  );
}

/* ─── Darja Card ─── */
function DarjaCard({ darja, section, index }: { darja: Darja; section: Section; index: number }) {
  const accentBanin = "border-sky-200 bg-sky-50";
  const accentBanat = "border-rose-200 bg-rose-50";
  const headingBanin = "bg-sky-600";
  const headingBanat = "bg-rose-500";

  return (
    <article className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col">
      {/* Card Header */}
      <header className={`px-5 py-4 ${section === "banin" ? headingBanin : headingBanat}`}>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white leading-tight">{darja.name}</h2>
            <p className="text-white/80 text-sm mt-0.5 font-urdu" dir="rtl">{darja.nameUrdu}</p>
          </div>
          <div className="text-right">
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${SECTION_BADGE[section]}`}>
              {section === "banin" ? "BANIN" : "BANAT"}
            </span>
            <p className="text-white/60 text-xs mt-1">{darja.books.length} books</p>
          </div>
        </div>
      </header>

      {/* Book List */}
      <div className="flex-1 p-4 space-y-1.5">
        <h3 className="sr-only">{darja.name} Books List</h3>
        {darja.books.map((book, i) => (
          <a
            key={i}
            href={book.href ?? "#"}
            onClick={e => { if (!book.href || book.href === "#") e.preventDefault(); }}
            className="group flex items-start gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
          >
            <span className="text-gray-300 text-xs font-mono w-5 shrink-0 mt-0.5 group-hover:text-gray-400 transition-colors">
              {String(i + 1).padStart(2, "0")}
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-1.5 mb-0.5">
                {book.tag && (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full border font-semibold tracking-wide ${TAG_STYLES[book.tag] ?? "bg-gray-100 text-gray-600"}`}>
                    {book.tag}
                  </span>
                )}
              </div>
              <p className="text-sm font-medium text-gray-800 group-hover:text-primary transition-colors leading-tight">
                {book.name}
              </p>
              {book.nameAr && (
                <p className="text-xs text-gray-400 mt-0.5" dir="rtl">{book.nameAr}</p>
              )}
            </div>
            <BookOpen className="w-3.5 h-3.5 text-gray-200 group-hover:text-primary/40 shrink-0 mt-1 transition-colors" />
          </a>
        ))}
      </div>

      {/* Footer */}
      <footer className={`px-4 py-3 border-t ${section === "banin" ? accentBanin : accentBanat}`}>
        <p className="text-xs text-gray-500 flex items-center gap-1.5">
          <BookOpen className="w-3 h-3 shrink-0" />
          {darja.name} — {section === "banin" ? "Banin (Boys)" : "Banat (Girls)"} Section
        </p>
      </footer>
    </article>
  );
}
