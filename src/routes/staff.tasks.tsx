import { createFileRoute } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/RoleShell";
import { STAFF_TASKS } from "@/lib/mockData";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/staff/tasks")({
  head: () => ({ meta: [{ title: "Staff Tasks · KCG University" }] }),
  component: StaffTasks,
});

const COLS = ["Today", "In Progress", "Done"] as const;

function StaffTasks() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Operational Tasks"
        subtitle="Kanban board of administrative & operational tasks"
        actions={
          <Button>
            <Plus className="h-4 w-4 mr-2" /> New Task
          </Button>
        }
      />

      <div className="grid gap-4 lg:grid-cols-3">
        {COLS.map((col) => {
          const items = STAFF_TASKS.filter((t) => t.column === col);
          return (
            <div key={col} className="rounded-xl border bg-muted/30 p-3">
              <div className="flex items-center justify-between px-2 pb-2">
                <h3 className="font-semibold text-sm">{col}</h3>
                <Badge variant="secondary" className="text-[10px]">
                  {items.length}
                </Badge>
              </div>
              <div className="space-y-2">
                {items.map((t) => (
                  <div key={t.id} className="rounded-lg bg-card border p-3 shadow-sm">
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-[10px]",
                        t.priority === "High" && "border-destructive text-destructive",
                        t.priority === "Medium" && "border-warning text-warning-foreground",
                        t.priority === "Low" && "border-muted-foreground text-muted-foreground",
                      )}
                    >
                      {t.priority}
                    </Badge>
                    <div className="text-sm font-medium mt-2">{t.title}</div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
