import { createFileRoute } from "@tanstack/react-router";
import { Clock, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PageHeader } from "@/components/RoleShell";
import { TIMETABLE, EXAM_SCHEDULE } from "@/lib/mockData";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/teacher/timetable")({
  head: () => ({ meta: [{ title: "Timetable · Faculty · KCG" }] }),
  component: TeacherTimetable,
});

const MY_COURSES = ["DS", "DBMS", "AI"];

function isMyCourse(cell: string) {
  return MY_COURSES.some((c) => cell.startsWith(c));
}

const MY_CLASSES = [
  { course: "CSE301 · Data Structures", room: "A-201", day: "Mon", time: "09:00 – 10:00" },
  { course: "CSE305 · DBMS", room: "B-104", day: "Mon", time: "10:00 – 11:00" },
  { course: "CSE402 · AI", room: "A-105", day: "Mon", time: "12:00 – 01:00" },
];

function TeacherTimetable() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="My Timetable"
        subtitle="Your weekly teaching schedule and invigilation duties"
      />

      <div className="grid gap-4 md:grid-cols-3">
        {MY_CLASSES.map((c) => (
          <div key={c.course} className="rounded-xl border bg-card p-4 shadow-sm">
            <h4 className="font-semibold text-sm">{c.course}</h4>
            <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {c.room}</span>
              <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {c.day} · {c.time}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-xl border bg-card shadow-sm overflow-x-auto">
        <div className="p-5 border-b">
          <h3 className="font-semibold">Weekly Schedule</h3>
          <p className="text-xs text-muted-foreground mt-1">Your classes highlighted · Others dimmed</p>
        </div>
        <table className="w-full text-sm min-w-[700px]">
          <thead>
            <tr className="bg-muted/50">
              <th className="p-3 text-left font-medium text-muted-foreground text-xs">Day</th>
              {TIMETABLE.periods.map((p) => (
                <th key={p} className="p-3 text-center font-medium text-muted-foreground text-xs">
                  {p}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {TIMETABLE.days.map((day, di) => (
              <tr key={day} className="border-t">
                <td className="p-3 font-medium">{day}</td>
                {TIMETABLE.grid[di].map((cell, ci) => {
                  const mine = isMyCourse(cell);
                  const isLunch = cell === "Lunch";
                  return (
                    <td key={ci} className="p-2 text-center">
                      {cell === "—" ? (
                        <span className="text-muted-foreground/40">—</span>
                      ) : isLunch ? (
                        <Badge className="bg-warning/20 text-warning-foreground border-0 text-[10px]">
                          Lunch
                        </Badge>
                      ) : (
                        <span
                          className={cn(
                            "inline-block rounded-md px-2 py-1 text-xs font-medium",
                            mine
                              ? "bg-primary/15 text-primary ring-1 ring-primary/30"
                              : "bg-muted/50 text-muted-foreground",
                          )}
                        >
                          {cell}
                        </span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
        <div className="p-5 border-b">
          <h3 className="font-semibold">Upcoming Exams (Invigilation)</h3>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Course</TableHead>
              <TableHead>Session</TableHead>
              <TableHead>Hall</TableHead>
              <TableHead>Invigilator</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {EXAM_SCHEDULE.map((e) => (
              <TableRow key={e.id}>
                <TableCell className="font-medium">{e.date}</TableCell>
                <TableCell>{e.course}</TableCell>
                <TableCell>
                  <Badge variant="outline">{e.session}</Badge>
                </TableCell>
                <TableCell>{e.hall}</TableCell>
                <TableCell>{e.invigilator}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
