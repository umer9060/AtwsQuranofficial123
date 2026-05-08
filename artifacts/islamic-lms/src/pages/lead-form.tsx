import { useState, useEffect } from "react";
import { useRoute, useLocation, Link } from "wouter";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";
import { CheckCircle, BookOpen, Users, Star } from "lucide-react";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    gtag?: (...args: unknown[]) => void;
  }
}

const COURSES: Record<string, { label: string; labelEn: string; icon: string; color: string; desc: string }> = {
  noorani: {
    label: "نورانی قاعدہ",
    labelEn: "Noorani Qaida",
    icon: "📖",
    color: "from-green-600 to-green-700",
    desc: "ابتدائی حروف تہجی اور قرآن کی بنیادی تعلیم",
  },
  naazira: {
    label: "ناظرہ قرآن",
    labelEn: "Naazira Quran",
    icon: "📗",
    color: "from-teal-600 to-teal-700",
    desc: "قرآن مجید کی روانی سے تلاوت",
  },
  tajweed: {
    label: "تجوید قرآن",
    labelEn: "Tajweed",
    icon: "🎙️",
    color: "from-blue-600 to-blue-700",
    desc: "تجوید کے قواعد کے ساتھ قرآن پڑھنا",
  },
  hifz: {
    label: "حفظ قرآن",
    labelEn: "Hifz ul Quran",
    icon: "🌟",
    color: "from-amber-600 to-amber-700",
    desc: "حفظ تلفظ کے ساتھ — مکمل حافظ قرآن",
  },
  alim: {
    label: "درس نظامی / عالم",
    labelEn: "Dars-e-Nizami / Alim",
    icon: "🎓",
    color: "from-purple-600 to-purple-700",
    desc: "مکمل اسلامی علوم — عالم بننے کا پروگرام",
  },
};

const LEVELS = [
  "بالکل نہیں آتا",
  "الف ب کا علم ہے",
  "قاعدہ مکمل ہے",
  "ناظرہ پڑھ لیتا ہوں",
  "کچھ حفظ ہے",
  "حافظ قرآن ہوں",
];

const CITIES = [
  "کراچی", "لاہور", "اسلام آباد", "راولپنڈی", "فیصل آباد", "ملتان",
  "پشاور", "کوئٹہ", "حیدرآباد", "گوجرانوالہ", "سیالکوٹ", "بہاولپور",
  "سکھر", "شیخوپورہ", "لاڑکانہ", "دیگر / بیرون ملک",
];

function firePixelEvents(gender: string, course: string) {
  const courseLabel = COURSES[course]?.label ?? course;
  if (window.fbq) {
    window.fbq("track", "Lead", { content_name: courseLabel, content_category: gender });
  }
  if (window.gtag) {
    window.gtag("event", "generate_lead", { event_category: gender, event_label: courseLabel });
  }
}

export default function LeadForm() {
  const [, params] = useRoute("/lead/:gender/:course");
  const [, setLocation] = useLocation();

  const gender = params?.gender ?? "boys";
  const course = params?.course ?? "noorani";
  const courseInfo = COURSES[course] ?? COURSES.noorani;

  const [form, setForm] = useState({
    name: "", phone: "", age: "", city: "", currentLevel: "", note: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const urlParams = new URLSearchParams(window.location.search);
  const utmSource = urlParams.get("utm_source") ?? undefined;
  const utmCampaign = urlParams.get("utm_campaign") ?? undefined;

  useEffect(() => {
    const g = gender === "boys" ? "لڑکوں" : "لڑکیوں";
    document.title = `${courseInfo.label} — ${g} کی کلاسز | AtwsQuranofficial`;
  }, [gender, course]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim()) {
      setError("نام اور فون نمبر لازمی ہے");
      return;
    }
    setError("");
    setSubmitting(true);
    try {
      const r = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          phone: form.phone.trim(),
          age: form.age ? parseInt(form.age) : undefined,
          city: form.city || undefined,
          gender,
          course,
          currentLevel: form.currentLevel || undefined,
          note: form.note.trim() || undefined,
          formType: `${gender}_${course}`,
          utmSource,
          utmCampaign,
        }),
      });
      if (!r.ok) throw new Error();
      firePixelEvents(gender, course);
      setDone(true);
    } catch {
      setError("خرابی ہوئی، دوبارہ کوشش کریں");
    } finally {
      setSubmitting(false);
    }
  };

  const genderLabel = gender === "boys" ? "لڑکوں" : "لڑکیوں";
  const genderLabelEn = gender === "boys" ? "Boys" : "Girls";

  if (done) {
    return (
      <div className={`min-h-screen bg-gradient-to-br ${courseInfo.color} flex items-center justify-center p-4`}>
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center space-y-6">
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-green-700 font-serif" dir="rtl">جزاکم اللہ خیرا!</h2>
            <p className="text-muted-foreground mt-2 font-serif" dir="rtl">
              آپ کی درخواست موصول ہو گئی۔ ہمارا استاد جلد آپ سے WhatsApp پر رابطہ کرے گا۔
            </p>
          </div>
          <div className="bg-green-50 rounded-xl p-4 text-sm text-right font-serif space-y-1" dir="rtl">
            <p><strong>کورس:</strong> {courseInfo.label}</p>
            <p><strong>نام:</strong> {form.name}</p>
            <p><strong>فون:</strong> {form.phone}</p>
          </div>
          <Link href="/">
            <Button variant="outline" className="w-full">واپس ہوم پیج</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br ${courseInfo.color}`}>
      {/* Header */}
      <div className="bg-white/10 backdrop-blur border-b border-white/20 sticky top-0 z-10">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/">
            <span className="text-white/80 text-sm hover:text-white cursor-pointer">← واپس</span>
          </Link>
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-white" />
            <span className="text-white font-bold text-sm">AtwsQuranofficial</span>
          </div>
          <span className="text-white/70 text-xs">{genderLabelEn}</span>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-8 space-y-6">
        {/* Course Card */}
        <div className="bg-white/15 backdrop-blur rounded-2xl p-6 text-center text-white space-y-2">
          <div className="text-5xl">{courseInfo.icon}</div>
          <h1 className="text-2xl font-bold font-serif" dir="rtl">{courseInfo.label}</h1>
          <p className="text-white/80 text-sm font-serif" dir="rtl">{courseInfo.desc}</p>
          <div className="flex items-center justify-center gap-4 mt-3 text-xs text-white/70">
            <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {genderLabel} کی کلاسز</span>
            <span className="flex items-center gap-1"><Star className="w-3 h-3" /> آنلائن • ہوم</span>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h2 className="text-lg font-bold text-right mb-5 font-serif text-gray-800" dir="rtl">
            مفت ٹرائل کلاس کے لیے رجسٹر کریں
          </h2>
          <form onSubmit={submit} className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-right block text-sm font-serif" dir="rtl">
                پورا نام <span className="text-red-500">*</span>
              </Label>
              <Input
                value={form.name}
                onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                placeholder="مثلاً: محمد احمد"
                className="text-right font-serif"
                dir="rtl"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-right block text-sm font-serif" dir="rtl">
                WhatsApp نمبر <span className="text-red-500">*</span>
              </Label>
              <Input
                value={form.phone}
                onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
                placeholder="03001234567"
                dir="ltr"
                type="tel"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-right block text-sm font-serif" dir="rtl">عمر</Label>
                <Input
                  value={form.age}
                  onChange={e => setForm(p => ({ ...p, age: e.target.value }))}
                  placeholder="مثلاً: 12"
                  type="number"
                  min="4"
                  max="80"
                  className="text-right"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-right block text-sm font-serif" dir="rtl">شہر</Label>
                <Select value={form.city} onValueChange={v => setForm(p => ({ ...p, city: v }))}>
                  <SelectTrigger className="text-right font-serif">
                    <SelectValue placeholder="شہر منتخب کریں" />
                  </SelectTrigger>
                  <SelectContent>
                    {CITIES.map(c => (
                      <SelectItem key={c} value={c} className="text-right font-serif">{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-right block text-sm font-serif" dir="rtl">قرآن کی موجودہ سطح</Label>
              <Select value={form.currentLevel} onValueChange={v => setForm(p => ({ ...p, currentLevel: v }))}>
                <SelectTrigger className="text-right font-serif">
                  <SelectValue placeholder="موجودہ سطح" />
                </SelectTrigger>
                <SelectContent>
                  {LEVELS.map(l => (
                    <SelectItem key={l} value={l} className="text-right font-serif">{l}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-right block text-sm font-serif" dir="rtl">کوئی سوال یا خاص بات؟</Label>
              <Textarea
                value={form.note}
                onChange={e => setForm(p => ({ ...p, note: e.target.value }))}
                placeholder="اگر کوئی خاص ضرورت ہو تو یہاں لکھیں..."
                rows={2}
                className="text-right font-serif"
                dir="rtl"
              />
            </div>

            {error && (
              <p className="text-red-600 text-sm text-right font-serif" dir="rtl">{error}</p>
            )}

            <Button
              type="submit"
              disabled={submitting}
              className={`w-full h-12 text-base font-bold bg-gradient-to-r ${courseInfo.color} hover:opacity-90 text-white`}
            >
              {submitting ? "جمع ہو رہا ہے..." : "مفت ٹرائل کلاس بُک کریں ✓"}
            </Button>

            <p className="text-xs text-muted-foreground text-center font-serif" dir="rtl">
              آپ کا ڈیٹا محفوظ ہے۔ صرف AtwsQuranofficial استعمال کرے گا۔
            </p>
          </form>
        </div>

        {/* Trust Badges */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: "✅", text: "مفت ٹرائل کلاس" },
            { icon: "👨‍🏫", text: "تجربہ کار اساتذہ" },
            { icon: "🔒", text: "الگ کلاسز" },
          ].map(b => (
            <div key={b.text} className="bg-white/15 backdrop-blur rounded-xl p-3 text-center text-white">
              <div className="text-xl mb-1">{b.icon}</div>
              <p className="text-xs font-serif">{b.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
