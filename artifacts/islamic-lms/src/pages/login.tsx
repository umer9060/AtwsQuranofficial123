import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { useLogin } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Link, useLocation } from "wouter";
import { BookOpen, Eye, EyeOff, LogIn } from "lucide-react";

export default function Login() {
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const { refetchUser } = useAuth();
  const loginMutation = useLogin();
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!credential.trim() || !password) return;

    loginMutation.mutate(
      { data: { email: credential.trim(), password } },
      {
        onSuccess: (data) => {
          if (data?.token) {
            localStorage.setItem("auth_token", data.token);
          }
          refetchUser();
          const role = data?.user?.role || "";
          if (role === "admin") setLocation("/admin/users");
          else if (role.includes("teacher") || role === "qari") setLocation("/teachers");
          else setLocation("/dashboard");
        },
        onError: (err: any) => {
          const msg = err?.message || "";
          const isPending = /not verified|pending|ابھی verify/i.test(msg);
          toast({
            title: isPending
              ? "اکاؤنٹ ابھی فعال نہیں"
              : "لاگ ان ناکام",
            description: isPending
              ? "براہ کرم پہلے WhatsApp ٹیسٹ مکمل کریں"
              : (msg.includes("not found") ? "اکاؤنٹ موجود نہیں — Check your ID" : msg.includes("incorrect") ? "پاس ورڈ غلط ہے — Wrong password" : msg),
            variant: "destructive",
          });
          if (isPending) setTimeout(() => setLocation("/pending-verification"), 1500);
        },
      }
    );
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-primary/5 to-background p-4">
      {/* Logo */}
      <div className="mb-8 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
          <BookOpen className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-3xl font-serif font-bold text-primary">AtwsQuranofficial</h1>
        <p className="text-muted-foreground text-sm mt-1">اسلامی تعلیمی نظام</p>
      </div>

      <Card className="w-full max-w-sm shadow-xl border-primary/10">
        <CardHeader className="space-y-1 pb-4">
          <CardTitle className="text-2xl text-center flex items-center justify-center gap-2">
            <LogIn className="w-5 h-5" /> لاگ ان کریں
          </CardTitle>
          <CardDescription className="text-center text-xs">
            CNIC · فون نمبر · ای میل · یوزرنیم — کوئی بھی استعمال کریں
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="credential">شناخت (ID)</Label>
              <Input
                id="credential"
                type="text"
                placeholder="ای میل / CNIC / فون / یوزرنیم"
                value={credential}
                onChange={(e) => setCredential(e.target.value)}
                required
                dir="ltr"
                autoComplete="username"
                className="h-11"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">پاس ورڈ</Label>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  className="h-11 pr-10"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  tabIndex={-1}
                >
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-3 pt-0">
            <Button
              type="submit"
              className="w-full h-11 text-base"
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  لاگ ان ہو رہا ہے...
                </span>
              ) : "لاگ ان کریں →"}
            </Button>

            <p className="text-sm text-center text-muted-foreground" dir="rtl">
              نئے طالب علم؟{" "}
              <Link href="/register" className="text-primary hover:underline font-semibold">
                داخلہ لیں
              </Link>
            </p>

            <div className="border-t pt-3 w-full text-center">
              <p className="text-xs text-muted-foreground" dir="rtl">
                بغیر لاگ ان کتابیں پڑھیں:{" "}
                <Link href="/library" className="text-primary hover:underline">مکتبہ</Link>
                {" · "}
                <Link href="/scholars" className="text-primary hover:underline">علماء</Link>
              </p>
            </div>
          </CardFooter>
        </form>
      </Card>

      <p className="mt-4 text-xs text-muted-foreground text-center">
        <Link href="/" className="hover:text-primary">← واپس ہوم پیج</Link>
      </p>
    </div>
  );
}
