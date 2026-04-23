import { useState } from "react";
import { useCreateUser } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Link, useLocation } from "wouter";
import { BookOpen, Upload, CheckCircle2, AlertCircle, User, FileText, Users } from "lucide-react";

const CLASSES = ["Noorani Qaida", "Quran Nazra", "Tajweed", "Hifz (Memorisation)", "Class 1", "Class 2", "Class 3", "Class 4", "Class 5", "Class 6", "Class 7", "Class 8"];
const EDUCATION_LEVELS = ["Primary (Class 1-5)", "Middle (Class 6-8)", "Matric / SSC", "Intermediate / FSc / FA", "Bachelor's Degree", "Master's Degree", "None / Not Applicable"];
const CNIC_REGEX = /^\d{5}-\d{7}-\d{1}$/;
type EnrollType = "self" | "parent";

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function validateCnic(value: string): boolean {
  return CNIC_REGEX.test(value);
}

type Step = "details" | "documents" | "review";

export default function Register() {
  const [enrollType, setEnrollType] = useState<EnrollType>("self");
  const [step, setStep] = useState<Step>("details");

  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [fatherName, setFatherName] = useState("");
  const [motherName, setMotherName] = useState("");
  const [dob, setDob] = useState("");
  const [age, setAge] = useState<number | "">("");
  const [gender, setGender] = useState<"male" | "female">("male");
  const [currentClass, setCurrentClass] = useState("");
  const [lastEducation, setLastEducation] = useState("");

  const [cnicNumber, setCnicNumber] = useState("");
  const [cnicError, setCnicError] = useState("");
  const [profileImageUrl, setProfileImageUrl] = useState<string>("");
  const [documentFileUrl, setDocumentFileUrl] = useState<string>("");
  const [profileFileName, setProfileFileName] = useState("");
  const [documentFileName, setDocumentFileName] = useState("");

  const createUserMutation = useCreateUser();
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const ageNum = typeof age === "number" ? age : parseInt(String(age)) || 0;
  const isMinor = ageNum > 0 && ageNum < 18;
  const docLabel = isMinor ? "B-Form" : "CNIC";
  const cnicPlaceholder = isMinor ? "Computerised B-Form number" : "e.g. 12345-1234567-1";

  const handleProfileImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast({ title: "Only image files allowed for profile photo", variant: "destructive" });
      return;
    }
    if (file.size > 3 * 1024 * 1024) {
      toast({ title: "Profile photo must be under 3MB", variant: "destructive" });
      return;
    }
    const b64 = await fileToBase64(file);
    setProfileImageUrl(b64);
    setProfileFileName(file.name);
  };

  const handleDocumentChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const allowed = ["image/jpeg", "image/jpg", "image/png", "image/webp", "application/pdf"];
    if (!allowed.includes(file.type)) {
      toast({ title: "Only image or PDF files allowed", variant: "destructive" });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast({ title: "Document must be under 5MB", variant: "destructive" });
      return;
    }
    const b64 = await fileToBase64(file);
    setDocumentFileUrl(b64);
    setDocumentFileName(file.name);
  };

  const validateStep1 = () => {
    if (!fullName.trim()) { toast({ title: "Full name is required — پورا نام ضروری ہے", variant: "destructive" }); return false; }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      toast({ title: "Valid email is required — صحیح ای میل ضروری ہے", variant: "destructive" }); return false;
    }
    if (!password || password.length < 6) { toast({ title: "Password must be at least 6 characters — پاسورڈ کم از کم 6 حروف", variant: "destructive" }); return false; }
    if (!phone.trim()) { toast({ title: "Phone number is required — فون نمبر ضروری ہے", variant: "destructive" }); return false; }
    // Pakistan phone: 03XXXXXXXXX or +923XXXXXXXXX
    const phoneDigits = phone.replace(/[^\d]/g, "");
    const validPhone = /^(?:92|0)?3\d{9}$/.test(phoneDigits);
    if (!validPhone) {
      toast({ title: "Invalid phone — غلط فون نمبر (03XXXXXXXXX)", variant: "destructive" }); return false;
    }
    if (!fatherName.trim()) { toast({ title: "Father/Mother name is required — والد/والدہ کا نام ضروری ہے", variant: "destructive" }); return false; }
    if (!age || ageNum <= 0 || ageNum > 100) { toast({ title: "Please enter a valid age — صحیح عمر لکھیں", variant: "destructive" }); return false; }
    if (!currentClass) { toast({ title: "Please select your current class — درجہ منتخب کریں", variant: "destructive" }); return false; }
    if (!lastEducation) { toast({ title: "Please select your last education level — تعلیمی سطح منتخب کریں", variant: "destructive" }); return false; }
    return true;
  };

  const validateStep2 = () => {
    if (!profileImageUrl) { toast({ title: "Profile photo is required (clear face image)", variant: "destructive" }); return false; }
    if (!documentFileUrl) { toast({ title: `${docLabel} document is required`, variant: "destructive" }); return false; }
    if (!isMinor && cnicNumber && !validateCnic(cnicNumber)) {
      setCnicError("CNIC format must be: XXXXX-XXXXXXX-X");
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (step === "details" && validateStep1()) setStep("documents");
    else if (step === "documents" && validateStep2()) setStep("review");
  };

  const handleSubmit = () => {
    createUserMutation.mutate(
      {
        data: {
          fullName: fullName.trim(),
          username: username.trim() || null,
          email: email.trim(),
          password,
          phone: phone.trim() || null,
          fatherName: fatherName.trim() || null,
          age: ageNum || null,
          gender,
          section: gender === "male" ? "boys" : "girls",
          role: gender === "male" ? "male_student" : "female_student",
          currentClass: currentClass || null,
          lastEducation: lastEducation || null,
          cnicNumber: cnicNumber.trim() || null,
          profileImageUrl: profileImageUrl || null,
          documentFileUrl: documentFileUrl || null,
        }
      },
      {
        onSuccess: () => {
          toast({
            title: "Registration successful!",
            description: "Your application is under review. You'll be notified after verification.",
          });
          setLocation("/login");
        },
        onError: (err) => {
          toast({ title: "Registration failed", description: err.message || "An error occurred", variant: "destructive" });
          setStep("details");
        },
      }
    );
  };

  const steps: { id: Step; label: string }[] = [
    { id: "details", label: "Personal Details" },
    { id: "documents", label: "Documents & Photo" },
    { id: "review", label: "Review & Submit" },
  ];
  const stepIndex = steps.findIndex(s => s.id === step);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-muted/30 p-4 py-12">
      <div className="mb-8 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-4">
          <BookOpen className="w-8 h-8" />
        </div>
        <h1 className="text-4xl font-serif font-bold text-primary">AtwsQuranofficial</h1>
        <p className="text-muted-foreground mt-1">Student Admission Form</p>
      </div>

      <div className="w-full max-w-2xl">
        {/* Enrollment type selector */}
        <div className="flex rounded-xl overflow-hidden border border-primary/20 mb-4 bg-white shadow-sm">
          <button
            onClick={() => { setEnrollType("self"); setStep("details"); }}
            className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors ${
              enrollType === "self" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted/50"
            }`}
          >
            <User className="w-4 h-4" />
            خود داخلہ لے رہا ہوں
          </button>
          <button
            onClick={() => { setEnrollType("parent"); setStep("details"); }}
            className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors ${
              enrollType === "parent" ? "bg-amber-600 text-white" : "text-muted-foreground hover:bg-muted/50"
            }`}
          >
            <Users className="w-4 h-4" />
            بچے کا داخلہ (والدین)
          </button>
        </div>

        {enrollType === "parent" && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-4 text-sm" dir="rtl">
            <p className="font-semibold text-amber-800 mb-1">والدین کا داخلہ فارم</p>
            <p className="text-amber-700 text-xs">اپنے بچے/بچی کی تمام معلومات درج کریں۔ ای میل آپ (والدین) کا Gmail ہو۔ داخلے کے بعد ایڈمن آپ سے رابطہ کرے گا۔</p>
          </div>
        )}

        {/* Step indicator */}
        <div className="flex items-center mb-6 gap-2">
          {steps.map((s, i) => (
            <div key={s.id} className="flex items-center gap-2 flex-1">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${
                i < stepIndex ? "bg-primary text-primary-foreground" : i === stepIndex ? "bg-primary text-primary-foreground ring-4 ring-primary/20" : "bg-muted text-muted-foreground"
              }`}>
                {i < stepIndex ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
              </div>
              <span className={`text-xs ${i === stepIndex ? "font-semibold text-primary" : "text-muted-foreground"}`}>{s.label}</span>
              {i < steps.length - 1 && <div className={`flex-1 h-0.5 ${i < stepIndex ? "bg-primary" : "bg-muted"}`} />}
            </div>
          ))}
        </div>

        <Card className="shadow-xl border-primary/10">
          {step === "details" && (
            <>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  {enrollType === "parent" ? "بچے کی ذاتی معلومات" : "Personal Information"}
                </CardTitle>
                <CardDescription dir="rtl">
                  {enrollType === "parent"
                    ? "بچے کی تمام معلومات درج کریں — ای میل اور پاس ورڈ آپ (والدین) کا ہوگا"
                    : "Fill in your basic details for admission"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name <span className="text-red-500">*</span></Label>
                    <Input id="fullName" required value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Muhammad Ali / Fatima Bibi" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="username">Username (optional)</Label>
                    <Input id="username" value={username} onChange={e => setUsername(e.target.value)} placeholder="e.g. ali_quran" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email (Gmail) <span className="text-red-500">*</span></Label>
                    <Input id="email" type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="name@gmail.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number <span className="text-red-500">*</span></Label>
                    <Input id="phone" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+92 300 1234567" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="password">
                      {enrollType === "parent" ? "پاس ورڈ (والدین کا)" : "Password"} <span className="text-red-500">*</span>
                    </Label>
                    <Input id="password" type="password" required value={password} onChange={e => setPassword(e.target.value)} placeholder="Min. 6 characters" autoComplete="new-password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fatherName">
                      {enrollType === "parent" ? "والد کا نام" : "Father / Mother Name"} <span className="text-red-500">*</span>
                    </Label>
                    <Input id="fatherName" value={fatherName} onChange={e => setFatherName(e.target.value)} placeholder={enrollType === "parent" ? "والد کا مکمل نام" : "Father or Mother's name"} />
                  </div>
                </div>
                {enrollType === "parent" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="motherName">والدہ کا نام <span className="text-red-500">*</span></Label>
                      <Input id="motherName" value={motherName} onChange={e => setMotherName(e.target.value)} placeholder="والدہ کا مکمل نام" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dob">تاریخ پیدائش <span className="text-red-500">*</span></Label>
                      <Input
                        id="dob"
                        type="date"
                        value={dob}
                        max={new Date().toISOString().split("T")[0]}
                        onChange={e => {
                          setDob(e.target.value);
                          if (e.target.value) {
                            const birth = new Date(e.target.value);
                            const now = new Date();
                            setAge(now.getFullYear() - birth.getFullYear());
                          }
                        }}
                      />
                      {ageNum > 0 && <Badge variant="secondary" className="text-xs">عمر: {ageNum} سال</Badge>}
                    </div>
                  </div>
                )}
                {enrollType === "self" && (
                  <div className="space-y-2">
                    <Label htmlFor="age">Age <span className="text-red-500">*</span></Label>
                    <Input
                      id="age"
                      type="number"
                      min={3}
                      max={99}
                      value={age}
                      onChange={e => setAge(e.target.value === "" ? "" : parseInt(e.target.value))}
                      placeholder="e.g. 12"
                    />
                    {ageNum > 0 && (
                      <Badge variant={isMinor ? "secondary" : "default"} className="text-xs">
                        {isMinor ? "Minor — B-Form required" : "Adult — CNIC required"}
                      </Badge>
                    )}
                  </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>{enrollType === "parent" ? "جنس (بچے کی)" : "Gender"} <span className="text-red-500">*</span></Label>
                    <Select value={gender} onValueChange={(v: "male" | "female") => setGender(v)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">{enrollType === "parent" ? "لڑکا (بنین)" : "Male (Boys Section)"}</SelectItem>
                        <SelectItem value="female">{enrollType === "parent" ? "لڑکی (بنات)" : "Female (Girls Section)"}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>درجہ / Current Class <span className="text-red-500">*</span></Label>
                    <Select value={currentClass} onValueChange={setCurrentClass}>
                      <SelectTrigger><SelectValue placeholder="Select class" /></SelectTrigger>
                      <SelectContent>
                        {CLASSES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Last Education Level <span className="text-red-500">*</span></Label>
                  <Select value={lastEducation} onValueChange={setLastEducation}>
                    <SelectTrigger><SelectValue placeholder="Select education level" /></SelectTrigger>
                    <SelectContent>
                      {EDUCATION_LEVELS.map(e => <SelectItem key={e} value={e}>{e}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </>
          )}

          {step === "documents" && (
            <>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><FileText className="w-5 h-5" /> Documents & Verification</CardTitle>
                <CardDescription>
                  Upload your profile photo and {isMinor ? "B-Form (under 18)" : "CNIC (18 and above)"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Profile Photo */}
                <div className="space-y-3">
                  <Label className="text-base font-semibold">Profile Photo <span className="text-red-500">*</span></Label>
                  <p className="text-xs text-muted-foreground">Clear face photo, good lighting. Max 3MB.</p>
                  <div className="border-2 border-dashed border-primary/30 rounded-lg p-6 text-center hover:border-primary/60 transition-colors">
                    {profileImageUrl ? (
                      <div className="flex flex-col items-center gap-3">
                        <img src={profileImageUrl} alt="Profile preview" className="w-24 h-24 rounded-full object-cover border-4 border-primary/20" />
                        <div className="flex items-center gap-2 text-sm text-green-600">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>{profileFileName}</span>
                        </div>
                        <Label htmlFor="profile-upload" className="cursor-pointer text-xs text-primary hover:underline">Change photo</Label>
                      </div>
                    ) : (
                      <Label htmlFor="profile-upload" className="cursor-pointer flex flex-col items-center gap-2">
                        <Upload className="w-8 h-8 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Click to upload profile photo</span>
                        <span className="text-xs text-muted-foreground">JPG, PNG (max 3MB)</span>
                      </Label>
                    )}
                    <Input
                      id="profile-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleProfileImageChange}
                    />
                  </div>
                </div>

                {/* CNIC / B-Form */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Label className="text-base font-semibold">{docLabel} Document <span className="text-red-500">*</span></Label>
                    <Badge variant={isMinor ? "secondary" : "outline"} className="text-xs">
                      {isMinor ? "Under 18 — B-Form" : "18+ — CNIC"}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {isMinor
                      ? "Upload your Computerised B-Form (image or PDF, max 5MB)"
                      : "Upload a clear scan/photo of your CNIC (image or PDF, max 5MB)"}
                  </p>

                  {!isMinor && (
                    <div className="space-y-1">
                      <Label htmlFor="cnic-number" className="text-sm">CNIC Number</Label>
                      <Input
                        id="cnic-number"
                        value={cnicNumber}
                        onChange={e => { setCnicNumber(e.target.value); setCnicError(""); }}
                        placeholder="12345-1234567-1"
                        className={cnicError ? "border-red-500" : ""}
                      />
                      {cnicError && (
                        <div className="flex items-center gap-1 text-xs text-red-500">
                          <AlertCircle className="w-3 h-3" />
                          {cnicError}
                        </div>
                      )}
                    </div>
                  )}

                  <div className="border-2 border-dashed border-primary/30 rounded-lg p-6 text-center hover:border-primary/60 transition-colors">
                    {documentFileUrl ? (
                      <div className="flex flex-col items-center gap-2">
                        <CheckCircle2 className="w-8 h-8 text-green-500" />
                        <p className="text-sm text-green-600 font-medium">{documentFileName}</p>
                        <Label htmlFor="doc-upload" className="cursor-pointer text-xs text-primary hover:underline">Change document</Label>
                      </div>
                    ) : (
                      <Label htmlFor="doc-upload" className="cursor-pointer flex flex-col items-center gap-2">
                        <Upload className="w-8 h-8 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Click to upload {docLabel}</span>
                        <span className="text-xs text-muted-foreground">Image or PDF, max 5MB</span>
                      </Label>
                    )}
                    <Input
                      id="doc-upload"
                      type="file"
                      accept="image/*,application/pdf"
                      className="hidden"
                      onChange={handleDocumentChange}
                    />
                  </div>
                </div>
              </CardContent>
            </>
          )}

          {step === "review" && (
            <>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-green-500" /> Review Your Application</CardTitle>
                <CardDescription>Please confirm all information is correct before submitting</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  {profileImageUrl && (
                    <div className="col-span-2 flex justify-center mb-2">
                      <img src={profileImageUrl} alt="Profile" className="w-20 h-20 rounded-full object-cover border-4 border-primary/20" />
                    </div>
                  )}
                  {[
                    ["Full Name", fullName],
                    ["Username", username || "—"],
                    ["Email", email],
                    ["Phone", phone],
                    ["Father/Mother Name", fatherName],
                    ["Age", `${age} years ${isMinor ? "(Minor)" : "(Adult)"}`],
                    ["Gender", gender === "male" ? "Male" : "Female"],
                    ["Current Class", currentClass],
                    ["Last Education", lastEducation],
                    [docLabel + " Number", cnicNumber || "—"],
                    [docLabel + " Document", documentFileName || "Not uploaded"],
                  ].map(([label, value]) => (
                    <div key={label} className="space-y-0.5">
                      <p className="text-xs text-muted-foreground">{label}</p>
                      <p className="font-medium break-all">{value}</p>
                    </div>
                  ))}
                </div>
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-700 space-y-1">
                  <p className="font-semibold">After submission:</p>
                  <p>1. Admin will review your documents</p>
                  <p>2. A video call test will be scheduled</p>
                  <p>3. You will be notified of approval/rejection</p>
                </div>
              </CardContent>
            </>
          )}

          <CardFooter className="flex flex-col gap-3">
            <div className="flex gap-3 w-full">
              {step !== "details" && (
                <Button variant="outline" onClick={() => setStep(step === "review" ? "documents" : "details")} className="flex-1">
                  Back
                </Button>
              )}
              {step !== "review" ? (
                <Button onClick={handleNext} className="flex-1">
                  Continue →
                </Button>
              ) : (
                <Button onClick={handleSubmit} className="flex-1" disabled={createUserMutation.isPending}>
                  {createUserMutation.isPending ? "Submitting..." : "Submit Application"}
                </Button>
              )}
            </div>
            {step === "details" && (
              <p className="text-sm text-center text-muted-foreground">
                Already registered?{" "}
                <Link href="/login" className="text-primary hover:underline font-medium">Log in</Link>
              </p>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
