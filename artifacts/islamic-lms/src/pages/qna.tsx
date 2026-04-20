import { useListQna, useAnswerQna, useCreateQna, useGetCurrentUser } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { MessageSquarePlus } from "lucide-react";

export default function QnaBoard() {
  const { data: currentUser } = useGetCurrentUser();
  const { data: qnas, isLoading, refetch } = useListQna();
  const answerMutation = useAnswerQna();
  const askMutation = useCreateQna();
  const { toast } = useToast();

  const [answerTexts, setAnswerTexts] = useState<Record<number, string>>({});
  const [question, setQuestion] = useState("");
  const [isAskOpen, setIsAskOpen] = useState(false);

  const isStudent = currentUser?.role === "male_student" || currentUser?.role === "female_student";
  const isTeacherOrAdmin = currentUser?.role === "teacher" || currentUser?.role === "female_teacher" || currentUser?.role === "admin" || currentUser?.role === "qari";

  const handleAnswerSubmit = (qnaId: number) => {
    const answer = answerTexts[qnaId];
    if (!answer || !currentUser) return;

    answerMutation.mutate(
      {
        id: qnaId,
        data: { answer, teacherId: currentUser.id }
      },
      {
        onSuccess: () => {
          toast({ title: "Answer submitted successfully" });
          setAnswerTexts(prev => ({ ...prev, [qnaId]: "" }));
          refetch();
        },
        onError: (err) => {
          toast({ title: "Failed to submit answer", description: err.message, variant: "destructive" });
        }
      }
    );
  };

  const handleAskQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || !currentUser) return;

    askMutation.mutate(
      {
        data: {
          studentId: currentUser.id,
          question: question.trim(),
        }
      },
      {
        onSuccess: () => {
          toast({ title: "Question submitted!", description: "A teacher will answer shortly." });
          setQuestion("");
          setIsAskOpen(false);
          refetch();
        },
        onError: (err) => {
          toast({ title: "Failed to submit question", description: err.message, variant: "destructive" });
        }
      }
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-3xl font-bold tracking-tight font-serif text-primary">Q&A Board</h2>
          <p className="text-muted-foreground">Student questions and teacher replies.</p>
        </div>
        {isStudent && (
          <Button onClick={() => setIsAskOpen(!isAskOpen)} className="gap-2">
            <MessageSquarePlus className="w-4 h-4" />
            Ask a Question
          </Button>
        )}
      </div>

      {isStudent && isAskOpen && (
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Submit Your Question</CardTitle>
          </CardHeader>
          <form onSubmit={handleAskQuestion}>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="question">Your Question</Label>
                <Textarea
                  id="question"
                  placeholder="Write your question about the course or Islamic topic..."
                  value={question}
                  onChange={e => setQuestion(e.target.value)}
                  rows={3}
                  required
                />
              </div>
            </CardContent>
            <CardFooter className="pt-0 gap-2">
              <Button type="submit" disabled={askMutation.isPending || !question.trim()}>
                {askMutation.isPending ? "Submitting..." : "Submit Question"}
              </Button>
              <Button type="button" variant="ghost" onClick={() => setIsAskOpen(false)}>Cancel</Button>
            </CardFooter>
          </form>
        </Card>
      )}

      <div className="space-y-4">
        {isLoading ? (
          <div className="flex justify-center p-8"><Spinner className="w-8 h-8 text-primary" /></div>
        ) : !qnas || qnas.length === 0 ? (
          <div className="text-center p-8 text-muted-foreground">
            <p>No questions found.</p>
            {isStudent && <p className="text-sm mt-1">Click "Ask a Question" above to be the first!</p>}
          </div>
        ) : (
          qnas.map((qna) => (
            <Card key={qna.id} className="shadow-sm border-primary/10">
              <CardHeader className="pb-2 flex flex-row items-center justify-between">
                <CardTitle className="text-lg font-serif">Question</CardTitle>
                <Badge variant={qna.status === "answered" ? "default" : "secondary"}>
                  {qna.status}
                </Badge>
              </CardHeader>
              <CardContent>
                <p className="text-foreground">{qna.question}</p>

                {qna.answer && (
                  <div className="mt-4 p-4 bg-muted/30 rounded-lg border border-primary/5">
                    <p className="text-sm font-medium text-primary mb-1">Teacher's Reply:</p>
                    <p className="text-muted-foreground">{qna.answer}</p>
                  </div>
                )}
              </CardContent>
              {qna.status === "pending" && isTeacherOrAdmin && (
                <CardFooter className="pt-0">
                  <div className="flex w-full gap-2">
                    <Input
                      placeholder="Write your answer..."
                      value={answerTexts[qna.id] || ""}
                      onChange={e => setAnswerTexts(prev => ({ ...prev, [qna.id]: e.target.value }))}
                    />
                    <Button
                      onClick={() => handleAnswerSubmit(qna.id)}
                      disabled={!answerTexts[qna.id] || answerMutation.isPending}
                    >
                      Submit Reply
                    </Button>
                  </div>
                </CardFooter>
              )}
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
