import { createFileRoute } from "@tanstack/react-router";
import { Search, FileText, Check, X } from "lucide-react";
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

export const Route = createFileRoute("/staff/records")({
  head: () => ({ meta: [{ title: "Document Verification · KCG University" }] }),
  component: StaffRecords,
});

const QUEUE = [
  { id: "DOC-2026-0421", student: "Sneha Pillai", type: "Bonafide Certificate", submitted: "22 Jun", status: "Pending" },
  { id: "DOC-2026-0422", student: "Rohan Mehta", type: "Transcript Request", submitted: "22 Jun", status: "Pending" },
  { id: "DOC-2026-0423", student: "Vikram Singh", type: "Migration Certificate", submitted: "21 Jun", status: "In Review" },
  { id: "DOC-2026-0424", student: "Diya Sharma", type: "Provisional Degree", submitted: "21 Jun", status: "In Review" },
  { id: "DOC-2026-0425", student: "Karan Joshi", type: "Hostel No-Dues", submitted: "20 Jun", status: "Issued" },
];

function StaffRecords() {
  return (
    <div className="space-y-6">
      <PageHeader title="Records & Documents" subtitle="Verify and issue official student documents" />

      <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
        <div className="p-4 border-b">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search by document ID, student or type…" className="pl-9" />
          </div>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Document ID</TableHead>
              <TableHead>Student</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Submitted</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {QUEUE.map((q) => (
              <TableRow key={q.id}>
                <TableCell className="font-mono text-xs">{q.id}</TableCell>
                <TableCell className="font-medium">{q.student}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <FileText className="h-3.5 w-3.5 text-muted-foreground" />
                    {q.type}
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">{q.submitted}</TableCell>
                <TableCell>
                  <Badge
                    className={
                      q.status === "Issued"
                        ? "bg-success/15 text-success border-0"
                        : q.status === "In Review"
                          ? "bg-primary/10 text-primary border-0"
                          : "bg-warning/20 text-warning-foreground border-0"
                    }
                  >
                    {q.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button size="sm" variant="outline" className="text-success border-success/40">
                      <Check className="h-3.5 w-3.5 mr-1" /> Approve
                    </Button>
                    <Button size="sm" variant="outline" className="text-destructive border-destructive/40">
                      <X className="h-3.5 w-3.5 mr-1" /> Reject
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
