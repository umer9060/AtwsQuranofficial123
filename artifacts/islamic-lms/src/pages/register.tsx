import { useState } from "react";
import { useCreateUser } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Link, useLocation } from "wouter";
import { BookOpen, Eye, EyeOff, UserPlus } from "lucide-react";

const CLASSES = [
  "Noorani Qaida",
  "Quran Nazra",
  "Tajweed",
  "Hifz (Memorisation)",
  "Class 1", "Class 2", "Class 3", "Class 4",
  "Class 5", "Class 6", "Class 7", "Class 8",
];

export default function Register() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [gender, setGender] = useState<"male" | "female">("male");
  const [currentClass, setCurrentClass] = useState("");
  const [age, setAge] = useState("");
  const [fatherName, setFatherName] = useState("");

  const createUserMutation = useCreateUser();
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const validate = () => {
    if (!fullName.trim()) {
      toast({ title: "پورا نام ضروری ہے", description: "Full name is required", variant: "destructive" }); return false;
    }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      toast({ title: "صحیح ای میل لکھیں", description: "Valid Gmail is required", variant: "destructive" }); return false;
    }
    if (!password || password.length < 6) {
      toast({ title: "پاس ورڈ کم از کم 6 حروف", description: "Password must be 6+ characters", variant: "destructive" }); return false;
    }
    if (!phone.trim()) {
      toast({ title: "فون نمبر ضروری ہے", description: "Phone number is required", variant: "destructive" }); return false;
    }
    const digits = phone.replace(/[^\d]/g, "");
    if (!/^(?:92|0)?3\d{9}$/.test(digits)) {
      toast({ title: "غلط فون نمبر", description: "Format: 03001234567", variant: "destructive" }); return false;
    }
    if (!currentClass) {
      toast({ title: "درجہ منتخب کریں", description: "Please select a class", variant: "destructive" }); return false;
    }
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const ageNum = parseInt(age) || null;
    createUserMutation.mutate(
      {
        data: {
          fullName: fullName.trim(),
          email: email.trim(),
          password,
          phone: phone.trim(),
          fatherName: fatherName.trim() || null,
          age: ageNum,
          gender,
          section: gender === "male" ? "boys" : "girls",
          role: gender === "male" ? "male_student" : "female_student",
          currentClass,
          username: null,
          lastEducation: null,
          cnicNumber: null,
          profileImageUrl: null,
          documentFileUrl: null,
        },
      },
      {
        onSuccess: (newUser) => {
          localStorage.removeItem("atws_pending_start");
          toast({
            title: "رجسٹریشن کامیاب! ✓",
            description: "اب WhatsApp پر ٹیسٹ مکمل کریں",
          });
          const name = encodeURIComponent(newUser?.fullName || fullName);
          setLocation(`/pending-verification?name=${name}&role=student`);
        },
        onError: (err: any) => {
          const msg = err?.message || "";
          const isDuplicate = /already exists|duplicate|unique/i.test(msg);
          toast({
            title: "رجسٹریشن ناکام",
            description: isDuplicate
              ? "یہ ای میل یا فون نمبر پہلے سے رجسٹرڈ ہے"
              : (msg || "دوبارہ کوشش کریں"),
            variant: "destructive",
          });
        },
      }
    );
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-primary/5 to-background p-4 py-10">
      {/* Logo */}
      <div className="mb-6 text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 mb-3">
          <BookOpen className="w-7 h-7 text-primary" />
        </div>
        <h1 className="text-2xl font-serif font-bold text-primary">AtwsQuranofficial</h1>
        <p className="text-muted-foreground text-sm mt-0.5">داخلہ فارم — Admission Form</p>
      </div>

      <Card className="w-full max-w-md shadow-xl border-primary/10">
        <CardHeader className="pb-3">
          <CardTitle className="text-xl flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-primary" /> نیا داخلہ
          </CardTitle>
          <CardDescription dir="rtl" className="text-xs">
            تمام معلومات درج کریں — داخلے کے بعد WhatsApp ٹیسٹ مکمل کریں پھر ایڈمن سے منظوری ملے گی
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-3">
            {/* Name + Father */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="fullName" className="text-xs">پورا نام <span className="text-red-500">*</span></Label>
                <Input
                  id="fullName"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  placeholder="Muhammad Ali"
                  className="h-10"
                  required
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="fatherName" className="text-xs">والد کا نام</Label>
                <Input
                  id="fatherName"
                  value={fatherName}
                  onChange={e => setFatherName(e.target.value)}
                  placeholder="Father's name"
                  className="h-10"
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-1">
              <Label htmlFor="email" className="text-xs">ای میل (Gmail) <span className="text-red-500">*</span></Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="name@gmail.com"
                className="h-10"
                dir="ltr"
                required
              />
            </div>

            {/* Phone + Age */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="phone" className="text-xs">فون نمبر <span className="text-red-500">*</span></Label>
                <Input
                  id="phone"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="03001234567"
                  className="h-10"
                  dir="ltr"
                  inputMode="tel"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="age" className="text-xs">عمر (سال)</Label>
                <Input
                  id="age"
                  type="number"
                  min={3}
                  max={99}
                  value={age}
                  onChange={e => setAge(e.target.value)}
                  placeholder="e.g. 12"
                  className="h-10"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1">
              <Label htmlFor="password" className="text-xs">پاس ورڈ <span className="text-red-500">*</span></Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="کم از کم 6 حروف"
                  className="h-10 pr-10"
                  autoComplete="new-password"
                  required
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

            {/* Gender + Class */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs">جنس <span className="text-red-500">*</span></Label>
                <Select value={gender} onValueChange={(v: "male" | "female") => setGender(v)}>
                  <SelectTrigger className="h-10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">لڑکا (Boys)</SelectItem>
                    <SelectItem value="female">لڑکی (Girls)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label className="text-xs">درجہ / Class <span className="text-red-500">*</span></Label>
                <Select value={currentClass} onValueChange={setCurrentClass}>
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="منتخب کریں" />
                  </SelectTrigger>
                  <SelectContent>
                    {CLASSES.map(c => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Info box */}
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 text-xs text-blue-700" dir="rtl">
              <p className="font-semibold mb-0.5">داخلے کا طریقہ:</p>
              <p>۱. یہ فارم جمع کریں &nbsp;→&nbsp; ۲. WhatsApp پر ٹیسٹ دیں &nbsp;→&nbsp; ۳. ایڈمن منظوری کے بعد لاگ ان کریں</p>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-3 pt-0">
            <Button
              type="submit"
              className="w-full h-11 text-base"
              disabled={createUserMutation.isPending}
            >
              {createUserMutation.isPending ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  جمع ہو رہا ہے...
                </span>
              ) : "داخلہ جمع کریں ✓"}
            </Button>

            <p className="text-sm text-center text-muted-foreground">
              پہلے سے اکاؤنٹ ہے؟{" "}
              <Link href="/login" className="text-primary hover:underline font-semibold">
                لاگ ان کریں
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>

      <p className="mt-4 text-xs text-muted-foreground">
        <Link href="/" className="hover:text-primary">← واپس ہوم پیج</Link>
      </p>
    </div>
  );
}
