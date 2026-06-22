import { createFileRoute } from "@tanstack/react-router";
import { Smile, Frown, Meh, ThumbsUp } from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Badge } from "@/components/ui/badge";
import { PageHeader, StatCard } from "@/components/RoleShell";
import { FEEDBACK_SENTIMENT, FACULTY_RATINGS } from "@/lib/mockData";

export const Route = createFileRoute("/ai/feedback")({
  head: () => ({ meta: [{ title: "AI Feedback Engine · KCG University" }] }),
  component: AIFeedback,
});

const COLORS = ["var(--color-chart-5)", "var(--color-chart-3)", "var(--color-chart-4)"];

const SAMPLES = [
  { text: "Dr. Meera's AI labs are the highlight of this semester — extremely well structured.", sentiment: "Positive", course: "AI" },
  { text: "DBMS pace is reasonable but more real-world case studies would help.", sentiment: "Neutral", course: "DBMS" },
  { text: "OS theory classes are too rushed; concepts get lost.", sentiment: "Negative", course: "OS" },
  { text: "Loved the new SCORM modules for Data Structures.", sentiment: "Positive", course: "DS" },
  { text: "Lab equipment availability needs to improve in CSL-2.", sentiment: "Negative", course: "Infra" },
];

function AIFeedback() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="AI Feedback Engine"
        subtitle="Sentiment analysis across student feedback, faculty ratings and course satisfaction"
      />

      <div className="grid gap-4 sm:grid-cols-4">
        <StatCard label="Responses" value="3,142" icon={ThumbsUp} hint="This semester" />
        <StatCard label="Positive" value="68%" icon={Smile} tone="success" />
        <StatCard label="Neutral" value="22%" icon={Meh} tone="warning" />
        <StatCard label="Negative" value="10%" icon={Frown} tone="destructive" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="rounded-xl border bg-card p-5 shadow-sm">
          <h3 className="font-semibold mb-4">Overall sentiment</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={FEEDBACK_SENTIMENT}
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {FEEDBACK_SENTIMENT.map((_, i) => (
                    <Cell key={i} fill={COLORS[i]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: "var(--color-card)",
                    border: "1px solid var(--color-border)",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-4 text-sm">
            {FEEDBACK_SENTIMENT.map((s, i) => (
              <div key={s.name} className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-sm" style={{ background: COLORS[i] }} />
                <span>{s.name}</span>
                <span className="font-semibold">{s.value}%</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border bg-card p-5 shadow-sm">
          <h3 className="font-semibold mb-4">Faculty satisfaction ratings</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={FACULTY_RATINGS} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis type="number" domain={[0, 5]} fontSize={12} stroke="var(--color-muted-foreground)" />
                <YAxis type="category" dataKey="faculty" fontSize={11} width={90} stroke="var(--color-muted-foreground)" />
                <Tooltip
                  contentStyle={{
                    background: "var(--color-card)",
                    border: "1px solid var(--color-border)",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
                <Bar dataKey="rating" fill="var(--color-gold)" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="rounded-xl border bg-card p-5 shadow-sm">
        <h3 className="font-semibold mb-4">AI-tagged feedback samples</h3>
        <div className="grid gap-3 md:grid-cols-2">
          {SAMPLES.map((s, i) => (
            <div key={i} className="rounded-lg border p-4">
              <div className="flex items-center gap-2 mb-2">
                <Badge
                  className={
                    s.sentiment === "Positive"
                      ? "bg-success/15 text-success border-0"
                      : s.sentiment === "Neutral"
                        ? "bg-warning/20 text-warning-foreground border-0"
                        : "bg-destructive/10 text-destructive border-0"
                  }
                >
                  {s.sentiment}
                </Badge>
                <Badge variant="outline" className="text-[10px]">
                  {s.course}
                </Badge>
              </div>
              <p className="text-sm">"{s.text}"</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
