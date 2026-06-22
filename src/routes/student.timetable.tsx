import { createFileRoute } from "@tanstack/react-router";
import { CalendarDays } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/RoleShell";
import { TIMETABLE, UPCOMING_EXAMS } from "@/lib/mockData";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/student/timetable")({
  head: () => ({ meta: [{ title: "Timetable · KCG University" }] }),
  component: TimetablePage,
});

function TimetablePage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Weekly Timetable"
        subtitle="Classroom, faculty and lab schedule for the current week"
      />

      <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[760px]">
            <thead>
              <tr className="bg-muted/50 text-xs uppercase tracking-wider text-muted-foreground">
                <th className="p-3 text-left font-medium">Day</th>
                {TIMETABLE.periods.map((p) => (
                  <th key={p} className="p-3 text-left font-medium">
                    {p}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {TIMETABLE.days.map((d, di) => (
                <tr key={d} className="border-t">
                  <td className="p-3 font-semibold">{d}</td>
                  {TIMETABLE.grid[di].map((cell, ci) => (
                    <td key={ci} className="p-2 align-top">
                      <Cell value={cell} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="rounded-xl border bg-card p-5 shadow-sm">
        <h3 className="font-semibold flex items-center gap-2 mb-4">
          <CalendarDays className="h-4 w-4 text-primary" /> Upcoming Exams
        </h3>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {UPCOMING_EXAMS.map((e) => (
            <div key={e.id} className="rounded-lg border p-4">
              <div className="text-xs text-muted-foreground">{e.type}</div>
              <div className="font-semibold mt-1">{e.course}</div>
              <div className="text-sm text-muted-foreground mt-2">
                {e.date} · {e.time}
              </div>
              <div className="text-xs text-primary mt-1">{e.room}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Cell({ value }: { value: string }) {
  if (value === "—") return <span className="text-muted-foreground/40">—</span>;
  if (value === "Lunch") return <Badge className="bg-warning/20 text-warning-foreground border-0">Lunch</Badge>;
  const isLab = value.includes("Lab");
  return (
    <div
      className={cn(
        "rounded-md px-2 py-2 text-xs leading-tight",
        isLab
          ? "bg-violet-500/10 text-violet-700 border border-violet-500/20"
          : "bg-primary/5 text-primary border border-primary/10",
      )}
    >
      {value}
    </div>
  );
}
