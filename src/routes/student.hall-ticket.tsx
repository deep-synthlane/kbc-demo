import { createFileRoute } from "@tanstack/react-router";
import { Printer, Download } from "lucide-react";
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
import { PageHeader } from "@/components/RoleShell";
import { STUDENT_PROFILE, UPCOMING_EXAMS, UNIVERSITY } from "@/lib/mockData";
import { toast } from "sonner";

export const Route = createFileRoute("/student/hall-ticket")({
  head: () => ({ meta: [{ title: "Hall Ticket · KCG" }] }),
  component: HallTicket,
});

const SEAT_MAP: Record<string, string> = {
  e1: "S-14",
  e2: "S-22",
  e3: "S-08",
  e4: "S-31",
};

function HallTicket() {
  const p = STUDENT_PROFILE;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Hall Ticket"
        subtitle="Download or print your examination hall ticket"
        actions={
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => toast("PDF download started")}>
              <Download className="h-4 w-4 mr-2" /> Download PDF
            </Button>
            <Button onClick={() => window.print()}>
              <Printer className="h-4 w-4 mr-2" /> Print Hall Ticket
            </Button>
          </div>
        }
      />

      <div className="rounded-xl border bg-card shadow-sm overflow-hidden print:shadow-none print:border-2 print:border-black">
        <div className="bg-gradient-to-r from-primary to-primary/80 p-6 text-primary-foreground text-center">
          <div className="flex items-center justify-center gap-3 mb-2">
            <img src={UNIVERSITY.logo} alt="" className="h-10 w-10 rounded-full object-cover object-left bg-white/20" />
            <h2 className="font-display text-xl font-semibold">{UNIVERSITY.name}</h2>
          </div>
          <p className="text-sm opacity-90">Mid-Semester Examination — June 2026</p>
        </div>

        <div className="p-6">
          <div className="flex gap-6 mb-6">
            <div className="h-28 w-24 rounded-lg border-2 border-dashed border-muted-foreground/30 grid place-items-center text-xs text-muted-foreground shrink-0">
              Photo
            </div>
            <div className="flex-1">
              <dl className="grid sm:grid-cols-2 gap-x-8 gap-y-2 text-sm">
                <Field label="Student Name" value={p.name} />
                <Field label="Enrolment No." value={p.enrollment} />
                <Field label="Department" value={p.department} />
                <Field label="Semester" value={p.semester} />
                <Field label="Batch" value={p.batch} />
                <Field label="Email" value={p.email} />
              </dl>
            </div>
            <div className="h-24 w-24 rounded-lg border-2 border-dashed border-muted-foreground/30 grid place-items-center text-xs text-muted-foreground shrink-0">
              QR
            </div>
          </div>

          <div className="rounded-lg border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Course</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Hall</TableHead>
                  <TableHead>Seat</TableHead>
                  <TableHead>Type</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {UPCOMING_EXAMS.map((e) => (
                  <TableRow key={e.id}>
                    <TableCell className="font-medium">{e.date}</TableCell>
                    <TableCell>{e.course}</TableCell>
                    <TableCell>{e.time}</TableCell>
                    <TableCell>{e.room}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{SEAT_MAP[e.id] ?? "S-01"}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-primary/10 text-primary border-0">{e.type}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="mt-6 rounded-lg bg-muted/50 p-4">
            <h4 className="font-semibold text-sm mb-2">Instructions</h4>
            <ul className="text-xs text-muted-foreground space-y-1 list-disc ml-4">
              <li>Carry this hall ticket and a valid university ID to every examination.</li>
              <li>Arrive at least 15 minutes before the scheduled time.</li>
              <li>Electronic devices (phones, smartwatches) are strictly prohibited inside the hall.</li>
              <li>Late entry beyond 30 minutes after the start will not be permitted.</li>
              <li>Any form of malpractice will result in immediate disqualification.</li>
            </ul>
          </div>

          <div className="mt-6 grid grid-cols-2 text-xs text-muted-foreground">
            <div>
              <div className="font-medium text-foreground">Controller of Examinations</div>
              <div>{UNIVERSITY.name}</div>
            </div>
            <div className="text-right">
              <div className="font-medium text-foreground">Date of Issue</div>
              <div>22 Jun 2026</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="font-medium">{value}</dd>
    </div>
  );
}
