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

export const Route = createFileRoute("/teacher/live-classes")({
  head: () => ({ meta: [{ title: "Live Classes · Faculty · KCG University" }] }),
  component: TeacherLive,
});

const HISTORY = [
  { date: "18 Jun", title: "DBMS · Joins", platform: "Google Meet", attended: 62, total: 72 },
  { date: "16 Jun", title: "DS · Trees Intro", platform: "Teams", attended: 78, total: 86 },
  { date: "14 Jun", title: "AI · Search", platform: "Google Meet", attended: 65, total: 74 },
];

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
                    <Button size="icon" variant="ghost" className="h-7 w-7">
                      <Copy className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
                <Button className="w-full" onClick={() => setOpen(false)}>
                  Create & notify class
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        }
      />

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
                <Button size="sm" className="flex-1">
                  <Video className="h-3.5 w-3.5 mr-1.5" /> Start
                </Button>
                <Button size="sm" variant="outline">
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
                  <Button size="sm" variant="ghost">
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
