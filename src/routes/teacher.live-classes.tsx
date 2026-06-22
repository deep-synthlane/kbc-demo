import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Calendar, Video, Link as LinkIcon, Copy, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PageHeader } from "@/components/RoleShell";
import { LIVE_CLASSES } from "@/lib/mockData";
import { toast } from "sonner";

export const Route = createFileRoute("/teacher/live-classes")({
  head: () => ({ meta: [{ title: "Live Classes · Faculty · KCG" }] }),
  component: TeacherLive,
});

const HISTORY = [
  { date: "18 Jun", title: "DBMS · Joins", platform: "Google Meet", attended: 62, total: 72 },
  { date: "16 Jun", title: "DS · Trees Intro", platform: "Teams", attended: 78, total: 86 },
  { date: "14 Jun", title: "AI · Search", platform: "Google Meet", attended: 65, total: 74 },
];

const WEEK_SCHEDULE = [
  { day: "Mon", sessions: [{ time: "10:00", title: "DS · Arrays Revision", section: "Sec A" }] },
  { day: "Tue", sessions: [{ time: "14:00", title: "DBMS · Normalization", section: "Sec A" }] },
  { day: "Wed", sessions: [{ time: "10:30", title: "DS · Trees", section: "Sec B" }] },
  { day: "Thu", sessions: [{ time: "15:00", title: "DBMS · Joins Deep Dive", section: "Sec A" }, { time: "11:00", title: "DS · Stacks Review", section: "Sec B" }] },
  { day: "Fri", sessions: [{ time: "09:00", title: "DS · Graphs Intro", section: "Sec A" }] },
  { day: "Sat", sessions: [] },
];

function handleStart(title: string) {
  toast.success(`Starting "${title}" — opening meeting link`);
  window.open("https://meet.google.com/iuf-gtjb-mgd", "_blank");
}

function TeacherLive() {
  const [open, setOpen] = useState(false);
  return (
    <div className="space-y-6">
      <PageHeader
        title="Live Classes"
        subtitle="Schedule meetings, track attendance, review session history"
        actions={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>
                <Calendar className="h-4 w-4 mr-2" /> Schedule Meeting
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Schedule a live class</DialogTitle>
              </DialogHeader>
              <div className="space-y-3">
                <div>
                  <Label className="text-xs">Title</Label>
                  <Input defaultValue="DBMS · Transactions Deep Dive" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs">Date</Label>
                    <Input type="date" defaultValue="2026-06-25" />
                  </div>
                  <div>
                    <Label className="text-xs">Time</Label>
                    <Input type="time" defaultValue="15:00" />
                  </div>
                </div>
                <div>
                  <Label className="text-xs">Platform</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <button className="rounded-md border px-3 py-2 text-sm hover:border-primary">
                      Google Meet
                    </button>
                    <button className="rounded-md border px-3 py-2 text-sm hover:border-primary">
                      Microsoft Teams
                    </button>
                  </div>
                </div>
                <div className="rounded-md border bg-muted/40 p-3">
                  <div className="text-xs text-muted-foreground mb-1">Auto-generated link</div>
                  <div className="flex items-center gap-2">
                    <LinkIcon className="h-3.5 w-3.5 text-primary" />
                    <code className="text-xs flex-1 truncate">meet.google.com/kcgu-vfx-mrt</code>
                    <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => toast("Link copied!")}>
                      <Copy className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
                <Button className="w-full" onClick={() => { setOpen(false); toast.success("Meeting scheduled & class notified"); }}>
                  Create & notify class
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        }
      />

      {/* Weekly calendar view */}
      <div className="rounded-xl border bg-card p-5 shadow-sm">
        <h2 className="font-semibold mb-3 flex items-center gap-2">
          <Calendar className="h-4 w-4 text-primary" /> This Week's Schedule
        </h2>
        <div className="grid grid-cols-6 gap-2">
          {WEEK_SCHEDULE.map((d) => (
            <div key={d.day} className="rounded-lg border p-3 min-h-[120px]">
              <div className="text-xs font-semibold text-muted-foreground mb-2">{d.day}</div>
              {d.sessions.length === 0 ? (
                <div className="text-xs text-muted-foreground/50 italic">Free</div>
              ) : (
                <div className="space-y-2">
                  {d.sessions.map((s) => (
                    <div key={s.time + s.title} className="rounded-md bg-primary/10 border border-primary/20 p-2">
                      <div className="text-[10px] text-muted-foreground">{s.time} · {s.section}</div>
                      <div className="text-xs font-medium mt-0.5 leading-tight">{s.title}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="font-display text-lg font-semibold mb-3">Upcoming sessions</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {LIVE_CLASSES.map((l) => (
            <div key={l.id} className="rounded-xl border bg-card p-5 shadow-sm">
              <Badge variant="outline" className="text-[10px]">
                {l.platform}
              </Badge>
              <div className="font-semibold mt-2">{l.title}</div>
              <div className="text-sm text-muted-foreground mt-1">
                {l.date} · {l.time}
              </div>
              <div className="flex gap-2 mt-4">
                <Button size="sm" className="flex-1" onClick={() => handleStart(l.title)}>
                  <Video className="h-3.5 w-3.5 mr-1.5" /> Start
                </Button>
                <Button size="sm" variant="outline" onClick={() => toast("Opening roster...")}>
                  <Users className="h-3.5 w-3.5 mr-1.5" /> Roster
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
        <div className="p-5 border-b">
          <h3 className="font-semibold">Session history</h3>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Platform</TableHead>
              <TableHead>Attendance</TableHead>
              <TableHead className="text-right">Recording</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {HISTORY.map((h, i) => (
              <TableRow key={i}>
                <TableCell>{h.date}</TableCell>
                <TableCell className="font-medium">{h.title}</TableCell>
                <TableCell>{h.platform}</TableCell>
                <TableCell>
                  <span className="font-semibold">{h.attended}</span>
                  <span className="text-muted-foreground"> / {h.total}</span>
                  <span className="ml-2 text-xs text-muted-foreground">
                    ({Math.round((h.attended / h.total) * 100)}%)
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <Button size="sm" variant="ghost" onClick={() => toast("Playing recording...")}>
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
