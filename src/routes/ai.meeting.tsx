import { createFileRoute } from "@tanstack/react-router";
import { Radio, Sparkles, CheckSquare, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/RoleShell";
import { MEETING_TRANSCRIPT } from "@/lib/mockData";

export const Route = createFileRoute("/ai/meeting")({
  head: () => ({ meta: [{ title: "AI Meeting Intelligence · KCG University" }] }),
  component: AIMeeting,
});

const KEY_POINTS = [
  "Exam window locked 28 Jun – 8 Jul",
  "Additional AI lab slot proposed: Thursday 4 PM",
  "Hall ticket auto-generation post attendance freeze on 26 Jun",
  "Mid-sem invigilator rotation finalised",
];

const ACTIONS = [
  { task: "Publish revised AI lab schedule on LMS", owner: "HoD CSE", due: "24 Jun" },
  { task: "Confirm hall allocation for 4 spillover halls", owner: "Examinations", due: "26 Jun" },
  { task: "Share calendar update with parents", owner: "Communications", due: "25 Jun" },
];

const SPEAKERS = ["Dean", "Registrar", "HoD CSE"];

function AIMeeting() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="AI Meeting Intelligence"
        subtitle="Live transcript, speaker identification, key points and action items"
        actions={
          <Badge className="bg-destructive text-destructive-foreground animate-pulse">
            <Radio className="h-3 w-3 mr-1" /> Recording
          </Badge>
        }
      />

      <div className="grid lg:grid-cols-[1fr_360px] gap-6">
        <div className="space-y-4">
          {/* Speakers */}
          <div className="rounded-xl border bg-card p-5 shadow-sm">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" /> Speakers identified
            </h3>
            <div className="flex flex-wrap gap-2">
              {SPEAKERS.map((s, i) => (
                <Badge
                  key={s}
                  className={`text-xs ${
                    i === 0 ? "bg-primary/15 text-primary" : i === 1 ? "bg-success/15 text-success" : "bg-gold/30 text-foreground"
                  } border-0`}
                >
                  ● {s}
                </Badge>
              ))}
            </div>
          </div>

          {/* Transcript */}
          <div className="rounded-xl border bg-card p-5 shadow-sm">
            <h3 className="font-semibold mb-4">Live Transcript</h3>
            <div className="space-y-3 max-h-[480px] overflow-y-auto pr-2">
              {MEETING_TRANSCRIPT.map((m, i) => (
                <div key={i} className="flex gap-3">
                  <div className="text-xs font-mono text-muted-foreground w-12 shrink-0 pt-0.5">
                    {m.t}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-semibold text-primary">{m.speaker}</div>
                    <div className="text-sm mt-0.5">{m.text}</div>
                  </div>
                </div>
              ))}
              <div className="flex gap-3 opacity-60 animate-pulse">
                <div className="text-xs font-mono text-muted-foreground w-12 shrink-0">●●●</div>
                <div className="text-sm italic">Listening…</div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-xl border bg-card p-5 shadow-sm">
            <h3 className="font-semibold flex items-center gap-2 mb-3">
              <Sparkles className="h-4 w-4 text-primary" /> AI Summary
            </h3>
            <p className="text-sm leading-relaxed">
              The academic council aligned on mid-semester examination dates, approved an
              additional AI lab slot, and reaffirmed automated hall-ticket generation after the
              26 Jun attendance freeze. All actions are scoped to be completed within the week.
            </p>
          </div>

          <div className="rounded-xl border bg-card p-5 shadow-sm">
            <h3 className="font-semibold mb-3">Key points</h3>
            <ul className="space-y-2 text-sm">
              {KEY_POINTS.map((p) => (
                <li key={p} className="flex gap-2">
                  <span className="text-primary mt-1.5">●</span>
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl border bg-card p-5 shadow-sm">
            <h3 className="font-semibold flex items-center gap-2 mb-3">
              <CheckSquare className="h-4 w-4 text-primary" /> Action items
            </h3>
            <div className="space-y-2.5">
              {ACTIONS.map((a, i) => (
                <div key={i} className="rounded-md border p-3 text-sm">
                  <div className="font-medium">{a.task}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {a.owner} · Due {a.due}
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-3">
              Email summary to participants
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
