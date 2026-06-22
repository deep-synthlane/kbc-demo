import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2, XCircle, AlertCircle, Eye } from "lucide-react";
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
import { PageHeader, StatCard } from "@/components/RoleShell";
import { APPLICATIONS } from "@/lib/mockData";

export const Route = createFileRoute("/admin/admissions")({
  head: () => ({ meta: [{ title: "Admissions · KCG University" }] }),
  component: Admissions,
});

function Admissions() {
  const pending = APPLICATIONS.filter((a) => a.status === "Pending Review").length;
  const approved = APPLICATIONS.filter((a) => a.status === "Approved").length;
  const incomplete = APPLICATIONS.filter((a) => a.docs !== "Complete").length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Admissions & Enrollment"
        subtitle="Verify documents, approve applications, communicate decisions"
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Pending Review" value={pending} icon={AlertCircle} tone="warning" />
        <StatCard label="Approved" value={approved} icon={CheckCircle2} tone="success" />
        <StatCard label="Documents Required" value={incomplete} icon={XCircle} tone="destructive" />
      </div>

      {/* Workflow stepper */}
      <div className="rounded-xl border bg-card p-5 shadow-sm">
        <h3 className="font-semibold mb-4">Admission Workflow</h3>
        <ol className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {[
            "Application Received",
            "Document Verification",
            "Eligibility Review",
            "Offer Letter",
            "Enrollment Complete",
          ].map((step, i) => (
            <li
              key={step}
              className="rounded-lg border bg-muted/30 p-3 text-center text-sm relative"
            >
              <div className="font-display text-lg text-primary">{String(i + 1).padStart(2, "0")}</div>
              <div className="text-xs mt-1">{step}</div>
            </li>
          ))}
        </ol>
      </div>

      <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
        <div className="p-5 border-b flex justify-between items-center">
          <h3 className="font-semibold">Application Queue</h3>
          <Badge variant="secondary">{APPLICATIONS.length} active</Badge>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Application ID</TableHead>
              <TableHead>Candidate</TableHead>
              <TableHead>Program</TableHead>
              <TableHead>Documents</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {APPLICATIONS.map((a) => (
              <TableRow key={a.id}>
                <TableCell className="font-mono text-xs">{a.id}</TableCell>
                <TableCell className="font-medium">{a.name}</TableCell>
                <TableCell>{a.program}</TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={
                      a.docs === "Complete"
                        ? "border-success text-success"
                        : "border-destructive text-destructive"
                    }
                  >
                    {a.docs}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    className={
                      a.status === "Approved"
                        ? "bg-success/15 text-success border-0"
                        : a.status === "Rejected"
                          ? "bg-destructive/10 text-destructive border-0"
                          : a.status === "Documents Required"
                            ? "bg-warning/20 text-warning-foreground border-0"
                            : "bg-primary/10 text-primary border-0"
                    }
                  >
                    {a.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex justify-end gap-1">
                    <Button size="sm" variant="ghost">
                      <Eye className="h-3.5 w-3.5" />
                    </Button>
                    <Button size="sm" variant="outline" className="text-success border-success/40">
                      Approve
                    </Button>
                    <Button size="sm" variant="outline">
                      Request
                    </Button>
                    <Button size="sm" variant="outline" className="text-destructive border-destructive/40">
                      Reject
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
