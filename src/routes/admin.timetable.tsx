import { createFileRoute } from "@tanstack/react-router";
import { AlertTriangle, Plus, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/RoleShell";
import { TIMETABLE } from "@/lib/mockData";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/timetable")({
  head: () => ({ meta: [{ title: "Timetable Builder · KCG" }] }),
  component: AdminTimetable,
});

function AdminTimetable() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Timetable Builder"
        subtitle="Assign faculty, rooms and labs; detect scheduling conflicts in real-time"
        actions={
          <div className="flex gap-2">
            <Button variant="outline">
              <Wand2 className="h-4 w-4 mr-2" /> Auto-resolve
            </Button>
            <Button>
              <Plus className="h-4 w-4 mr-2" /> New Slot
            </Button>
          </div>
        }
      />

      {/* Conflict banner */}
      <div className="rounded-xl border border-warning/40 bg-warning/15 p-4 flex items-start gap-3">
        <AlertTriangle className="h-5 w-5 text-warning-foreground shrink-0 mt-0.5" />
        <div className="flex-1">
          <div className="font-semibold text-sm">1 scheduling conflict detected</div>
          <div className="text-xs text-muted-foreground mt-0.5">
            Dr. Karthik Venkatesan is double-booked on <b>Thursday 11:00</b> for both OS and AI lab. Reassign required.
          </div>
        </div>
        <Button size="sm" variant="outline">
          Resolve
        </Button>
      </div>

      <div className="grid lg:grid-cols-[1fr_280px] gap-6">
        <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs min-w-[760px]">
              <thead>
                <tr className="bg-muted/50 uppercase tracking-wider text-muted-foreground">
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
                    <td className="p-3 font-semibold text-sm">{d}</td>
                    {TIMETABLE.grid[di].map((cell, ci) => {
                      const conflict = di === 3 && ci === 2;
                      return (
                        <td key={ci} className="p-2 align-top">
                          <div
                            className={cn(
                              "rounded-md px-2 py-1.5 cursor-pointer hover:ring-2 hover:ring-primary/40 transition",
                              cell === "—"
                                ? "bg-muted/30 text-muted-foreground"
                                : "bg-primary/5 text-primary border border-primary/10",
                              conflict && "bg-destructive/15 text-destructive border-destructive/40",
                            )}
                          >
                            {cell}
                            {conflict && <span className="block text-[10px]">⚠ conflict</span>}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-xl border bg-card p-5 shadow-sm">
            <h3 className="font-semibold mb-3">Quick assign</h3>
            <div className="space-y-3 text-sm">
              <div>
                <div className="text-xs text-muted-foreground mb-1">Course</div>
                <div className="rounded-md border px-3 py-2">CSE304 · OS</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground mb-1">Faculty</div>
                <div className="rounded-md border px-3 py-2">Dr. Karthik Venkatesan</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground mb-1">Room</div>
                <div className="rounded-md border px-3 py-2">Hall C-301</div>
              </div>
              <Button size="sm" className="w-full">
                Save slot
              </Button>
            </div>
          </div>

          <div className="rounded-xl border bg-card p-5 shadow-sm">
            <h3 className="font-semibold mb-3">Room utilisation</h3>
            <div className="space-y-2 text-sm">
              {[
                { r: "A-201", u: 82 },
                { r: "B-104", u: 68 },
                { r: "C-301", u: 74 },
                { r: "CSL-1", u: 91 },
                { r: "CSL-2", u: 56 },
              ].map((x) => (
                <div key={x.r}>
                  <div className="flex justify-between text-xs">
                    <span>{x.r}</span>
                    <span className="text-muted-foreground">{x.u}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                    <div className="h-full bg-primary" style={{ width: `${x.u}%` }} />
                  </div>
                </div>
              ))}
            </div>
            <Badge variant="secondary" className="mt-3 text-[10px]">
              Conflicts auto-detected
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
}
