import { createFileRoute } from "@tanstack/react-router";
import { Eye, ShieldCheck, AlertTriangle, ScanFace } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageHeader, StatCard } from "@/components/RoleShell";
import { PROCTOR_FEED } from "@/lib/mockData";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/ai/proctoring")({
  head: () => ({ meta: [{ title: "AI Proctoring · KCG" }] }),
  component: AIProctoring,
});

const TIMELINE = [
  { t: "10:04", student: "Imran Khan", evt: "Face not detected for 15s", severity: "high" },
  { t: "10:09", student: "Suresh Babu", evt: "Identity mismatch warning", severity: "high" },
  { t: "10:18", student: "Rahul Verma", evt: "Looked away repeatedly", severity: "med" },
  { t: "10:24", student: "Suresh Babu", evt: "Multiple faces in frame", severity: "high" },
];

function AIProctoring() {
  const clean = PROCTOR_FEED.filter((p) => p.flags === 0).length;
  const flagged = PROCTOR_FEED.filter((p) => p.flags > 0).length;
  const totalFlags = PROCTOR_FEED.reduce((s, p) => s + p.flags, 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="AI Proctoring Dashboard"
        subtitle="Real-time exam integrity monitoring across all live sessions"
        actions={
          <Badge className="bg-success/15 text-success border-0">
            <ShieldCheck className="h-3 w-3 mr-1" /> Integrity score: 94%
          </Badge>
        }
      />

      <div className="grid gap-4 sm:grid-cols-4">
        <StatCard label="Candidates Live" value={PROCTOR_FEED.length} icon={Eye} />
        <StatCard label="Clean Sessions" value={clean} icon={ShieldCheck} tone="success" />
        <StatCard label="Flagged" value={flagged} icon={AlertTriangle} tone="warning" />
        <StatCard label="Total Alerts" value={totalFlags} icon={ScanFace} tone="destructive" />
      </div>

      <div className="grid lg:grid-cols-[1fr_360px] gap-6">
        <div>
          <h3 className="font-semibold mb-3">Live candidate feed</h3>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {PROCTOR_FEED.map((p) => (
              <div key={p.id} className="rounded-xl border bg-card overflow-hidden shadow-sm">
                <div
                  className={cn(
                    "aspect-video bg-gradient-to-br relative grid place-items-center",
                    p.flags === 0
                      ? "from-success/30 to-success/10"
                      : p.flags <= 1
                        ? "from-warning/30 to-warning/10"
                        : "from-destructive/30 to-destructive/10",
                  )}
                >
                  <ScanFace className="h-10 w-10 text-foreground/40" />
                  {p.flags > 0 && (
                    <Badge className="absolute top-2 left-2 bg-destructive text-destructive-foreground">
                      ⚠ {p.flags} alert{p.flags > 1 ? "s" : ""}
                    </Badge>
                  )}
                </div>
                <div className="p-3 space-y-2">
                  <div className="text-sm font-semibold truncate">{p.student}</div>
                  <div className="flex flex-wrap gap-1">
                    <Mini ok={p.face} label="Face" />
                    <Mini ok={p.identity} label="ID" />
                    <Mini ok={p.gaze === "OK"} label={`Gaze · ${p.gaze}`} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-xl border bg-card p-5 shadow-sm">
            <h3 className="font-semibold mb-3">Exam Integrity Timeline</h3>
            <div className="space-y-3">
              {TIMELINE.map((t, i) => (
                <div key={i} className="flex gap-3">
                  <div className="text-xs font-mono text-muted-foreground w-10 shrink-0">{t.t}</div>
                  <div
                    className={cn(
                      "h-2 w-2 rounded-full mt-1.5 shrink-0",
                      t.severity === "high" ? "bg-destructive" : "bg-warning",
                    )}
                  />
                  <div className="min-w-0">
                    <div className="text-sm font-medium">{t.student}</div>
                    <div className="text-xs text-muted-foreground">{t.evt}</div>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-3">
              Export integrity report
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Mini({ ok, label }: { ok: boolean; label: string }) {
  return (
    <span
      className={cn(
        "text-[10px] px-1.5 py-0.5 rounded",
        ok
          ? "bg-success/15 text-success"
          : "bg-destructive/10 text-destructive",
      )}
    >
      {ok ? "●" : "○"} {label}
    </span>
  );
}
