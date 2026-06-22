import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  Download, CheckCircle2, Clock, FileText, ChevronRight,
  Bell, BellOff, ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { PageHeader } from "@/components/RoleShell";
import {
  initApplicationStore,
  getApplicationsByEmail,
  getStudentNotifications,
  markAllReadForEmail,
  type StoredApplication,
  type AppNotification,
  type FullApplicationStatus,
} from "@/lib/applicationStore";
import { downloadReceipt } from "@/lib/pdfReceipt";
import { getSession } from "@/lib/session";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const Route = createFileRoute("/student/applications")({
  head: () => ({ meta: [{ title: "My Applications · KCG" }] }),
  component: StudentApplications,
});

const STATUS_STEPS: FullApplicationStatus[] = [
  "Submitted",
  "Payment Completed",
  "Under Review",
  "Approved",
  "Enrolled",
];

const STATUS_META: Record<FullApplicationStatus, { label: string; color: string; bg: string }> = {
  Draft:               { label: "Draft",              color: "text-muted-foreground", bg: "bg-muted" },
  Submitted:           { label: "Submitted",          color: "text-blue-600", bg: "bg-blue-100 dark:bg-blue-900/30" },
  "Payment Completed": { label: "Payment Completed",  color: "text-cyan-600", bg: "bg-cyan-100 dark:bg-cyan-900/30" },
  "Under Review":      { label: "Under Review",       color: "text-primary", bg: "bg-primary/10" },
  "Documents Pending": { label: "Documents Pending",  color: "text-yellow-600", bg: "bg-yellow-100 dark:bg-yellow-900/30" },
  Approved:            { label: "Approved",           color: "text-green-600", bg: "bg-green-100 dark:bg-green-900/30" },
  Rejected:            { label: "Rejected",           color: "text-destructive", bg: "bg-destructive/10" },
  Enrolled:            { label: "Enrolled",           color: "text-purple-600", bg: "bg-purple-100 dark:bg-purple-900/30" },
};

function StatusPill({ status }: { status: FullApplicationStatus }) {
  const m = STATUS_META[status];
  return (
    <span className={cn("text-xs font-semibold px-2.5 py-1 rounded-full", m.bg, m.color)}>
      {m.label}
    </span>
  );
}

function ProgressTracker({ status }: { status: FullApplicationStatus }) {
  const isRejected = status === "Rejected";
  const isDocsPending = status === "Documents Pending";
  const currentIdx = STATUS_STEPS.indexOf(status);

  if (isRejected) {
    return (
      <div className="flex items-center gap-2 text-destructive text-sm font-medium">
        <div className="h-6 w-6 rounded-full bg-destructive grid place-items-center">
          <span className="text-white text-xs">✕</span>
        </div>
        Application Rejected
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1 overflow-x-auto pb-1">
      {STATUS_STEPS.map((step, i) => {
        const done = currentIdx > i;
        const active = currentIdx === i || (isDocsPending && i === 2);
        return (
          <div key={step} className="flex items-center gap-1 shrink-0">
            <div className={cn(
              "flex items-center gap-1.5 text-xs px-2 py-1 rounded-full font-medium",
              done ? "bg-green-500 text-white" :
              active ? "bg-primary text-primary-foreground" :
              "bg-muted text-muted-foreground",
            )}>
              {done ? <CheckCircle2 className="h-3 w-3" /> : <span>{i + 1}</span>}
              {step}
              {isDocsPending && step === "Under Review" && active && (
                <span className="ml-1 text-yellow-200">⚠</span>
              )}
            </div>
            {i < STATUS_STEPS.length - 1 && (
              <ChevronRight className={cn("h-3 w-3 shrink-0", done ? "text-green-500" : "text-muted-foreground/40")} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── Application Card ──────────────────────────────────────────────────────
function ApplicationCard({ app }: { app: StoredApplication }) {
  const [pdfLoading, setPdfLoading] = useState(false);
  const [showDetail, setShowDetail] = useState(false);

  async function handleDownload() {
    setPdfLoading(true);
    try { await downloadReceipt(app); }
    catch { toast.error("Failed to generate PDF"); }
    finally { setPdfLoading(false); }
  }

  const appDate = new Date(app.submittedAt).toLocaleDateString("en-IN", {
    day: "2-digit", month: "long", year: "numeric",
  });

  return (
    <>
      <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 p-5 border-b">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono text-sm font-bold text-primary">{app.id}</span>
              <StatusPill status={app.status} />
              {app.isDemo && <Badge variant="outline" className="text-xs">Demo</Badge>}
            </div>
            <p className="text-sm font-medium mt-1">{app.program}</p>
            <p className="text-xs text-muted-foreground">Applied on {appDate}</p>
          </div>
          <div className="flex gap-2 shrink-0">
            <Button size="sm" variant="ghost" onClick={() => setShowDetail(true)}>
              <FileText className="h-3.5 w-3.5 mr-1.5" /> Details
            </Button>
            <Button size="sm" variant="outline" onClick={handleDownload} disabled={pdfLoading}>
              <Download className="h-3.5 w-3.5 mr-1.5" />
              {pdfLoading ? "…" : "Receipt"}
            </Button>
          </div>
        </div>

        {/* Progress */}
        <div className="px-5 py-4 bg-muted/20">
          <p className="text-xs text-muted-foreground mb-2 font-medium uppercase tracking-wide">Application Progress</p>
          <ProgressTracker status={app.status} />
        </div>

        {/* Remarks */}
        {app.remarks && (
          <div className="px-5 py-3 border-t bg-yellow-50 dark:bg-yellow-900/10 text-xs text-yellow-700 dark:text-yellow-400 flex items-start gap-2">
            <span className="font-semibold shrink-0">Admin Note:</span>
            <span>{app.remarks}</span>
          </div>
        )}

        {/* Footer meta */}
        <div className="px-5 py-3 border-t flex gap-4 text-xs text-muted-foreground">
          <span>Txn: <span className="font-mono">{app.transactionId}</span></span>
          <span>·</span>
          <span>₹{app.feeAmount.toLocaleString("en-IN")} {app.paymentStatus === "Completed" ? "✓" : "pending"}</span>
        </div>
      </div>

      {/* Detail dialog */}
      <Dialog open={showDetail} onOpenChange={setShowDetail}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{app.id} — Application Details</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 text-sm">
            <div className="grid grid-cols-2 gap-x-4 gap-y-3">
              {[
                ["Status", <StatusPill key="s" status={app.status} />],
                ["Program", app.program],
                ["Email", app.email],
                ["Phone", app.phone],
                ["10th Marks", `${app.tenthMarks}%`],
                ["12th Marks", `${app.twelfthMarks}%`],
                ["Entrance Score", app.entranceExamScore ?? "—"],
                ["Payment", `₹${app.feeAmount.toLocaleString("en-IN")} (${app.paymentStatus})`],
                ["Transaction ID", <span key="t" className="font-mono">{app.transactionId}</span>],
                ["Submitted", new Date(app.submittedAt).toLocaleDateString("en-IN")],
              ].map(([label, value]) => (
                <div key={String(label)}>
                  <dt className="text-xs text-muted-foreground">{label}</dt>
                  <dd className="font-medium mt-0.5">{value}</dd>
                </div>
              ))}
            </div>
            {app.remarks && (
              <div className="rounded-lg bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-800 p-3">
                <p className="text-xs font-semibold text-yellow-700 dark:text-yellow-400 mb-1">Admin Remarks</p>
                <p className="text-yellow-700 dark:text-yellow-300">{app.remarks}</p>
              </div>
            )}
            <Button className="w-full gap-2" onClick={handleDownload} disabled={pdfLoading}>
              <Download className="h-4 w-4" />
              {pdfLoading ? "Generating PDF…" : "Download Payment Receipt"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

// ── Notifications Panel ───────────────────────────────────────────────────
function NotificationsPanel({ email }: { email: string }) {
  const [notifs, setNotifs] = useState<AppNotification[]>([]);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    setNotifs(getStudentNotifications(email));
  }, [email]);

  const unread = notifs.filter((n) => !n.read).length;

  function markAll() {
    markAllReadForEmail(email);
    setNotifs(getStudentNotifications(email));
    toast("All notifications marked as read");
  }

  if (!expanded) {
    return (
      <button
        onClick={() => setExpanded(true)}
        className="flex items-center gap-2 rounded-xl border bg-card px-4 py-3 text-sm hover:bg-muted/40 transition w-full text-left"
      >
        {unread > 0 ? <Bell className="h-4 w-4 text-primary" /> : <BellOff className="h-4 w-4 text-muted-foreground" />}
        <span className="font-medium">{unread > 0 ? `${unread} new notification${unread > 1 ? "s" : ""}` : "No new notifications"}</span>
        <ChevronRight className="h-4 w-4 ml-auto text-muted-foreground" />
      </button>
    );
  }

  return (
    <div className="rounded-xl border bg-card shadow-sm">
      <div className="p-4 border-b flex items-center justify-between">
        <h3 className="font-semibold flex items-center gap-2">
          <Bell className="h-4 w-4 text-primary" /> Notifications
          {unread > 0 && <Badge className="bg-primary text-primary-foreground text-[10px] h-4 px-1.5">{unread}</Badge>}
        </h3>
        <div className="flex gap-2">
          {unread > 0 && <Button size="sm" variant="ghost" onClick={markAll}>Mark all read</Button>}
          <Button size="sm" variant="ghost" onClick={() => setExpanded(false)}>Close</Button>
        </div>
      </div>
      <div className="divide-y max-h-72 overflow-y-auto">
        {notifs.length === 0 && (
          <p className="text-center text-sm text-muted-foreground py-8">No notifications yet.</p>
        )}
        {notifs.map((n) => (
          <div key={n.id} className={cn("p-4 flex gap-3", !n.read && "bg-primary/5")}>
            <div className={cn("h-2 w-2 rounded-full shrink-0 mt-2", !n.read ? "bg-primary" : "bg-transparent")} />
            <div>
              <p className="text-sm font-medium">{n.title}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{n.body}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {new Date(n.createdAt).toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────
function StudentApplications() {
  const [apps, setApps] = useState<StoredApplication[]>([]);
  const session = getSession();
  const email = session?.email ?? "";

  useEffect(() => {
    initApplicationStore();
    setApps(getApplicationsByEmail(email));
  }, [email]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Applications"
        subtitle="Track your admission applications, download receipts and view status updates"
        actions={
          <Button asChild>
            <Link to="/apply"><ExternalLink className="h-4 w-4 mr-2" /> New Application</Link>
          </Button>
        }
      />

      {email && <NotificationsPanel email={email} />}

      {apps.length === 0 ? (
        <div className="rounded-xl border bg-card shadow-sm py-16 text-center space-y-4">
          <div className="mx-auto h-14 w-14 rounded-full bg-muted grid place-items-center">
            <FileText className="h-7 w-7 text-muted-foreground" />
          </div>
          <div>
            <h3 className="font-semibold">No applications yet</h3>
            <p className="text-sm text-muted-foreground mt-1">Start your admission journey by submitting an application.</p>
          </div>
          <Button asChild>
            <Link to="/apply">Apply for Admission</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {apps.map((app) => <ApplicationCard key={app.id} app={app} />)}
        </div>
      )}
    </div>
  );
}
