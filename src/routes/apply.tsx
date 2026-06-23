import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useRef } from "react";
import {
  CheckCircle2,
  Upload,
  ChevronRight,
  ChevronLeft,
  ArrowLeft,
  CreditCard,
  Smartphone,
  Building2,
  ShieldCheck,
  Download,
  FileText,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import {
  ADMISSION_REQUIRED_DOCS,
  ADMISSION_PROGRAMS,
  APPLICATION_FEE,
} from "@/lib/admissions";
import { UNIVERSITY } from "@/lib/mockData";
import {
  generateApplicationId,
  generateTransactionId,
  saveApplication,
  pushNotification,
  type StoredApplication,
} from "@/lib/applicationStore";
import { downloadReceipt } from "@/lib/pdfReceipt";
import { formatFileSize } from "@/lib/materialUpload";
import { toast } from "sonner";

export const Route = createFileRoute("/apply")({
  head: () => ({
    meta: [{ title: "Apply for Admission · Knowledge Consortium of Gujarat" }],
  }),
  component: ApplyPage,
});

const STEPS = ["Personal Details", "Academic Details", "Documents"] as const;
const PAYMENT_METHODS = [
  { id: "UPI", label: "UPI", icon: Smartphone, detail: "Google Pay, PhonePe, Paytm" },
  { id: "Card", label: "Debit / Credit Card", icon: CreditCard, detail: "Visa, Mastercard, RuPay" },
  { id: "Net Banking", label: "Net Banking", icon: Building2, detail: "All major Indian banks" },
] as const;
type PaymentMethod = (typeof PAYMENT_METHODS)[number]["id"];

type DocUpload = { fileName: string; fileSize: string };

const DOC_ACCEPT: Record<(typeof ADMISSION_REQUIRED_DOCS)[number], { accept: string; extensions: string[] }> = {
  "10th Marksheet": { accept: ".pdf,application/pdf", extensions: [".pdf"] },
  "12th Marksheet": { accept: ".pdf,application/pdf", extensions: [".pdf"] },
  "Passport Photo": { accept: ".jpg,.jpeg,.png,image/*", extensions: [".jpg", ".jpeg", ".png"] },
  "Government ID Proof": { accept: ".pdf,.jpg,.jpeg,.png", extensions: [".pdf", ".jpg", ".jpeg", ".png"] },
};

function fileMatchesDoc(file: File, doc: (typeof ADMISSION_REQUIRED_DOCS)[number]) {
  const ext = `.${file.name.split(".").pop()?.toLowerCase() ?? ""}`;
  const cfg = DOC_ACCEPT[doc];
  if (cfg.extensions.includes(ext)) return true;
  if (doc === "Passport Photo" && file.type.startsWith("image/")) return true;
  if (doc === "Government ID Proof" && (file.type.startsWith("image/") || file.type === "application/pdf")) return true;
  return false;
}

interface FormData {
  name: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  guardianName: string;
  address: string;
  tenthMarks: string;
  twelfthMarks: string;
  previousInstitution: string;
  program: string;
  entranceExamScore: string;
}

const EMPTY_FORM: FormData = {
  name: "", email: "", phone: "", dateOfBirth: "", gender: "",
  guardianName: "", address: "", tenthMarks: "", twelfthMarks: "",
  previousInstitution: "", program: "", entranceExamScore: "",
};

function statusColor(s: string) {
  if (s === "Payment Completed" || s === "Approved" || s === "Enrolled")
    return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
  if (s === "Rejected") return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
  if (s === "Documents Pending")
    return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-600";
  return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
}

function ApplyPage() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormData>(EMPTY_FORM);
  const [uploads, setUploads] = useState<Partial<Record<(typeof ADMISSION_REQUIRED_DOCS)[number], DocUpload>>>({});
  const [pendingDoc, setPendingDoc] = useState<(typeof ADMISSION_REQUIRED_DOCS)[number] | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [declared, setDeclared] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("UPI");
  const [paying, setPaying] = useState(false);
  const [submittedApp, setSubmittedApp] = useState<StoredApplication | null>(null);
  const [pdfLoading, setPdfLoading] = useState(false);

  function set(field: keyof FormData) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  function openDocUpload(doc: (typeof ADMISSION_REQUIRED_DOCS)[number]) {
    setPendingDoc(doc);
    fileInputRef.current?.click();
  }

  function handleDocFileSelect(file: File | null) {
    if (!file || !pendingDoc) return;
    if (!fileMatchesDoc(file, pendingDoc)) {
      toast.error(`Please upload a valid file for ${pendingDoc}`);
      setPendingDoc(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }
    setUploads((u) => ({
      ...u,
      [pendingDoc]: { fileName: file.name, fileSize: formatFileSize(file.size) },
    }));
    toast.success(`${pendingDoc} uploaded`);
    setPendingDoc(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function removeDoc(doc: (typeof ADMISSION_REQUIRED_DOCS)[number]) {
    setUploads((u) => {
      const next = { ...u };
      delete next[doc];
      return next;
    });
  }

  const allDocsUploaded = ADMISSION_REQUIRED_DOCS.every((doc) => uploads[doc]);

  function handleSubmit() {
    setShowPayment(true);
  }

  function handlePayment() {
    setPaying(true);
    window.setTimeout(() => {
      const now = new Date().toISOString();
      const appId = generateApplicationId();
      const txnId = generateTransactionId();

      const app: StoredApplication = {
        id: appId,
        transactionId: txnId,
        submittedAt: now,
        lastUpdated: now,
        name: form.name || "Applicant",
        email: form.email || "applicant@example.com",
        phone: form.phone || "—",
        dateOfBirth: form.dateOfBirth || "—",
        gender: form.gender || "—",
        guardianName: form.guardianName || "—",
        address: form.address || "—",
        tenthMarks: Number(form.tenthMarks) || 0,
        twelfthMarks: Number(form.twelfthMarks) || 0,
        previousInstitution: form.previousInstitution || "—",
        program: form.program || "—",
        entranceExamScore: form.entranceExamScore ? Number(form.entranceExamScore) : null,
        paymentMethod,
        paymentStatus: "Completed",
        feeAmount: APPLICATION_FEE,
        paymentDate: now,
        documents: ADMISSION_REQUIRED_DOCS.map((name) => ({
          name,
          uploaded: !!uploads[name],
          fileName: uploads[name]?.fileName,
        })),
        status: "Payment Completed",
        auditLog: [
          {
            id: crypto.randomUUID(),
            action: "Application submitted",
            by: form.name || "Applicant",
            role: "student",
            at: now,
          },
          {
            id: crypto.randomUUID(),
            action: "Payment completed",
            by: form.name || "Applicant",
            role: "student",
            note: `₹${APPLICATION_FEE.toLocaleString("en-IN")} via ${paymentMethod}. Txn: ${txnId}`,
            at: now,
          },
        ],
      };

      saveApplication(app);

      // Notifications
      pushNotification({
        id: crypto.randomUUID(),
        type: "submission",
        title: "Application Submitted",
        body: `Application ${appId} submitted for ${app.program}. Payment of ₹${APPLICATION_FEE.toLocaleString("en-IN")} received.`,
        applicationId: appId,
        createdAt: now,
        read: false,
        for: "student",
        studentEmail: app.email,
      });
      pushNotification({
        id: crypto.randomUUID(),
        type: "new_application",
        title: `New Application: ${appId}`,
        body: `${app.name} applied for ${app.program}. Payment received.`,
        applicationId: appId,
        createdAt: now,
        read: false,
        for: "admin",
        studentEmail: app.email,
      });

      setPaying(false);
      setSubmittedApp(app);
    }, 1400);
  }

  async function handleDownload() {
    if (!submittedApp) return;
    setPdfLoading(true);
    try {
      await downloadReceipt(submittedApp);
    } finally {
      setPdfLoading(false);
    }
  }

  // ── Success modal ────────────────────────────────────────────────────────
  if (submittedApp) {
    const a = submittedApp;
    const appDate = new Date(a.submittedAt).toLocaleDateString("en-IN", {
      day: "2-digit", month: "long", year: "numeric",
    });

    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="w-full max-w-lg bg-card border rounded-2xl shadow-lg overflow-hidden">
          {/* Green header */}
          <div className="bg-green-600 dark:bg-green-700 px-8 py-6 text-white text-center">
            <div className="mx-auto mb-3 h-14 w-14 rounded-full bg-white/20 grid place-items-center">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h1 className="text-xl font-bold font-display">Application Submitted!</h1>
            <p className="text-green-100 text-sm mt-1">Payment received · Under review</p>
          </div>

          <div className="px-8 py-6 space-y-5">
            {/* Application number */}
            <div className="rounded-xl bg-muted/50 p-4 text-center">
              <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Application Number</p>
              <p className="font-mono text-2xl font-bold tracking-wide text-primary">{a.id}</p>
              <p className="text-xs text-muted-foreground mt-1">Save this for all future correspondence</p>
            </div>

            {/* Details grid */}
            <dl className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
              <div>
                <dt className="text-xs text-muted-foreground uppercase tracking-wide">Student Name</dt>
                <dd className="font-medium mt-0.5">{a.name}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground uppercase tracking-wide">Program</dt>
                <dd className="font-medium mt-0.5">{a.program}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground uppercase tracking-wide">Application Date</dt>
                <dd className="font-medium mt-0.5">{appDate}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground uppercase tracking-wide">Payment Status</dt>
                <dd className="mt-0.5">
                  <span className={cn("text-xs font-semibold px-2 py-0.5 rounded-full", statusColor("Payment Completed"))}>
                    Completed
                  </span>
                </dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground uppercase tracking-wide">Transaction ID</dt>
                <dd className="font-mono text-xs font-medium mt-0.5">{a.transactionId}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground uppercase tracking-wide">Amount Paid</dt>
                <dd className="font-medium mt-0.5">₹{a.feeAmount.toLocaleString("en-IN")}</dd>
              </div>
            </dl>

            {/* Status badge */}
            <div className="flex items-center gap-2 rounded-lg border px-4 py-3">
              <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse shrink-0" />
              <div>
                <p className="text-sm font-medium">Status: Payment Completed</p>
                <p className="text-xs text-muted-foreground">You will receive updates at {a.email}</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-2.5 pt-1">
              <Button onClick={handleDownload} disabled={pdfLoading} className="w-full gap-2">
                <Download className="h-4 w-4" />
                {pdfLoading ? "Generating PDF…" : "Download Receipt (PDF)"}
              </Button>
              <div className="grid gap-2">
                
                <Button variant="ghost" asChild>
                  <Link to="/">
                    <ArrowLeft className="h-3.5 w-3.5 mr-1.5" /> Back to Login
                  </Link>
                </Button>
              </div>
            </div>

            <p className="text-center text-xs text-muted-foreground">
              You can download your receipt again using the button above, or from the
              confirmation email sent to your registered address.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ── Payment screen ──────────────────────────────────────────────────────
  if (showPayment) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b bg-card">
          <div className="mx-auto max-w-3xl flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-3">
              <img src={UNIVERSITY.logo} alt="" className="h-10 w-10 rounded-full object-cover object-left" />
              <div>
                <div className="font-display text-sm font-semibold leading-tight">{UNIVERSITY.name}</div>
                <div className="text-[11px] uppercase tracking-wider text-muted-foreground">Admission Portal</div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setShowPayment(false)}
              className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1.5"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Back to application
            </button>
          </div>
        </header>

        <main className="mx-auto max-w-3xl px-6 py-8 space-y-6">
          <div>
            <h1 className="font-display text-2xl font-semibold">Application Fee Payment</h1>
            <p className="mt-1 text-sm text-muted-foreground">Complete payment to submit your admission application.</p>
          </div>

          {/* Review summary banner */}
          <div className="rounded-xl border bg-muted/30 p-4 grid sm:grid-cols-3 gap-3 text-sm">
            <div>
              <p className="text-xs text-muted-foreground">Applicant</p>
              <p className="font-medium">{form.name || "—"}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Program</p>
              <p className="font-medium">{form.program || "—"}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Email</p>
              <p className="font-medium truncate">{form.email || "—"}</p>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-5">
            <div className="lg:col-span-3 rounded-xl border bg-card p-6 shadow-sm space-y-4">
              <h2 className="font-medium">Select payment method</h2>
              <div className="space-y-3">
                {PAYMENT_METHODS.map(({ id, label, icon: Icon, detail }) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setPaymentMethod(id)}
                    className={cn(
                      "flex w-full items-center gap-4 rounded-lg border p-4 text-left transition",
                      paymentMethod === id
                        ? "border-primary bg-primary/5 ring-1 ring-primary/30"
                        : "hover:border-muted-foreground/40",
                    )}
                  >
                    <div className={cn("grid h-10 w-10 shrink-0 place-items-center rounded-lg", paymentMethod === id ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground")}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-sm font-medium">{label}</div>
                      <div className="text-xs text-muted-foreground">{detail}</div>
                    </div>
                  </button>
                ))}
              </div>
              {paymentMethod === "UPI" && (
                <div className="space-y-1.5 pt-2">
                  <Label>UPI ID</Label>
                  <Input placeholder="yourname@upi" />
                </div>
              )}
              {paymentMethod === "Card" && (
                <div className="grid gap-4 pt-2 md:grid-cols-2">
                  <div className="space-y-1.5 md:col-span-2">
                    <Label>Card Number</Label>
                    <Input placeholder="XXXX XXXX XXXX XXXX" />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Expiry</Label>
                    <Input placeholder="MM/YY" />
                  </div>
                  <div className="space-y-1.5">
                    <Label>CVV</Label>
                    <Input placeholder="XXX" type="password" />
                  </div>
                </div>
              )}
              {paymentMethod === "Net Banking" && (
                <div className="space-y-1.5 pt-2">
                  <Label>Bank</Label>
                  <Select defaultValue="sbi">
                    <SelectTrigger><SelectValue placeholder="Select your bank" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sbi">State Bank of India</SelectItem>
                      <SelectItem value="hdfc">HDFC Bank</SelectItem>
                      <SelectItem value="icici">ICICI Bank</SelectItem>
                      <SelectItem value="axis">Axis Bank</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            <div className="lg:col-span-2 rounded-xl border bg-card p-6 shadow-sm space-y-4 h-fit">
              <h2 className="font-medium">Payment summary</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Application fee</span>
                  <span>₹{APPLICATION_FEE.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Processing fee</span>
                  <span>₹0</span>
                </div>
                <div className="border-t pt-2 flex justify-between font-semibold">
                  <span>Total payable</span>
                  <span>₹{APPLICATION_FEE.toLocaleString("en-IN")}</span>
                </div>
              </div>
              <div className="flex items-start gap-2 rounded-lg bg-muted/50 p-3 text-xs text-muted-foreground">
                <ShieldCheck className="h-4 w-4 shrink-0 mt-0.5 text-green-600" />
                Payments are processed securely. This is a demo — no real transaction occurs.
              </div>
              <Button className="w-full" onClick={handlePayment} disabled={paying}>
                {paying ? "Processing payment…" : `Pay ₹${APPLICATION_FEE.toLocaleString("en-IN")}`}
              </Button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // ── Main application form ───────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="mx-auto max-w-3xl flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <img src={UNIVERSITY.logo} alt="" className="h-10 w-10 rounded-full object-cover object-left" />
            <div>
              <div className="font-display text-sm font-semibold leading-tight">{UNIVERSITY.name}</div>
              <div className="text-[11px] uppercase tracking-wider text-muted-foreground">Admission Portal</div>
            </div>
          </div>
          <Link to="/" className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1.5">
            <ArrowLeft className="h-3.5 w-3.5" /> Back to login
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-8 space-y-6">
        <div>
          <h1 className="font-display text-2xl font-semibold">Admission Application</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Fill in your details to apply for admission to {UNIVERSITY.name} programs.
          </p>
        </div>

        {/* Stepper */}
        <div className="flex items-center gap-2">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center gap-2 flex-1">
              <div className={cn("flex items-center gap-2 rounded-lg border p-3 flex-1 transition", i === step && "border-primary bg-primary/5 ring-1 ring-primary/30", i < step && "border-green-500 bg-green-500/5", i > step && "opacity-50")}>
                <span className={cn("grid h-7 w-7 shrink-0 place-items-center rounded-full text-xs font-medium", i < step ? "bg-green-500 text-white" : i === step ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground")}>
                  {i < step ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
                </span>
                <span className="text-sm font-medium">{s}</span>
              </div>
              {i < STEPS.length - 1 && <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />}
            </div>
          ))}
        </div>

        {/* Form card */}
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          {step === 0 && (
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-1.5">
                <Label>Full Name *</Label>
                <Input value={form.name} onChange={set("name")} placeholder="Enter your full name" />
              </div>
              <div className="space-y-1.5">
                <Label>Email *</Label>
                <Input type="email" value={form.email} onChange={set("email")} placeholder="you@example.com" />
              </div>
              <div className="space-y-1.5">
                <Label>Phone Number *</Label>
                <Input type="tel" value={form.phone} onChange={set("phone")} placeholder="+91 XXXXX XXXXX" />
              </div>
              <div className="space-y-1.5">
                <Label>Date of Birth *</Label>
                <Input type="date" value={form.dateOfBirth} onChange={set("dateOfBirth")} />
              </div>
              <div className="space-y-1.5">
                <Label>Gender *</Label>
                <Select value={form.gender} onValueChange={(v) => setForm((f) => ({ ...f, gender: v }))}>
                  <SelectTrigger><SelectValue placeholder="Select gender" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Father's / Guardian's Name *</Label>
                <Input value={form.guardianName} onChange={set("guardianName")} placeholder="Enter guardian's name" />
              </div>
              <div className="space-y-1.5 md:col-span-2">
                <Label>Address *</Label>
                <Textarea value={form.address} onChange={set("address")} placeholder="Enter your complete address" rows={3} />
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-1.5">
                <Label>10th Marks (%) *</Label>
                <Input type="number" value={form.tenthMarks} onChange={set("tenthMarks")} placeholder="e.g. 92" min="0" max="100" />
              </div>
              <div className="space-y-1.5">
                <Label>12th Marks (%) *</Label>
                <Input type="number" value={form.twelfthMarks} onChange={set("twelfthMarks")} placeholder="e.g. 88" min="0" max="100" />
              </div>
              <div className="space-y-1.5 md:col-span-2">
                <Label>Previous Institution *</Label>
                <Input value={form.previousInstitution} onChange={set("previousInstitution")} placeholder="Name of your school / college" />
              </div>
              <div className="space-y-1.5">
                <Label>Program Applied For *</Label>
                <Select value={form.program} onValueChange={(v) => setForm((f) => ({ ...f, program: v }))}>
                  <SelectTrigger><SelectValue placeholder="Choose program" /></SelectTrigger>
                  <SelectContent>
                    {ADMISSION_PROGRAMS.map((p) => (
                      <SelectItem key={p} value={p}>{p}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Entrance Exam Score</Label>
                <Input type="number" value={form.entranceExamScore} onChange={set("entranceExamScore")} placeholder="e.g. 285" />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">Upload the following required documents. All documents are required for application processing.</p>
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept={pendingDoc ? DOC_ACCEPT[pendingDoc].accept : undefined}
                onChange={(e) => handleDocFileSelect(e.target.files?.[0] ?? null)}
              />
              <div className="space-y-3">
                {ADMISSION_REQUIRED_DOCS.map((doc) => (
                  <div key={doc} className="flex items-center justify-between rounded-lg border p-4">
                    <div className="flex items-center gap-3">
                      {uploads[doc] ? (
                        <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0" />
                      ) : (
                        <div className="h-5 w-5 rounded-full border-2 border-muted-foreground/30 shrink-0" />
                      )}
                      <div>
                        <span className="text-sm font-medium">{doc}</span>
                        {uploads[doc] && (
                          <p className="text-xs text-muted-foreground mt-0.5">
                            <FileText className="h-3 w-3 inline mr-1" />
                            {uploads[doc]!.fileName} · {uploads[doc]!.fileSize}
                          </p>
                        )}
                        {!uploads[doc] && (
                          <p className="text-xs text-muted-foreground mt-0.5">
                            Accepts {DOC_ACCEPT[doc].extensions.join(", ")}
                          </p>
                        )}
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant={uploads[doc] ? "ghost" : "outline"}
                      onClick={() => (uploads[doc] ? removeDoc(doc) : openDocUpload(doc))}
                    >
                      {uploads[doc] ? (
                        <><X className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" /> Remove</>
                      ) : (
                        <><Upload className="h-3.5 w-3.5 mr-1.5" /> Upload</>
                      )}
                    </Button>
                  </div>
                ))}
              </div>
              <div className="flex items-start gap-2 pt-2">
                <Checkbox id="declare" checked={declared} onCheckedChange={(v) => setDeclared(v === true)} />
                <label htmlFor="declare" className="text-sm text-muted-foreground leading-tight">
                  I declare that all information provided is accurate and complete. I understand that any false information may lead to cancellation of my admission.
                </label>
              </div>
            </div>
          )}

          <div className="flex justify-between mt-6 pt-4 border-t">
            <Button variant="outline" onClick={() => setStep((s) => s - 1)} disabled={step === 0}>
              <ChevronLeft className="h-4 w-4 mr-1" /> Previous
            </Button>
            {step < 2 ? (
              <Button onClick={() => setStep((s) => s + 1)}>
                Next <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            ) : (
              <Button onClick={handleSubmit} disabled={!declared || !allDocsUploaded}>
                <ShieldCheck className="h-4 w-4 mr-1.5" /> Proceed to Payment
              </Button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
