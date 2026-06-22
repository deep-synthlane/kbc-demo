import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { FileText, Upload, MessageSquare, HelpCircle, Clock, BookOpen, CheckCircle2 } from "lucide-react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { PageHeader } from "@/components/RoleShell";
import { ASSIGNMENTS, QUIZ_RESULT } from "@/lib/mockData";
import { useCourses } from "@/lib/courseStore";
import { toast } from "sonner";

export const Route = createFileRoute("/student/assessments")({
  head: () => ({ meta: [{ title: "Assessments · KCG" }] }),
  component: Assessments,
});

const SEED_SCORES: Record<string, { score: number; total: number }> = {
  q1: { score: 18, total: 20 },
  q2: { score: 16, total: 20 },
  q3: { score: 17, total: 20 },
};

type QuizInfo = {
  id: string;
  title: string;
  duration: string;
  done: boolean;
  courseTitle: string;
  courseCode: string;
  unitTitle: string;
};

function Assessments() {
  const { courses } = useCourses();
  const [assignments, setAssignments] = useState(ASSIGNMENTS.map((a) => ({ ...a })));
  const [submitDialog, setSubmitDialog] = useState<string | null>(null);
  const submitTarget = assignments.find((a) => a.id === submitDialog);

  const allQuizzes = useMemo<QuizInfo[]>(() => {
    const result: QuizInfo[] = [];
    for (const course of courses) {
      for (const unit of course.units) {
        for (const lesson of unit.lessons) {
          if (lesson.type === "quiz") {
            result.push({
              id: lesson.id,
              title: lesson.title,
              duration: lesson.duration,
              done: lesson.done,
              courseTitle: course.title,
              courseCode: course.code,
              unitTitle: unit.title,
            });
          }
        }
      }
    }
    return result;
  }, [courses]);

  const availableQuizzes = allQuizzes.filter((q) => !q.done);
  const completedQuizzes = allQuizzes.filter((q) => q.done);

  const chartData = completedQuizzes.slice(0, 6).map((q) => {
    const seed = SEED_SCORES[q.id];
    return {
      name: q.title.replace(/^Quiz:\s*/i, ""),
      score: seed?.score ?? Math.floor(Math.random() * 5 + 15),
      total: seed?.total ?? 20,
    };
  });

  const avgScore = chartData.length > 0
    ? Math.round(chartData.reduce((s, d) => s + (d.score / d.total) * 100, 0) / chartData.length)
    : 0;

  function handleSubmitAssignment() {
    if (!submitDialog) return;
    setAssignments((prev) =>
      prev.map((a) => (a.id === submitDialog ? { ...a, status: "Submitted" } : a)),
    );
    setSubmitDialog(null);
    toast.success("Assignment submitted successfully");
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Assessments"
        subtitle="MCQ quizzes, assignment submissions and faculty feedback"
      />

      <Tabs defaultValue="quizzes">
        <TabsList>
          <TabsTrigger value="quizzes">Quizzes</TabsTrigger>
          <TabsTrigger value="assignments">Assignments</TabsTrigger>
          <TabsTrigger value="results">Results & Feedback</TabsTrigger>
        </TabsList>

        <TabsContent value="quizzes" className="space-y-6">
          {/* Available Quizzes */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Available Quizzes</h3>
              <Badge variant="outline">{availableQuizzes.length} pending</Badge>
            </div>
            {availableQuizzes.length === 0 ? (
              <div className="rounded-xl border border-dashed p-6 text-center text-muted-foreground text-sm">
                No quizzes available right now. Check back later!
              </div>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {availableQuizzes.map((q) => (
                  <div key={q.id} className="rounded-xl border bg-card p-4 shadow-sm space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="text-sm font-semibold leading-tight">{q.title}</h4>
                        <p className="text-xs text-muted-foreground mt-0.5">{q.courseCode} · {q.courseTitle}</p>
                      </div>
                      <HelpCircle className="h-4 w-4 shrink-0 text-primary" />
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" /> {q.duration}
                      </span>
                      <span className="flex items-center gap-1">
                        <BookOpen className="h-3 w-3" /> {q.unitTitle.split(" · ")[1] ?? q.unitTitle}
                      </span>
                    </div>
                    <Button size="sm" className="w-full" asChild>
                      <Link to="/student/quiz/$quizId" params={{ quizId: q.id }}>
                        Take Quiz
                      </Link>
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Completed Quizzes / Performance */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Completed Quizzes</h3>
              {avgScore > 0 && (
                <Badge className="bg-success/15 text-success border-0">Avg {avgScore}%</Badge>
              )}
            </div>
            {completedQuizzes.length === 0 ? (
              <div className="rounded-xl border border-dashed p-6 text-center text-muted-foreground text-sm">
                You haven't completed any quizzes yet. Take one above to see your results here.
              </div>
            ) : (
              <>
                {chartData.length > 0 && (
                  <div className="rounded-xl border bg-card p-5 shadow-sm">
                    <p className="text-xs text-muted-foreground mb-3">Recent quiz scores</p>
                    <div className="h-52">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                          <XAxis dataKey="name" fontSize={11} stroke="var(--color-muted-foreground)" />
                          <YAxis fontSize={12} stroke="var(--color-muted-foreground)" />
                          <Tooltip
                            contentStyle={{
                              background: "var(--color-card)",
                              border: "1px solid var(--color-border)",
                              borderRadius: 8,
                              fontSize: 12,
                            }}
                          />
                          <Bar dataKey="score" fill="var(--color-primary)" radius={[6, 6, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                )}
                <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Quiz</TableHead>
                        <TableHead>Course</TableHead>
                        <TableHead>Score</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {completedQuizzes.map((q) => {
                        const seed = SEED_SCORES[q.id];
                        return (
                          <TableRow key={q.id}>
                            <TableCell className="font-medium">{q.title}</TableCell>
                            <TableCell className="text-muted-foreground">{q.courseCode}</TableCell>
                            <TableCell>
                              {seed ? (
                                <span className="font-semibold">{seed.score}/{seed.total}</span>
                              ) : (
                                <span className="text-muted-foreground text-xs">Submitted</span>
                              )}
                            </TableCell>
                            <TableCell>
                              <Badge className="bg-success/15 text-success border-0">
                                <CheckCircle2 className="h-3 w-3 mr-1" /> Done
                              </Badge>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              </>
            )}
          </div>
        </TabsContent>

        <TabsContent value="assignments" className="space-y-4">
          <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Assignment</TableHead>
                  <TableHead>Course</TableHead>
                  <TableHead>Due</TableHead>
                  <TableHead>Weight</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {assignments.map((a) => (
                  <TableRow key={a.id}>
                    <TableCell className="font-medium">{a.title}</TableCell>
                    <TableCell>{a.course}</TableCell>
                    <TableCell className="text-muted-foreground">{a.due}</TableCell>
                    <TableCell>{a.weight}%</TableCell>
                    <TableCell>
                      <Badge
                        className={
                          a.status === "Submitted"
                            ? "bg-success/15 text-success border-0"
                            : a.status === "Draft"
                              ? "bg-warning/20 text-warning-foreground border-0"
                              : "bg-destructive/10 text-destructive border-0"
                        }
                      >
                        {a.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => a.status !== "Submitted" && setSubmitDialog(a.id)}
                      >
                        <Upload className="h-3.5 w-3.5 mr-1.5" />
                        {a.status === "Submitted" ? "View" : "Submit"}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="results" className="grid lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 rounded-xl border bg-card p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold flex items-center gap-2">
                <FileText className="h-4 w-4 text-primary" /> {QUIZ_RESULT.title}
              </h3>
              <Badge className="bg-success/15 text-success border-0">
                {QUIZ_RESULT.performance}
              </Badge>
            </div>
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="rounded-lg bg-success/10 p-4 text-center">
                <div className="text-3xl font-display font-semibold text-success">
                  {QUIZ_RESULT.score}/{QUIZ_RESULT.total}
                </div>
                <div className="text-xs text-muted-foreground mt-1">Score</div>
              </div>
              <div className="rounded-lg bg-primary/10 p-4 text-center">
                <div className="text-3xl font-display font-semibold text-primary">90%</div>
                <div className="text-xs text-muted-foreground mt-1">Percentile</div>
              </div>
              <div className="rounded-lg bg-muted p-4 text-center">
                <div className="text-3xl font-display font-semibold">{QUIZ_RESULT.timeTaken}</div>
                <div className="text-xs text-muted-foreground mt-1">Time taken</div>
              </div>
            </div>
            <div className="space-y-3">
              {QUIZ_RESULT.breakdown.map((b) => (
                <div key={b.topic}>
                  <div className="flex justify-between text-xs mb-1">
                    <span>{b.topic}</span>
                    <span className="text-muted-foreground">
                      {b.correct}/{b.total}
                    </span>
                  </div>
                  <Progress value={(b.correct / b.total) * 100} className="h-1.5" />
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-xl border bg-card p-6 shadow-sm">
            <h3 className="font-semibold flex items-center gap-2 mb-3">
              <MessageSquare className="h-4 w-4 text-primary" /> Faculty Feedback
            </h3>
            <div className="rounded-lg border-l-4 border-primary bg-primary/5 p-4 text-sm">
              {QUIZ_RESULT.facultyFeedback}
            </div>
            <div className="mt-4 text-xs text-muted-foreground">
              From <span className="font-medium text-foreground">Dr. Priya Ramanathan</span> ·
              17 Jun 2026
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={!!submitDialog} onOpenChange={(v) => !v && setSubmitDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Submit Assignment</DialogTitle>
          </DialogHeader>
          {submitTarget && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">{submitTarget.title} · {submitTarget.course}</p>
              <div className="rounded-lg border-2 border-dashed p-6 text-center text-sm text-muted-foreground">
                <Upload className="h-6 w-6 mx-auto mb-2" />
                Drag & drop your file here
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium">File name</label>
                <Input defaultValue="assignment_submission.pdf" />
              </div>
              <Button className="w-full" onClick={handleSubmitAssignment}>
                Submit Assignment
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
