import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useMemo } from "react";
import {
  CheckCircle2, XCircle, AlertCircle, Eye, Download, Search,
  Filter, Clock, FileText, User, BookOpen,
  CreditCard, History, MessageSquare, MoreHorizontal,
  RefreshCw, TriangleAlert, BadgeCheck, UserCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { PageHeader, StatCard } from "@/components/RoleShell";
import {
  initApplicationStore,
  getApplications,
  updateApplicationStatus,
  requestDocuments,
  addRemarks,
  type StoredApplication,
  type FullApplicationStatus,
} from "@/lib/applicationStore";
import { downloadReceipt } from "@/lib/pdfReceipt";
import { ADMISSION_PROGRAMS } from "@/lib/admissions";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/admissions")({
  head: () => ({ meta: [{ title: "Admissions · KCG" }] }),
  component: AdminAdmissions,
});

const STATUS_CONFIG: Record<FullApplicationStatus, { label: string; className: string }> = {
  Draft:               { label: "Draft",              className: "bg-muted text-muted-foreground border-0" },
  Submitted:           { label: "Submitted",          className: "bg-blue-500/10 text-blue-600 border-0" },
  "Payment Completed": { label: "Payment Completed",  className: "bg-cyan-500/10 text-cyan-600 border-0" },
  "Under Review":      { label: "Under Review",       className: "bg-primary/10 text-primary border-0" },
  "Documents Pending": { label: "Documents Pending",  className: "bg-warning/20 text-warning-foreground border-0" },
  Approved:            { label: "Approved",           className: "bg-success/15 text-success border-0" },
  Rejected:            { label: "Rejected",           className: "bg-destructive/10 text-destructive border-0" },
  Enrolled:            { label: "Enrolled",           className: "bg-purple-500/10 text-purple-600 border-0" },
};

const ADMIN_NAME = "Dr. Vikram Acharya";

function StatusBadge({ status }: { status: FullApplicationStatus }) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG["Under Review"];
  return <Badge className={cfg.className}>{cfg.label}</Badge>;
}

function DetailRow({ label, value }: { label: string; value: string | number | null | undefined }) {
  return (
    <div>
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="font-medium mt-0.5 text-sm">{value ?? "—"}</dd>
    </div>
  );
}

// ── Status Change Dialog ──────────────────────────────────────────────────
interface StatusDialogProps {
  app: StoredApplication | null;
  onClose: () => void;
  onDone: (updated: StoredApplication) => void;
}
function StatusDialog({ app, onClose, onDone }: StatusDialogProps) {
  const [newStatus, setNewStatus] = useState<FullApplicationStatus>("Under Review");
  const [note, setNote] = useState("");

  useEffect(() => {
    if (app) { setNewStatus(app.status); setNote(""); }
  }, [app]);

  function confirm() {
    if (!app) return;
    const updated = updateApplicationStatus(app.id, newStatus, ADMIN_NAME, note || undefined);
    if (updated) {
      toast(`Status updated to "${newStatus}"`);
      onDone(updated);
    } else {
      toast.error("Failed to update status");
    }
  }

  return (
    <Dialog open={!!app} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Change Application Status</DialogTitle>
        </DialogHeader>
        {app && (
          <div className="space-y-4">
            <div className="rounded-lg bg-muted/40 p-3 text-sm">
              <p className="font-medium">{app.name}</p>
              <p className="text-muted-foreground">{app.id} · {app.program}</p>
            </div>
            <div className="space-y-1.5">
              <Label>Current Status</Label>
              <div><StatusBadge status={app.status} /></div>
            </div>
            <div className="space-y-1.5">
              <Label>New Status *</Label>
              <Select value={newStatus} onValueChange={(v) => setNewStatus(v as FullApplicationStatus)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {(Object.keys(STATUS_CONFIG) as FullApplicationStatus[]).map((s) => (
                    <SelectItem key={s} value={s}>{STATUS_CONFIG[s].label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Remarks / Notes (optional)</Label>
              <Textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Add internal remarks or reason for status change…"
                rows={3}
              />
            </div>
          </div>
        )}
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={confirm} disabled={!app || newStatus === app?.status}>
            Update Status
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ── Request Documents Dialog ──────────────────────────────────────────────
interface DocRequestDialogProps {
  app: StoredApplication | null;
  onClose: () => void;
  onDone: (updated: StoredApplication) => void;
}
function DocRequestDialog({ app, onClose, onDone }: DocRequestDialogProps) {
  const [note, setNote] = useState("");
  function confirm() {
    if (!app || !note.trim()) return;
    const updated = requestDocuments(app.id, ADMIN_NAME, note.trim());
    if (updated) { toast(`Document request sent to ${app.name}`); onDone(updated); }
    else toast.error("Failed");
  }
  return (
    <Dialog open={!!app} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader><DialogTitle>Request Additional Documents</DialogTitle></DialogHeader>
        {app && (
          <div className="space-y-4">
            <div className="rounded-lg bg-muted/40 p-3 text-sm">
              <p className="font-medium">{app.name} · {app.id}</p>
            </div>
            <div className="space-y-1.5">
              <Label>Specify required documents *</Label>
              <Textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="e.g. Please upload a clear copy of your Aadhaar card and latest passport photograph."
                rows={4}
              />
            </div>
          </div>
        )}
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={confirm} disabled={!note.trim()}>Send Request</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ── Application Detail Modal ──────────────────────────────────────────────
interface DetailModalProps {
  app: StoredApplication | null;
  onClose: () => void;
  onStatusChange: (a: StoredApplication) => void;
}
function DetailModal({ app, onClose, onStatusChange }: DetailModalProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const [remark, setRemark] = useState("");
  const [savingRemark, setSavingRemark] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);

  useEffect(() => {
    if (app) { setRemark(app.remarks ?? ""); }
  }, [app?.id]);

  function saveRemark() {
    if (!app) return;
    setSavingRemark(true);
    const updated = addRemarks(app.id, remark, ADMIN_NAME);
    setSavingRemark(false);
    if (updated) {
      toast("Remarks saved");
      onStatusChange(updated);
      onClose();
    } else {
      toast.error("Failed to save — refreshing data…");
      initApplicationStore();
      const retried = addRemarks(app.id, remark, ADMIN_NAME);
      if (retried) { toast("Remarks saved"); onStatusChange(retried); onClose(); }
      else toast.error("Could not save remarks. Please reload the page.");
    }
  }

  async function handlePdf() {
    if (!app) return;
    setPdfLoading(true);
    try { await downloadReceipt(app); }
    finally { setPdfLoading(false); }
  }

  return (
    <Dialog open={!!app} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between gap-4 pr-6">
            <div>
              <DialogTitle>{app?.name}</DialogTitle>
              <p className="text-xs text-muted-foreground mt-0.5">{app?.id} · {app?.program}</p>
            </div>
            {app && <StatusBadge status={app.status} />}
          </div>
        </DialogHeader>

        {app && (
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-4 w-full">
              <TabsTrigger value="overview"><User className="h-3.5 w-3.5 mr-1.5" />Overview</TabsTrigger>
              <TabsTrigger value="documents"><FileText className="h-3.5 w-3.5 mr-1.5" />Documents</TabsTrigger>
              <TabsTrigger value="payment"><CreditCard className="h-3.5 w-3.5 mr-1.5" />Payment</TabsTrigger>
              <TabsTrigger value="audit"><History className="h-3.5 w-3.5 mr-1.5" />Audit Log</TabsTrigger>
            </TabsList>

            {/* Overview */}
            <TabsContent value="overview" className="space-y-5 pt-2">
              <div>
                <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                  <User className="h-4 w-4 text-primary" /> Personal Details
                </h4>
                <dl className="grid grid-cols-2 gap-x-6 gap-y-3">
                  <DetailRow label="Full Name" value={app.name} />
                  <DetailRow label="Email" value={app.email} />
                  <DetailRow label="Phone" value={app.phone} />
                  <DetailRow label="Date of Birth" value={app.dateOfBirth} />
                  <DetailRow label="Gender" value={app.gender} />
                  <DetailRow label="Guardian" value={app.guardianName} />
                  <div className="col-span-2"><DetailRow label="Address" value={app.address} /></div>
                </dl>
              </div>
              <div className="border-t pt-4">
                <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-primary" /> Academic Details
                </h4>
                <dl className="grid grid-cols-2 gap-x-6 gap-y-3">
                  <DetailRow label="10th Marks (%)" value={app.tenthMarks} />
                  <DetailRow label="12th Marks (%)" value={app.twelfthMarks} />
                  <div className="col-span-2"><DetailRow label="Previous Institution" value={app.previousInstitution} /></div>
                  <DetailRow label="Entrance Exam Score" value={app.entranceExamScore} />
                  <DetailRow label="Program Applied" value={app.program} />
                </dl>
              </div>
              <div className="border-t pt-4">
                <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-primary" /> Remarks
                </h4>
                <Textarea
                  value={remark}
                  onChange={(e) => setRemark(e.target.value)}
                  placeholder="Add internal admin notes…"
                  rows={3}
                />
                <Button size="sm" className="mt-2" onClick={saveRemark} disabled={savingRemark}>
                  {savingRemark ? "Saving…" : "Save Remarks"}
                </Button>
              </div>
            </TabsContent>

            {/* Documents */}
            <TabsContent value="documents" className="space-y-3 pt-2">
              {app.documents.map((doc) => (
                <div key={doc.name} className="flex items-center justify-between gap-3 rounded-lg border p-3">
                  <div className="min-w-0">
                    <p className="text-sm font-medium">{doc.name}</p>
                    {doc.uploaded && doc.fileName && (
                      <p className="text-xs text-muted-foreground mt-0.5">{doc.fileName}</p>
                    )}
                  </div>
                  <div className="shrink-0">
                    {doc.uploaded ? (
                      <Badge className="bg-success/15 text-success border-0">
                        <CheckCircle2 className="h-3 w-3 mr-1" /> Uploaded
                      </Badge>
                    ) : (
                      <Badge className="bg-destructive/10 text-destructive border-0">
                        <XCircle className="h-3 w-3 mr-1" /> Missing
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </TabsContent>

            {/* Payment */}
            <TabsContent value="payment" className="pt-2">
              <div className="rounded-xl border bg-muted/30 p-5 space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Transaction ID</span>
                  <span className="font-mono font-medium">{app.transactionId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Payment Method</span>
                  <span className="font-medium">{app.paymentMethod}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Amount</span>
                  <span className="font-semibold">₹{app.feeAmount.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Payment Date</span>
                  <span>{new Date(app.paymentDate).toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" })}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status</span>
                  <span className={cn("font-semibold", app.paymentStatus === "Completed" ? "text-green-600" : "text-yellow-600")}>
                    {app.paymentStatus}
                  </span>
                </div>
              </div>
              <Button variant="outline" className="mt-4 w-full gap-2" onClick={handlePdf} disabled={pdfLoading}>
                <Download className="h-4 w-4" />
                {pdfLoading ? "Generating…" : "Download Payment Receipt (PDF)"}
              </Button>
            </TabsContent>

            {/* Audit Log */}
            <TabsContent value="audit" className="pt-2">
              <div className="space-y-3">
                {app.auditLog.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-6">No audit entries yet.</p>
                )}
                {[...app.auditLog].reverse().map((entry) => (
                  <div key={entry.id} className="flex gap-3 rounded-lg border p-3">
                    <div className={cn("mt-0.5 h-6 w-6 shrink-0 grid place-items-center rounded-full text-white text-[10px]", entry.role === "admin" ? "bg-primary" : "bg-muted text-muted-foreground")}>
                      {entry.role === "admin" ? "A" : "S"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-medium">{entry.action}</p>
                        <span className="text-xs text-muted-foreground shrink-0">
                          {new Date(entry.at).toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">by {entry.by}</p>
                      {entry.note && <p className="text-xs mt-1 bg-muted/40 rounded px-2 py-1">{entry.note}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        )}
      </DialogContent>
    </Dialog>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────
function AdminAdmissions() {
  const [apps, setApps] = useState<StoredApplication[]>([]);
  const [search, setSearch] = useState("");
  const [programFilter, setProgramFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [viewApp, setViewApp] = useState<StoredApplication | null>(null);
  const [statusChangeApp, setStatusChangeApp] = useState<StoredApplication | null>(null);
  const [docRequestApp, setDocRequestApp] = useState<StoredApplication | null>(null);

  function load() {
    initApplicationStore();
    setApps(getApplications());
  }

  useEffect(() => { load(); }, []);

  function refresh(updated: StoredApplication) {
    setApps((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
    setViewApp((prev) => (prev?.id === updated.id ? updated : prev));
    setStatusChangeApp(null);
    setDocRequestApp(null);
  }

  function quickStatus(appId: string, status: FullApplicationStatus) {
    const updated = updateApplicationStatus(appId, status, ADMIN_NAME);
    if (updated) { toast(`${appId} → ${status}`); refresh(updated); }
    else toast.error("Update failed");
  }

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return apps.filter((a) => {
      if (q && !a.name.toLowerCase().includes(q) && !a.id.toLowerCase().includes(q) && !a.email.toLowerCase().includes(q)) return false;
      if (programFilter !== "all" && a.program !== programFilter) return false;
      if (statusFilter !== "all" && a.status !== statusFilter) return false;
      return true;
    });
  }, [apps, search, programFilter, statusFilter]);

  const counts = useMemo(() => ({
    total: apps.length,
    underReview: apps.filter((a) => a.status === "Under Review").length,
    paymentDone: apps.filter((a) => a.status === "Payment Completed" || a.status === "Submitted").length,
    docsPending: apps.filter((a) => a.status === "Documents Pending").length,
    approved: apps.filter((a) => a.status === "Approved").length,
    rejected: apps.filter((a) => a.status === "Rejected").length,
  }), [apps]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Admissions Management"
        subtitle="Review applications, manage statuses, track enrollment pipeline"
        actions={
          <Button variant="outline" size="sm" onClick={load}>
            <RefreshCw className="h-4 w-4 mr-2" /> Refresh
          </Button>
        }
      />

      {/* Stats */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-6">
        <StatCard label="Total Applications" value={counts.total} icon={FileText} />
        <StatCard label="Payment Received" value={counts.paymentDone} icon={CreditCard} tone="default" />
        <StatCard label="Under Review" value={counts.underReview} icon={AlertCircle} tone="warning" />
        <StatCard label="Docs Pending" value={counts.docsPending} icon={TriangleAlert} tone="warning" />
        <StatCard label="Approved" value={counts.approved} icon={BadgeCheck} tone="success" />
        <StatCard label="Rejected" value={counts.rejected} icon={XCircle} tone="destructive" />
      </div>

      {/* Filters */}
      <div className="rounded-xl border bg-card p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, application ID or email…"
            className="pl-9"
          />
        </div>
        <Select value={programFilter} onValueChange={setProgramFilter}>
          <SelectTrigger className="w-45">
            <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
            <SelectValue placeholder="All programs" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Programs</SelectItem>
            {ADMISSION_PROGRAMS.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-45">
            <SelectValue placeholder="All statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            {(Object.keys(STATUS_CONFIG) as FullApplicationStatus[]).map((s) => (
              <SelectItem key={s} value={s}>{STATUS_CONFIG[s].label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
        <div className="p-4 border-b flex items-center justify-between">
          <h3 className="font-semibold">Application Queue</h3>
          <Badge variant="secondary">{filtered.length} of {apps.length}</Badge>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>App ID</TableHead>
                <TableHead>Candidate</TableHead>
                <TableHead>Program</TableHead>
                <TableHead>Documents</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="text-center text-muted-foreground py-12">
                    No applications match your filters.
                  </TableCell>
                </TableRow>
              )}
              {filtered.map((a) => {
                const docsComplete = a.documents.every((d) => d.uploaded);
                return (
                  <TableRow key={a.id}>
                    <TableCell className="font-mono text-xs">{a.id}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium text-sm">{a.name}</p>
                        <p className="text-xs text-muted-foreground">{a.email}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">{a.program}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={docsComplete ? "border-success text-success" : "border-destructive text-destructive"}>
                        {docsComplete ? "Complete" : "Incomplete"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className={cn("text-xs font-medium", a.paymentStatus === "Completed" ? "text-green-600" : "text-yellow-600")}>
                        {a.paymentStatus}
                      </span>
                    </TableCell>
                    <TableCell><StatusBadge status={a.status} /></TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {new Date(a.submittedAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end items-center gap-1">
                        <Button size="sm" variant="ghost" onClick={() => setViewApp(a)} title="View details">
                          <Eye className="h-3.5 w-3.5" />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button size="sm" variant="ghost">
                              <MoreHorizontal className="h-3.5 w-3.5" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem onClick={() => setStatusChangeApp(a)}>
                              <RefreshCw className="h-3.5 w-3.5 mr-2" /> Change Status
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => quickStatus(a.id, "Under Review")}>
                              <Clock className="h-3.5 w-3.5 mr-2" /> Start Review
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => quickStatus(a.id, "Approved")} className="text-green-600">
                              <CheckCircle2 className="h-3.5 w-3.5 mr-2" /> Approve
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setDocRequestApp(a)}>
                              <FileText className="h-3.5 w-3.5 mr-2" /> Request Documents
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => quickStatus(a.id, "Enrolled")} className="text-purple-600">
                              <UserCheck className="h-3.5 w-3.5 mr-2" /> Mark as Enrolled
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => quickStatus(a.id, "Rejected")} className="text-destructive">
                              <XCircle className="h-3.5 w-3.5 mr-2" /> Reject
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Dialogs */}
      <DetailModal app={viewApp} onClose={() => setViewApp(null)} onStatusChange={refresh} />
      <StatusDialog app={statusChangeApp} onClose={() => setStatusChangeApp(null)} onDone={refresh} />
      <DocRequestDialog app={docRequestApp} onClose={() => setDocRequestApp(null)} onDone={refresh} />
    </div>
  );
}
