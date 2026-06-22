import { createFileRoute, Link } from "@tanstack/react-router";
import { BookOpen, Users, ClipboardCheck, Video, ArrowRight } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { PageHeader, StatCard } from "@/components/RoleShell";
import { COURSES, SUBMISSIONS_TO_GRADE, LIVE_CLASSES } from "@/lib/mockData";

export const Route = createFileRoute("/teacher/dashboard")({
  head: () => ({ meta: [{ title: "Faculty Dashboard · KCG" }] }),
  component: TeacherDashboard,
});

const PERFORMANCE = [
  { week: "W1", avg: 72 },
  { week: "W2", avg: 75 },
  { week: "W3", avg: 78 },
  { week: "W4", avg: 74 },
  { week: "W5", avg: 81 },
  { week: "W6", avg: 84 },
];

function TeacherDashboard() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Good morning, Dr. Priya"
        subtitle="Faculty · Computer Science & Engineering"
        actions={
          <Button asChild>
            <Link to="/teacher/assessments">
              Evaluate submissions <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Courses Managed" value={3} icon={BookOpen} hint="This semester" />
        <StatCard label="Students Enrolled" value={246} icon={Users} tone="success" />
        <StatCard
          label="Pending Evaluations"
          value={SUBMISSIONS_TO_GRADE.filter((s) => s.status === "Pending").length}
          icon={ClipboardCheck}
          tone="warning"
          hint="Across 3 assignments"
        />
        <StatCard label="Upcoming Classes" value={4} icon={Video} tone="gold" hint="Next 7 days" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-xl border bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold">Class Performance Trend</h3>
              <p className="text-xs text-muted-foreground">Average quiz scores · weekly</p>
            </div>
            <Badge className="bg-success/15 text-success border-0">+12% MoM</Badge>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={PERFORMANCE}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="week" fontSize={12} stroke="var(--color-muted-foreground)" />
                <YAxis fontSize={12} stroke="var(--color-muted-foreground)" />
                <Tooltip
                  contentStyle={{
                    background: "var(--color-card)",
                    border: "1px solid var(--color-border)",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="avg"
                  stroke="var(--color-primary)"
                  strokeWidth={2.5}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-xl border bg-card p-5 shadow-sm">
            <h3 className="font-semibold mb-3">Pending evaluations</h3>
            <div className="space-y-2.5">
              {SUBMISSIONS_TO_GRADE.slice(0, 4).map((s) => (
                <div key={s.id} className="flex items-center gap-3 text-sm">
                  <div className="grid h-8 w-8 place-items-center rounded-full bg-primary/10 text-primary text-[11px] font-semibold">
                    {s.student
                      .split(" ")
                      .map((p) => p[0])
                      .join("")}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-medium truncate">{s.student}</div>
                    <div className="text-xs text-muted-foreground truncate">{s.assignment}</div>
                  </div>
                  <Badge
                    variant="outline"
                    className={
                      s.status === "Pending"
                        ? "border-warning text-warning-foreground bg-warning/20"
                        : "border-success text-success bg-success/10"
                    }
                  >
                    {s.status}
                  </Badge>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border bg-card p-5 shadow-sm">
            <h3 className="font-semibold mb-3">Today's Sessions</h3>
            <div className="space-y-2">
              {LIVE_CLASSES.slice(0, 2).map((l) => (
                <div key={l.id} className="rounded-md border p-3">
                  <div className="text-sm font-medium truncate">{l.title}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    {l.time} · {l.platform}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div>
        <h2 className="font-display text-xl font-semibold mb-3">My Courses</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {COURSES.slice(0, 3).map((c) => (
            <div key={c.id} className="rounded-xl border bg-card p-5 shadow-sm">
              <div className="text-xs text-muted-foreground">{c.code}</div>
              <div className="font-semibold mt-1">{c.title}</div>
              <div className="text-xs text-muted-foreground mt-1">{c.students} students</div>
              <div className="mt-3">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-muted-foreground">Syllabus coverage</span>
                  <span className="font-medium">{c.progress}%</span>
                </div>
                <Progress value={c.progress} className="h-1.5" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
