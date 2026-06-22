import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Search, Eye, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PageHeader } from "@/components/RoleShell";
import { STUDENTS_DIRECTORY } from "@/lib/mockData";
import { toast } from "sonner";

export const Route = createFileRoute("/staff/students")({
  head: () => ({ meta: [{ title: "Student Records · Staff · KCG" }] }),
  component: StaffStudents,
});

function StaffStudents() {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<(typeof STUDENTS_DIRECTORY)[number] | null>(null);

  const filtered = STUDENTS_DIRECTORY.filter(
    (s) =>
      s.name.toLowerCase().includes(query.toLowerCase()) ||
      s.id.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <PageHeader title="Student Records" subtitle="Search, view and issue certificates for students" />

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by name or enrollment ID…"
          className="pl-9"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Enrollment ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Semester</TableHead>
              <TableHead>CGPA</TableHead>
              <TableHead>Attendance</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((s) => (
              <TableRow key={s.id}>
                <TableCell className="font-mono text-xs">{s.id}</TableCell>
                <TableCell className="font-medium">{s.name}</TableCell>
                <TableCell>{s.dept}</TableCell>
                <TableCell>{s.sem}</TableCell>
                <TableCell className="font-semibold">{s.cgpa}</TableCell>
                <TableCell>
                  <Badge
                    className={
                      s.attendance >= 85
                        ? "bg-success/15 text-success border-0"
                        : s.attendance >= 75
                          ? "bg-warning/20 text-warning-foreground border-0"
                          : "bg-destructive/10 text-destructive border-0"
                    }
                  >
                    {s.attendance}%
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex justify-end gap-1">
                    <Button size="sm" variant="ghost" onClick={() => setSelected(s)}>
                      <Eye className="h-3.5 w-3.5 mr-1" /> View
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => toast(`Certificate request queued for ${s.name}`)}
                    >
                      <FileText className="h-3.5 w-3.5 mr-1" /> Issue Certificate
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                  No students match your search.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!selected} onOpenChange={(v) => !v && setSelected(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Student Profile</DialogTitle>
          </DialogHeader>
          {selected && (
            <dl className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
              <Field label="Name" value={selected.name} />
              <Field label="Enrollment ID" value={selected.id} />
              <Field label="Department" value={selected.dept} />
              <Field label="Semester" value={String(selected.sem)} />
              <Field label="CGPA" value={String(selected.cgpa)} />
              <Field label="Attendance" value={`${selected.attendance}%`} />
              <Field label="Mentor" value="Dr. Priya Ramanathan" />
            </dl>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="font-medium mt-0.5">{value}</dd>
    </div>
  );
}
