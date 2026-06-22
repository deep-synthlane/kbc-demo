import { createFileRoute } from "@tanstack/react-router";
import { Video, Calendar, PlayCircle, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PageHeader } from "@/components/RoleShell";
import { LIVE_CLASSES, RECORDINGS } from "@/lib/mockData";

export const Route = createFileRoute("/student/live-classes")({
  head: () => ({ meta: [{ title: "Live Classes · KCG" }] }),
  component: LiveClassesPage,
});

const ATTENDANCE = [
  { date: "18 Jun", session: "DBMS · Joins", status: "Present", duration: "58 min" },
  { date: "17 Jun", session: "AI · Search", status: "Present", duration: "47 min" },
  { date: "16 Jun", session: "OS · Memory", status: "Absent", duration: "—" },
  { date: "14 Jun", session: "DS · Linked Lists", status: "Present", duration: "55 min" },
];

function LiveClassesPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Live Classes"
        subtitle="Join scheduled sessions, review recordings, track attendance"
      />

      {/* Upcoming sessions */}
      <div>
        <h2 className="font-display text-lg font-semibold mb-3 flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" /> Upcoming Sessions
        </h2>
        <div className="grid gap-4 md:grid-cols-3">
          {LIVE_CLASSES.map((l) => (
            <div key={l.id} className="rounded-xl border bg-card p-5 shadow-sm flex flex-col">
              <div className="flex items-start justify-between gap-2">
                <Badge variant="outline" className="text-[10px]">
                  {l.platform}
                </Badge>
                {l.status === "live" && (
                  <Badge className="bg-destructive text-destructive-foreground animate-pulse">
                    ● LIVE
                  </Badge>
                )}
              </div>
              <div className="mt-3 flex-1">
                <div className="font-semibold leading-tight">{l.title}</div>
                <div className="text-sm text-muted-foreground mt-1">{l.faculty}</div>
                <div className="text-xs text-muted-foreground mt-3 flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" /> {l.date} · {l.time}
                </div>
              </div>
              <Button className="mt-4 w-full">
                <Video className="h-4 w-4 mr-2" /> Join {l.platform}
              </Button>
            </div>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Attendance log */}
        <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
          <div className="p-5 border-b">
            <h3 className="font-semibold flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" /> Attendance Log
            </h3>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Session</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Duration</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ATTENDANCE.map((a, i) => (
                <TableRow key={i}>
                  <TableCell>{a.date}</TableCell>
                  <TableCell className="font-medium">{a.session}</TableCell>
                  <TableCell>
                    <Badge
                      className={
                        a.status === "Present"
                          ? "bg-success/15 text-success border-0"
                          : "bg-destructive/10 text-destructive border-0"
                      }
                    >
                      {a.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{a.duration}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Recordings */}
        <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
          <div className="p-5 border-b">
            <h3 className="font-semibold flex items-center gap-2">
              <PlayCircle className="h-4 w-4 text-primary" /> Session Recordings
            </h3>
          </div>
          <div className="divide-y">
            {RECORDINGS.map((r) => (
              <div key={r.id} className="flex items-center gap-4 p-4 hover:bg-muted/40 transition">
                <div className="grid h-12 w-16 place-items-center rounded-md bg-gradient-to-br from-primary to-primary/60 text-primary-foreground shrink-0">
                  <PlayCircle className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-medium text-sm truncate">{r.title}</div>
                  <div className="text-xs text-muted-foreground">
                    {r.date} · {r.duration} · {r.views} views
                  </div>
                </div>
                <Button size="sm" variant="ghost">
                  Watch
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
