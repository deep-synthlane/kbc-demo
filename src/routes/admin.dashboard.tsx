import { createFileRoute } from "@tanstack/react-router";
import { Users, GraduationCap, BookOpen, FileSpreadsheet } from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { PageHeader, StatCard } from "@/components/RoleShell";
import {
  ADMIN_KPIS,
  ATTENDANCE_TREND,
  ENROLLMENT_BY_DEPT,
  FEE_COLLECTION,
} from "@/lib/mockData";

export const Route = createFileRoute("/admin/dashboard")({
  head: () => ({ meta: [{ title: "Administrator Dashboard · KCG University" }] }),
  component: AdminDashboard,
});

const FEE_COLORS = ["var(--color-chart-5)", "var(--color-chart-3)", "var(--color-chart-4)"];

function AdminDashboard() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Institutional Overview"
        subtitle="Live snapshot of academic operations across campuses"
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Students"
          value={ADMIN_KPIS.students.toLocaleString()}
          icon={Users}
          hint="+184 this semester"
          tone="primary"
        />
        <StatCard
          label="Total Faculty"
          value={ADMIN_KPIS.teachers}
          icon={GraduationCap}
          tone="gold"
          hint="42 visiting"
        />
        <StatCard
          label="Active Courses"
          value={ADMIN_KPIS.courses}
          icon={BookOpen}
          tone="success"
        />
        <StatCard
          label="Exams Scheduled"
          value={ADMIN_KPIS.exams}
          icon={FileSpreadsheet}
          tone="warning"
          hint="Next 30 days"
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-xl border bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold">Campus-wide Attendance Trend</h3>
              <p className="text-xs text-muted-foreground">Rolling 6-month average</p>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={ATTENDANCE_TREND}>
                <defs>
                  <linearGradient id="att2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.45} />
                    <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="month" fontSize={12} stroke="var(--color-muted-foreground)" />
                <YAxis fontSize={12} stroke="var(--color-muted-foreground)" domain={[70, 100]} />
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
                  strokeWidth={2.5}
                  fill="url(#att2)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-xl border bg-card p-5 shadow-sm">
          <h3 className="font-semibold mb-4">Fee Collection</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={FEE_COLLECTION}
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {FEE_COLLECTION.map((_, i) => (
                    <Cell key={i} fill={FEE_COLORS[i]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: "var(--color-card)",
                    border: "1px solid var(--color-border)",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-1.5">
            {FEE_COLLECTION.map((f, i) => (
              <div key={f.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span
                    className="h-2.5 w-2.5 rounded-sm"
                    style={{ background: FEE_COLORS[i] }}
                  />
                  <span>{f.name}</span>
                </div>
                <span className="font-medium">{f.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-xl border bg-card p-5 shadow-sm">
        <h3 className="font-semibold mb-4">Enrollment by Department</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={ENROLLMENT_BY_DEPT}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="dept" fontSize={12} stroke="var(--color-muted-foreground)" />
              <YAxis fontSize={12} stroke="var(--color-muted-foreground)" />
              <Tooltip
                contentStyle={{
                  background: "var(--color-card)",
                  border: "1px solid var(--color-border)",
                  borderRadius: 8,
                  fontSize: 12,
                }}
              />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="students" fill="var(--color-primary)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
