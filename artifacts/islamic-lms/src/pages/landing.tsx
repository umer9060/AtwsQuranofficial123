import { useState } from "react";
import { Link } from "wouter";
import {
  BookOpen, Users, Video, Star, CheckCircle, Phone,
  Globe, ChevronDown, Menu, X, ExternalLink, GraduationCap,
  BookMarked, Mic2, Scroll, Heart, Shield, Clock, Award
} from "lucide-react";

const WA_ADMIN = "https://wa.me/message/RCWLPSMMGS5GK1";
const WA_BOYS = WA_ADMIN;
const WA_GIRLS = WA_ADMIN;
const WA_CHANNEL = "https://whatsapp.com/channel/0029Vb8LsW0GU3BP0tiLAB1A";

const LANGS: Record<string, Record<string, string>> = {
  en: {
    lang: "English",
    admissionOpen: "Admissions Open — Enroll Now",
    admissionSub: "Online Islamic Education — Boys & Girls Separate Systems",
    heroTitle: "AtwsQuranofficial",
    heroTag: "Online Quran & Islamic Education — Full System",
    heroSub: "Noorani Qaida · Quran Nazra · Tajweed · Hifz · Fiqh · Hadith · Translation (Urdu / Pashto)",
    enrollBoys: "Boys Admission — طلبہ داخلہ",
    enrollGirls: "Girls Admission — طالبات داخلہ",
    freeTrial: "Start Free Trial",
    loginBtn: "Student Login",
    onlineOnly: "Online Classes Only",
    separateSystem: "Completely Separate System for Male & Female Students",
    testNote: "All students will be tested before admission and placed in the correct level",
    boysSection: "Boys Section — بنین",
    girlsSection: "Girls Section — بنات",
    joinBoys: "Join Boys WhatsApp Group",
    joinGirls: "Join Girls WhatsApp Group",
    coursesTitle: "Our Courses",
    featuresTitle: "Why AtwsQuranofficial?",
    contactTitle: "Contact Us",
    contactAdmin: "WhatsApp Admin",
    enrollNow: "Enroll Now",
    viewDetails: "View Details",
    nav_home: "Home",
    nav_courses: "Courses",
    nav_admission: "Admission",
    nav_books: "Books & Grades",
    nav_contact: "Contact",
    nav_login: "Login",
  },
  ur: {
    lang: "اردو",
    admissionOpen: "داخلے جاری ہیں — ابھی درج کریں",
    admissionSub: "آن لائن اسلامی تعلیم — طلبہ اور طالبات کا الگ نظام",
    heroTitle: "AtwsQuranofficial",
    heroTag: "آن لائن قرآن و دینی تعلیم کا مکمل نظام",
    heroSub: "نورانی قاعدہ · قرآن مجید · تجوید · حفظ · فقہ · حدیث · ترجمہ (اردو / پشتو)",
    enrollBoys: "طلبہ داخلہ بنین (لڑکے)",
    enrollGirls: "طالبات داخلہ بنات (لڑکیاں)",
    freeTrial: "مفت ٹرائل شروع کریں",
    loginBtn: "طالب علم لاگ ان",
    onlineOnly: "صرف آن لائن کلاسز",
    separateSystem: "طلبہ اور طالبات کا مکمل الگ نظام",
    testNote: "داخلے سے پہلے تمام طلبہ کا ٹیسٹ لیا جائے گا اور درست درجہ میں داخل کیا جائے گا",
    boysSection: "طلبہ کا مدرسہ — بنین",
    girlsSection: "طالبات کا مدرسہ — بنات",
    joinBoys: "طلبہ واٹس ایپ گروپ میں شامل ہوں",
    joinGirls: "طالبات واٹس ایپ گروپ میں شامل ہوں",
    coursesTitle: "ہمارے کورسز",
    featuresTitle: "AtwsQuranofficial کیوں؟",
    contactTitle: "رابطہ کریں",
    contactAdmin: "ایڈمن واٹس ایپ",
    enrollNow: "داخلہ لیں",
    viewDetails: "تفصیل دیکھیں",
    nav_home: "گھر",
    nav_courses: "کورسز",
    nav_admission: "داخلہ",
    nav_books: "کتابیں و درجات",
    nav_contact: "رابطہ",
    nav_login: "لاگ ان",
  },
  ar: {
    lang: "العربية",
    admissionOpen: "التسجيل مفتوح — سجّل الآن",
    admissionSub: "التعليم الإسلامي الإلكتروني — نظامان منفصلان للطلاب والطالبات",
    heroTitle: "AtwsQuranofficial",
    heroTag: "نظام تعليم القرآن والعلوم الإسلامية عبر الإنترنت",
    heroSub: "القاعدة النورانية · القرآن الكريم · التجويد · الحفظ · الفقه · الحديث",
    enrollBoys: "تسجيل الطلاب — بنين",
    enrollGirls: "تسجيل الطالبات — بنات",
    freeTrial: "ابدأ التجربة المجانية",
    loginBtn: "دخول الطلاب",
    onlineOnly: "دروس إلكترونية فقط",
    separateSystem: "نظام منفصل تمامًا للطلاب والطالبات",
    testNote: "يُختبر جميع الطلاب قبل القبول ويُوزَّعون على المستوى المناسب",
    boysSection: "قسم الطلاب — بنين",
    girlsSection: "قسم الطالبات — بنات",
    joinBoys: "انضم لمجموعة واتساب الطلاب",
    joinGirls: "انضمي لمجموعة واتساب الطالبات",
    coursesTitle: "دوراتنا",
    featuresTitle: "لماذا AtwsQuranofficial؟",
    contactTitle: "تواصل معنا",
    contactAdmin: "واتساب الإدارة",
    enrollNow: "سجّل الآن",
    viewDetails: "التفاصيل",
    nav_home: "الرئيسية",
    nav_courses: "الدورات",
    nav_admission: "التسجيل",
    nav_books: "الكتب والمراحل",
    nav_contact: "التواصل",
    nav_login: "دخول",
  },
  ps: {
    lang: "پښتو",
    admissionOpen: "داخله خلاصه ده — اوس ثبت نام وکړئ",
    admissionSub: "آنلاین اسلامي تعلیم — د نارینه او ښځینه جلا سیسټم",
    heroTitle: "AtwsQuranofficial",
    heroTag: "د آنلاین قرآن او دیني زده کړې بشپړ سیسټم",
    heroSub: "نورانی قاعده · قرآن · تجوید · حفظ · فقه · حدیث · ژباړه",
    enrollBoys: "د هلکانو داخله",
    enrollGirls: "د نجونو داخله",
    freeTrial: "وړیا ازموینه پیل کړئ",
    loginBtn: "د زده کوونکي لاګ ان",
    onlineOnly: "یوازې آنلاین ټولګي",
    separateSystem: "د نارینه او ښځینه زده کوونکو لپاره بشپړ جلا سیسټم",
    testNote: "د داخلې دمخه به ټول زده کوونکي ازمایل کیږي او سم درجه ورکول کیږي",
    boysSection: "د هلکانو مدرسه",
    girlsSection: "د نجونو مدرسه",
    joinBoys: "د هلکانو واټساپ ګروپ کې شامل شئ",
    joinGirls: "د نجونو واټساپ ګروپ کې شامل شئ",
    coursesTitle: "زموږ کورسونه",
    featuresTitle: "ولې AtwsQuranofficial؟",
    contactTitle: "مونږ سره اړیکه ونیسئ",
    contactAdmin: "ادمین واټساپ",
    enrollNow: "داخله واخلئ",
    viewDetails: "تفصیل وګورئ",
    nav_home: "کور",
    nav_courses: "کورسونه",
    nav_admission: "داخله",
    nav_books: "کتابونه",
    nav_contact: "اړیکه",
    nav_login: "لاګ ان",
  },
  es: {
    lang: "Español",
    admissionOpen: "Admisiones Abiertas — Inscríbete Ahora",
    admissionSub: "Educación Islámica en Línea — Sistemas Separados para Niños y Niñas",
    heroTitle: "AtwsQuranofficial",
    heroTag: "Sistema Completo de Educación Islámica en Línea",
    heroSub: "Noorani Qaida · Quran · Tajweed · Hifz · Fiqh · Hadith · Traducción",
    enrollBoys: "Admisión Niños — Baneen",
    enrollGirls: "Admisión Niñas — Banaat",
    freeTrial: "Prueba Gratuita",
    loginBtn: "Acceso Estudiantes",
    onlineOnly: "Clases Solo en Línea",
    separateSystem: "Sistema Completamente Separado para Estudiantes Masculinos y Femeninos",
    testNote: "Todos los estudiantes serán evaluados antes de la admisión y colocados en el nivel correcto",
    boysSection: "Sección Masculina — Baneen",
    girlsSection: "Sección Femenina — Banaat",
    joinBoys: "Unirse al Grupo de WhatsApp Niños",
    joinGirls: "Unirse al Grupo de WhatsApp Niñas",
    coursesTitle: "Nuestros Cursos",
    featuresTitle: "¿Por qué AtwsQuranofficial?",
    contactTitle: "Contáctenos",
    contactAdmin: "WhatsApp Admin",
    enrollNow: "Inscríbete",
    viewDetails: "Ver Detalles",
    nav_home: "Inicio",
    nav_courses: "Cursos",
    nav_admission: "Admisión",
    nav_books: "Libros y Grados",
    nav_contact: "Contacto",
    nav_login: "Ingresar",
  },
  pa: {
    lang: "پنجابی",
    admissionOpen: "داخلے کھلے ہن — ہُنے داخلہ لؤ",
    admissionSub: "آن لائن اسلامی تعلیم — مُنڈیاں تے کُڑیاں دا وکھرا نظام",
    heroTitle: "AtwsQuranofficial",
    heroTag: "آن لائن قرآن تے دینی تعلیم دا مکمل نظام",
    heroSub: "نورانی قاعدہ · قرآن مجید · تجوید · حفظ · فقہ · حدیث · ترجمہ",
    enrollBoys: "مُنڈیاں دا داخلہ",
    enrollGirls: "کُڑیاں دا داخلہ",
    freeTrial: "مفت ٹرائل شروع کرو",
    loginBtn: "طالب علم لاگ ان",
    onlineOnly: "صرف آن لائن کلاسیں",
    separateSystem: "مُنڈیاں تے کُڑیاں دا مکمل وکھرا نظام",
    testNote: "داخلے توں پہلاں سارے طالب علماں دا ٹیسٹ لیا جاوے گا تے صحیح درجے وچ داخل کیتا جاوے گا",
    boysSection: "مُنڈیاں دا مدرسہ — بنین",
    girlsSection: "کُڑیاں دا مدرسہ — بنات",
    joinBoys: "مُنڈیاں دے واٹس ایپ گروپ وچ شامل ہوؤ",
    joinGirls: "کُڑیاں دے واٹس ایپ گروپ وچ شامل ہوؤ",
    coursesTitle: "ساڈے کورس",
    featuresTitle: "AtwsQuranofficial کیوں؟",
    contactTitle: "سانوں رابطہ کرو",
    contactAdmin: "ایڈمن واٹس ایپ",
    enrollNow: "داخلہ لؤ",
    viewDetails: "تفصیل ویکھو",
    nav_home: "گھر",
    nav_courses: "کورس",
    nav_admission: "داخلہ",
    nav_books: "کتاباں",
    nav_contact: "رابطہ",
    nav_login: "لاگ ان",
  },
  sd: {
    lang: "سنڌي",
    admissionOpen: "داخلا کھليل آهي — هاڻي داخل ٿيو",
    admissionSub: "آن لائن اسلامي تعليم — ڇوڪرن ۽ ڇوڪرين جو الڳ نظام",
    heroTitle: "AtwsQuranofficial",
    heroTag: "آن لائن قرآن ۽ ديني تعليم جو مڪمل نظام",
    heroSub: "نوراني قاعدو · قرآن مجيد · تجويد · حفظ · فقه · حديث · ترجمو",
    enrollBoys: "ڇوڪرن جو داخلو",
    enrollGirls: "ڇوڪرين جو داخلو",
    freeTrial: "مفت ٽرائل شروع ڪريو",
    loginBtn: "شاگرد لاگ ان",
    onlineOnly: "صرف آن لائن ڪلاسون",
    separateSystem: "ڇوڪرن ۽ ڇوڪرين جو مڪمل الڳ نظام",
    testNote: "داخلي کان اڳ سڀني شاگردن جو ٽيسٽ ورتو ويندو ۽ صحيح درجي ۾ داخل ڪيو ويندو",
    boysSection: "ڇوڪرن جو مدرسو — بنين",
    girlsSection: "ڇوڪرين جو مدرسو — بنات",
    joinBoys: "ڇوڪرن جي واٽس ايپ گروپ ۾ شامل ٿيو",
    joinGirls: "ڇوڪرين جي واٽس ايپ گروپ ۾ شامل ٿيو",
    coursesTitle: "اسان جا ڪورسز",
    featuresTitle: "AtwsQuranofficial ڇو؟",
    contactTitle: "اسان سان رابطو ڪريو",
    contactAdmin: "ايڊمن واٽس ايپ",
    enrollNow: "داخلو وٺو",
    viewDetails: "تفصيل ڏسو",
    nav_home: "گهر",
    nav_courses: "ڪورسز",
    nav_admission: "داخلو",
    nav_books: "ڪتاب",
    nav_contact: "رابطو",
    nav_login: "لاگ ان",
  },
};

const BOYS_LEVELS = [
  { num: 1, ar: "أولى", ur: "اولی — پہلا درجہ", en: "Grade 1 — Awwali" },
  { num: 2, ar: "ثانية", ur: "ثانیہ — دوسرا درجہ", en: "Grade 2 — Saaniyah" },
  { num: 3, ar: "ثالثة", ur: "ثالثہ — تیسرا درجہ", en: "Grade 3 — Saalisah" },
  { num: 4, ar: "رابعة", ur: "رابعہ — چوتھا درجہ", en: "Grade 4 — Raabi'ah" },
  { num: 5, ar: "خامسة", ur: "خامسہ — پانچواں درجہ", en: "Grade 5 — Khaamisah" },
  { num: 6, ar: "سادسة", ur: "سادسہ — چھٹا درجہ", en: "Grade 6 — Saadisah" },
  { num: 7, ar: "سابعة", ur: "سابعہ — موقوف علیہ", en: "Grade 7 — Mawqoof Alayhi" },
  { num: 8, ar: "دورة", ur: "دورۂ حدیث", en: "Grade 8 — Dawra-e-Hadith" },
];

const GIRLS_LEVELS = [
  { num: 1, ar: "خاصة ١", ur: "خاصہ سال اول — پہلا درجہ", en: "Grade 1 — Khassah Year 1" },
  { num: 2, ar: "خاصة ٢", ur: "خاصہ سال دوم — دوسرا درجہ", en: "Grade 2 — Khassah Year 2" },
  { num: 3, ar: "عالية ١", ur: "عالیہ سال اول — تیسرا درجہ", en: "Grade 3 — Aaliyah Year 1" },
  { num: 4, ar: "عالية ٢", ur: "عالیہ سال دوم — چوتھا درجہ", en: "Grade 4 — Aaliyah Year 2" },
  { num: 5, ar: "عالمية ١", ur: "عالمیہ سال اول — پانچواں درجہ", en: "Grade 5 — Aalimiyyah Year 1" },
  { num: 6, ar: "عالمية ٢", ur: "عالمیہ سال دوم — چھٹا درجہ", en: "Grade 6 — Aalimiyyah Year 2" },
];

const COURSES = [
  { icon: BookOpen, title: "نورانی قاعدہ", en: "Noorani Qaida", desc: "بنیادی قرآن پڑھنے کا طریقہ · Basic Quran reading foundations", color: "from-emerald-500 to-green-600" },
  { icon: BookMarked, title: "قرآن مجید ناظرہ", en: "Quran Nazra", desc: "مکمل قرآن پڑھنا · Complete Quran reading with tajweed", color: "from-teal-500 to-emerald-600" },
  { icon: Mic2, title: "علم تجوید", en: "Tajweed", desc: "قرآن کی صحیح تلاوت · Proper Quranic recitation rules", color: "from-green-600 to-teal-700" },
  { icon: Star, title: "حفظ القرآن", en: "Hifz Program", desc: "قرآن حفظ کرنے کا مکمل پروگرام · Full memorization program", color: "from-amber-500 to-yellow-600" },
  { icon: Scroll, title: "فقہ اسلامی", en: "Fiqh (Levels 1–6)", desc: "اسلامی قانون و فقہ · Islamic jurisprudence levels 1–6", color: "from-blue-500 to-indigo-600" },
  { icon: BookOpen, title: "علم الحدیث", en: "Hadith Studies", desc: "احادیث نبوی کا مطالعہ · Study of Prophetic traditions", color: "from-purple-500 to-violet-600" },
  { icon: Globe, title: "ترجمہ قرآن", en: "Translation (Urdu/Pashto)", desc: "قرآن کا اردو / پشتو ترجمہ · Quran translation in Urdu & Pashto", color: "from-rose-500 to-pink-600" },
];

const FEATURES = [
  { icon: Video, title: "One-on-One Classes", ur: "ون آن ون کلاسز" },
  { icon: Users, title: "Separate Boys / Girls", ur: "علیحدہ طلبہ / طالبات" },
  { icon: GraduationCap, title: "Certified Teachers", ur: "سند یافتہ اساتذہ" },
  { icon: Clock, title: "Flexible Timing", ur: "لچک دار اوقات" },
  { icon: Shield, title: "Safe Environment", ur: "محفوظ ماحول" },
  { icon: Award, title: "Certificate on Completion", ur: "مکمل سند" },
  { icon: Heart, title: "Female Teachers for Girls", ur: "طالبات کے لیے الگ خواتین اساتذہ" },
  { icon: Phone, title: "WhatsApp Support", ur: "واٹس ایپ سپورٹ" },
];

export default function Landing() {
  const [lang, setLang] = useState(() => {
    const saved = localStorage.getItem("atws_lang");
    if (saved && LANGS[saved]) return saved;
    const bl = navigator.language.toLowerCase();
    if (bl.startsWith("ar")) return "ar";
    if (bl.startsWith("ps") || bl.startsWith("pus")) return "ps";
    if (bl.startsWith("pa")) return "pa";
    if (bl.startsWith("sd")) return "sd";
    if (bl.startsWith("es")) return "es";
    if (bl.startsWith("en")) return "en";
    return "ur";
  });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);

  const changeLang = (l: string) => {
    setLang(l);
    localStorage.setItem("atws_lang", l);
    setLangMenuOpen(false);
  };

  const t = LANGS[lang];
  const isRtl = lang === "ur" || lang === "ar" || lang === "ps" || lang === "pa" || lang === "sd";

  return (
    <div className={`min-h-screen bg-white font-sans ${isRtl ? "font-[Noto_Naskh_Arabic]" : ""}`} dir={isRtl ? "rtl" : "ltr"}>
      {/* ─── Top Admission Banner ─── */}
      <div className="bg-gradient-to-r from-emerald-700 via-green-600 to-teal-700 text-white py-2.5 px-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,rgba(255,255,255,0.03)_10px,rgba(255,255,255,0.03)_20px)]" />
        <p className="text-sm md:text-base font-bold tracking-wide animate-pulse relative z-10">
          🌙 {t.admissionOpen} &nbsp;·&nbsp; {t.admissionSub} 🌙
        </p>
      </div>

      {/* ─── Navbar ─── */}
      <nav className="bg-white border-b border-green-100 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-600 to-emerald-700 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-lg font-bold text-green-800">AtwsQuranofficial</span>
                <p className="text-xs text-green-600 hidden md:block">إشاعة التوحيد والسنة</p>
              </div>
            </div>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-1">
              {["nav_home", "nav_courses", "nav_admission", "nav_books", "nav_contact"].map(key => (
                <a
                  key={key}
                  href={`#${key.replace("nav_", "")}`}
                  className="px-3 py-2 text-sm text-gray-600 hover:text-green-700 hover:bg-green-50 rounded-md transition-colors"
                >
                  {t[key as keyof typeof t]}
                </a>
              ))}
              <Link href="/library">
                <button className="px-3 py-2 text-sm text-green-700 hover:text-green-800 hover:bg-green-50 rounded-md transition-colors font-medium">
                  📚 مکتبہ کتاب
                </button>
              </Link>
              <Link href="/ulema">
                <button className="px-3 py-2 text-sm text-green-700 hover:text-green-800 hover:bg-green-50 rounded-md transition-colors font-medium">
                  👨‍🎓 علماء
                </button>
              </Link>

              {/* Language Selector */}
              <div className="relative ml-2">
                <button
                  onClick={() => setLangMenuOpen(!langMenuOpen)}
                  className="flex items-center gap-1.5 px-3 py-2 text-sm text-gray-600 hover:text-green-700 hover:bg-green-50 rounded-md transition-colors border border-green-100"
                >
                  <Globe className="w-4 h-4" />
                  <span>{t.lang}</span>
                  <ChevronDown className="w-3 h-3" />
                </button>
                {langMenuOpen && (
                  <div className="absolute top-full mt-1 right-0 bg-white border border-green-100 rounded-lg shadow-lg overflow-hidden z-50 min-w-[120px]">
                    {Object.entries(LANGS).map(([code, ldata]) => (
                      <button
                        key={code}
                        onClick={() => changeLang(code)}
                        className={`w-full text-left px-4 py-2 text-sm transition-colors ${lang === code ? "bg-green-50 text-green-700 font-medium" : "text-gray-600 hover:bg-gray-50"}`}
                      >
                        {ldata.lang}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <Link href="/login">
                <button className="ml-2 px-4 py-2 text-sm font-medium text-green-700 border border-green-300 rounded-lg hover:bg-green-50 transition-colors">
                  {t.nav_login}
                </button>
              </Link>
            </div>

            {/* Mobile menu toggle */}
            <button className="md:hidden p-2 rounded-md text-gray-500 hover:bg-gray-100" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-green-100 bg-white px-4 py-3 space-y-1">
            {["nav_home", "nav_courses", "nav_admission", "nav_books", "nav_contact"].map(key => (
              <a key={key} href={`#${key.replace("nav_", "")}`} onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-sm text-gray-700 hover:bg-green-50 rounded-md">
                {t[key as keyof typeof t]}
              </a>
            ))}
            <Link href="/library">
              <button onClick={() => setMobileMenuOpen(false)} className="w-full text-left px-3 py-2 text-sm text-green-700 font-medium hover:bg-green-50 rounded-md">
                📚 مکتبہ کتاب (Book Library)
              </button>
            </Link>
            <Link href="/ulema">
              <button onClick={() => setMobileMenuOpen(false)} className="w-full text-left px-3 py-2 text-sm text-green-700 font-medium hover:bg-green-50 rounded-md">
                👨‍🎓 علماء کا کتب خانہ
              </button>
            </Link>
            <div className="flex gap-2 pt-2 flex-wrap">
              {Object.entries(LANGS).map(([code, ldata]) => (
                <button
                  key={code}
                  onClick={() => { changeLang(code); setMobileMenuOpen(false); }}
                  className={`px-3 py-1 text-xs rounded-full border transition-colors ${lang === code ? "bg-green-100 border-green-400 text-green-700 font-medium" : "border-gray-200 text-gray-500"}`}
                >
                  {ldata.lang}
                </button>
              ))}
            </div>
            <Link href="/login">
              <button className="w-full mt-2 px-4 py-2 text-sm font-medium text-green-700 border border-green-300 rounded-lg hover:bg-green-50">
                {t.nav_login}
              </button>
            </Link>
          </div>
        )}
      </nav>

      {/* ─── HERO SECTION ─── */}
      <section id="home" className="relative overflow-hidden bg-gradient-to-br from-green-900 via-emerald-800 to-teal-900 text-white">
        {/* Islamic geometric background */}
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "radial-gradient(circle at 25% 25%, rgba(255,255,255,0.2) 1px, transparent 1px), radial-gradient(circle at 75% 75%, rgba(255,255,255,0.2) 1px, transparent 1px)", backgroundSize: "50px 50px" }}
        />
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-400 via-amber-300 to-yellow-400" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 md:py-28 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            {/* Arabic header */}
            <div className="text-amber-300 text-2xl md:text-3xl font-bold mb-2 tracking-wider" style={{ fontFamily: "Noto Naskh Arabic, serif" }}>
              بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْم
            </div>
            <div className="text-green-300 text-sm mb-6">إشاعة التوحيد والسنة · وحدة المدارس الإسلامية باكستان</div>

            <h1 className="text-5xl md:text-7xl font-bold mb-4 text-white drop-shadow-lg">{t.heroTitle}</h1>
            <p className="text-xl md:text-2xl text-amber-200 mb-3 font-semibold" style={{ fontFamily: isRtl ? "Noto Naskh Arabic, serif" : "inherit" }}>{t.heroTag}</p>
            <p className="text-green-200 text-base md:text-lg mb-10 leading-relaxed" style={{ fontFamily: isRtl ? "Noto Naskh Arabic, serif" : "inherit" }}>{t.heroSub}</p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
              <a href="#admission" className="w-full sm:w-auto flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-4 rounded-xl shadow-xl transition-all hover:shadow-blue-900/50 hover:scale-105 text-base">
                <span>👦</span> {t.enrollBoys}
              </a>
              <a href="#admission" className="w-full sm:w-auto flex items-center justify-center gap-2 bg-pink-600 hover:bg-pink-700 text-white font-bold px-8 py-4 rounded-xl shadow-xl transition-all hover:shadow-pink-900/50 hover:scale-105 text-base">
                <span>👩</span> {t.enrollGirls}
              </a>
              <Link href="/register">
                <button className="w-full sm:w-auto flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-bold px-8 py-4 rounded-xl shadow-xl transition-all hover:scale-105 text-base">
                  <Star className="w-5 h-5" /> {t.freeTrial}
                </button>
              </Link>
            </div>

            {/* Alert badges */}
            <div className="flex flex-wrap items-center justify-center gap-3">
              <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white text-sm px-4 py-2 rounded-full font-medium">
                <Video className="w-4 h-4 text-amber-300" /> {t.onlineOnly}
              </span>
              <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white text-sm px-4 py-2 rounded-full font-medium">
                <Shield className="w-4 h-4 text-green-300" /> {t.separateSystem}
              </span>
            </div>
          </div>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" preserveAspectRatio="none" className="w-full h-12 md:h-16 fill-white">
            <path d="M0,80 C240,0 480,80 720,40 C960,0 1200,80 1440,40 L1440,80 L0,80 Z" />
          </svg>
        </div>
      </section>

      {/* ─── TEST NOTE BANNER ─── */}
      <section className="bg-amber-50 border-y border-amber-200">
        <div className="max-w-5xl mx-auto px-4 py-5 flex flex-col md:flex-row items-center gap-4 text-center md:text-start">
          <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
            <Award className="w-6 h-6 text-amber-600" />
          </div>
          <div>
            <p className="font-bold text-amber-800 text-base">📝 {t.testNote}</p>
            <p className="text-amber-700 text-sm mt-1">Wahdat-ul-Madaris Al-Islamia Pakistan · إشاعة التوحيد والسنة</p>
          </div>
        </div>
      </section>

      {/* ─── COURSES SECTION ─── */}
      <section id="courses" className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-green-900 mb-3">{t.coursesTitle}</h2>
            <div className="w-20 h-1 bg-gradient-to-r from-green-500 to-amber-400 rounded-full mx-auto" />
          </div>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {COURSES.map(course => (
              <div key={course.title} className="group bg-white border border-green-100 rounded-2xl overflow-hidden hover:shadow-xl transition-all hover:-translate-y-1 hover:border-green-300">
                <div className={`h-2 bg-gradient-to-r ${course.color}`} />
                <div className="p-5">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${course.color} flex items-center justify-center mb-4`}>
                    <course.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-bold text-green-900 text-lg mb-1" style={{ fontFamily: "Noto Naskh Arabic, serif" }}>{course.title}</h3>
                  <p className="text-xs text-green-600 font-medium mb-2">{course.en}</p>
                  <p className="text-sm text-gray-500 leading-relaxed mb-4">{course.desc}</p>
                  <div className="flex gap-2">
                    <a href="#admission" className={`flex-1 text-center text-xs font-semibold py-2 rounded-lg bg-gradient-to-r ${course.color} text-white hover:opacity-90 transition-opacity`}>
                      {t.enrollNow}
                    </a>
                    <button className="flex-1 text-xs font-semibold py-2 rounded-lg border border-green-200 text-green-700 hover:bg-green-50 transition-colors">
                      {t.viewDetails}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── ADMISSION SECTION ─── */}
      <section id="admission" className="py-16 md:py-24 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <span className="inline-block bg-green-100 text-green-700 text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
              🎓 {t.admissionOpen}
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-green-900 mb-4">{t.nav_admission}</h2>
            <div className="w-20 h-1 bg-gradient-to-r from-green-500 to-amber-400 rounded-full mx-auto mb-6" />
            <p className="text-base text-amber-700 bg-amber-50 border border-amber-200 rounded-xl px-6 py-3 inline-block font-medium max-w-2xl">
              📝 {t.testNote}
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            {/* BOYS SECTION */}
            <div className="bg-white rounded-3xl overflow-hidden shadow-xl border-2 border-blue-200 hover:border-blue-400 transition-all">
              <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6 text-white">
                <div className="flex items-center gap-4">
                  <div className="text-5xl">👦</div>
                  <div>
                    <h3 className="text-2xl font-bold">{t.boysSection}</h3>
                    <p className="text-blue-200 text-sm mt-1">بنین · Wahdat-ul-Madaris Boys System</p>
                    <p className="text-blue-100 text-xs mt-1">8 Levels / 8 درجات</p>
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-4">
                {/* Levels grid */}
                <div className="grid grid-cols-2 gap-2">
                  {BOYS_LEVELS.map(level => (
                    <div key={level.num} className="flex items-start gap-2 bg-blue-50 rounded-xl p-3 border border-blue-100">
                      <span className="w-7 h-7 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                        {level.num}
                      </span>
                      <div>
                        <p className="text-xs font-bold text-blue-900" style={{ fontFamily: "Noto Naskh Arabic, serif" }}>{level.ur}</p>
                        <p className="text-xs text-blue-600">{level.en}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Courses included */}
                <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                  <p className="text-xs font-bold text-blue-800 mb-2">📚 Courses Included:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {["نورانی قاعدہ", "قرآن ناظرہ", "تجوید", "فقہ", "حدیث", "عقیدہ", "دورۂ حدیث"].map(c => (
                      <span key={c} className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full" style={{ fontFamily: "Noto Naskh Arabic, serif" }}>{c}</span>
                    ))}
                  </div>
                </div>

                {/* CTA */}
                <div className="space-y-3 pt-2">
                  <a
                    href={WA_BOYS}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-3 w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-xl transition-all hover:scale-105 shadow-lg text-sm"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                    {t.joinBoys}
                  </a>
                  <Link href="/register">
                    <button className="flex items-center justify-center gap-2 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-all text-sm">
                      <GraduationCap className="w-5 h-5" /> {t.enrollNow}
                    </button>
                  </Link>
                </div>
              </div>
            </div>

            {/* GIRLS SECTION */}
            <div className="bg-white rounded-3xl overflow-hidden shadow-xl border-2 border-pink-200 hover:border-pink-400 transition-all">
              <div className="bg-gradient-to-r from-pink-600 to-rose-700 p-6 text-white">
                <div className="flex items-center gap-4">
                  <div className="text-5xl">👩</div>
                  <div>
                    <h3 className="text-2xl font-bold">{t.girlsSection}</h3>
                    <p className="text-pink-200 text-sm mt-1">بنات · Wahdat-ul-Madaris Girls System</p>
                    <p className="text-pink-100 text-xs mt-1">6 Levels / 6 درجات · Female Teachers Only</p>
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-4">
                {/* Levels grid */}
                <div className="grid grid-cols-2 gap-2">
                  {GIRLS_LEVELS.map(level => (
                    <div key={level.num} className="flex items-start gap-2 bg-pink-50 rounded-xl p-3 border border-pink-100">
                      <span className="w-7 h-7 rounded-full bg-pink-600 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                        {level.num}
                      </span>
                      <div>
                        <p className="text-xs font-bold text-pink-900" style={{ fontFamily: "Noto Naskh Arabic, serif" }}>{level.ur}</p>
                        <p className="text-xs text-pink-600">{level.en}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Courses included */}
                <div className="bg-pink-50 rounded-xl p-4 border border-pink-100">
                  <p className="text-xs font-bold text-pink-800 mb-2">📚 Courses Included:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {["نورانی قاعدہ", "قرآن ناظرہ", "تجوید", "فقہ", "حدیث", "عقیدہ", "عالمیہ"].map(c => (
                      <span key={c} className="text-xs bg-pink-100 text-pink-700 px-2 py-0.5 rounded-full" style={{ fontFamily: "Noto Naskh Arabic, serif" }}>{c}</span>
                    ))}
                  </div>
                </div>

                {/* Privacy notice */}
                <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-xl p-3">
                  <Shield className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <p className="text-xs text-amber-700">طالبات کا نظام مکمل علیحدہ ہے · Female-only teachers · Private recorded lectures</p>
                </div>

                {/* CTA */}
                <div className="space-y-3 pt-2">
                  <a
                    href={WA_GIRLS}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-3 w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-xl transition-all hover:scale-105 shadow-lg text-sm"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                    {t.joinGirls}
                  </a>
                  <Link href="/register">
                    <button className="flex items-center justify-center gap-2 w-full bg-pink-600 hover:bg-pink-700 text-white font-bold py-3 rounded-xl transition-all text-sm">
                      <GraduationCap className="w-5 h-5" /> {t.enrollNow}
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Admission flow steps */}
          <div className="mt-14">
            <h3 className="text-center text-xl font-bold text-green-900 mb-8">Admission Flow — داخلے کا طریقہ کار</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {[
                { num: "①", label: "Website Visit", ur: "ویب سائٹ وزٹ کریں", icon: "🌐" },
                { num: "②", label: "Join WhatsApp Group", ur: "واٹس ایپ گروپ جوائن", icon: "💬" },
                { num: "③", label: "Take Placement Test", ur: "ٹیسٹ دیں", icon: "📝" },
                { num: "④", label: "Level Assigned", ur: "درجہ دیا جائے گا", icon: "🎯" },
                { num: "⑤", label: "Admission Confirmed", ur: "داخلہ مکمل", icon: "✅" },
              ].map((step, i) => (
                <div key={i} className="bg-white rounded-xl p-4 text-center shadow-sm border border-green-100 hover:border-green-300 hover:shadow-md transition-all">
                  <div className="text-3xl mb-2">{step.icon}</div>
                  <div className="text-green-600 font-bold text-lg mb-1">{step.num}</div>
                  <p className="text-xs font-semibold text-gray-700">{step.label}</p>
                  <p className="text-xs text-gray-500 mt-0.5" style={{ fontFamily: "Noto Naskh Arabic, serif" }}>{step.ur}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── BOOKS & GRADES ─── */}
      <section id="books" className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-green-900 mb-3">{t.nav_books}</h2>
            <div className="w-20 h-1 bg-gradient-to-r from-green-500 to-amber-400 rounded-full mx-auto" />
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[
              { title: "قرآن مجید", en: "The Holy Quran", icon: "📖", color: "green" },
              { title: "نورانی قاعدہ", en: "Noorani Qaida", icon: "📚", color: "blue" },
              { title: "فقہ کی کتابیں", en: "Fiqh Books (Levels 1–8)", icon: "⚖️", color: "purple" },
              { title: "حدیث کی کتابیں", en: "Hadith Books", icon: "📜", color: "amber" },
              { title: "تفسیر القرآن", en: "Tafseer of Quran", icon: "🔍", color: "teal" },
              { title: "عقیدہ و اصول", en: "Aqeedah & Usool", icon: "🌟", color: "rose" },
            ].map(book => (
              <div key={book.title} className={`flex items-center gap-4 p-4 rounded-xl border hover:shadow-md transition-all cursor-pointer bg-${book.color}-50 border-${book.color}-100 hover:border-${book.color}-300`}>
                <div className="text-3xl">{book.icon}</div>
                <div>
                  <p className="font-bold text-gray-800" style={{ fontFamily: "Noto Naskh Arabic, serif" }}>{book.title}</p>
                  <p className="text-sm text-gray-500">{book.en}</p>
                </div>
                <CheckCircle className="w-5 h-5 text-green-500 ml-auto shrink-0" />
              </div>
            ))}
          </div>
          <div className="mt-6 text-center">
            <Link href="/login">
              <button className="inline-flex items-center gap-2 px-6 py-3 bg-green-700 hover:bg-green-800 text-white font-semibold rounded-xl transition-colors shadow-md">
                <BookMarked className="w-5 h-5" /> Access Full Book Library — Login Required
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* ─── FEATURES SECTION ─── */}
      <section className="py-16 md:py-20 bg-gradient-to-br from-green-900 via-emerald-800 to-teal-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "repeating-linear-gradient(0deg,transparent,transparent 50px,rgba(255,255,255,0.5) 50px,rgba(255,255,255,0.5) 51px),repeating-linear-gradient(90deg,transparent,transparent 50px,rgba(255,255,255,0.5) 50px,rgba(255,255,255,0.5) 51px)" }} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-3">{t.featuresTitle}</h2>
            <div className="w-20 h-1 bg-gradient-to-r from-amber-400 to-yellow-300 rounded-full mx-auto" />
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map(f => (
              <div key={f.title} className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-5 hover:bg-white/15 transition-all hover:scale-105">
                <div className="w-12 h-12 rounded-xl bg-amber-400/20 flex items-center justify-center mb-4">
                  <f.icon className="w-6 h-6 text-amber-300" />
                </div>
                <h3 className="font-bold text-white mb-1">{f.title}</h3>
                <p className="text-green-200 text-sm" style={{ fontFamily: "Noto Naskh Arabic, serif" }}>{f.ur}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── DEMO / TRIAL SECTION ─── */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl font-bold text-green-900 mb-3">Live Trial & Demo Classes</h2>
          <p className="text-gray-500 mb-8">No login required to view demo content — ڈیمو دیکھنے کے لیے لاگ ان ضروری نہیں</p>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              { label: "Quran Recitation Demo", ur: "قرآن تلاوت ڈیمو", icon: "🎵", badge: "FREE" },
              { label: "Tajweed Trial Class", ur: "تجوید ٹرائل کلاس", icon: "🎙️", badge: "7-Day Trial" },
              { label: "Noorani Qaida Sample", ur: "نورانی قاعدہ نمونہ", icon: "📖", badge: "FREE" },
            ].map(item => (
              <div key={item.label} className="bg-green-50 border border-green-200 rounded-2xl p-6 hover:shadow-lg transition-all cursor-pointer hover:border-green-400">
                <div className="text-5xl mb-4">{item.icon}</div>
                <span className="inline-block bg-amber-100 text-amber-700 text-xs font-bold px-3 py-1 rounded-full mb-3">{item.badge}</span>
                <h3 className="font-bold text-green-900">{item.label}</h3>
                <p className="text-sm text-green-700 mt-1" style={{ fontFamily: "Noto Naskh Arabic, serif" }}>{item.ur}</p>
                <Link href="/register">
                  <button className="mt-4 w-full py-2 bg-green-700 hover:bg-green-800 text-white text-sm font-semibold rounded-lg transition-colors">
                    Start Free Trial
                  </button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CONTACT SECTION ─── */}
      <section id="contact" className="py-16 bg-gray-50 border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl font-bold text-green-900 mb-3">{t.contactTitle}</h2>
          <div className="w-20 h-1 bg-gradient-to-r from-green-500 to-amber-400 rounded-full mx-auto mb-8" />

          <div className="grid gap-4 md:grid-cols-3 mb-8">
            <a href={WA_ADMIN} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-3 p-6 bg-white rounded-2xl border border-green-200 hover:border-green-400 hover:shadow-lg transition-all">
              <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center">
                <svg className="w-7 h-7 text-green-600" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              </div>
              <div>
                <p className="font-bold text-gray-800">{t.contactAdmin}</p>
                <p className="text-xs text-gray-500">General inquiries — واٹس ایپ ایڈمن</p>
              </div>
              <ExternalLink className="w-4 h-4 text-green-500" />
            </a>

            <a href={WA_BOYS} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-3 p-6 bg-white rounded-2xl border border-blue-200 hover:border-blue-400 hover:shadow-lg transition-all">
              <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center text-3xl">👦</div>
              <div>
                <p className="font-bold text-gray-800">Boys Admission</p>
                <p className="text-xs text-gray-500">طلبہ داخلہ — بنین گروپ</p>
              </div>
              <ExternalLink className="w-4 h-4 text-blue-500" />
            </a>

            <a href={WA_GIRLS} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-3 p-6 bg-white rounded-2xl border border-pink-200 hover:border-pink-400 hover:shadow-lg transition-all">
              <div className="w-14 h-14 rounded-full bg-pink-100 flex items-center justify-center text-3xl">👩</div>
              <div>
                <p className="font-bold text-gray-800">Girls Admission</p>
                <p className="text-xs text-gray-500">طالبات داخلہ — بنات گروپ</p>
              </div>
              <ExternalLink className="w-4 h-4 text-pink-500" />
            </a>
          </div>

          {/* Login CTA */}
          <div className="bg-gradient-to-r from-green-700 to-emerald-800 rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-2">Already Enrolled? — پہلے سے داخل ہیں؟</h3>
            <p className="text-green-200 mb-6">Login to access your dashboard, classes, and study materials</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/login">
                <button className="px-8 py-3 bg-white text-green-800 font-bold rounded-xl hover:bg-green-50 transition-colors shadow-lg">
                  {t.loginBtn}
                </button>
              </Link>
              <Link href="/register">
                <button className="px-8 py-3 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl transition-colors shadow-lg">
                  {t.enrollNow}
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="bg-green-950 text-green-300">
        {/* Social & Contact */}
        <div className="border-b border-green-900 py-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="grid gap-8 md:grid-cols-3">
              {/* Brand */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-green-800 flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-amber-300" />
                  </div>
                  <div>
                    <span className="text-white font-bold text-lg">AtwsQuranofficial</span>
                    <p className="text-xs text-green-500">إشاعة التوحيد والسنة</p>
                  </div>
                </div>
                <p className="text-sm text-green-400 leading-relaxed" dir="rtl">
                  آن لائن اسلامی تعلیم — طلبہ اور طالبات کا مکمل الگ نظام۔ وفاق المدارس السلفیہ کے نصاب کے مطابق تعلیم۔
                </p>
                <p className="text-xs text-green-600 mt-2">
                  ✉️ <a href="mailto:atwsquranofficial@gmail.com" className="hover:text-amber-300 transition-colors">atwsquranofficial@gmail.com</a>
                </p>
              </div>

              {/* Quick Links */}
              <div>
                <h4 className="text-white font-semibold mb-4 text-sm">Quick Links — روابط</h4>
                <div className="space-y-2 text-sm">
                  <div><a href="#home" className="hover:text-white transition-colors">🏠 Home</a></div>
                  <div><a href="#courses" className="hover:text-white transition-colors">📚 Courses</a></div>
                  <div><a href="#admission" className="hover:text-white transition-colors">🎓 Admission</a></div>
                  <div><Link href="/library"><span className="hover:text-white transition-colors cursor-pointer">📖 مکتبہ کتاب (Book Library)</span></Link></div>
                  <div><Link href="/ulema"><span className="hover:text-white transition-colors cursor-pointer">👨‍🎓 علماء کا کتب خانہ</span></Link></div>
                  <div><Link href="/login"><span className="hover:text-white transition-colors cursor-pointer">🔑 Student Login</span></Link></div>
                </div>
              </div>

              {/* Social Media */}
              <div>
                <h4 className="text-white font-semibold mb-4 text-sm">Social Media — سوشل میڈیا</h4>
                <div className="space-y-2.5">
                  <a href="https://www.youtube.com/@atwsquranofficial" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-white transition-colors group">
                    <div className="w-8 h-8 rounded-lg bg-red-700/30 flex items-center justify-center group-hover:bg-red-600 transition-colors">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                    </div>
                    <span className="text-sm">YouTube</span>
                  </a>
                  <a href="https://www.instagram.com/atwsquranofficial2026/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-white transition-colors group">
                    <div className="w-8 h-8 rounded-lg bg-pink-700/30 flex items-center justify-center group-hover:bg-pink-600 transition-colors">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                    </div>
                    <span className="text-sm">Instagram</span>
                  </a>
                  <a href="https://www.tiktok.com/@atwsquranofficial" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-white transition-colors group">
                    <div className="w-8 h-8 rounded-lg bg-gray-700/30 flex items-center justify-center group-hover:bg-gray-600 transition-colors">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>
                    </div>
                    <span className="text-sm">TikTok</span>
                  </a>
                  <a href="https://www.facebook.com/profile.php?id=61576395013249" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-white transition-colors group">
                    <div className="w-8 h-8 rounded-lg bg-blue-700/30 flex items-center justify-center group-hover:bg-blue-600 transition-colors">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                    </div>
                    <span className="text-sm">Facebook</span>
                  </a>
                  <a href={WA_CHANNEL} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-white transition-colors group">
                    <div className="w-8 h-8 rounded-lg bg-green-700/30 flex items-center justify-center group-hover:bg-green-600 transition-colors">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                    </div>
                    <span className="text-sm">WhatsApp Channel</span>
                  </a>
                  <a href="https://www.linkedin.com/in/atwsquranofficial" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-white transition-colors group">
                    <div className="w-8 h-8 rounded-lg bg-blue-800/30 flex items-center justify-center group-hover:bg-blue-700 transition-colors">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                    </div>
                    <span className="text-sm">LinkedIn</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="py-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-green-600">
            <p>© 2026 AtwsQuranofficial. Online Islamic Education. All rights reserved.</p>
            <p>
              <a href="mailto:atwsquranofficial@gmail.com" className="hover:text-amber-300 transition-colors">atwsquranofficial@gmail.com</a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
