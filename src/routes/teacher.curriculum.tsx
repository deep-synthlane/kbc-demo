import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2, PlayCircle, Lock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { PageHeader } from "@/components/RoleShell";
import { COURSES, UNITS } from "@/lib/mockData";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const Route = createFileRoute("/teacher/curriculum")({
  head: () => ({ meta: [{ title: "Curriculum · Faculty · KCG" }] }),
  component: TeacherCurriculum,
});

const CAL_EVENTS: Record<number, { label: string; type: "exam" | "holiday" | "event" }> = {
  3: { label: "Convocation", type: "event" },
  10: { label: "Founders' Day", type: "holiday" },
  18: { label: "Mid-Sem Begin", type: "exam" },
  19: { label: "Mid-Sem", type: "exam" },
  20: { label: "Mid-Sem", type: "exam" },
  21: { label: "Mid-Sem", type: "exam" },
  24: { label: "Hackathon", type: "event" },
};

function TeacherCurriculum() {
  const myCourses = COURSES.slice(0, 3);

  return (
    <div className="space-y-6">
      <PageHeader title="Curriculum & Syllabus" subtitle="Course syllabus, unit coverage and academic calendar" />

      <div className="grid gap-4 lg:grid-cols-3">
        {myCourses.map((c) => (
          <div key={c.id} className="rounded-xl border bg-card shadow-sm overflow-hidden">
            <div className={`bg-gradient-to-r ${c.color} p-4 text-white`}>
              <div className="text-xs opacity-80">{c.code}</div>
              <h3 className="font-semibold mt-1">{c.title}</h3>
              <Badge className="mt-2 bg-white/20 border-0 text-white text-[10px]">{c.credits} credits</Badge>
            </div>
            <div className="p-4 space-y-3">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-muted-foreground">Syllabus coverage</span>
                  <span className="font-medium">{c.progress}%</span>
                </div>
                <Progress value={c.progress} className="h-1.5" />
              </div>
              <Accordion type="single" collapsible className="space-y-1">
                {UNITS.map((u) => (
                  <AccordionItem key={u.id} value={u.id} className="border rounded-md px-3">
                    <AccordionTrigger className="text-xs py-2 hover:no-underline">
                      <div className="flex items-center gap-2">
                        {u.status === "completed" ? (
                          <CheckCircle2 className="h-3.5 w-3.5 text-success" />
                        ) : u.status === "locked" ? (
                          <Lock className="h-3.5 w-3.5 text-muted-foreground" />
                        ) : (
                          <PlayCircle className="h-3.5 w-3.5 text-primary" />
                        )}
                        <span className="truncate">{u.title}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-1 text-xs text-muted-foreground">
                        {u.lessons.map((l) => (
                          <div key={l.id} className="flex items-center gap-2">
                            {l.done ? (
                              <CheckCircle2 className="h-3 w-3 text-success" />
                            ) : (
                              <div className="h-3 w-3 rounded-full border" />
                            )}
                            <span>{l.title}</span>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
              <Button
                variant="ghost"
                size="sm"
                className="w-full text-xs"
                onClick={() => toast("CO-PO matrix coming soon")}
              >
                CO-PO Mapping
              </Button>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-xl border bg-card p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold">Academic Calendar — June 2026</h3>
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
