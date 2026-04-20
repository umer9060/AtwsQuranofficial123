import { useListLessons, useCreateLesson, useListCourses } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { FileText, Video } from "lucide-react";

export default function Lessons() {
  const [search, setSearch] = useState("");
  const [selectedCourse, setSelectedCourse] = useState<string>("all");
  
  const { data: courses } = useListCourses();
  const { data: lessons, isLoading, refetch } = useListLessons({ 
    search: search || undefined,
    courseId: selectedCourse !== "all" ? parseInt(selectedCourse) : undefined
  });

  const { user } = useAuth();
  const isTeacherOrAdmin = user?.role === "admin" || user?.role === "teacher" || user?.role === "female_teacher" || user?.role === "qari";

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight font-serif text-primary">Lessons Management</h2>
          <p className="text-muted-foreground">Manage course lessons and materials.</p>
        </div>
        {isTeacherOrAdmin && (
          <CreateLessonDialog courses={courses || []} onCreated={refetch} />
        )}
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <CardTitle>All Lessons</CardTitle>
            <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
              <Input
                placeholder="Search lessons..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="max-w-xs"
              />
              <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                <SelectTrigger className="w-full sm:w-[200px]">
                  <SelectValue placeholder="Filter by course" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Courses</SelectItem>
                  {courses?.map(c => (
                    <SelectItem key={c.id} value={c.id.toString()}>{c.title}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center p-8"><Spinner className="w-8 h-8 text-primary" /></div>
          ) : !lessons || lessons.length === 0 ? (
            <div className="text-center p-8 text-muted-foreground">No lessons found.</div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {lessons.map((lesson) => (
                <Card key={lesson.id} className="shadow-sm border-primary/10">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div className="flex flex-col gap-1">
                        <span className="text-xs text-muted-foreground font-medium">Order: {lesson.orderIndex}</span>
                        <CardTitle className="text-lg">{lesson.title}</CardTitle>
                      </div>
                      {lesson.isPrivate && <Badge variant="secondary">Private</Badge>}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {lesson.content || "No content provided."}
                    </p>
                    <div className="flex gap-2">
                      {lesson.videoUrl && (
                        <Badge variant="outline" className="flex gap-1 items-center bg-primary/5">
                          <Video className="w-3 h-3" /> Video
                        </Badge>
                      )}
                      {lesson.pdfUrl && (
                        <Badge variant="outline" className="flex gap-1 items-center bg-primary/5">
                          <FileText className="w-3 h-3" /> PDF
                        </Badge>
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

function CreateLessonDialog({ courses, onCreated }: { courses: any[], onCreated: () => void }) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [courseId, setCourseId] = useState<string>("");
  const [content, setContent] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [pdfUrl, setPdfUrl] = useState("");
  const [orderIndex, setOrderIndex] = useState("1");
  const [isPrivate, setIsPrivate] = useState(false);
  
  const createMutation = useCreateLesson();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseId) {
      toast({ title: "Validation Error", description: "Please select a course", variant: "destructive" });
      return;
    }

    createMutation.mutate(
      {
        data: {
          title,
          courseId: parseInt(courseId),
          content: content || null,
          videoUrl: videoUrl || null,
          pdfUrl: pdfUrl || null,
          orderIndex: parseInt(orderIndex),
          isPrivate
        }
      },
      {
        onSuccess: () => {
          toast({ title: "Lesson created successfully" });
          setOpen(false);
          setTitle("");
          setContent("");
          setVideoUrl("");
          setPdfUrl("");
          onCreated();
        },
        onError: (err) => {
          toast({ title: "Failed to create lesson", description: err.message, variant: "destructive" });
        }
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add New Lesson</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create Lesson</DialogTitle>
          <DialogDescription>Add a new lesson to a course.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="course">Course</Label>
            <Select value={courseId} onValueChange={setCourseId}>
              <SelectTrigger>
                <SelectValue placeholder="Select course" />
              </SelectTrigger>
              <SelectContent>
                {courses.map(c => (
                  <SelectItem key={c.id} value={c.id.toString()}>{c.title}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" value={title} onChange={e => setTitle(e.target.value)} required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="order">Order Index</Label>
              <Input id="order" type="number" min="1" value={orderIndex} onChange={e => setOrderIndex(e.target.value)} required />
            </div>
            <div className="flex items-center space-x-2 pt-8">
              <Switch id="private" checked={isPrivate} onCheckedChange={setIsPrivate} />
              <Label htmlFor="private">Private Lesson</Label>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="content">Description / Content</Label>
            <Textarea id="content" value={content} onChange={e => setContent(e.target.value)} rows={3} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="video">Video URL (Optional)</Label>
            <Input id="video" type="url" value={videoUrl} onChange={e => setVideoUrl(e.target.value)} placeholder="https://..." />
          </div>
          <div className="space-y-2">
            <Label htmlFor="pdf">PDF URL (Optional)</Label>
            <Input id="pdf" type="url" value={pdfUrl} onChange={e => setPdfUrl(e.target.value)} placeholder="https://..." />
          </div>
          <div className="flex justify-end pt-4">
            <Button type="submit" disabled={createMutation.isPending}>
              {createMutation.isPending ? "Creating..." : "Create Lesson"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
