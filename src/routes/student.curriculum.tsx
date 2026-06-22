import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2, Lock, BookOpen } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { PageHeader } from "@/components/RoleShell";
import { STUDENT_CURRICULUM } from "@/lib/mockData";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/student/curriculum")({
  head: () => ({ meta: [{ title: "Curriculum · KCG" }] }),
  component: StudentCurriculum,
});

const CURRENT_SEM = 6;

const CAL_EVENTS: Record<number, { label: string; type: "exam" | "holiday" | "event" }> = {
  3: { label: "Convocation", type: "event" },
  10: { label: "Founders' Day", type: "holiday" },
  18: { label: "Mid-Sem Begin", type: "exam" },
  19: { label: "Mid-Sem", type: "exam" },
  20: { label: "Mid-Sem", type: "exam" },
  21: { label: "Mid-Sem", type: "exam" },
  24: { label: "Hackathon", type: "event" },
};

function StudentCurriculum() {
  return (
    <div className="space-y-6">
      <PageHeader title="Curriculum & Calendar" subtitle="B.Tech CSE — Semester-wise courses and academic calendar" />

      <Tabs defaultValue="curriculum">
        <TabsList>
          <TabsTrigger value="curriculum">My Curriculum</TabsTrigger>
          <TabsTrigger value="calendar">Academic Calendar</TabsTrigger>
        </TabsList>

        <TabsContent value="curriculum" className="space-y-4">
          {STUDENT_CURRICULUM.map((sem) => {
            const completed = sem.semester < CURRENT_SEM;
            const current = sem.semester === CURRENT_SEM;
            const locked = sem.semester > CURRENT_SEM;
            return (
              <div
                key={sem.semester}
                className={cn(
                  "rounded-xl border bg-card shadow-sm overflow-hidden",
                  locked && "opacity-50",
                )}
              >
                <div className="flex items-center gap-3 p-4 border-b bg-muted/30">
                  {completed ? (
                    <CheckCircle2 className="h-5 w-5 text-success" />
                  ) : locked ? (
                    <Lock className="h-5 w-5 text-muted-foreground" />
                  ) : (
                    <BookOpen className="h-5 w-5 text-primary" />
                  )}
                  <h3 className="font-semibold text-sm flex-1">Semester {sem.semester}</h3>
                  <Badge
                    className={
                      completed
                        ? "bg-success/15 text-success border-0"
                        : current
                          ? "bg-primary/10 text-primary border-0"
                          : "bg-muted text-muted-foreground border-0"
                    }
                  >
                    {completed ? "Completed" : current ? "Current" : "Upcoming"}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {sem.courses.reduce((a, c) => a + c.credits, 0)} credits
                  </span>
                </div>
                <div className="p-4">
                  <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
                    {sem.courses.map((c) => (
                      <div key={c.code} className="flex items-center gap-3 rounded-lg border p-3">
                        <div className="min-w-0 flex-1">
                          <div className="text-xs font-mono text-muted-foreground">{c.code}</div>
                          <div className="text-sm font-medium truncate">{c.title}</div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <Badge variant="outline" className="text-[10px]">{c.credits}cr</Badge>
                          <Badge
                            className={cn(
                              "text-[10px] border-0",
                              c.type === "Core" && "bg-primary/10 text-primary",
                              c.type === "Elective" && "bg-violet-500/10 text-violet-600",
                              c.type === "Lab" && "bg-warning/15 text-warning-foreground",
                            )}
                          >
                            {c.type}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </TabsContent>

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
                <div key={d} className="py-2 font-medium text-muted-foreground">{d}</div>
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
                    {ev && <div className="text-[10px] mt-auto leading-tight truncate">{ev.label}</div>}
                  </div>
                );
              })}
            </div>
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
