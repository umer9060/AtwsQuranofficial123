import { useState } from "react";
import { Link } from "wouter";
import { BookOpen, Mail, CheckCircle2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSent(true);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-muted/30 p-4">
      <div className="mb-8 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-4">
          <BookOpen className="w-8 h-8" />
        </div>
        <h1 className="text-4xl font-serif font-bold text-primary">AtwsQuranofficial</h1>
        <p className="text-muted-foreground mt-1">پاس ورڈ بھول گئے؟</p>
      </div>

      <div className="mb-4 text-center">
        <Link href="/login" className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 justify-center">
          <ArrowLeft className="w-3.5 h-3.5" />
          لاگ ان پر واپس جائیں
        </Link>
      </div>

      <Card className="w-full max-w-md shadow-xl border-primary/10">
        {!sent ? (
          <>
            <CardHeader className="space-y-1">
              <CardTitle className="text-xl text-center flex items-center justify-center gap-2">
                <Mail className="w-5 h-5 text-primary" />
                پاس ورڈ ری سیٹ
              </CardTitle>
              <CardDescription className="text-center" dir="rtl">
                اپنا Gmail ای میل لکھیں — ہم آپ کو پاس ورڈ تبدیل کرنے کا لنک بھیجیں گے
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Gmail ای میل</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@gmail.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    dir="ltr"
                  />
                </div>
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-700" dir="rtl">
                  <p>⚠️ اگر آپ کا اکاؤنٹ رجسٹرڈ ہے تو صرف اسی ای میل پر لنک آئے گا جو آپ نے داخلے کے وقت دیا تھا۔</p>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-3">
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "بھیجا جا رہا ہے..." : "ری سیٹ لنک بھیجیں"}
                </Button>
                <p className="text-xs text-center text-muted-foreground" dir="rtl">
                  یاد آ گیا؟{" "}
                  <Link href="/login" className="text-primary hover:underline font-medium">لاگ ان کریں</Link>
                </p>
              </CardFooter>
            </form>
          </>
        ) : (
          <>
            <CardHeader className="space-y-1">
              <div className="flex justify-center mb-2">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8 text-green-600" />
                </div>
              </div>
              <CardTitle className="text-xl text-center text-green-700">لنک بھیج دیا گیا!</CardTitle>
              <CardDescription className="text-center" dir="rtl">
                <strong>{email}</strong> پر پاس ورڈ ری سیٹ کا لنک بھیج دیا گیا ہے۔ براہ کرم اپنا inbox چیک کریں۔
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-xs text-green-700 space-y-1" dir="rtl">
                <p className="font-semibold">اگر ای میل نہ آئے تو:</p>
                <p>• Spam / Junk فولڈر چیک کریں</p>
                <p>• 5 منٹ انتظار کریں</p>
                <p>• ایڈمن سے رابطہ کریں: atwsquranofficial@gmail.com</p>
              </div>
            </CardContent>
            <CardFooter>
              <Link href="/login" className="w-full">
                <Button className="w-full">لاگ ان صفحے پر جائیں</Button>
              </Link>
            </CardFooter>
          </>
        )}
      </Card>
    </div>
  );
}
