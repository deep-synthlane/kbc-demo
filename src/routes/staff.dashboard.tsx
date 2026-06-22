import { createFileRoute, Link } from "@tanstack/react-router";
import { ClipboardList, Megaphone, FileSearch, BookOpen, Home, CreditCard } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { PageHeader, StatCard } from "@/components/RoleShell";
import { STAFF_TASKS } from "@/lib/mockData";

export const Route = createFileRoute("/staff/dashboard")({
  head: () => ({ meta: [{ title: "Staff Dashboard · KCG University" }] }),
  component: StaffDashboard,
});

const QUICK = [
  { label: "Document Verification", icon: FileSearch, to: "/staff/records" },
  { label: "Library Desk", icon: BookOpen, to: "/staff/records" },
  { label: "Hostel Allotment", icon: Home, to: "/staff/tasks" },
  { label: "Fee Collection", icon: CreditCard, to: "/staff/tasks" },
];

function StaffDashboard() {
  return (
    <div className="space-y-6">
      <PageHeader title="Staff Workspace" subtitle="Operational tasks and announcements for today" />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Pending Tasks"
          value={STAFF_TASKS.filter((t) => t.column !== "Done").length}
          icon={ClipboardList}
          tone="warning"
        />
        <StatCard
          label="Active Announcements"
          value={3}
          icon={Megaphone}
          tone="primary"
        />
        <StatCard label="Records Verified" value={142} icon={FileSearch} tone="success" hint="This week" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="rounded-xl border bg-card p-5 shadow-sm">
          <h3 className="font-semibold mb-3">Quick links</h3>
          <div className="grid grid-cols-2 gap-3">
            {QUICK.map((q) => {
              const Icon = q.icon;
              return (
                <Link
                  key={q.label}
                  to={q.to}
                  className="rounded-lg border p-4 hover:border-primary hover:bg-primary/5 transition flex items-center gap-3"
                >
                  <div className="grid h-10 w-10 place-items-center rounded-md bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="text-sm font-medium">{q.label}</div>
                </Link>
              );
            })}
          </div>
        </div>

        <div className="rounded-xl border bg-card p-5 shadow-sm">
          <h3 className="font-semibold mb-3">Today's tasks</h3>
          <div className="space-y-2.5">
            {STAFF_TASKS.filter((t) => t.column === "Today").map((t) => (
              <div key={t.id} className="flex items-center gap-3 rounded-md border p-3">
                <Badge
                  variant="outline"
                  className={
                    t.priority === "High"
                      ? "border-destructive text-destructive"
                      : t.priority === "Medium"
                        ? "border-warning text-warning-foreground"
                        : "border-muted-foreground text-muted-foreground"
                  }
                >
                  {t.priority}
                </Badge>
                <div className="text-sm font-medium flex-1">{t.title}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
