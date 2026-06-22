import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  CheckCircle2,
  XCircle,
  AlertCircle,
  Eye,
  Trophy,
  Download,
  FileText,
  Image,
} from "lucide-react";
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PageHeader, StatCard } from "@/components/RoleShell";
import { APPLICATIONS } from "@/lib/mockData";
import type { AdmissionApplication, ApplicationDocument } from "@/lib/admissions";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/admissions")({
  head: () => ({ meta: [{ title: "Admissions · KCG" }] }),
  component: Admissions,
});

function DetailField({ label, value }: { label: string; value: string | number | null }) {
  return (
    <div>
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="font-medium mt-0.5">{value ?? "—"}</dd>
    </div>
  );
}

function Admissions() {
  const [viewApp, setViewApp] = useState<AdmissionApplication | null>(null);
  const [viewDoc, setViewDoc] = useState<ApplicationDocument | null>(null);

  const pending = APPLICATIONS.filter((a) => a.status === "Pending Review").length;
  const approved = APPLICATIONS.filter((a) => a.status === "Approved").length;
  const incomplete = APPLICATIONS.filter((a) => a.docs !== "Complete").length;

  const meritList = APPLICATIONS
    .filter((a) => a.status === "Approved" && a.meritScore !== null)
    .sort((a, b) => (b.meritScore ?? 0) - (a.meritScore ?? 0));

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
                    <Button size="sm" variant="ghost" onClick={() => setViewApp(a)}>
                      <Eye className="h-3.5 w-3.5" />
                    </Button>
                    <Button size="sm" variant="outline" className="text-success border-success/40">
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => toast(`Document request sent to ${a.name}`)}
                    >
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

      {/* Merit list */}
      <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
        <div className="p-5 border-b flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Trophy className="h-4 w-4 text-gold" />
            <h3 className="font-semibold">Merit List</h3>
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => toast("PDF export started")}
            >
              <Download className="h-3.5 w-3.5 mr-1.5" /> Export PDF
            </Button>
            <Button
              size="sm"
              onClick={() => toast(`Merit list generated for ${meritList.length} candidates`)}
            >
              Generate Merit List
            </Button>
          </div>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Rank</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Program</TableHead>
              <TableHead>Merit Score</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {meritList.map((a, i) => (
              <TableRow key={a.id}>
                <TableCell>
                  <Badge variant="outline" className="font-mono">{i + 1}</Badge>
                </TableCell>
                <TableCell className="font-medium">{a.name}</TableCell>
                <TableCell>{a.program}</TableCell>
                <TableCell className="font-semibold">{a.meritScore}</TableCell>
                <TableCell>
                  <Badge className="bg-success/15 text-success border-0">Approved</Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* View application dialog */}
      <Dialog open={!!viewApp} onOpenChange={(v) => !v && setViewApp(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Application Details</DialogTitle>
          </DialogHeader>
          {viewApp && (
            <div className="space-y-6">
              <dl className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
                <DetailField label="Application ID" value={viewApp.id} />
                <DetailField label="Status" value={viewApp.status} />
                <DetailField label="Payment" value={viewApp.paymentStatus} />
                <DetailField label="Program Applied For" value={viewApp.program} />
              </dl>

              <div>
                <h4 className="text-sm font-semibold mb-3">Personal Details</h4>
                <dl className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
                  <DetailField label="Full Name" value={viewApp.name} />
                  <DetailField label="Email" value={viewApp.email} />
                  <DetailField label="Phone Number" value={viewApp.phone} />
                  <DetailField label="Date of Birth" value={viewApp.dateOfBirth} />
                  <DetailField label="Gender" value={viewApp.gender} />
                  <DetailField label="Father's / Guardian's Name" value={viewApp.guardianName} />
                  <div className="col-span-2">
                    <DetailField label="Address" value={viewApp.address} />
                  </div>
                </dl>
              </div>

              <div>
                <h4 className="text-sm font-semibold mb-3">Academic Details</h4>
                <dl className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
                  <DetailField label="10th Marks (%)" value={viewApp.tenthMarks} />
                  <DetailField label="12th Marks (%)" value={viewApp.twelfthMarks} />
                  <DetailField label="Previous Institution" value={viewApp.previousInstitution} />
                  <DetailField
                    label="Entrance Exam Score"
                    value={viewApp.entranceExamScore}
                  />
                </dl>
              </div>

              <div>
                <h4 className="text-sm font-semibold mb-2">Documents</h4>
                <div className="space-y-2">
                  {viewApp.documents.map((doc) => (
                    <div
                      key={doc.name}
                      className="flex items-center justify-between gap-3 rounded-lg border p-3"
                    >
                      <div className="min-w-0">
                        <span className="text-sm font-medium">{doc.name}</span>
                        {doc.uploaded && doc.fileName && (
                          <p className="text-xs text-muted-foreground truncate mt-0.5">
                            {doc.fileName} · {doc.fileSize}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {doc.uploaded ? (
                          <>
                            <Badge className="bg-success/15 text-success border-0">
                              <CheckCircle2 className="h-3 w-3 mr-1" /> Uploaded
                            </Badge>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setViewDoc(doc)}
                            >
                              <Eye className="h-3.5 w-3.5 mr-1.5" /> View
                            </Button>
                          </>
                        ) : (
                          <Badge className="bg-destructive/10 text-destructive border-0">
                            <XCircle className="h-3 w-3 mr-1" /> Missing
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Document preview dialog */}
      <Dialog open={!!viewDoc} onOpenChange={(v) => !v && setViewDoc(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{viewDoc?.name}</DialogTitle>
          </DialogHeader>
          {viewDoc?.uploaded && (
            <div className="space-y-4">
              <div className="rounded-lg border bg-muted/30 p-4 text-sm space-y-2">
                <div className="flex justify-between gap-4">
                  <span className="text-muted-foreground">File name</span>
                  <span className="font-mono text-xs text-right">{viewDoc.fileName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Size</span>
                  <span>{viewDoc.fileSize}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Uploaded on</span>
                  <span>{viewDoc.uploadedAt}</span>
                </div>
              </div>

              <div className="rounded-lg border-2 border-dashed border-muted-foreground/25 bg-muted/20 aspect-[4/3] flex flex-col items-center justify-center gap-3 p-6 text-center">
                {viewDoc.name === "Passport Photo" ? (
                  <>
                    <div className="h-32 w-28 rounded-lg bg-gradient-to-b from-muted to-muted-foreground/20 border flex items-center justify-center">
                      <Image className="h-10 w-10 text-muted-foreground/50" />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Passport-size photograph preview
                    </p>
                  </>
                ) : (
                  <>
                    <FileText className="h-12 w-12 text-muted-foreground/50" />
                    <p className="text-sm font-medium">{viewDoc.fileName}</p>
                    <p className="text-xs text-muted-foreground max-w-xs">
                      PDF document preview — demo placeholder for scanned{" "}
                      {viewDoc.name.toLowerCase()}.
                    </p>
                  </>
                )}
              </div>

              <Button
                variant="outline"
                className="w-full"
                onClick={() => toast(`Downloading ${viewDoc.fileName}`)}
              >
                <Download className="h-4 w-4 mr-2" /> Download
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
