import { createFileRoute } from "@tanstack/react-router";
import { Search, Download, Eye } from "lucide-react";
import { Input } from "@/components/ui/input";
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
import { STUDENTS_DIRECTORY } from "@/lib/mockData";

export const Route = createFileRoute("/admin/students")({
  head: () => ({ meta: [{ title: "Students Directory · KCG University" }] }),
  component: AdminStudents,
});

function AdminStudents() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Student Information System"
        subtitle="Search and inspect every student record across the university"
        actions={
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" /> Export CSV
          </Button>
        }
      />

      <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
        <div className="p-4 border-b flex flex-col sm:flex-row gap-3 items-center">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search by name, enrolment ID or department…" className="pl-9" />
          </div>
          <div className="flex gap-2 text-xs">
            <Button size="sm" variant="outline">
              All
            </Button>
            <Button size="sm" variant="ghost">
              CSE
            </Button>
            <Button size="sm" variant="ghost">
              ECE
            </Button>
            <Button size="sm" variant="ghost">
              MBA
            </Button>
          </div>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Enrolment ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Semester</TableHead>
              <TableHead>CGPA</TableHead>
              <TableHead>Attendance</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {STUDENTS_DIRECTORY.map((s) => (
              <TableRow key={s.id}>
                <TableCell className="font-mono text-xs">{s.id}</TableCell>
                <TableCell className="font-medium">{s.name}</TableCell>
                <TableCell>{s.dept}</TableCell>
                <TableCell>Sem {s.sem}</TableCell>
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
                <TableCell className="text-right">
                  <Button size="sm" variant="ghost">
                    <Eye className="h-3.5 w-3.5 mr-1.5" /> View
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
