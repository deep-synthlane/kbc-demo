import { createFileRoute } from "@tanstack/react-router";
import { Mic, Video, Sparkles, Award } from "lucide-react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { PageHeader } from "@/components/RoleShell";
import { INTERVIEW_QA } from "@/lib/mockData";

export const Route = createFileRoute("/ai/interview")({
  head: () => ({ meta: [{ title: "AI Interview Assistant · KCG University" }] }),
  component: AIInterview,
});

const SCORES = [
  { trait: "Confidence", value: 84 },
  { trait: "Communication", value: 91 },
  { trait: "Technical", value: 78 },
  { trait: "Clarity", value: 86 },
  { trait: "Domain Depth", value: 72 },
];

function AIInterview() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="AI Interview Assistant"
        subtitle="Mock interview simulation with realtime scoring on confidence, communication & domain depth"
        actions={
          <Badge className="bg-primary/10 text-primary border-0">
            <Sparkles className="h-3 w-3 mr-1" /> Powered by KCGU·AI
          </Badge>
        }
      />

      <div className="grid lg:grid-cols-[1fr_360px] gap-6">
        {/* Video + transcript */}
        <div className="space-y-4">
          <div className="rounded-xl border bg-card overflow-hidden shadow-sm">
            <div className="aspect-video bg-gradient-to-br from-sidebar to-sidebar-accent relative">
              <div className="absolute inset-0 grid place-items-center text-sidebar-foreground/40">
                <div className="text-center">
                  <Video className="h-12 w-12 mx-auto mb-2" />
                  <div className="text-sm">Candidate camera · Live</div>
                </div>
              </div>
              <div className="absolute top-4 left-4 flex gap-2">
                <Badge className="bg-destructive text-destructive-foreground animate-pulse">
                  ● REC
                </Badge>
                <Badge className="bg-black/50 text-white border-0">00:08:42</Badge>
              </div>
              <div className="absolute bottom-4 right-4 w-40 aspect-video rounded-md bg-sidebar-accent border border-sidebar-border grid place-items-center text-xs text-sidebar-foreground/60">
                AI Interviewer
              </div>
              <div className="absolute bottom-4 left-4 flex gap-2">
                <div className="h-8 w-8 rounded-full bg-white/15 grid place-items-center backdrop-blur">
                  <Mic className="h-4 w-4 text-white" />
                </div>
                <div className="h-8 w-8 rounded-full bg-white/15 grid place-items-center backdrop-blur">
                  <Video className="h-4 w-4 text-white" />
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-xl border bg-card p-5 shadow-sm">
            <h3 className="font-semibold mb-3">Interview Q&A Transcript</h3>
            <div className="space-y-4">
              {INTERVIEW_QA.map((qa, i) => (
                <div key={i} className="rounded-lg border-l-2 border-primary pl-4">
                  <div className="text-xs uppercase tracking-wider text-primary font-medium">
                    Q{i + 1} · Interviewer
                  </div>
                  <div className="text-sm mt-1 font-medium">{qa.q}</div>
                  <div className="text-xs text-muted-foreground mt-2 italic">{qa.a}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scoring panel */}
        <div className="space-y-4">
          <div className="rounded-xl border bg-card p-5 shadow-sm">
            <h3 className="font-semibold mb-2">Live Performance Score</h3>
            <div className="font-display text-5xl font-semibold text-primary">82</div>
            <div className="text-xs text-muted-foreground mb-4">out of 100 · Strong candidate</div>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={SCORES}>
                  <PolarGrid stroke="var(--color-border)" />
                  <PolarAngleAxis dataKey="trait" fontSize={11} stroke="var(--color-muted-foreground)" />
                  <PolarRadiusAxis fontSize={10} stroke="var(--color-muted-foreground)" />
                  <Radar
                    dataKey="value"
                    stroke="var(--color-primary)"
                    fill="var(--color-primary)"
                    fillOpacity={0.4}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-xl border bg-card p-5 shadow-sm space-y-3">
            <h3 className="font-semibold flex items-center gap-2">
              <Award className="h-4 w-4 text-gold" /> Overall Assessment
            </h3>
            {SCORES.map((s) => (
              <div key={s.trait}>
                <div className="flex justify-between text-xs mb-1">
                  <span>{s.trait}</span>
                  <span className="font-semibold">{s.value}</span>
                </div>
                <Progress value={s.value} className="h-1.5" />
              </div>
            ))}
            <Button className="w-full mt-2">Generate Final Report</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
