import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, FileText, MessageSquarePlus, Wand2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { QUESTION_BANK, SUBMISSIONS_TO_GRADE } from "@/lib/mockData";
import { toast } from "sonner";

export const Route = createFileRoute("/teacher/assessments")({
  head: () => ({ meta: [{ title: "Assessments · Faculty · KCG" }] }),
  component: TeacherAssess,
});

const PERF = [
  { range: "0-40", students: 4 },
  { range: "40-60", students: 12 },
  { range: "60-75", students: 28 },
  { range: "75-90", students: 32 },
  { range: "90-100", students: 18 },
];

const AUTO_SCORES: Record<string, number> = { s1: 85, s2: 78, s4: 91 };

function TeacherAssess() {
  const [subs, setSubs] = useState(SUBMISSIONS_TO_GRADE.map((s) => ({ ...s, autoGraded: false })));

  function handleAutoGrade() {
    toast("Auto-grading 3 pending submissions…");
    setTimeout(() => {
      setSubs((prev) =>
        prev.map((s) =>
          s.status === "Pending"
            ? { ...s, status: "Graded", autoGraded: true }
            : s,
        ),
      );
      toast.success("Auto-grading complete");
    }, 2000);
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Assessment Centre" subtitle="Question bank, quizzes, assignments and grading" />

      <Tabs defaultValue="evaluate">
        <TabsList>
          <TabsTrigger value="evaluate">Evaluate Submissions</TabsTrigger>
          <TabsTrigger value="bank">Question Bank</TabsTrigger>
          <TabsTrigger value="analytics">Performance Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="evaluate" className="space-y-4">
          <div className="flex justify-end">
            <Button variant="outline" onClick={handleAutoGrade}>
              <Wand2 className="h-4 w-4 mr-2" /> Auto-grade
            </Button>
          </div>
          <div className="grid lg:grid-cols-[1fr_360px] gap-4">
            <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Assignment</TableHead>
                    <TableHead>Submitted</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {subs.map((s) => (
                    <TableRow key={s.id}>
                      <TableCell className="font-medium">{s.student}</TableCell>
                      <TableCell>{s.assignment}</TableCell>
                      <TableCell className="text-muted-foreground">{s.submitted}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5">
                          <Badge
                            className={
                              s.status === "Graded"
                                ? "bg-success/15 text-success border-0"
                                : "bg-warning/20 text-warning-foreground border-0"
                            }
                          >
                            {s.autoGraded ? "Auto-graded" : s.status}
                          </Badge>
                          {s.autoGraded && (
                            <Badge className="bg-violet-500/10 text-violet-600 border-0 text-[9px] px-1.5">
                              <Sparkles className="h-2.5 w-2.5 mr-0.5" /> AI
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button size="sm" variant="outline">
                          {s.status === "Graded" ? "Review" : "Evaluate"}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="rounded-xl border bg-card p-5 shadow-sm space-y-4">
              <div>
                <div className="text-xs uppercase tracking-wider text-muted-foreground">
                  Now grading
                </div>
                <h3 className="font-semibold mt-1">Ananya Iyer · LRU Cache</h3>
              </div>
              <div className="rounded-lg border bg-muted/40 p-4 text-sm">
                <FileText className="h-4 w-4 inline mr-2 text-primary" />
                submission.zip · 14 KB
              </div>
              <div className="space-y-3">
                <div>
                  <Label className="text-xs">Score (out of 100)</Label>
                  <Input defaultValue="92" type="number" />
                </div>
                <div>
                  <Label className="text-xs">Feedback</Label>
                  <Textarea
                    rows={4}
                    defaultValue="Clean implementation. Consider thread-safety for production use."
                  />
                </div>
                <Button className="w-full">
                  <MessageSquarePlus className="h-4 w-4 mr-2" /> Submit grade & feedback
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="bank" className="space-y-4">
          <div className="flex justify-end">
            <Button>
              <Plus className="h-4 w-4 mr-2" /> Add question
            </Button>
          </div>
          <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Topic</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Difficulty</TableHead>
                  <TableHead>Question Count</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {QUESTION_BANK.map((q) => (
                  <TableRow key={q.id}>
                    <TableCell className="font-medium">{q.topic}</TableCell>
                    <TableCell>{q.type}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          q.difficulty === "Easy"
                            ? "border-success text-success"
                            : q.difficulty === "Medium"
                              ? "border-warning text-warning-foreground"
                              : "border-destructive text-destructive"
                        }
                      >
                        {q.difficulty}
                      </Badge>
                    </TableCell>
                    <TableCell>{q.count}</TableCell>
                    <TableCell className="text-right">
                      <Button size="sm" variant="ghost">
                        Build Quiz
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="analytics">
          <div className="rounded-xl border bg-card p-5 shadow-sm">
            <h3 className="font-semibold mb-4">Score distribution — Data Structures · Unit 2 Quiz</h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={PERF}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis dataKey="range" fontSize={12} stroke="var(--color-muted-foreground)" />
                  <YAxis fontSize={12} stroke="var(--color-muted-foreground)" />
                  <Tooltip
                    contentStyle={{
                      background: "var(--color-card)",
                      border: "1px solid var(--color-border)",
                      borderRadius: 8,
                      fontSize: 12,
                    }}
                  />
                  <Bar dataKey="students" fill="var(--color-primary)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
