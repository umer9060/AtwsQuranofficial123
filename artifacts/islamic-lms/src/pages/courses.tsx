import { useListCourses, useCreateCourse, useDeleteCourse } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";
import { Spinner } from "@/components/ui/spinner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, Eye } from "lucide-react";

export default function Courses() {
  const [search, setSearch] = useState("");
  const { user } = useAuth();
  const { data: courses, isLoading, refetch } = useListCourses({
    search: search || undefined
  });
  const deleteMutation = useDeleteCourse();
  const { toast } = useToast();

  const isAdminOrTeacher = user?.role === "admin" || user?.role === "teacher" || user?.role === "female_teacher" || user?.role === "qari";

  const handleDelete = (id: number, title: string) => {
    if (confirm(`Delete course "${title}"? This cannot be undone.`)) {
      deleteMutation.mutate(
        { id },
        {
          onSuccess: () => { toast({ title: "Course deleted" }); refetch(); },
          onError: (e) => toast({ title: "Failed", description: e.message, variant: "destructive" }),
        }
      );
    }
  };

  const TYPE_COLORS: Record<string, string> = {
    qaida: "bg-blue-100 text-blue-700",
    quran: "bg-green-100 text-green-700",
    hifz: "bg-purple-100 text-purple-700",
    tajweed: "bg-orange-100 text-orange-700",
    hadith: "bg-yellow-100 text-yellow-700",
    fiqh: "bg-red-100 text-red-700",
    translation: "bg-teal-100 text-teal-700",
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight font-serif text-primary">Courses</h2>
          <p className="text-muted-foreground">Browse academic programs and courses.</p>
        </div>
        {isAdminOrTeacher && <CreateCourseDialog onCreated={refetch} />}
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <CardTitle>All Courses</CardTitle>
            <div className="flex gap-2 w-full md:w-auto">
              <Input
                placeholder="Search courses..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="max-w-xs"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center p-8"><Spinner className="text-primary w-8 h-8" /></div>
          ) : !courses || courses.length === 0 ? (
            <div className="text-center p-8 text-muted-foreground">No courses found.</div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {courses.map((course) => (
                <Card key={course.id} className="shadow-sm border-primary/10 flex flex-col hover:border-primary/30 transition-all">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start mb-2">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${TYPE_COLORS[course.type] || "bg-gray-100 text-gray-700"}`}>
                        {course.type.replace("_", " ")}
                      </span>
                      <Badge variant="secondary" className="capitalize text-xs">
                        {course.gender}
                      </Badge>
                    </div>
                    <CardTitle className="text-xl">{course.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col justify-between">
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {course.description || "No description provided."}
                    </p>
                    <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
                      <span>Level {course.level || "N/A"}</span>
                      <span>{course.lessonCount} lessons</span>
                    </div>
                    <div className="flex gap-2">
                      <Link href={`/courses/${course.id}`} className="flex-1">
                        <Button variant="outline" size="sm" className="w-full h-8 text-xs gap-1">
                          <Eye className="w-3 h-3" /> View
                        </Button>
                      </Link>
                      {isAdminOrTeacher && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-muted-foreground hover:text-red-600"
                          onClick={() => handleDelete(course.id, course.title)}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function CreateCourseDialog({ onCreated }: { onCreated: () => void }) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [type, setType] = useState("qaida");
  const [gender, setGender] = useState("both");
  const [level, setLevel] = useState("1");
  const [description, setDescription] = useState("");

  const createMutation = useCreateCourse();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(
      {
        data: {
          title,
          type: type as any,
          gender: gender as any,
          level: parseInt(level),
          description: description || null,
        }
      },
      {
        onSuccess: () => {
          toast({ title: "Course created successfully" });
          setOpen(false);
          setTitle(""); setDescription("");
          onCreated();
        },
        onError: (e) => toast({ title: "Failed", description: e.message, variant: "destructive" }),
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2"><Plus className="w-4 h-4" /> Add Course</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader><DialogTitle>Create New Course</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-2">
            <Label>Course Title</Label>
            <Input value={title} onChange={e => setTitle(e.target.value)} required placeholder="e.g. Quran Nazra - Beginners" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Type</Label>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="qaida">Noorani Qaida</SelectItem>
                  <SelectItem value="quran">Quran Nazra</SelectItem>
                  <SelectItem value="hifz">Quran Hifz</SelectItem>
                  <SelectItem value="tajweed">Tajweed</SelectItem>
                  <SelectItem value="hadith">Hadith</SelectItem>
                  <SelectItem value="fiqh">Fiqh</SelectItem>
                  <SelectItem value="translation">Translation</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Level</Label>
              <Select value={level} onValueChange={setLevel}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {[1,2,3,4,5,6].map(l => <SelectItem key={l} value={String(l)}>Level {l}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Gender Section</Label>
            <Select value={gender} onValueChange={setGender}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="both">Both (Male & Female)</SelectItem>
                <SelectItem value="male">Male Only</SelectItem>
                <SelectItem value="female">Female Only</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Description (optional)</Label>
            <Textarea value={description} onChange={e => setDescription(e.target.value)} rows={3} placeholder="Describe what students will learn..." />
          </div>
          <Button type="submit" className="w-full" disabled={createMutation.isPending}>
            {createMutation.isPending ? "Creating..." : "Create Course"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
