import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { useLogin } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Link, useLocation } from "wouter";
import { BookOpen, GraduationCap, Users } from "lucide-react";

type Tab = "general" | "girls";

export default function Login() {
  const [tab, setTab] = useState<Tab>("general");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { refetchUser } = useAuth();
  const loginMutation = useLogin();
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const credential = tab === "girls" ? username : email;
    loginMutation.mutate(
      { data: { email: credential, password } },
      {
        onSuccess: (data) => {
          if (data?.token) {
            localStorage.setItem("auth_token", data.token);
          }
          refetchUser();
          // Role-based redirect
          const role = data?.user?.role || "";
          if (role === "admin") setLocation("/admin/users");
          else if (role.includes("teacher") || role === "qari") setLocation("/teachers");
          else setLocation("/dashboard");
        },
        onError: (err: any) => {
          // Server returns 403 with bilingual message when account is pending
          const msg = err?.message || "";
          const isPending = /not verified|pending|ابھی verify/i.test(msg);
          toast({
            title: isPending ? "اکاؤنٹ ابھی فعال نہیں — Account not active" : "لاگ ان ناکام — Login failed",
            description: msg || "غلط شناخت یا پاس ورڈ",
            variant: "destructive",
          });
          if (isPending) {
            setTimeout(() => setLocation("/pending-verification"), 1500);
          }
        },
      }
    );
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-muted/30 p-4">
      <div className="mb-8 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-4">
          <BookOpen className="w-8 h-8" />
        </div>
        <h1 className="text-4xl font-serif font-bold text-primary">AtwsQuranofficial</h1>
        <p className="text-muted-foreground mt-2">اسلامی تعلیمی نظام — Islamic LMS</p>
      </div>

      <div className="mb-4 text-center">
        <Link href="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">
          ← واپس ہوم پیج
        </Link>
      </div>

      <div className="w-full max-w-md">
        {/* Tab selector */}
        <div className="flex rounded-xl overflow-hidden border border-primary/20 mb-4 bg-white shadow-sm">
          <button
            onClick={() => setTab("general")}
            className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors ${
              tab === "general"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted/50"
            }`}
          >
            <Users className="w-4 h-4" />
            طلبہ / اساتذہ
          </button>
          <button
            onClick={() => setTab("girls")}
            className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors ${
              tab === "girls"
                ? "bg-pink-600 text-white"
                : "text-muted-foreground hover:bg-muted/50"
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            طالبات لاگ ان
          </button>
        </div>

        <Card className="shadow-xl border-primary/10">
          <CardHeader className="space-y-1">
            {tab === "general" ? (
              <>
                <CardTitle className="text-2xl text-center">خوش آمدید</CardTitle>
                <CardDescription className="text-center" dir="rtl">
                  اپنا ای میل اور پاس ورڈ لکھیں
                </CardDescription>
              </>
            ) : (
              <>
                <CardTitle className="text-2xl text-center text-pink-700">طالبات لاگ ان</CardTitle>
                <CardDescription className="text-center" dir="rtl">
                  اپنا یوزرنیم یا ای میل اور پاس ورڈ لکھیں
                </CardDescription>
              </>
            )}
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {tab === "general" ? (
                <div className="space-y-2">
                  <Label htmlFor="email" dir="rtl">شناختی کارڈ / فون / ای میل</Label>
                  <Input
                    id="email"
                    type="text"
                    placeholder="12345-1234567-1  یا  03001234567  یا  name@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    dir="ltr"
                    autoComplete="username"
                  />
                  <p className="text-xs text-muted-foreground" dir="rtl">
                    تینوں میں سے کسی ایک سے لاگ ان کر سکتے ہیں
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <Label htmlFor="username" dir="rtl">یوزرنیم / شناختی کارڈ / فون / ای میل</Label>
                  <Input
                    id="username"
                    type="text"
                    placeholder="یوزرنیم، CNIC، فون یا ای میل"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    dir="ltr"
                    autoComplete="username"
                  />
                </div>
              )}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">پاس ورڈ</Label>
                  <Link href="/forgot-password" className="text-xs text-primary hover:underline">
                    پاس ورڈ بھول گئے؟
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
              </div>

              {tab === "girls" && (
                <div className="bg-pink-50 border border-pink-200 rounded-lg p-3 text-xs text-pink-700" dir="rtl">
                  <p>🌸 طالبات: اگر پہلی بار آ رہی ہیں تو پہلے ایڈمن سے رابطہ کریں اور اپنا یوزرنیم حاصل کریں۔</p>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button
                type="submit"
                className={`w-full ${tab === "girls" ? "bg-pink-600 hover:bg-pink-700" : ""}`}
                disabled={loginMutation.isPending}
              >
                {loginMutation.isPending ? "لاگ ان ہو رہا ہے..." : "لاگ ان کریں"}
              </Button>
              <p className="text-sm text-center text-muted-foreground" dir="rtl">
                نئے طالب علم؟{" "}
                <Link href="/register" className="text-primary hover:underline font-medium">
                  یہاں داخلہ لیں
                </Link>
              </p>
              <div className="text-xs text-center text-muted-foreground space-y-1" dir="rtl">
                <p>بغیر لاگ ان کتابیں پڑھیں:{" "}
                  <Link href="/library" className="text-primary hover:underline">مکتبہ کتاب</Link>
                  {" "}·{" "}
                  <Link href="/scholars" className="text-primary hover:underline">علماء کا کتب خانہ</Link>
                </p>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
