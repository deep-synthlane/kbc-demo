import { createFileRoute } from "@tanstack/react-router";
import { Download, ExternalLink, FileText, Library, TrendingUp } from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/RoleShell";
import { ENROLLMENT_BY_DEPT, FACULTY_RATINGS } from "@/lib/mockData";

export const Route = createFileRoute("/admin/reports")({
  head: () => ({ meta: [{ title: "Reports · KCG" }] }),
  component: Reports,
});

const PLACEMENT = [
  { year: "2021", placed: 78 },
  { year: "2022", placed: 82 },
  { year: "2023", placed: 86 },
  { year: "2024", placed: 89 },
  { year: "2025", placed: 92 },
];

const REPORTS = [
  { name: "NAAC Self-Study Report", updated: "12 Jun", size: "4.2 MB" },
  { name: "AICTE Annual Disclosure", updated: "08 Jun", size: "2.8 MB" },
  { name: "Placement Statistics 2025", updated: "02 Jun", size: "1.6 MB" },
  { name: "Audited Financial Statements", updated: "30 May", size: "3.1 MB" },
  { name: "Research & Publications", updated: "28 May", size: "5.4 MB" },
];

function Reports() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Reports & Insights"
        subtitle="Institutional reports and compliance documents"
        actions={
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" /> Export Snapshot
          </Button>
        }
      />

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="rounded-xl border bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" /> Placement Trend
            </h3>
            <Badge className="bg-success/15 text-success border-0">+14% vs 2021</Badge>
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={PLACEMENT}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="year" fontSize={12} stroke="var(--color-muted-foreground)" />
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
                  dataKey="placed"
                  stroke="var(--color-chart-5)"
                  strokeWidth={2.5}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-xl border bg-card p-5 shadow-sm">
          <h3 className="font-semibold mb-4">Department Enrolment</h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ENROLLMENT_BY_DEPT} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis type="number" fontSize={12} stroke="var(--color-muted-foreground)" />
                <YAxis type="category" dataKey="dept" fontSize={12} width={50} stroke="var(--color-muted-foreground)" />
                <Tooltip
                  contentStyle={{
                    background: "var(--color-card)",
                    border: "1px solid var(--color-border)",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
                <Bar dataKey="students" fill="var(--color-primary)" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="rounded-xl border bg-card p-5 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-primary shrink-0">
              <Library className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold">Library Usage & Analytics</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                eLibrary circulation, usage trends, and resource analytics in Knimbus.
              </p>
            </div>
          </div>
          <Button variant="outline" asChild>
            <a
              href="https://nitpy.knimbus.com/librarian/v2/elibrarySetup/reports/overview"
              target="_blank"
              rel="noopener noreferrer"
            >
              <ExternalLink className="h-4 w-4 mr-2" /> Open Analytics
            </a>
          </Button>
        </div>
      </div>

      <div className="rounded-xl border bg-card p-5 shadow-sm">
        <h3 className="font-semibold mb-4">Faculty Rating Snapshot</h3>
        <div className="space-y-2.5">
          {FACULTY_RATINGS.map((f) => (
            <div key={f.faculty} className="flex items-center gap-4">
              <div className="text-sm font-medium w-40">{f.faculty}</div>
              <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full bg-gold"
                  style={{ width: `${(f.rating / 5) * 100}%` }}
                />
              </div>
              <div className="text-sm font-semibold w-12 text-right">{f.rating}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
        <div className="p-5 border-b">
          <h3 className="font-semibold">Compliance & Reports Library</h3>
        </div>
        <div className="divide-y">
          {REPORTS.map((r) => (
            <div key={r.name} className="flex items-center gap-4 p-4 hover:bg-muted/40 transition">
              <div className="grid h-10 w-10 place-items-center rounded-md bg-primary/10 text-primary shrink-0">
                <FileText className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-medium text-sm">{r.name}</div>
                <div className="text-xs text-muted-foreground">
                  Updated {r.updated} · {r.size}
                </div>
              </div>
              <Button size="sm" variant="outline">
                <Download className="h-3.5 w-3.5 mr-1.5" /> Download
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
