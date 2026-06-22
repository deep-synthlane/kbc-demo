import { createFileRoute } from "@tanstack/react-router";
import { Mail, GraduationCap, BookOpen, TrendingUp, Award, User } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
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
import { PageHeader, StatCard } from "@/components/RoleShell";
import { STUDENT_PROFILE, TRANSCRIPT, GRADE_DISTRIBUTION } from "@/lib/mockData";

export const Route = createFileRoute("/student/profile")({
  head: () => ({ meta: [{ title: "Profile · KCG University" }] }),
  component: ProfilePage,
});

function ProfilePage() {
  const p = STUDENT_PROFILE;
  return (
    <div className="space-y-6">
      <PageHeader title="Student Profile" subtitle="Personal details, academic history & transcript" />

      {/* Identity card */}
      <div className="rounded-xl border bg-card p-6 shadow-sm flex flex-col md:flex-row gap-6 items-start">
        <Avatar className="h-24 w-24">
          <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-display">
            AI
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="font-display text-2xl font-semibold">{p.name}</h2>
            <Badge className="bg-gold/30 text-foreground border-0">Honours Stream</Badge>
          </div>
          <div className="text-sm text-muted-foreground mt-1 flex items-center gap-2">
            <Mail className="h-3.5 w-3.5" /> {p.email}
          </div>
          <dl className="mt-5 grid sm:grid-cols-2 gap-x-8 gap-y-3 text-sm">
            <Info label="Enrolment Number" value={p.enrollment} />
            <Info label="Department" value={p.department} />
            <Info label="Semester" value={p.semester} />
            <Info label="Batch" value={p.batch} />
            <Info label="Mentor" value={p.mentor} />
            <Info label="Status" value="Active · Good Standing" />
          </dl>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="CGPA" value={p.cgpa} icon={Award} tone="gold" hint="Top 15% of batch" />
        <StatCard label="Attendance" value={`${p.attendance}%`} icon={TrendingUp} tone="success" />
        <StatCard label="Credits" value={`${p.credits}/${p.totalCredits}`} icon={BookOpen} />
        <StatCard label="Current Sem" value="6" icon={GraduationCap} hint="of 8" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
          <div className="p-5 border-b">
            <h3 className="font-semibold flex items-center gap-2">
              <User className="h-4 w-4 text-primary" /> Academic Transcript
            </h3>
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
              {TRANSCRIPT.map((t) => (
                <TableRow key={t.sem}>
                  <TableCell className="font-medium">{t.sem}</TableCell>
                  <TableCell className="font-semibold">{t.gpa}</TableCell>
                  <TableCell>{t.credits}</TableCell>
                  <TableCell>
                    <Badge
                      className={
                        t.status === "Completed"
                          ? "bg-success/15 text-success border-0"
                          : "bg-primary/10 text-primary border-0"
                      }
                    >
                      {t.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="rounded-xl border bg-card p-5 shadow-sm">
          <h3 className="font-semibold mb-4">Grade Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={GRADE_DISTRIBUTION}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="grade" stroke="var(--color-muted-foreground)" fontSize={12} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    background: "var(--color-card)",
                    border: "1px solid var(--color-border)",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
                <Bar dataKey="count" fill="var(--color-gold)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-wider text-muted-foreground">{label}</dt>
      <dd className="font-medium text-foreground mt-0.5">{value}</dd>
    </div>
  );
}
