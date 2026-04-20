import { useGetCourse, useListLessons } from "@workspace/api-client-react";
import { useParams } from "wouter";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { BookOpen, FileText, Video, Download } from "lucide-react";
import { useAuth } from "@/lib/auth";

export default function CourseDetail() {
  const { id } = useParams<{ id: string }>();
  const courseId = parseInt(id, 10);
  const { data: course, isLoading: isCourseLoading } = useGetCourse(courseId, {
    query: { enabled: !isNaN(courseId) }
  });
  
  const { data: lessons, isLoading: isLessonsLoading } = useListLessons({ courseId }, {
    query: { enabled: !isNaN(courseId) }
  });

  const { user } = useAuth();

  if (isCourseLoading) {
    return <div className="flex justify-center p-12"><Spinner className="w-8 h-8 text-primary" /></div>;
  }

  if (!course) {
    return <div className="text-center p-12 text-muted-foreground">Course not found.</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3 mb-2">
          <Badge variant="outline" className="capitalize">{course.type.replace("_", " ")}</Badge>
          <Badge variant="secondary" className="capitalize">{course.gender} Section</Badge>
          {course.level && <Badge variant="outline">Level {course.level}</Badge>}
        </div>
        <h2 className="text-3xl font-bold tracking-tight font-serif text-primary">{course.title}</h2>
        <p className="text-muted-foreground max-w-3xl">{course.description || "No description provided."}</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <h3 className="text-xl font-bold font-serif flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-primary" />
            Course Curriculum
          </h3>
          
          {isLessonsLoading ? (
            <div className="flex justify-center p-8"><Spinner className="w-6 h-6 text-primary" /></div>
          ) : !lessons || lessons.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="p-8 text-center text-muted-foreground">
                No lessons available for this course yet.
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {lessons.map((lesson, index) => (
                <Card key={lesson.id} className="shadow-sm border-primary/10 transition-all hover:border-primary/30">
                  <CardHeader className="pb-3 flex flex-row items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <span className="text-primary/60 text-sm font-mono w-6">{index + 1}.</span>
                        {lesson.title}
                      </CardTitle>
                      {lesson.isPrivate && <Badge variant="secondary" className="text-xs">Private</Badge>}
                    </div>
                  </CardHeader>
                  <CardContent>
                    {lesson.content && (
                      <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{lesson.content}</p>
                    )}
                    
                    <div className="flex flex-wrap gap-2 mt-2">
                      {lesson.videoUrl && (
                        <Button variant="outline" size="sm" className="gap-2" asChild>
                          <a href={lesson.videoUrl} target="_blank" rel="noopener noreferrer">
                            <Video className="w-4 h-4" /> Watch Lesson
                          </a>
                        </Button>
                      )}
                      {lesson.pdfUrl && (
                        <Button variant="outline" size="sm" className="gap-2" asChild>
                          <a href={lesson.pdfUrl} target="_blank" rel="noopener noreferrer">
                            <FileText className="w-4 h-4" /> Reading Material
                          </a>
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-6">
          <Card className="shadow-sm border-primary/10">
            <CardHeader>
              <CardTitle>Course Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="flex justify-between py-2 border-b border-primary/5">
                <span className="text-muted-foreground">Total Lessons</span>
                <span className="font-medium">{course.lessonCount}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-primary/5">
                <span className="text-muted-foreground">Level</span>
                <span className="font-medium">{course.level || "All Levels"}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-primary/5">
                <span className="text-muted-foreground">Enrolled</span>
                <span className="font-medium capitalize">{course.gender}</span>
              </div>
              {user && (user.role === 'male_student' || user.role === 'female_student') && (
                <Button className="w-full mt-4">Ask a Question</Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
