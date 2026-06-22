import { createFileRoute, Link } from "@tanstack/react-router";
import {
  BookOpen,
  TrendingUp,
  Award,
  ClipboardList,
  Calendar,
  Bell,
  Video,
  ArrowRight,
} from "lucide-react";
import {
  Line,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import { PageHeader, StatCard } from "@/components/RoleShell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  COURSES,
  ATTENDANCE_TREND,
  UPCOMING_EXAMS,
  ASSIGNMENTS,
  NOTIFICATIONS,
  LIVE_CLASSES,
  STUDENT_PROFILE,
} from "@/lib/mockData";

export const Route = createFileRoute("/student/dashboard")({
  head: () => ({
    meta: [{ title: "Student Dashboard · KCG University" }],
  }),
  component: StudentDashboard,
});

function StudentDashboard() {
  return (
    <div className="space-y-6">
      <PageHeader
        title={`Welcome back, ${STUDENT_PROFILE.name.split(" ")[0]}`}
        subtitle={`${STUDENT_PROFILE.department} · ${STUDENT_PROFILE.semester} · Enrolment ${STUDENT_PROFILE.enrollment}`}
        actions={
          <Button asChild>
            <Link to="/student/courses">
              Continue learning <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Enrolled Courses" value={COURSES.length} icon={BookOpen} hint="Semester 6" />
        <StatCard
          label="Attendance"
          value={`${STUDENT_PROFILE.attendance}%`}
          icon={TrendingUp}
          tone="success"
          hint="Above 85% requirement"
        />
        <StatCard
          label="Credits Earned"
          value={`${STUDENT_PROFILE.credits}/${STUDENT_PROFILE.totalCredits}`}
          icon={Award}
          tone="gold"
          hint={`CGPA ${STUDENT_PROFILE.cgpa}`}
        />
        <StatCard
          label="Assignments Due"
          value={ASSIGNMENTS.filter((a) => a.status !== "Submitted").length}
          icon={ClipboardList}
          tone="warning"
          hint="Next 7 days"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Course cards */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl font-semibold">My Courses</h2>
            <Link to="/student/courses" className="text-sm text-primary hover:underline">
              View all
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {COURSES.map((c) => (
              <Link
                key={c.id}
                to="/student/courses/$courseId"
                params={{ courseId: c.id }}
                className="group rounded-xl border bg-card overflow-hidden shadow-sm hover:shadow-md transition"
              >
                <div className={`h-20 bg-gradient-to-br ${c.color} relative`}>
                  <div className="absolute inset-0 bg-black/10" />
                  <div className="absolute bottom-2 left-4 text-white">
                    <div className="text-[11px] uppercase tracking-wider opacity-80">{c.code}</div>
                  </div>
                </div>
                <div className="p-4 space-y-3">
                  <div>
                    <div className="font-semibold leading-tight group-hover:text-primary transition">
                      {c.title}
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5">{c.faculty}</div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium">{c.progress}%</span>
                    </div>
                    <Progress value={c.progress} className="h-1.5" />
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Attendance chart */}
          <div className="rounded-xl border bg-card p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold">Attendance Trend</h3>
                <p className="text-xs text-muted-foreground">Last 6 months</p>
              </div>
              <Badge variant="secondary" className="bg-success/15 text-success border-0">
                Healthy
              </Badge>
            </div>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={ATTENDANCE_TREND}>
                  <defs>
                    <linearGradient id="att" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis dataKey="month" stroke="var(--color-muted-foreground)" fontSize={12} />
                  <YAxis stroke="var(--color-muted-foreground)" fontSize={12} domain={[60, 100]} />
                  <Tooltip
                    contentStyle={{
                      background: "var(--color-card)",
                      border: "1px solid var(--color-border)",
                      borderRadius: 8,
                      fontSize: 12,
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="attendance"
                    stroke="var(--color-primary)"
                    strokeWidth={2}
                    fill="url(#att)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Side column */}
        <div className="space-y-6">
          <div className="rounded-xl border bg-card p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary" /> Upcoming Exams
              </h3>
              <Link to="/student/timetable" className="text-xs text-primary hover:underline">
                Schedule
              </Link>
            </div>
            <div className="space-y-3">
              {UPCOMING_EXAMS.slice(0, 4).map((e) => (
                <div key={e.id} className="flex items-start gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-md bg-primary/10 text-primary text-xs font-semibold shrink-0">
                    {e.date.split(" ")[0]}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium truncate">{e.course}</div>
                    <div className="text-xs text-muted-foreground">
                      {e.time} · {e.room}
                    </div>
                  </div>
                  <Badge variant="outline" className="text-[10px]">
                    {e.type}
                  </Badge>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border bg-card p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold flex items-center gap-2">
                <Video className="h-4 w-4 text-primary" /> Live Now & Next
              </h3>
            </div>
            <div className="space-y-3">
              {LIVE_CLASSES.slice(0, 2).map((l) => (
                <div key={l.id} className="rounded-md border p-3">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium truncate">{l.title}</div>
                    {l.status === "live" && (
                      <Badge className="bg-destructive text-destructive-foreground text-[10px] animate-pulse">
                        LIVE
                      </Badge>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {l.date} · {l.time}
                  </div>
                  <Button size="sm" className="mt-2 w-full" variant="outline">
                    Join {l.platform}
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border bg-card p-5 shadow-sm">
            <h3 className="font-semibold flex items-center gap-2 mb-4">
              <Bell className="h-4 w-4 text-primary" /> Notifications
            </h3>
            <div className="space-y-3">
              {NOTIFICATIONS.map((n) => (
                <div key={n.id} className="flex items-start gap-2">
                  <div className="h-2 w-2 rounded-full bg-primary mt-1.5 shrink-0" />
                  <div className="min-w-0">
                    <div className="text-sm">{n.title}</div>
                    <div className="text-xs text-muted-foreground">{n.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
