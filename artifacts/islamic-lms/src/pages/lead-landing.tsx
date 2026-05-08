import { Link } from "wouter";
import { useEffect } from "react";
import { BookOpen, ArrowLeft } from "lucide-react";

interface Props {
  gender: "boys" | "girls";
}

const COURSES = [
  { key: "noorani", icon: "📖", label: "نورانی قاعدہ", desc: "ابتدائی حروف تہجی اور بنیادی قرآن", color: "bg-green-500 hover:bg-green-600", badge: "Beginner" },
  { key: "naazira", icon: "📗", label: "ناظرہ قرآن", desc: "روانی سے قرآن مجید کی تلاوت", color: "bg-teal-500 hover:bg-teal-600", badge: "Intermediate" },
  { key: "tajweed", icon: "🎙️", label: "تجوید قرآن", desc: "تجوید کے قواعد کے ساتھ قرآن", color: "bg-blue-500 hover:bg-blue-600", badge: "Advanced" },
  { key: "hifz", icon: "🌟", label: "حفظ قرآن", desc: "حفظ تلفظ کے ساتھ — مکمل حافظ", color: "bg-amber-500 hover:bg-amber-600", badge: "Premium" },
  { key: "alim", icon: "🎓", label: "درس نظامی / عالم", desc: "مکمل اسلامی علوم — عالم بننا", color: "bg-purple-500 hover:bg-purple-600", badge: "Scholar" },
];

export default function LeadLanding({ gender }: Props) {
  const isBoys = gender === "boys";
  const title = isBoys ? "لڑکوں کی آنلائن قرآن کلاسز" : "لڑکیوں کی آنلائن قرآن کلاسز";
  const subtitle = isBoys
    ? "مرد اساتذہ کے ساتھ — علیحدہ نظام"
    : "خواتین اساتذہ کے ساتھ — مکمل پردہ";
  const bgGradient = isBoys ? "from-green-700 to-emerald-800" : "from-pink-700 to-rose-800";

  useEffect(() => {
    document.title = `${title} | AtwsQuranofficial`;
  }, []);

  return (
    <div className={`min-h-screen bg-gradient-to-br ${bgGradient}`}>
      <div className="bg-white/10 backdrop-blur border-b border-white/20 sticky top-0 z-10">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/">
            <span className="text-white/80 text-sm hover:text-white cursor-pointer flex items-center gap-1">
              <ArrowLeft className="w-4 h-4" /> واپس
            </span>
          </Link>
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-white" />
            <span className="text-white font-bold text-sm">AtwsQuranofficial</span>
          </div>
          <span className="text-white/70 text-xs">{isBoys ? "Boys" : "Girls"}</span>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-8 space-y-6">
        <div className="text-center text-white space-y-3">
          <div className="text-5xl">{isBoys ? "👦" : "👧"}</div>
          <h1 className="text-2xl font-bold font-serif" dir="rtl">{title}</h1>
          <p className="text-white/80 font-serif text-sm" dir="rtl">{subtitle}</p>
          <div className="flex items-center justify-center gap-2 text-xs text-white/60">
            <span>✅ مفت ٹرائل کلاس</span>
            <span>•</span>
            <span>🌐 آنلائن / گھر بیٹھے</span>
          </div>
        </div>

        <div>
          <p className="text-white/80 text-center text-sm mb-4 font-serif" dir="rtl">
            کورس منتخب کریں:
          </p>
          <div className="space-y-3">
            {COURSES.map(c => (
              <Link key={c.key} href={`/lead/${gender}/${c.key}`}>
                <div className={`${c.color} rounded-xl p-4 cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98]`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-3xl">{c.icon}</div>
                      <div className="text-white text-right" dir="rtl">
                        <p className="font-bold font-serif">{c.label}</p>
                        <p className="text-xs text-white/80 font-serif">{c.desc}</p>
                      </div>
                    </div>
                    <div className="shrink-0">
                      <span className="bg-white/20 text-white text-xs px-2 py-1 rounded-full">{c.badge}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur rounded-xl p-4 text-white text-center text-sm font-serif space-y-2" dir="rtl">
          <p className="font-bold">کیوں AtwsQuranofficial؟</p>
          <div className="grid grid-cols-2 gap-2 text-xs text-white/80 mt-2">
            <span>✅ تجربہ کار علماء کرام</span>
            <span>✅ لچکدار اوقات</span>
            <span>✅ ون ٹو ون کلاس</span>
            <span>✅ ہفتہ وار رپورٹ</span>
          </div>
        </div>
      </div>
    </div>
  );
}
