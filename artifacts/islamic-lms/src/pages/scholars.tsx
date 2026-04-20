import { useState, useMemo, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Search, User, BookOpen, Play, ExternalLink } from "lucide-react";
import { Link } from "wouter";
import { Badge } from "@/components/ui/badge";

function useMeta(title: string, description: string) {
  useEffect(() => {
    document.title = title;
    let meta = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
    if (!meta) { meta = document.createElement("meta"); meta.name = "description"; document.head.appendChild(meta); }
    meta.content = description;
  }, [title, description]);
}

interface Scholar {
  id: string;
  name: string;
  nameAr: string;
  maslak: string;
  maslakColor: string;
  born?: string;
  died?: string;
  specialty: string[];
  bio: string;
  books: string[];
  videoUrl?: string;
  imageInitials: string;
}

const SCHOLARS: Scholar[] = [
  {
    id: "ibn-taymiyyah",
    name: "Sheikh ul Islam Ibn Taymiyyah",
    nameAr: "شیخ الاسلام ابن تیمیہ",
    maslak: "Salafi",
    maslakColor: "bg-green-100 text-green-700 border-green-200",
    born: "661 AH",
    died: "728 AH",
    specialty: ["Aqeedah", "Fiqh", "Hadith", "Tafsir"],
    bio: "One of the greatest Islamic scholars, known for his profound knowledge in Aqeedah, Fiqh, and refutation of innovations. Author of hundreds of books and fatwas.",
    books: ["Majmoo ul Fatawa", "Al-Aqeedah ul Wasitiyyah", "Minhaj ul Sunnah", "Dar ul Ta'arud ul Aql wan Naql"],
    imageInitials: "ابن",
  },
  {
    id: "ibn-qayyim",
    name: "Imam Ibn ul Qayyim Al-Jawziyyah",
    nameAr: "امام ابن قیم الجوزیہ",
    maslak: "Salafi",
    maslakColor: "bg-green-100 text-green-700 border-green-200",
    born: "691 AH",
    died: "751 AH",
    specialty: ["Aqeedah", "Fiqh", "Spirituality", "Tafsir"],
    bio: "Student of Ibn Taymiyyah and one of the most prolific Islamic authors. His works on heart purification and Aqeedah remain classics of Islamic literature.",
    books: ["Zaad ul Ma'ad", "Madarij ul Salikeen", "I'lam ul Muwaqqieen", "Kitab ul Ruh"],
    imageInitials: "ابن",
  },
  {
    id: "bukhari",
    name: "Imam Muhammad ibn Ismail Al-Bukhari",
    nameAr: "امام محمد بن اسماعیل البخاری",
    maslak: "Muhaddis",
    maslakColor: "bg-amber-100 text-amber-700 border-amber-200",
    born: "194 AH",
    died: "256 AH",
    specialty: ["Hadith", "Rijal", "Fiqh"],
    bio: "The greatest compiler of Prophetic Hadith. His Sahih ul Bukhari is considered the most authentic book after the Quran. He traveled extensively to collect authentic narrations.",
    books: ["Sahih ul Bukhari", "Al-Adab ul Mufrad", "Al-Tarikh ul Kabeer"],
    imageInitials: "بخ",
  },
  {
    id: "muslim",
    name: "Imam Muslim ibn Al-Hajjaj",
    nameAr: "امام مسلم بن الحجاج",
    maslak: "Muhaddis",
    maslakColor: "bg-amber-100 text-amber-700 border-amber-200",
    born: "204 AH",
    died: "261 AH",
    specialty: ["Hadith", "Rijal"],
    bio: "Compiler of Sahih Muslim, the second most authentic Hadith collection. Known for his meticulous methodology in authenticating narrations.",
    books: ["Sahih Muslim", "Al-Musnad ul Kabeer"],
    imageInitials: "مس",
  },
  {
    id: "abu-hanifa",
    name: "Imam Abu Hanifa Al-Nu'man",
    nameAr: "امام ابو حنیفہ النعمان",
    maslak: "Hanafi",
    maslakColor: "bg-blue-100 text-blue-700 border-blue-200",
    born: "80 AH",
    died: "150 AH",
    specialty: ["Fiqh", "Aqeedah", "Usool"],
    bio: "Founder of the Hanafi school of thought, one of the four major Sunni legal schools. Known as the 'Great Imam' (Al-Imam ul A'zam) for his profound legal reasoning.",
    books: ["Al-Fiqh ul Akbar", "Al-Musnad", "Al-Alim wal Muta'allim"],
    imageInitials: "ابو",
  },
  {
    id: "malik",
    name: "Imam Malik ibn Anas",
    nameAr: "امام مالک بن انس",
    maslak: "Maliki",
    maslakColor: "bg-purple-100 text-purple-700 border-purple-200",
    born: "93 AH",
    died: "179 AH",
    specialty: ["Fiqh", "Hadith", "Usool"],
    bio: "Founder of the Maliki school of Fiqh. Born and raised in Madinah, his Muwatta is one of the earliest and most important Hadith compilations.",
    books: ["Al-Muwatta", "Al-Mudawwanah ul Kubra"],
    imageInitials: "ما",
  },
  {
    id: "shafi",
    name: "Imam Muhammad ibn Idris Al-Shafi'i",
    nameAr: "امام محمد بن ادریس الشافعی",
    maslak: "Shafi'i",
    maslakColor: "bg-teal-100 text-teal-700 border-teal-200",
    born: "150 AH",
    died: "204 AH",
    specialty: ["Fiqh", "Usool", "Hadith", "Poetry"],
    bio: "Founder of the Shafi'i school and father of Islamic Jurisprudence methodology (Usool ul Fiqh). Student of Imam Malik and teacher of Imam Ahmad.",
    books: ["Al-Risalah", "Al-Umm", "Musnad Al-Shafi'i"],
    imageInitials: "شا",
  },
  {
    id: "ahmad",
    name: "Imam Ahmad ibn Hanbal",
    nameAr: "امام احمد بن حنبل",
    maslak: "Hanbali",
    maslakColor: "bg-rose-100 text-rose-700 border-rose-200",
    born: "164 AH",
    died: "241 AH",
    specialty: ["Hadith", "Fiqh", "Aqeedah"],
    bio: "Founder of the Hanbali school. Known for his steadfastness during the Mu'tazilite inquisition (Mihnah). His Musnad contains over 30,000 Hadith.",
    books: ["Al-Musnad", "Al-Aqeedah", "Usool ul Sunnah", "Al-Radd ala ul Jahmiyyah"],
    imageInitials: "اح",
  },
  {
    id: "nawawi",
    name: "Imam Yahya ibn Sharaf Al-Nawawi",
    nameAr: "امام یحییٰ بن شرف النووی",
    maslak: "Shafi'i",
    maslakColor: "bg-teal-100 text-teal-700 border-teal-200",
    born: "631 AH",
    died: "676 AH",
    specialty: ["Hadith", "Fiqh", "Language"],
    bio: "One of the greatest Shafi'i scholars whose works remain standard references. Known for his Riyadh ul Saliheen and commentary on Sahih Muslim.",
    books: ["Riyadh ul Saliheen", "Al-Majmoo", "Al-Minhaj (Sharh Sahih Muslim)", "Al-Arba'een ul Nawawiyyah"],
    imageInitials: "نو",
  },
  {
    id: "ibn-kathir",
    name: "Imam Ismail ibn Kathir Al-Dimashqi",
    nameAr: "امام اسماعیل بن کثیر الدمشقی",
    maslak: "Salafi",
    maslakColor: "bg-green-100 text-green-700 border-green-200",
    born: "700 AH",
    died: "774 AH",
    specialty: ["Tafsir", "Hadith", "History"],
    bio: "One of the most renowned scholars of Tafsir and History. His Tafsir ul Quran ul Azeem is among the most widely read and referenced Quran commentaries.",
    books: ["Tafsir Ibn Kathir", "Al-Bidayah wan Nihayah", "Al-Jami ul Masanid"],
    imageInitials: "ابن",
  },
  {
    id: "suyuti",
    name: "Imam Jalal ud-Din Al-Suyuti",
    nameAr: "امام جلال الدین السیوطی",
    maslak: "Shafi'i",
    maslakColor: "bg-teal-100 text-teal-700 border-teal-200",
    born: "849 AH",
    died: "911 AH",
    specialty: ["Tafsir", "Hadith", "Language", "History"],
    bio: "One of the most prolific Islamic scholars with over 500 works. Known for Tafsir Jalalayn (co-authored with Imam Mahalli) and extensive works in Hadith sciences.",
    books: ["Tafsir Jalalayn", "Al-Itqan fi Uloom ul Quran", "Tadreeb ul Rawi", "Al-Dur ul Manthoor"],
    imageInitials: "سی",
  },
  {
    id: "barelvi",
    name: "Imam Ahmad Raza Khan Barelvi",
    nameAr: "امام احمد رضا خان بریلوی",
    maslak: "Barelvi",
    maslakColor: "bg-yellow-100 text-yellow-700 border-yellow-200",
    born: "1272 AH (1856 CE)",
    died: "1340 AH (1921 CE)",
    specialty: ["Fiqh", "Fatawa", "Sufism", "Poetry"],
    bio: "Founder of the Barelvi movement in South Asia. Authored Fatawa Razawiyyah (a monumental fatwa collection) and translated the Quran in Urdu (Kanz ul Iman).",
    books: ["Fatawa Razawiyyah (30 vols)", "Kanz ul Iman (Quran Translation)", "Al-Dawlat ul Makkiyyah"],
    imageInitials: "رض",
  },
];

const MASLAK_FILTERS = ["All", "Salafi", "Hanafi", "Maliki", "Shafi'i", "Hanbali", "Barelvi", "Muhaddis"];

export default function Scholars() {
  useMeta(
    "علماء کا کتب خانہ — Scholars Library | AtwsQuranofficial",
    "Profiles of great Islamic scholars from various schools of thought — Salafi, Hanafi, Maliki, Shafi'i, Hanbali, Barelvi. Biographies, books, and more."
  );

  const [search, setSearch] = useState("");
  const [maslakFilter, setMaslakFilter] = useState("All");
  const [selectedScholar, setSelectedScholar] = useState<Scholar | null>(null);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return SCHOLARS.filter(s => {
      const matchesMaslak = maslakFilter === "All" || s.maslak === maslakFilter;
      const matchesSearch = !q || s.name.toLowerCase().includes(q) || s.nameAr.includes(q) || s.maslak.toLowerCase().includes(q);
      return matchesMaslak && matchesSearch;
    });
  }, [search, maslakFilter]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-green-900 via-emerald-800 to-teal-900 text-white">
        <div className="max-w-6xl mx-auto px-4 py-12 text-center">
          <Link href="/">
            <button className="inline-flex items-center gap-2 text-green-300 hover:text-white text-sm mb-6 transition-colors">
              ← واپس ہوم پیج
            </button>
          </Link>
          <div className="inline-flex items-center gap-2 bg-white/10 text-amber-300 px-4 py-1.5 rounded-full text-sm font-medium mb-4 border border-white/20">
            <User className="w-4 h-4" />
            علماء کرام کے پروفائل
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-3" style={{ fontFamily: "Noto Naskh Arabic, serif" }}>
            علماء کا کتب خانہ
          </h1>
          <p className="text-green-200 text-lg mb-1">Scholars Library — Great Islamic Scholars</p>
          <p className="text-green-300 text-sm" dir="rtl">
            مختلف مسالک کے علماء کے پروفائل، سوانح، کتابیں اور ویڈیوز
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
        {/* Search & Filter */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="عالم کا نام تلاش کریں… (Urdu / English)"
                className="pl-9 bg-gray-50 border-gray-200 rounded-xl h-10 text-sm"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {MASLAK_FILTERS.map(m => (
                <button
                  key={m}
                  onClick={() => setMaslakFilter(m)}
                  className={`px-3 py-2 text-xs font-semibold rounded-xl border transition-all ${
                    maslakFilter === m
                      ? "bg-green-700 text-white border-green-700"
                      : "bg-white text-gray-600 border-gray-200 hover:border-green-300"
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-2">{filtered.length} scholars found</p>
        </div>

        {/* Scholars Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <User className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="text-lg font-medium" dir="rtl">کوئی عالم نہیں ملا</p>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map(scholar => (
              <ScholarCard key={scholar.id} scholar={scholar} onClick={() => setSelectedScholar(scholar)} />
            ))}
          </div>
        )}
      </div>

      {/* Scholar Detail Modal */}
      {selectedScholar && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4" onClick={() => setSelectedScholar(null)}>
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="bg-gradient-to-r from-green-800 to-emerald-900 p-6 text-white">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center text-xl font-bold text-white shrink-0" style={{ fontFamily: "Noto Naskh Arabic, serif" }}>
                  {selectedScholar.imageInitials}
                </div>
                <div>
                  <h2 className="text-xl font-bold" style={{ fontFamily: "Noto Naskh Arabic, serif" }} dir="rtl">{selectedScholar.nameAr}</h2>
                  <p className="text-green-200 text-sm">{selectedScholar.name}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full border font-semibold ${selectedScholar.maslakColor}`}>
                      {selectedScholar.maslak}
                    </span>
                    {selectedScholar.born && (
                      <span className="text-xs text-green-300">{selectedScholar.born} — {selectedScholar.died}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="p-6 space-y-5">
              <div>
                <h3 className="text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                  <User className="w-4 h-4 text-green-600" /> سوانح — Biography
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">{selectedScholar.bio}</p>
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-green-600" /> اہم کتابیں — Key Books
                </h3>
                <ul className="space-y-1.5">
                  {selectedScholar.books.map((book, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-gray-700">
                      <span className="w-5 h-5 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-xs font-bold shrink-0">{i + 1}</span>
                      {book}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-700 mb-2">تخصص — Specialties</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedScholar.specialty.map(s => (
                    <span key={s} className="text-xs px-2.5 py-1 rounded-full bg-green-50 text-green-700 border border-green-200 font-medium">{s}</span>
                  ))}
                </div>
              </div>
              {selectedScholar.videoUrl && (
                <a href={selectedScholar.videoUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 w-full justify-center py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition-colors text-sm">
                  <Play className="w-4 h-4" /> ویڈیو دیکھیں
                </a>
              )}
              <button onClick={() => setSelectedScholar(null)} className="w-full py-2.5 border border-gray-200 text-gray-600 hover:bg-gray-50 rounded-xl text-sm font-medium transition-colors">
                بند کریں — Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ScholarCard({ scholar, onClick }: { scholar: Scholar; onClick: () => void }) {
  return (
    <article
      className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all cursor-pointer hover:border-green-200 overflow-hidden"
      onClick={onClick}
    >
      <div className="p-5">
        <div className="flex items-start gap-4 mb-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-700 to-emerald-800 flex items-center justify-center text-lg font-bold text-white shrink-0" style={{ fontFamily: "Noto Naskh Arabic, serif" }}>
            {scholar.imageInitials}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-bold text-gray-900 text-base leading-tight" style={{ fontFamily: "Noto Naskh Arabic, serif" }} dir="rtl">
              {scholar.nameAr}
            </h3>
            <p className="text-xs text-gray-500 mt-0.5 leading-tight">{scholar.name}</p>
            <div className="flex items-center gap-2 mt-1.5">
              <span className={`text-[10px] px-2 py-0.5 rounded-full border font-semibold ${scholar.maslakColor}`}>
                {scholar.maslak}
              </span>
              {scholar.born && (
                <span className="text-[10px] text-gray-400">{scholar.born}</span>
              )}
            </div>
          </div>
        </div>
        <p className="text-xs text-gray-500 leading-relaxed mb-3 line-clamp-2">{scholar.bio}</p>
        <div className="flex flex-wrap gap-1.5 mb-3">
          {scholar.specialty.map(s => (
            <span key={s} className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 font-medium">{s}</span>
          ))}
        </div>
        <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
          <BookOpen className="w-3.5 h-3.5 text-gray-400" />
          <p className="text-xs text-gray-400">{scholar.books.length} major books</p>
          <button className="ml-auto text-xs text-green-600 hover:text-green-700 font-semibold flex items-center gap-1">
            پروفائل دیکھیں <ExternalLink className="w-3 h-3" />
          </button>
        </div>
      </div>
    </article>
  );
}
