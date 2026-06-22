import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { FileText, Upload, MessageSquare, HelpCircle } from "lucide-react";
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
import { toast } from "sonner";

export const Route = createFileRoute("/student/assessments")({
  head: () => ({ meta: [{ title: "Assessments · KCG" }] }),
  component: Assessments,
});

const QUIZ_HISTORY = [
  { name: "Linear Structures", score: 18, total: 20 },
  { name: "Stacks & Queues", score: 16, total: 20 },
  { name: "ER Modeling", score: 19, total: 20 },
  { name: "SQL Joins", score: 14, total: 20 },
  { name: "Search Algos", score: 17, total: 20 },
];

function Assessments() {
  const [assignments, setAssignments] = useState(ASSIGNMENTS.map((a) => ({ ...a })));
  const [submitDialog, setSubmitDialog] = useState<string | null>(null);
  const submitTarget = assignments.find((a) => a.id === submitDialog);

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

        <TabsContent value="quizzes" className="space-y-4">
          <div className="rounded-xl border bg-card p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold">Recent Quiz Performance</h3>
                <p className="text-xs text-muted-foreground">Last 5 quizzes across courses</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge className="bg-success/15 text-success border-0">Avg 84%</Badge>
                <Button size="sm" asChild>
                  <Link to="/student/quiz/$quizId" params={{ quizId: "q1" }}>
                    <HelpCircle className="h-3.5 w-3.5 mr-1.5" /> Take Quiz
                  </Link>
                </Button>
              </div>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={QUIZ_HISTORY}>
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
