import { createFileRoute } from "@tanstack/react-router";
import { Calendar as CalIcon, BookCopy, GraduationCap } from "lucide-react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/RoleShell";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/curriculum")({
  head: () => ({ meta: [{ title: "Curriculum & Calendar · KCG University" }] }),
  component: Curriculum,
});

const PROGRAMS = [
  { code: "B.Tech CSE", duration: "4 yrs", courses: 48, electives: 12, sem: 8 },
  { code: "B.Tech ECE", duration: "4 yrs", courses: 46, electives: 10, sem: 8 },
  { code: "MBA", duration: "2 yrs", courses: 24, electives: 8, sem: 4 },
  { code: "B.Sc Data Science", duration: "3 yrs", courses: 36, electives: 9, sem: 6 },
];

const ELECTIVES = [
  { name: "Quantum Computing", dept: "CSE", capacity: 60, enrolled: 54 },
  { name: "Blockchain & Web3", dept: "CSE", capacity: 80, enrolled: 72 },
  { name: "Generative AI Studio", dept: "CSE", capacity: 90, enrolled: 88 },
  { name: "VLSI Design", dept: "ECE", capacity: 50, enrolled: 38 },
  { name: "Behavioural Finance", dept: "MBA", capacity: 40, enrolled: 36 },
];

const CAL_EVENTS: Record<number, { label: string; type: "exam" | "holiday" | "event" }> = {
  3: { label: "Convocation", type: "event" },
  10: { label: "Founders' Day", type: "holiday" },
  18: { label: "Mid-Sem Begin", type: "exam" },
  19: { label: "Mid-Sem", type: "exam" },
  20: { label: "Mid-Sem", type: "exam" },
  21: { label: "Mid-Sem", type: "exam" },
  24: { label: "Hackathon", type: "event" },
};

function Curriculum() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Curriculum & Academic Calendar"
        subtitle="Programs, electives, semesters and key academic events"
      />

      <Tabs defaultValue="calendar">
        <TabsList>
          <TabsTrigger value="calendar">
            <CalIcon className="h-4 w-4 mr-1.5" /> Academic Calendar
          </TabsTrigger>
          <TabsTrigger value="programs">
            <GraduationCap className="h-4 w-4 mr-1.5" /> Programs
          </TabsTrigger>
          <TabsTrigger value="electives">
            <BookCopy className="h-4 w-4 mr-1.5" /> Electives
          </TabsTrigger>
        </TabsList>

        <TabsContent value="calendar">
          <div className="rounded-xl border bg-card p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold">June 2026</h3>
                <p className="text-xs text-muted-foreground">Semester 6 · Even Term</p>
              </div>
              <div className="flex gap-2 text-xs">
                <Legend tone="exam" label="Exams" />
                <Legend tone="holiday" label="Holiday" />
                <Legend tone="event" label="Event" />
              </div>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center text-xs">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                <div key={d} className="py-2 font-medium text-muted-foreground">
                  {d}
                </div>
              ))}
              {Array.from({ length: 30 }).map((_, i) => {
                const day = i + 1;
                const ev = CAL_EVENTS[day];
                return (
                  <div
                    key={day}
                    className={cn(
                      "aspect-square rounded-md border p-1.5 flex flex-col text-left",
                      ev?.type === "exam" && "bg-destructive/10 border-destructive/30",
                      ev?.type === "holiday" && "bg-warning/15 border-warning/30",
                      ev?.type === "event" && "bg-primary/10 border-primary/30",
                      !ev && "bg-card hover:bg-muted/40",
                    )}
                  >
                    <div className="font-medium">{day}</div>
                    {ev && (
                      <div className="text-[10px] mt-auto leading-tight truncate">{ev.label}</div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="programs">
          <div className="grid gap-4 md:grid-cols-2">
            {PROGRAMS.map((p) => (
              <div key={p.code} className="rounded-xl border bg-card p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">{p.code}</h3>
                  <Badge variant="outline">{p.duration}</Badge>
                </div>
                <div className="grid grid-cols-3 gap-3 mt-4 text-center">
                  <Box label="Courses" value={p.courses} />
                  <Box label="Electives" value={p.electives} />
                  <Box label="Semesters" value={p.sem} />
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="electives">
          <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted/50 text-xs uppercase tracking-wider text-muted-foreground">
                  <th className="p-3 text-left">Elective</th>
                  <th className="p-3 text-left">Department</th>
                  <th className="p-3 text-left">Enrolment</th>
                  <th className="p-3 text-left">Fill</th>
                </tr>
              </thead>
              <tbody>
                {ELECTIVES.map((e) => {
                  const pct = Math.round((e.enrolled / e.capacity) * 100);
                  return (
                    <tr key={e.name} className="border-t">
                      <td className="p-3 font-medium">{e.name}</td>
                      <td className="p-3">{e.dept}</td>
                      <td className="p-3 text-muted-foreground">
                        {e.enrolled} / {e.capacity}
                      </td>
                      <td className="p-3">
                        <div className="w-32 h-1.5 rounded-full bg-muted overflow-hidden">
                          <div
                            className="h-full bg-primary"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function Legend({ tone, label }: { tone: "exam" | "holiday" | "event"; label: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <span
        className={cn(
          "h-2.5 w-2.5 rounded-sm",
          tone === "exam" && "bg-destructive/60",
          tone === "holiday" && "bg-warning",
          tone === "event" && "bg-primary",
        )}
      />
      <span className="text-muted-foreground">{label}</span>
    </div>
  );
}

function Box({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-md bg-muted/50 p-2">
      <div className="font-display text-xl font-semibold">{value}</div>
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
    </div>
  );
}
