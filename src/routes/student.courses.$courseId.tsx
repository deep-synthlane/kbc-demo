import { createFileRoute, Link, useParams, useNavigate } from "@tanstack/react-router";
import {
  PlayCircle,
  FileText,
  HelpCircle,
  CheckCircle2,
  Lock,
  ChevronLeft,
  Award,
  Users,
  Clock,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";
import {
  RadialBarChart,
  RadialBar,
  ResponsiveContainer,
  PolarAngleAxis,
} from "recharts";
import { COURSES, UNITS } from "@/lib/mockData";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/student/courses/$courseId")({
  head: () => ({ meta: [{ title: "Course · KCG" }] }),
  component: CourseDetail,
});

function CourseDetail() {
  const { courseId } = useParams({ from: "/student/courses/$courseId" });
  const navigate = useNavigate();
  const course = COURSES.find((c) => c.id === courseId) ?? COURSES[0];
  const [open, setOpen] = useState<"video" | "pdf" | null>(null);

  return (
    <div className="space-y-6">
      <Link
        to="/student/courses"
        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
      >
        <ChevronLeft className="h-4 w-4 mr-1" /> All courses
      </Link>

      {/* Hero */}
      <div className={`rounded-2xl bg-gradient-to-br ${course.color} p-8 text-white relative overflow-hidden`}>
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative grid lg:grid-cols-[1fr_auto] gap-6 items-end">
          <div>
            <div className="text-xs uppercase tracking-wider opacity-80">{course.code}</div>
            <h1 className="font-display text-3xl md:text-4xl font-semibold mt-1">{course.title}</h1>
            <p className="mt-2 opacity-90">{course.faculty} · {course.department}</p>
            <div className="mt-5 flex flex-wrap gap-3 text-sm">
              <Stat icon={Award} label={`${course.credits} credits`} />
              <Stat icon={Users} label={`${course.students} students`} />
              <Stat icon={Clock} label={`${course.units} units`} />
            </div>
          </div>
          <div className="w-48">
            <div className="text-xs uppercase tracking-wider opacity-80 mb-2">Your progress</div>
            <Progress value={course.progress} className="h-2 bg-white/30" />
            <div className="text-2xl font-display font-semibold mt-2">{course.progress}%</div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-[1fr_320px] gap-6">
        {/* Units accordion */}
        <div className="space-y-4">
          <h2 className="font-display text-xl font-semibold">Course Content</h2>
          <Accordion type="multiple" defaultValue={["u1", "u2"]} className="space-y-3">
            {UNITS.map((u) => (
              <AccordionItem
                key={u.id}
                value={u.id}
                className={cn(
                  "rounded-xl border bg-card overflow-hidden",
                  u.status === "locked" && "opacity-60",
                )}
              >
                <AccordionTrigger className="px-5 py-4 hover:no-underline">
                  <div className="flex items-center gap-3 flex-1 text-left">
                    {u.status === "completed" ? (
                      <CheckCircle2 className="h-5 w-5 text-success" />
                    ) : u.status === "locked" ? (
                      <Lock className="h-5 w-5 text-muted-foreground" />
                    ) : (
                      <PlayCircle className="h-5 w-5 text-primary" />
                    )}
                    <div className="font-medium">{u.title}</div>
                    <Badge
                      variant="outline"
                      className="ml-auto mr-2 text-[10px] capitalize"
                    >
                      {u.status.replace("-", " ")}
                    </Badge>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-5 pb-4">
                  <div className="space-y-1.5">
                    {u.lessons.map((l) => {
                      const Icon =
                        l.type === "video"
                          ? PlayCircle
                          : l.type === "pdf"
                            ? FileText
                            : HelpCircle;
                      return (
                        <button
                          key={l.id}
                          onClick={() => {
                            if (l.type === "quiz") {
                              navigate({ to: "/student/quiz/$quizId", params: { quizId: l.id } });
                            } else {
                              setOpen(l.type === "video" ? "video" : "pdf");
                            }
                          }}
                          className="w-full flex items-center gap-3 rounded-md px-3 py-2.5 hover:bg-muted transition text-left"
                        >
                          <Icon
                            className={cn(
                              "h-4 w-4 shrink-0",
                              l.done ? "text-success" : "text-muted-foreground",
                            )}
                          />
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium truncate">{l.title}</div>
                            <div className="text-xs text-muted-foreground capitalize">
                              {l.type} · {l.duration}
                            </div>
                          </div>
                          {l.done && (
                            <Badge variant="secondary" className="text-[10px] bg-success/15 text-success">
                              Completed
                            </Badge>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {/* Stats sidebar */}
        <div className="space-y-4">
          <div className="rounded-xl border bg-card p-5 shadow-sm">
            <h3 className="font-semibold mb-3">Performance</h3>
            <div className="h-44">
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart
                  innerRadius="60%"
                  outerRadius="100%"
                  data={[{ name: "Score", value: course.progress, fill: "var(--color-primary)" }]}
                  startAngle={90}
                  endAngle={-270}
                >
                  <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
                  <RadialBar background dataKey="value" cornerRadius={10} />
                </RadialBarChart>
              </ResponsiveContainer>
            </div>
            <div className="text-center text-sm text-muted-foreground -mt-4">
              {course.progress}% complete
            </div>
          </div>

          <div className="rounded-xl border bg-card p-5 shadow-sm space-y-3">
            <h3 className="font-semibold">Quick Actions</h3>
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link to="/student/quiz/$quizId" params={{ quizId: "q2" }}>
                <HelpCircle className="h-4 w-4 mr-2" /> Attempt next quiz
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-start" onClick={() => setOpen("pdf")}>
              <FileText className="h-4 w-4 mr-2" /> Open reference notes
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link to="/student/live-classes">Join live class</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Lesson preview dialogs */}
      <Dialog open={open === "video"} onOpenChange={(v) => !v && setOpen(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Lesson · Singly Linked Lists</DialogTitle>
          </DialogHeader>
          <div className="aspect-video bg-black rounded-lg grid place-items-center text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/40 to-black/80" />
            <div className="relative text-center">
              <PlayCircle className="h-16 w-16 mx-auto mb-2 opacity-80" />
              <div className="text-sm opacity-70">Demo video player</div>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <div className="text-sm text-muted-foreground">Duration: 18 min</div>
            <Button>Mark as complete</Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={open === "pdf"} onOpenChange={(v) => !v && setOpen(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Reference Notes (PDF)</DialogTitle>
          </DialogHeader>
          <div className="aspect-[3/4] max-h-[60vh] bg-muted rounded-lg p-8 overflow-auto">
            <div className="max-w-prose mx-auto space-y-3 text-sm">
              <h3 className="font-display text-lg font-semibold">Chapter 3 — Linked Lists</h3>
              <p>A linked list is a linear data structure where each element is a separate object…</p>
              <p>Each node contains a value and a pointer to the next node. Variants include singly, doubly, and circular linked lists.</p>
              <h4 className="font-semibold pt-2">Operations</h4>
              <ul className="list-disc ml-5 space-y-1">
                <li>Insertion at head — O(1)</li>
                <li>Insertion at tail — O(n) without tail pointer</li>
                <li>Deletion — O(n) for search + O(1) removal</li>
              </ul>
            </div>
          </div>
        </DialogContent>
      </Dialog>

    </div>
  );
}

function Stat({ icon: Icon, label }: { icon: typeof Award; label: string }) {
  return (
    <div className="flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 backdrop-blur-sm">
      <Icon className="h-3.5 w-3.5" />
      <span>{label}</span>
    </div>
  );
}
