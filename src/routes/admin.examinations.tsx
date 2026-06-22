import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Printer, Award, QrCode } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { PageHeader } from "@/components/RoleShell";
import { EXAM_SCHEDULE } from "@/lib/mockData";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/examinations")({
  head: () => ({ meta: [{ title: "Examinations · KCG" }] }),
  component: Examinations,
});

const RESULTS = [
  { id: "KCGU/22/CSE/0184", name: "Ananya Iyer", course: "DS", marks: 87, grade: "A+" },
  { id: "KCGU/22/CSE/0185", name: "Rahul Verma", course: "DS", marks: 74, grade: "A" },
  { id: "KCGU/22/ECE/0091", name: "Priya Nair", course: "DS", marks: 92, grade: "O" },
  { id: "KCGU/23/MECH/0040", name: "Imran Khan", course: "DS", marks: 61, grade: "B+" },
];

function Examinations() {
  const [seat, setSeat] = useState<string | null>(null);

  const seats = Array.from({ length: 36 }).map((_, i) => `S${String(i + 1).padStart(2, "0")}`);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Examination Management"
        subtitle="Schedule exams, generate hall tickets, assign seating, publish results"
        actions={
          <Button>
            <Plus className="h-4 w-4 mr-2" /> Schedule Exam
          </Button>
        }
      />

      <Tabs defaultValue="schedule">
        <TabsList>
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
          <TabsTrigger value="hall-ticket">Hall Ticket</TabsTrigger>
          <TabsTrigger value="seating">Seating Plan</TabsTrigger>
          <TabsTrigger value="results">Results</TabsTrigger>
        </TabsList>

        <TabsContent value="schedule">
          <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Course</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Session</TableHead>
                  <TableHead>Hall</TableHead>
                  <TableHead>Invigilator</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {EXAM_SCHEDULE.map((e) => (
                  <TableRow key={e.id}>
                    <TableCell className="font-medium">{e.course}</TableCell>
                    <TableCell>{e.date}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{e.session === "FN" ? "Forenoon" : "Afternoon"}</Badge>
                    </TableCell>
                    <TableCell>{e.hall}</TableCell>
                    <TableCell className="text-muted-foreground">{e.invigilator}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="hall-ticket">
          <div className="max-w-2xl mx-auto rounded-xl border-2 border-primary/30 bg-card p-8 shadow-lg">
            <div className="flex items-start justify-between border-b pb-4">
              <div>
                <div className="text-xs uppercase tracking-wider text-muted-foreground">
                  KCG · Examinations Cell
                </div>
                <h2 className="font-display text-2xl font-semibold mt-1">Hall Ticket</h2>
                <div className="text-sm text-muted-foreground mt-1">
                  Mid-Semester Examination · June 2026
                </div>
              </div>
              <div className="grid h-16 w-16 place-items-center rounded-md bg-foreground text-background">
                <QrCode className="h-10 w-10" />
              </div>
            </div>
            <div className="grid md:grid-cols-[120px_1fr] gap-4 mt-5">
              <div className="aspect-square rounded-md bg-muted grid place-items-center text-muted-foreground">
                Photo
              </div>
              <dl className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
                <Field label="Name" value="Ananya Iyer" />
                <Field label="Enrolment" value="KCGU/22/CSE/0184" />
                <Field label="Program" value="B.Tech CSE · Sem 6" />
                <Field label="Hall" value="A-201" />
                <Field label="Seat No." value="S-14" />
                <Field label="Date" value="28 Jun 2026" />
              </dl>
            </div>
            <div className="mt-6 rounded-lg bg-muted/40 p-4 text-xs text-muted-foreground">
              Carry a valid ID along with this hall ticket. Report 30 minutes prior to the session.
              Mobile phones, smart watches, and other electronic devices are prohibited.
            </div>
            <div className="mt-4 flex justify-end">
              <Button variant="outline">
                <Printer className="h-4 w-4 mr-2" /> Print
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="seating">
          <div className="rounded-xl border bg-card p-6 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="font-semibold">Hall A-201 · 28 Jun · Forenoon</h3>
                <p className="text-xs text-muted-foreground">36 seats · 34 allocated</p>
              </div>
              <div className="text-xs text-muted-foreground">Click a seat to view candidate</div>
            </div>
            <div className="grid grid-cols-6 gap-2 max-w-lg mx-auto">
              {seats.map((s, i) => {
                const empty = i === 12 || i === 28;
                return (
                  <button
                    key={s}
                    onClick={() => setSeat(s)}
                    className={cn(
                      "aspect-square rounded-md text-xs font-mono transition border",
                      empty
                        ? "bg-muted text-muted-foreground border-dashed"
                        : "bg-primary/10 text-primary border-primary/20 hover:bg-primary/20",
                      seat === s && "ring-2 ring-primary",
                    )}
                  >
                    {s}
                  </button>
                );
              })}
            </div>
            {seat && (
              <div className="mt-5 rounded-lg border p-4 max-w-md mx-auto text-sm">
                <div className="text-xs text-muted-foreground">Seat {seat}</div>
                <div className="font-medium mt-1">Ananya Iyer</div>
                <div className="text-xs text-muted-foreground">KCGU/22/CSE/0184 · B.Tech CSE</div>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="results">
          <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
            <div className="p-5 border-b flex items-center justify-between">
              <div>
                <h3 className="font-semibold">CSE301 · Data Structures · Mid-Sem</h3>
                <p className="text-xs text-muted-foreground">Awaiting publish approval</p>
              </div>
              <Button>
                <Award className="h-4 w-4 mr-2" /> Publish Results
              </Button>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Enrolment</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Marks / 100</TableHead>
                  <TableHead>Grade</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {RESULTS.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell className="font-mono text-xs">{r.id}</TableCell>
                    <TableCell className="font-medium">{r.name}</TableCell>
                    <TableCell className="font-semibold">{r.marks}</TableCell>
                    <TableCell>
                      <Badge className="bg-gold/30 text-foreground border-0 font-display">
                        {r.grade}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</dt>
      <dd className="font-medium">{value}</dd>
    </div>
  );
}
