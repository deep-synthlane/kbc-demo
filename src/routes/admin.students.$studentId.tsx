import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import {
  ArrowLeft, Mail, Phone, GraduationCap, BookOpen,
  TrendingUp, Award, User, CheckCircle2, Clock, Download,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { PageHeader, StatCard } from "@/components/RoleShell";
import { STUDENTS_DIRECTORY, STUDENT_DETAIL } from "@/lib/mockData";

export const Route = createFileRoute("/admin/students/$studentId")({
  head: () => ({ meta: [{ title: "Student Detail · KCG Admin" }] }),
  loader: ({ params }) => {
    const s = STUDENTS_DIRECTORY.find((x) => x.slug === params.studentId);
    if (!s) throw notFound();
    return { student: s, detail: STUDENT_DETAIL[params.studentId] };
  },
  component: StudentDetail,
});

function StudentDetail() {
  const { student: s, detail: d } = Route.useLoaderData();
  const initials = s.name.split(" ").map((n) => n[0]).join("");

  const statusColor = s.attendance >= 85
    ? "bg-success/15 text-success border-0"
    : s.attendance >= 75
      ? "bg-warning/20 text-warning-foreground border-0"
      : "bg-destructive/10 text-destructive border-0";

  return (
    <div className="space-y-6">
      <PageHeader
        title={s.name}
        subtitle={`${s.id} · ${s.dept} · Semester ${s.sem}`}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link to="/admin/students">
                <ArrowLeft className="h-4 w-4 mr-2" /> Back to Directory
              </Link>
            </Button>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" /> Export Report
            </Button>
          </div>
        }
      />

      {/* Identity card */}
      <div className="rounded-xl border bg-card p-6 shadow-sm flex flex-col md:flex-row gap-6 items-start">
        <Avatar className="h-20 w-20 shrink-0">
          <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-display">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="font-display text-2xl font-semibold">{s.name}</h2>
            <Badge className={statusColor}>{d.status}</Badge>
          </div>
          <div className="flex flex-wrap gap-4 mt-2 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5"><Mail className="h-3.5 w-3.5" />{d.email}</span>
            <span className="flex items-center gap-1.5"><Phone className="h-3.5 w-3.5" />{d.phone}</span>
          </div>
          <dl className="mt-5 grid sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-3 text-sm">
            <Info label="Enrolment ID" value={s.id} mono />
            <Info label="Department" value={s.dept} />
            <Info label="Semester" value={`Semester ${s.sem}`} />
            <Info label="Batch" value={d.batch} />
            <Info label="Mentor" value={d.mentor} />
            <Info label="Credits Earned" value={`${d.credits} / ${d.totalCredits}`} />
          </dl>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="CGPA" value={s.cgpa.toString()} icon={Award} tone="gold" />
        <StatCard label="Attendance" value={`${s.attendance}%`} icon={TrendingUp} tone={s.attendance >= 85 ? "success" : "default"} />
        <StatCard label="Credits" value={`${d.credits}/${d.totalCredits}`} icon={BookOpen} />
        <StatCard label="Current Sem" value={`Sem ${s.sem}`} icon={GraduationCap} hint={`of ${d.totalCredits / 20} semesters`} />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Transcript */}
        <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
          <div className="p-5 border-b flex items-center gap-2">
            <User className="h-4 w-4 text-primary" />
            <h3 className="font-semibold">Academic Transcript</h3>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Semester</TableHead>
                <TableHead>GPA</TableHead>
                <TableHead>Credits</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {d.transcript.map((t) => (
                <TableRow key={t.sem}>
                  <TableCell className="font-medium text-sm">{t.sem}</TableCell>
                  <TableCell className="font-semibold">{t.gpa > 0 ? t.gpa : "—"}</TableCell>
                  <TableCell>{t.credits > 0 ? t.credits : "—"}</TableCell>
                  <TableCell>
                    <Badge className={t.status === "Completed"
                      ? "bg-success/15 text-success border-0"
                      : "bg-primary/10 text-primary border-0"}>
                      {t.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Grade distribution */}
        <div className="rounded-xl border bg-card p-5 shadow-sm">
          <h3 className="font-semibold mb-4">Grade Distribution</h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={d.gradeDistribution}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="grade" stroke="var(--color-muted-foreground)" fontSize={12} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={12} />
                <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 8, fontSize: 12 }} />
                <Bar dataKey="count" fill="var(--color-primary)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Current courses */}
      <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
        <div className="p-5 border-b">
          <h3 className="font-semibold flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-primary" /> Enrolled Courses (Current Semester)
          </h3>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Code</TableHead>
              <TableHead>Course Title</TableHead>
              <TableHead>Faculty</TableHead>
              <TableHead>Grade (Last Sem)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {d.courses.map((c) => (
              <TableRow key={c.code}>
                <TableCell className="font-mono text-xs">{c.code}</TableCell>
                <TableCell className="font-medium">{c.title}</TableCell>
                <TableCell className="text-muted-foreground text-sm">{c.faculty}</TableCell>
                <TableCell>
                  <Badge className={c.grade === "A+" ? "bg-success/15 text-success border-0"
                    : c.grade.startsWith("A") ? "bg-primary/10 text-primary border-0"
                      : "bg-muted text-muted-foreground border-0"}>
                    {c.grade}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Enrollment timeline */}
      <div className="rounded-xl border bg-card p-6 shadow-sm">
        <h3 className="font-semibold flex items-center gap-2 mb-4">
          <Clock className="h-4 w-4 text-primary" /> Enrollment History
        </h3>
        <div className="relative ml-4">
          <div className="absolute left-3 top-2 bottom-2 w-0.5 bg-border" />
          <div className="space-y-4">
            {d.timeline.map((e) => (
              <div key={e.semester} className="relative flex items-start gap-4 pl-8">
                <div className="absolute left-0 top-1">
                  {e.status === "Completed" ? (
                    <div className="grid h-6 w-6 place-items-center rounded-full bg-success text-white">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                    </div>
                  ) : (
                    <div className="grid h-6 w-6 place-items-center rounded-full bg-primary text-primary-foreground">
                      <BookOpen className="h-3.5 w-3.5" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">{e.semester}</span>
                    <Badge className={e.status === "Completed"
                      ? "bg-success/15 text-success border-0 text-[10px]"
                      : "bg-primary/10 text-primary border-0 text-[10px]"}>
                      {e.status}
                    </Badge>
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    {e.year} · {e.courses} courses · {e.credits > 0 ? `${e.credits} credits` : "In progress"}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Info({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-wider text-muted-foreground">{label}</dt>
      <dd className={`font-medium text-foreground mt-0.5 ${mono ? "font-mono text-sm" : ""}`}>{value}</dd>
    </div>
  );
}
