import { createFileRoute } from "@tanstack/react-router";
import { Send, Megaphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { PageHeader } from "@/components/RoleShell";

export const Route = createFileRoute("/staff/announcements")({
  head: () => ({ meta: [{ title: "Announcements · KCG University" }] }),
  component: Announcements,
});

const POSTS = [
  { id: 1, title: "Mid-sem hall tickets are now downloadable", to: "All Students", time: "2h ago" },
  { id: 2, title: "Library will close at 6 PM on 28 Jun", to: "All", time: "1d ago" },
  { id: 3, title: "Hostel mess menu revision from 1 Jul", to: "Hostellers", time: "2d ago" },
  { id: 4, title: "Bus route 12 timing change", to: "Day Scholars", time: "3d ago" },
];

function Announcements() {
  return (
    <div className="space-y-6">
      <PageHeader title="Announcements" subtitle="Broadcast updates to students, faculty or staff" />

      <div className="grid lg:grid-cols-[1fr_360px] gap-6">
        <div className="space-y-3">
          {POSTS.map((p) => (
            <div key={p.id} className="rounded-xl border bg-card p-5 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-md bg-primary/10 text-primary shrink-0">
                  <Megaphone className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold">{p.title}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    To {p.to} · {p.time}
                  </div>
                </div>
                <Badge variant="secondary" className="text-[10px]">
                  Live
                </Badge>
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-xl border bg-card p-5 shadow-sm h-fit space-y-3 sticky top-20">
          <h3 className="font-semibold">New announcement</h3>
          <div>
            <Label className="text-xs">Audience</Label>
            <Input defaultValue="All Students" />
          </div>
          <div>
            <Label className="text-xs">Title</Label>
            <Input placeholder="Headline" />
          </div>
          <div>
            <Label className="text-xs">Message</Label>
            <Textarea rows={4} placeholder="Write the announcement…" />
          </div>
          <Button className="w-full">
            <Send className="h-4 w-4 mr-2" /> Broadcast
          </Button>
        </div>
      </div>
    </div>
  );
}
