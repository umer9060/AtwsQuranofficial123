import { useState, useMemo, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BookOpen, Search, GraduationCap, Filter, Download, Eye, BookMarked, Library } from "lucide-react";
import { Link } from "wouter";

function useMeta(title: string, description: string) {
  useEffect(() => {
    document.title = title;
    let meta = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
    if (!meta) { meta = document.createElement("meta"); meta.name = "description"; document.head.appendChild(meta); }
    meta.content = description;
  }, [title, description]);
}

export type Section = "banin" | "banat";
export interface Book { name: string; nameAr?: string; tag?: string; pdfUrl?: string; viewUrl?: string; }
export interface Darja {
  id: string;
  name: string;
  nameUrdu: string;
  nameAr?: string;
  books: Book[];
  sharhat: Book[];
}

const BANIN_DARJAT: Darja[] = [
  {
    id: "oola",
    name: "Awwali (Grade 1)",
    nameUrdu: "اولیٰ — ثانویہ عامہ سال اول",
    nameAr: "الأولى",
    books: [
      { name: "Jamal ul Quran", nameAr: "جمال القرآن", tag: "Quran" },
      { name: "Hifz Am Parah", nameAr: "حفظ عم پارہ", tag: "Quran" },
      { name: "Nisf Taal", nameAr: "نصف تال" },
      { name: "Al-Fiqh ul Muyassar", nameAr: "الفقہ المیسر", tag: "Fiqh" },
      { name: "Mahfuzat (Part 1)", nameAr: "محفوظات (حصہ اول)" },
      { name: "Nahw Mir Farsi", nameAr: "نحو میر فارسی" },
      { name: "Al-Nahw ul Yasir", nameAr: "النحو الیسر" },
      { name: "Nahw Mir (Abdullah Gungohawi)", nameAr: "نحو میر (عبداللہ گنگوہی)" },
      { name: "Fanusah (Kakori)", nameAr: "فانوسہ (کاکوری)" },
      { name: "Irshad ul Sarf", nameAr: "ارشاد الصرف" },
      { name: "Tahzeeb ul Sarf (M. Fareed Ahmad Haqani)", nameAr: "تہذیب الصرف (مولانا فرید احمد حقانی)" },
    ],
    sharhat: [
      { name: "Nahw Mir ma'al Ijraa — Urdu Explanation", nameAr: "نحو میر مع الاجراء کی اردو شرح" },
      { name: "Irshad ul Sarf — Urdu Explanation", nameAr: "ارشاد الصرف کی اردو شرح" },
    ],
  },
  {
    id: "saania",
    name: "Saaniyah (Grade 2)",
    nameUrdu: "ثانیہ — ثانویہ عامہ سال دوم",
    nameAr: "الثانية",
    books: [
      { name: "Tabarak wa Am Parah", nameAr: "تبارک و عم پارہ", tag: "Quran" },
      { name: "Ramzah ul Tarawih (Pashto)", nameAr: "رمضہ التراویح (پشتو)" },
      { name: "Murji'ah ul Taratim (Urdu)", nameAr: "مرجعہ التراتم (اردو)" },
      { name: "Zaad ul Talibeen", nameAr: "زاد الطالبین", tag: "Fiqh" },
      { name: "Mukhtasar ul Qudoori", nameAr: "مختصر القدوری", tag: "Fiqh" },
      { name: "Ilm ul Seegha", nameAr: "علم الصیغہ" },
      { name: "Dastoor ul Mubtadi", nameAr: "دستور المبتدی" },
      { name: "Hidayat ul Nahw", nameAr: "ہدایۃ النحو" },
      { name: "Mi'atu Aamil", nameAr: "مائۃ عامل" },
      { name: "Muallim ul Insha 1", nameAr: "معلم الانشاء 1" },
      { name: "Al-Arabiyya Bayna Yadayk 2, 3", nameAr: "العربیہ بین یدیک 2،3" },
      { name: "Tasheel ul Mantiq", nameAr: "تسہیل المنطق" },
    ],
    sharhat: [
      { name: "Hidayat ul Nahw ma'al Ijraa — Urdu Explanation", nameAr: "ہدایۃ النحو مع الاجراء کی اردو شرح" },
    ],
  },
  {
    id: "saalis",
    name: "Saalisah (Grade 3)",
    nameUrdu: "ثالثہ — ثانویہ خاصہ سال اول",
    nameAr: "الثالثة",
    books: [
      { name: "Tarjama Surah Al-Kahf to Surah An-Nas", nameAr: "ترجمہ سورۃ الکہف تا سورۃ الناس", tag: "Quran" },
      { name: "Ramzah ul Tarawih", nameAr: "رمضہ التراویح" },
      { name: "Murji'ah ul Taratim", nameAr: "مرجعہ التراتم" },
      { name: "Al-Adab ul Mufrad", nameAr: "الادب المفرد", tag: "Hadith" },
      { name: "Kanz ud-Daqaiq", nameAr: "کنز الدقائق", tag: "Fiqh" },
      { name: "Usool ul Shashi", nameAr: "اصول الشاشی", tag: "Fiqh" },
      { name: "Al-Kafiyah", nameAr: "کافیہ" },
      { name: "Mirah ul Arwah", nameAr: "مراح الارواح" },
      { name: "Nafhat ul Arab", nameAr: "نفحۃ العرب" },
      { name: "Al-Arabiyya Bayna Yadayk 5, 6, 2", nameAr: "العربیہ بین یدیک 5،6،2" },
      { name: "Mirqat", nameAr: "مرقات" },
    ],
    sharhat: [
      { name: "Al-Kafiyah — Urdu Explanation", nameAr: "کافیہ کی اردو شرح" },
      { name: "Mirah ul Arwah ma Abwab — Urdu Explanation", nameAr: "مراح الارواح مع اسان خصوصیات الابواب کی اردو شرح" },
      { name: "Mirqat — Urdu Lugawi Explanation", nameAr: "مرقات کی اردو لغوی شرح" },
    ],
  },
  {
    id: "raabi",
    name: "Raabi'ah (Grade 4)",
    nameUrdu: "رابعہ — ثانویہ خاصہ سال دوم",
    nameAr: "الرابعة",
    books: [
      { name: "Aal Imran to Surah Al-Kahf", nameAr: "آل عمران تا سورۃ کہف", tag: "Quran" },
      { name: "Riyadh ul Saliheen", nameAr: "ریاض الصالحین", tag: "Hadith" },
      { name: "Usool ul Sunnah", nameAr: "اصول السنۃ" },
      { name: "Al-Maqamat ul Hariryyah", nameAr: "المقامات الحریریۃ" },
      { name: "Al-Arabiyya Bayna Yadayk 8, 7", nameAr: "العربیہ بین یدیک 8،7" },
      { name: "Duroos ul Balagha", nameAr: "دروس البلاغۃ" },
    ],
    sharhat: [
      { name: "Sharh ul Wiqayah Vol 2, 3", nameAr: "شرح الوقایۃ جلد 2،3" },
      { name: "Noor ul Anwar", nameAr: "نور الانوار" },
      { name: "Sharh ul Jami (Mu'arrab)", nameAr: "شرح الجامی (معرب)" },
      { name: "Sharh ul Tahzeeb — Urdu Explanation", nameAr: "شرح التہذیب کی اردو شرح" },
    ],
  },
  {
    id: "khamis",
    name: "Khaamisah (Grade 5)",
    nameUrdu: "خامسہ — عالیہ سال اول",
    nameAr: "الخامسة",
    books: [
      { name: "Surah Al-Baqarah (style of Shaykh al-Mashayikh Husayn Ali)", nameAr: "سورۃ البقرۃ بطرز شیخ المشائخ حسین علی", tag: "Quran" },
      { name: "Muqaddimah Nayl ul Sa'ireen", nameAr: "مقدمہ نیل السائرین" },
      { name: "Athar ul Sunan", nameAr: "اثار السنن", tag: "Hadith" },
      { name: "Husami", nameAr: "حسامی" },
      { name: "Al-Hidayah (Salatan)", nameAr: "الہدایہ (صلاتاً)", tag: "Fiqh" },
      { name: "Hidayat ul Hikmah", nameAr: "ہدایۃ الحکمۃ" },
      { name: "Talkhees ul Miftah", nameAr: "تلخیص المفتاح" },
      { name: "Sab'a Muallaqat", nameAr: "سبع معلقات" },
      { name: "Sullam ul Uloom (Tasawwurat)", nameAr: "سلم العلوم تصورات" },
      { name: "Muheet ul Da'irah", nameAr: "محیط الدائرۃ" },
    ],
    sharhat: [
      { name: "Sharh ul Jami (Munni) — Urdu Explanation", nameAr: "شرح الجامی (منی) کی اردو شرح" },
    ],
  },
  {
    id: "sadis",
    name: "Saadisah (Grade 6)",
    nameUrdu: "سادسہ — عالیہ سال دوم",
    nameAr: "السادسة",
    books: [
      { name: "Tafsir Jalalayn", nameAr: "تفسیر جلالین", tag: "Tafsir" },
      { name: "Anwar ul Tanzeel", nameAr: "انوار التنزیل", tag: "Tafsir" },
      { name: "Al-Fawz ul Kabeer", nameAr: "الفوز الکبیر" },
      { name: "Musnad ul Imam ul A'zam", nameAr: "مسند الامام الاعظم", tag: "Hadith" },
      { name: "Tayseer Mustalah ul Hadith", nameAr: "تیسیر مصطلح الحدیث", tag: "Hadith" },
      { name: "Al-Saraji", nameAr: "السراحی", tag: "Fiqh" },
      { name: "Al-Hidayah (Nikah)", nameAr: "الہدایہ (نکاح)", tag: "Fiqh" },
      { name: "Tawdeeh wa Talweeh", nameAr: "تلویح و توضیح" },
      { name: "Mukhtasar ul Ma'ani", nameAr: "مختصر المعانی" },
      { name: "Sharh ul Aqaid", nameAr: "شرح العقائد" },
      { name: "Al-Aqeedah ul Tahawiyyah", nameAr: "العقیدۃ الطحاویۃ" },
      { name: "Diwan ul Hamasah", nameAr: "دیوان الحماسۃ" },
      { name: "Tafheem ul Falakiyyat", nameAr: "تفہیم الفلکیات" },
      { name: "Matn ul Kafi", nameAr: "متن الکافی" },
    ],
    sharhat: [
      { name: "Tawdeeh wa Talweeh and Mukhtasar ul Ma'ani — Urdu Explanation", nameAr: "تلویح و توضیح اور مختصر المعانی کی اردو شرح" },
    ],
  },
  {
    id: "saabi",
    name: "Saabi'ah (Grade 7)",
    nameUrdu: "سابعہ — عالمیہ سال اول",
    nameAr: "السابعة",
    books: [
      { name: "Tafsir Baydawi", nameAr: "تفسیر بیضاوی", tag: "Tafsir" },
      { name: "Muntakhabaat ul Itqan", nameAr: "منتخبات الاتقان", tag: "Tafsir" },
      { name: "Mishkat ul Masabih (Vol 1 & 2)", nameAr: "مشکوٰۃ شریف (اول و ثانی)", tag: "Hadith" },
      { name: "Sharh Nukhbat ul Fikr", nameAr: "شرح نخبۃ الفکر", tag: "Hadith" },
      { name: "Al-Hidayah (Vol 3 & 4)", nameAr: "الہدایہ (حصہ سوم و چہارم)", tag: "Fiqh" },
    ],
    sharhat: [
      { name: "Al-Kafiyaan wal Madhahib — Urdu Explanation", nameAr: "الکافیان و المذاہب کی اردو وضاحت" },
    ],
  },
  {
    id: "dawra-hadith",
    name: "Dawra Hadith (Grade 8)",
    nameUrdu: "دورہ حدیث — عالمیہ سال دوم",
    nameAr: "دورة الحديث",
    books: [
      { name: "Sahih ul Bukhari (Vol 1 & 2)", nameAr: "صحیح البخاری (جلد اول و ثانی)", tag: "Sahih Bukhari" },
      { name: "Sahih Muslim (Vol 1 & 2)", nameAr: "صحیح مسلم (جلد اول و ثانی)", tag: "Sahih Muslim" },
      { name: "Sunan ul Tirmidhi (Vol 1 & 2)", nameAr: "سنن الترمذی (جلد اول و ثانی)", tag: "Hadith" },
      { name: "Sunan ul Nasa'i", nameAr: "سنن النسائی", tag: "Hadith" },
      { name: "Sunan Abi Dawood", nameAr: "سنن ابی داود", tag: "Hadith" },
      { name: "Sunan Ibn Majah", nameAr: "سنن ابن ماجہ", tag: "Hadith" },
      { name: "Shama'il ul Tirmidhi", nameAr: "شمائل ترمذی", tag: "Hadith" },
      { name: "Muwatta Imam Muhammad", nameAr: "موطا امام محمد", tag: "Hadith" },
      { name: "Ma'ani ul Athar (Vol 1)", nameAr: "معانی الآثار (جلد اول)", tag: "Hadith" },
    ],
    sharhat: [],
  },
];

const BANAT_DARJAT: Darja[] = [
  {
    id: "khasa-awal",
    name: "Khassah Awal (Grade 1)",
    nameUrdu: "خاصہ اول — درجہ اول",
    nameAr: "خاصة أول",
    books: [
      { name: "Muallim ul Talibeen", nameAr: "معلم الطالبین" },
      { name: "Zaad ul Talibeen", nameAr: "زاد الطالبین", tag: "Fiqh" },
      { name: "Ta'leem ul Islam", nameAr: "تعلیم الاسلام" },
      { name: "Ilm ul Sarf (Part 1, 2, 3)", nameAr: "علم الصرف (جزء اول، دوم، سوم)" },
      { name: "Ilm ul Nahw (Part 1)", nameAr: "علم النحو (جزء اول)" },
      { name: "Al-Fatihah wa Qisar ul Suwar", nameAr: "فاتحہ و قصار سور", tag: "Quran" },
      { name: "Raziyah ul Tarajim (Pashto) / Marziyah ul Tarajim (Urdu)", nameAr: "رضیہ التراجم (پشتو) یا مرضیہ التراجم (اردو)" },
      { name: "Khulasat ul Tajweed", nameAr: "خلاصۃ التجوید" },
    ],
    sharhat: [
      { name: "Ilm ul Sarf — Urdu Explanation", nameAr: "علم الصرف کی اردو شرح" },
      { name: "Ilm ul Nahw — Urdu Explanation", nameAr: "علم النحو کی اردو شرح" },
    ],
  },
  {
    id: "khasa-dom",
    name: "Khassah Dom (Grade 2)",
    nameUrdu: "خاصہ دوم — درجہ دوم",
    nameAr: "خاصة دوم",
    books: [
      { name: "Tasheel ul Mantiq", nameAr: "تسہیل المنطق" },
      { name: "Nahw Mir or Al-Nahw ul Yasir", nameAr: "نحو میر یا النحو الیسر" },
      { name: "Irshad ul Sarf or Tahzeeb ul Sarf", nameAr: "ارشاد الصرف یا تہذیب الصرف" },
      { name: "Mukhtasar ul Qudoori (up to Kitab ul Hajj)", nameAr: "مختصر القدوری (تا کتاب الحج)", tag: "Fiqh" },
      { name: "Kitab ul Nikah to Kitab ul Faraqat", nameAr: "کتاب النکاح تا آخر کتاب الفرقات", tag: "Fiqh" },
      { name: "Hifz Aam Parah 1 (Half)", nameAr: "علم پارہ اول (نصف) حفظ", tag: "Quran" },
      { name: "Aal Imran to End", nameAr: "آل عمران تا آخر", tag: "Quran" },
    ],
    sharhat: [
      { name: "Irshad ul Sarf — Urdu Explanation", nameAr: "ارشاد الصرف کی اردو شرح" },
      { name: "Nahw Mir — Urdu Explanation", nameAr: "نحو میر کی اردو شرح" },
      { name: "Mukhtasar ul Qudoori — Urdu Explanation", nameAr: "مختصر القدوری کی اردو شرح" },
      { name: "Hidayat ul Nahw — Urdu Explanation", nameAr: "ہدایۃ النحو کی اردو شرح" },
      { name: "Tasheel ul Mantiq — Urdu Explanation", nameAr: "تسہیل المنطق کی اردو شرح" },
    ],
  },
  {
    id: "aaliyah-awal",
    name: "Aaliyah Awal (Grade 3)",
    nameUrdu: "عالیہ اول — درجہ سوم",
    nameAr: "عالية أول",
    books: [
      { name: "Hidayat ul Nahw", nameAr: "ہدایۃ النحو" },
      { name: "Mukhtasar ul Qudoori (Remaining)", nameAr: "مختصر القدوری (باقی)", tag: "Fiqh" },
      { name: "Aqeedah Tahawiyyah", nameAr: "عقیدۃ طحاویہ" },
      { name: "Riyadh ul Saliheen", nameAr: "ریاض الصالحین", tag: "Hadith" },
      { name: "Al-An'am to Surah Al-Isra", nameAr: "انعام تا سورۃ الاسراء", tag: "Quran" },
      { name: "Duroos ul Balagha", nameAr: "دروس البلاغۃ" },
      { name: "Nafhat ul Arab", nameAr: "نفحۃ العرب" },
      { name: "Al-Wabil ul Sayyib", nameAr: "الوایل الصیب" },
    ],
    sharhat: [
      { name: "Hidayat ul Nahw — Urdu Explanation", nameAr: "ہدایۃ النحو کی اردو شرح" },
      { name: "Mukhtasar ul Qudoori — Urdu Explanation", nameAr: "مختصر القدوری کی اردو شرح" },
      { name: "Duroos ul Balagha — Urdu Explanation", nameAr: "دروس البلاغۃ کی اردو شرح" },
      { name: "Nafhat ul Arab — Urdu Explanation", nameAr: "نفحۃ العرب کی اردو شرح" },
    ],
  },
  {
    id: "aaliyah-dom",
    name: "Aaliyah Dom (Grade 4)",
    nameUrdu: "عالیہ دوم — درجہ چہارم",
    nameAr: "عالية دوم",
    books: [
      { name: "Tarbiyyat Awlad ka Nabawi Andaz", nameAr: "تربیت اولاد کا نبوی انداز" },
      { name: "Al-Hidayah (Vol 1)", nameAr: "ہدایۃ (اول)", tag: "Fiqh" },
      { name: "Mishkat (Vol 1)", nameAr: "مشکوۃ (اول)", tag: "Hadith" },
      { name: "Sharh ul Aqaid", nameAr: "شرح العقائد" },
      { name: "Surah Al-Kahf to End", nameAr: "سورۃ الکہف تا آخر", tag: "Quran" },
      { name: "Usool ul Sunnah (Urdu)", nameAr: "اصول السنۃ (اردو)" },
      { name: "Mishkat (Vol 2)", nameAr: "مشکوۃ (ثانی)", tag: "Hadith" },
    ],
    sharhat: [
      { name: "Al-Hidayah — Urdu Explanation", nameAr: "ہدایۃ کی اردو شرح" },
      { name: "Mishkat — Urdu Explanation", nameAr: "مشکوۃ کی اردو شرح" },
      { name: "Sharh ul Aqaid — Urdu Explanation", nameAr: "شرح العقائد کی اردو شرح" },
    ],
  },
  {
    id: "aalamiya-awal",
    name: "Aalamiyyah Awal (Grade 5)",
    nameUrdu: "عالمیہ اول — درجہ پنجم",
    nameAr: "عالمية أول",
    books: [
      { name: "Al-Adyan wal Madhahib (Urdu)", nameAr: "الادیان والمذاہب (اردو)" },
      { name: "Al-Hidayah (Vol 2)", nameAr: "الہدایہ (ثانی)", tag: "Fiqh" },
      { name: "Sharh Ma'ani ul Athar", nameAr: "شرح معانی الآثار", tag: "Hadith" },
      { name: "Tayseer Mustalah ul Hadith", nameAr: "تیسیر مصطلح الحدیث", tag: "Hadith" },
      { name: "Jalalayn Muntakhabat", nameAr: "جلالین منتخبات", tag: "Tafsir" },
    ],
    sharhat: [
      { name: "Al-Hidayah (Vol 2) — Urdu Explanation", nameAr: "الہدایہ (ثانی) کی اردو شرح" },
      { name: "Sharh Ma'ani ul Athar — Urdu Explanation", nameAr: "شرح معانی الآثار کی اردو شرح" },
    ],
  },
  {
    id: "aalamiya-dom",
    name: "Aalamiyyah Dom (Grade 6)",
    nameUrdu: "عالمیہ دوم — درجہ چھم",
    nameAr: "عالمية دوم",
    books: [
      { name: "Sahih ul Bukhari (Vol 1 & 2)", nameAr: "صحیح البخاری (جلد اول و دوم)", tag: "Sahih Bukhari" },
      { name: "Sahih Muslim (Vol 1 & 2)", nameAr: "صحیح مسلم (جلد اول و دوم)", tag: "Sahih Muslim" },
      { name: "Jami ul Tirmidhi", nameAr: "جامع الترمذی", tag: "Hadith" },
      { name: "Sunan Abi Dawood", nameAr: "سنن ابی داود", tag: "Hadith" },
      { name: "Shama'il ul Tirmidhi", nameAr: "شمائل ترمذی", tag: "Hadith" },
    ],
    sharhat: [],
  },
];

const TAG_STYLES: Record<string, string> = {
  "Quran":        "bg-emerald-100 text-emerald-700 border-emerald-200",
  "Sahih Bukhari":"bg-amber-100  text-amber-700  border-amber-200",
  "Sahih Muslim": "bg-blue-100   text-blue-700   border-blue-200",
  "Hadith":       "bg-purple-100 text-purple-700 border-purple-200",
  "Fiqh":         "bg-teal-100   text-teal-700   border-teal-200",
  "Tafsir":       "bg-green-100  text-green-700  border-green-200",
};
const SECTION_BADGE: Record<Section, string> = {
  banin: "bg-sky-100 text-sky-700 border-sky-200",
  banat: "bg-rose-100 text-rose-700 border-rose-200",
};

export default function DarseNizami() {
  useMeta(
    "Wifaq ul Madaris Al-Salfia — Book Library | AtwsQuranofficial",
    "Complete Wifaq ul Madaris Al-Salfia curriculum for Boys (Banin) and Girls (Banat) — online library with PDF download and read options."
  );

  const [activeSection, setActiveSection] = useState<Section>("banin");
  const [search, setSearch] = useState("");
  const [darjaFilter, setDarjaFilter] = useState("all");
  const [bookType, setBookType] = useState<"all" | "asal" | "sharhat">("all");

  const darjat = activeSection === "banin" ? BANIN_DARJAT : BANAT_DARJAT;

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return darjat
      .filter(d => darjaFilter === "all" || d.id === darjaFilter)
      .map(d => {
        const asal = bookType !== "sharhat" ? (q ? d.books.filter(b => b.name.toLowerCase().includes(q) || (b.nameAr ?? "").includes(q)) : d.books) : [];
        const sharhat = bookType !== "asal" ? (q ? d.sharhat.filter(b => b.name.toLowerCase().includes(q) || (b.nameAr ?? "").includes(q)) : d.sharhat) : [];
        return { ...d, filteredBooks: asal, filteredSharhat: sharhat };
      })
      .filter(d => d.filteredBooks.length > 0 || d.filteredSharhat.length > 0);
  }, [darjat, search, darjaFilter, bookType]);

  const totalBooks = darjat.reduce((sum, d) => sum + d.books.length + d.sharhat.length, 0);

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* ─── Hero Header ─── */}
      <div className="bg-gradient-to-br from-green-900 via-emerald-800 to-teal-900 text-white">
        <div className="max-w-6xl mx-auto px-4 py-12 text-center" dir="ltr">
          <Link href="/">
            <button className="inline-flex items-center gap-2 text-green-300 hover:text-white text-sm mb-6 transition-colors">
              ← واپس ہوم پیج
            </button>
          </Link>
          <div className="inline-flex items-center gap-2 bg-white/10 text-amber-300 px-4 py-1.5 rounded-full text-sm font-medium mb-4 border border-white/20">
            <Library className="w-4 h-4" />
            وفاق المدارس السلفیہ پاکستان
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-3" style={{ fontFamily: "Noto Naskh Arabic, serif" }}>
            مکتبہ کتاب
          </h1>
          <p className="text-green-200 text-lg mb-1">Wifaq ul Madaris Al-Salfia — Complete Book Library</p>
          <p className="text-green-300 text-sm" dir="rtl">
            لڑکوں اور لڑکیوں کے مکمل نصاب کی آن لائن لائبریری · PDF ڈاؤن لوڈ اور آن لائن پڑھیں
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8 space-y-6" dir="ltr">
        {/* ─── Section Tabs ─── */}
        <div className="flex gap-3 justify-center">
          {(["banin", "banat"] as Section[]).map((sec) => (
            <button
              key={sec}
              onClick={() => { setActiveSection(sec); setDarjaFilter("all"); setSearch(""); }}
              className={`px-7 py-3 rounded-full font-bold text-sm transition-all border shadow-sm ${
                activeSection === sec
                  ? sec === "banin"
                    ? "bg-sky-600 text-white border-sky-600 shadow-md shadow-sky-200"
                    : "bg-rose-500 text-white border-rose-500 shadow-md shadow-rose-200"
                  : "bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:shadow"
              }`}
            >
              {sec === "banin" ? "👦 لڑکوں کا نصاب — بنین (8 درجات)" : "👧 لڑکیوں کا نصاب — بنات (6 درجات)"}
            </button>
          ))}
        </div>

        {/* ─── Stats bar ─── */}
        <div className="flex items-center justify-center gap-6 text-sm text-gray-500 flex-wrap">
          <span><strong className="text-gray-800">{darjat.length}</strong> درجات</span>
          <span className="w-px h-4 bg-gray-200" />
          <span><strong className="text-gray-800">{totalBooks}</strong> کل کتابیں</span>
          <span className="w-px h-4 bg-gray-200" />
          <span className={`font-medium ${activeSection === "banin" ? "text-sky-600" : "text-rose-500"}`}>
            {activeSection === "banin" ? "بنین (لڑکے)" : "بنات (لڑکیاں)"}
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
                placeholder="کتاب کا نام تلاش کریں… (Urdu / English)"
                className="pl-9 bg-gray-50 border-gray-200 rounded-xl h-10 text-sm"
                dir="rtl"
              />
            </div>
            <div className="flex gap-2 items-center flex-wrap">
              <Filter className="w-4 h-4 text-gray-400 shrink-0" />
              <Select value={darjaFilter} onValueChange={setDarjaFilter}>
                <SelectTrigger className="w-56 h-10 rounded-xl bg-gray-50 border-gray-200 text-sm">
                  <SelectValue placeholder="درجہ فلٹر" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">تمام درجات — All</SelectItem>
                  {darjat.map(d => (
                    <SelectItem key={d.id} value={d.id}>{d.nameUrdu}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={bookType} onValueChange={v => setBookType(v as "all" | "asal" | "sharhat")}>
                <SelectTrigger className="w-44 h-10 rounded-xl bg-gray-50 border-gray-200 text-sm">
                  <SelectValue placeholder="کتاب کی قسم" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">تمام کتابیں</SelectItem>
                  <SelectItem value="asal">اصل کتابیں</SelectItem>
                  <SelectItem value="sharhat">اردو شرحات</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          {search && (
            <p className="text-xs text-gray-400 mt-2 ml-1" dir="rtl">
              "<strong>{search}</strong>" کے لیے {filtered.reduce((s, d) => s + d.filteredBooks.length + d.filteredSharhat.length, 0)} نتائج
            </p>
          )}
        </div>

        {/* ─── Darja Cards ─── */}
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="text-lg font-medium" dir="rtl">کوئی کتاب نہیں ملی</p>
            <p className="text-sm">Try a different search or filter</p>
          </div>
        ) : (
          <div className="space-y-6">
            {filtered.map((darja) => (
              <DarjaCard key={darja.id} darja={darja} section={activeSection} />
            ))}
          </div>
        )}

        {/* ─── Legend ─── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">کتاب کے ٹیگز — Book Tags</h3>
          <div className="flex flex-wrap gap-2">
            {Object.entries(TAG_STYLES).map(([tag, cls]) => (
              <span key={tag} className={`text-xs px-2.5 py-1 rounded-full border font-medium ${cls}`}>{tag}</span>
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-3" dir="rtl">
            وفاق المدارس السلفیہ پاکستان کے نصاب تعلیم کے مطابق۔ PDF فائلیں جلد دستیاب ہوں گی۔
          </p>
        </div>
      </div>
    </div>
  );
}

function DarjaCard({ darja, section }: { darja: Darja & { filteredBooks: Book[]; filteredSharhat: Book[] }; section: Section }) {
  const [activeTab, setActiveTab] = useState<"asal" | "sharhat">("asal");

  const headingBanin = "bg-gradient-to-r from-sky-600 to-blue-700";
  const headingBanat = "bg-gradient-to-r from-rose-500 to-pink-600";

  const showBooks = darja.filteredBooks.length > 0;
  const showSharhat = darja.filteredSharhat.length > 0;

  return (
    <article className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
      {/* Card Header */}
      <header className={`px-6 py-5 ${section === "banin" ? headingBanin : headingBanat}`}>
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <p className="text-white/70 text-xs font-medium mb-0.5">{darja.nameAr}</p>
            <h2 className="text-xl font-bold text-white leading-tight" dir="rtl">{darja.nameUrdu}</h2>
            <p className="text-white/70 text-sm mt-0.5">{darja.name}</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-center">
              <p className="text-white text-lg font-bold">{darja.books.length}</p>
              <p className="text-white/60 text-xs">اصل کتابیں</p>
            </div>
            {darja.sharhat.length > 0 && (
              <>
                <div className="w-px h-8 bg-white/20" />
                <div className="text-center">
                  <p className="text-white text-lg font-bold">{darja.sharhat.length}</p>
                  <p className="text-white/60 text-xs">شرحات</p>
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Tab selector */}
      <div className="border-b border-gray-100 px-4 pt-3">
        <div className="flex gap-1">
          {showBooks && (
            <button
              onClick={() => setActiveTab("asal")}
              className={`px-4 py-2 text-sm font-semibold rounded-t-lg border-b-2 transition-colors ${
                activeTab === "asal" ? "border-green-600 text-green-700 bg-green-50" : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              📚 اصل کتابیں ({darja.filteredBooks.length})
            </button>
          )}
          {showSharhat && (
            <button
              onClick={() => setActiveTab("sharhat")}
              className={`px-4 py-2 text-sm font-semibold rounded-t-lg border-b-2 transition-colors ${
                activeTab === "sharhat" ? "border-amber-600 text-amber-700 bg-amber-50" : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              📖 اردو شرحات ({darja.filteredSharhat.length})
            </button>
          )}
        </div>
      </div>

      {/* Book List */}
      <div className="p-4">
        {activeTab === "asal" && showBooks && (
          <div className="grid gap-2 md:grid-cols-2">
            {darja.filteredBooks.map((book, i) => (
              <BookCard key={i} book={book} index={i} type="asal" />
            ))}
          </div>
        )}
        {activeTab === "sharhat" && showSharhat && (
          <div className="grid gap-2 md:grid-cols-2">
            {darja.filteredSharhat.map((book, i) => (
              <BookCard key={i} book={book} index={i} type="sharhat" />
            ))}
          </div>
        )}
        {activeTab === "asal" && !showBooks && showSharhat && (
          <p className="text-center text-gray-400 text-sm py-4">شرحات ٹیب پر جائیں</p>
        )}
        {activeTab === "sharhat" && !showSharhat && (
          <p className="text-center text-gray-400 text-sm py-4 dir-rtl">اس درجے میں کوئی الگ شرح نہیں — اصل متون پر زیادہ زور</p>
        )}
      </div>
    </article>
  );
}

function BookCard({ book, index, type }: { book: Book; index: number; type: "asal" | "sharhat" }) {
  const isAsal = type === "asal";
  return (
    <div className={`flex items-start gap-3 px-3 py-3 rounded-xl border transition-all hover:shadow-sm ${
      isAsal ? "bg-white border-gray-100 hover:border-green-200" : "bg-amber-50/50 border-amber-100 hover:border-amber-300"
    }`}>
      <span className="text-gray-300 text-xs font-mono w-5 shrink-0 mt-0.5">
        {String(index + 1).padStart(2, "0")}
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-1.5 mb-0.5">
          {book.tag && (
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full border font-semibold ${TAG_STYLES[book.tag] ?? "bg-gray-100 text-gray-600"}`}>
              {book.tag}
            </span>
          )}
          {!isAsal && (
            <span className="text-[10px] px-1.5 py-0.5 rounded-full border font-semibold bg-amber-100 text-amber-700 border-amber-200">
              شرح
            </span>
          )}
        </div>
        <p className="text-sm font-semibold text-gray-800 leading-tight" dir="rtl">{book.nameAr}</p>
        <p className="text-xs text-gray-500 mt-0.5 leading-tight">{book.name}</p>
      </div>
      <div className="flex flex-col gap-1 shrink-0">
        <a
          href={book.pdfUrl ?? "#"}
          onClick={e => { if (!book.pdfUrl) e.preventDefault(); }}
          title="PDF ڈاؤن لوڈ"
          className={`flex items-center gap-1 text-[10px] px-2 py-1 rounded-md font-medium transition-colors ${
            book.pdfUrl
              ? "bg-green-600 text-white hover:bg-green-700"
              : "bg-gray-100 text-gray-400 cursor-not-allowed"
          }`}
        >
          <Download className="w-3 h-3" />
          PDF
        </a>
        <a
          href={book.viewUrl ?? "#"}
          onClick={e => { if (!book.viewUrl) e.preventDefault(); }}
          title="آن لائن پڑھیں"
          className={`flex items-center gap-1 text-[10px] px-2 py-1 rounded-md font-medium transition-colors ${
            book.viewUrl
              ? "bg-blue-600 text-white hover:bg-blue-700"
              : "bg-gray-100 text-gray-400 cursor-not-allowed"
          }`}
        >
          <Eye className="w-3 h-3" />
          Read
        </a>
      </div>
    </div>
  );
}
