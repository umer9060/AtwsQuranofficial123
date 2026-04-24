import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, MessageCircle, CheckCircle2, AlertCircle, ArrowLeft, Hash } from "lucide-react";

const WA_ADMIN = "https://wa.me/message/RCWLPSMMGS5GK1";
const WA_CHANNEL = "https://whatsapp.com/channel/0029Vb8LsW0GU3BP0tiLAB1A";

/** Format milliseconds → "Hh Mm Ss" */
function fmt(ms: number) {
  if (ms <= 0) return "0h 0m 0s";
  const s = Math.floor(ms / 1000);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return `${h}h ${m}m ${sec}s`;
}

export default function PendingVerification() {
  // 3-hour review window starting from when user landed on this page
  const params = new URLSearchParams(window.location.search);
  const name = params.get("name") || "";
  const role = params.get("role") || "student";

  const startKey = "atws_pending_start";
  const [startedAt] = useState<number>(() => {
    const stored = localStorage.getItem(startKey);
    if (stored) return parseInt(stored, 10);
    const now = Date.now();
    localStorage.setItem(startKey, String(now));
    return now;
  });

  const REVIEW_MS = 3 * 60 * 60 * 1000; // 3 hours
  const [now, setNow] = useState(Date.now());
  const remaining = Math.max(0, startedAt + REVIEW_MS - now);

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-green-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Back to home */}
        <Link href="/">
          <button className="flex items-center gap-1.5 text-green-700 hover:text-green-800 mb-4 text-sm" dir="rtl">
            <ArrowLeft className="w-4 h-4" />
            واپس ہوم پیج
          </button>
        </Link>

        <Card className="border-2 border-amber-200 shadow-lg">
          <CardHeader className="text-center pb-4">
            <div className="mx-auto w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mb-3">
              <Clock className="w-8 h-8 text-amber-600" />
            </div>
            <Badge variant="secondary" className="mx-auto bg-amber-100 text-amber-800 border-amber-300">
              Pending Verification — جائزہ زیرِ غور
            </Badge>
            <h1 className="text-2xl font-bold text-gray-800 mt-3" dir="rtl">
              {name ? `${name} — آپ کا اکاؤنٹ بن گیا` : "آپ کا اکاؤنٹ بن گیا"}
            </h1>
            <p className="text-gray-600 text-sm mt-1" dir="rtl">
              لیکن ابھی فعال نہیں — پہلے واٹس ایپ پر ٹیسٹ مکمل کریں
            </p>
          </CardHeader>

          <CardContent className="space-y-5">
            {/* Status box */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4" dir="rtl">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
                <div className="text-sm text-amber-900 space-y-1">
                  <p className="font-bold">آپ کا اکاؤنٹ ابھی فعال نہیں ہے</p>
                  <p>لاگ ان کرنے سے پہلے یہ تین قدم مکمل کریں:</p>
                </div>
              </div>
            </div>

            {/* Steps */}
            <div className="space-y-3">
              {[
                { n: "1", title: "واٹس ایپ پر ایڈمن سے رابطہ کریں", desc: "نیچے بٹن دبا کر ایڈمن کو پیغام بھیجیں" },
                { n: "2", title: "زبانی / تحریری ٹیسٹ دیں", desc: "ایڈمن آپ سے چھوٹا سا ٹیسٹ لیں گے (قاعدہ / تجوید / بنیادی معلومات)" },
                { n: "3", title: "ایڈمن کی منظوری کا انتظار کریں", desc: "2-3 گھنٹوں میں آپ کا اکاؤنٹ Active ہو جائے گا" },
              ].map(s => (
                <div key={s.n} className="flex items-start gap-3 p-3 bg-white border border-gray-200 rounded-lg">
                  <div className="w-7 h-7 rounded-full bg-green-600 text-white text-sm font-bold flex items-center justify-center shrink-0">
                    {s.n}
                  </div>
                  <div dir="rtl">
                    <p className="font-bold text-gray-800 text-sm">{s.title}</p>
                    <p className="text-xs text-gray-600 mt-0.5">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* WhatsApp Button — primary CTA */}
            <a href={WA_ADMIN} target="_blank" rel="noopener noreferrer" className="block">
              <Button
                size="lg"
                className="w-full bg-green-600 hover:bg-green-700 text-white text-base h-14 gap-2 shadow-md"
              >
                <MessageCircle className="w-5 h-5" />
                Start Test on WhatsApp — واٹس ایپ پر ٹیسٹ شروع کریں
              </Button>
            </a>

            {/* Pre-filled message hint */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-xs text-gray-700" dir="rtl">
              <p className="font-bold mb-1">📝 یہ پیغام بھیجیں:</p>
              <p className="font-mono bg-white p-2 rounded border" dir="ltr">
                Assalamualaikum, I have registered{name ? ` as ${name}` : ""}. I want to give my test for {role === "teacher" ? "teacher" : "student"} verification.
              </p>
            </div>

            {/* Countdown */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center" dir="rtl">
              <p className="text-xs text-blue-700 mb-1">متوقع جائزہ کا وقت</p>
              {remaining > 0 ? (
                <>
                  <p className="text-2xl font-bold text-blue-900 font-mono" dir="ltr">{fmt(remaining)}</p>
                  <p className="text-xs text-blue-600 mt-1">عام طور پر 2-3 گھنٹے میں منظوری مل جاتی ہے</p>
                </>
              ) : (
                <>
                  <p className="text-lg font-bold text-blue-900">جائزہ کا وقت گزر چکا</p>
                  <p className="text-xs text-blue-600 mt-1">براہ کرم دوبارہ ایڈمن سے رابطہ کریں</p>
                </>
              )}
            </div>

            {/* Secondary actions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <a href={WA_CHANNEL} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" className="w-full gap-2" dir="rtl">
                  <Hash className="w-4 h-4" />
                  واٹس ایپ چینل
                </Button>
              </a>
              <Link href="/login">
                <Button variant="outline" className="w-full gap-2" dir="rtl">
                  <CheckCircle2 className="w-4 h-4" />
                  منظوری کے بعد لاگ ان
                </Button>
              </Link>
            </div>

            <p className="text-xs text-center text-gray-500 pt-2" dir="rtl">
              کوئی مسئلہ ہو تو واٹس ایپ پر ایڈمن سے رابطہ کریں
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
