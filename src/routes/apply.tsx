import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  CheckCircle2,
  Upload,
  ChevronRight,
  ChevronLeft,
  ArrowLeft,
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
import { cn } from "@/lib/utils";
import { UNIVERSITY } from "@/lib/mockData";

export const Route = createFileRoute("/apply")({
  head: () => ({
    meta: [{ title: "Apply for Admission · Knowledge Consortium of Gujarat" }],
  }),
  component: ApplyPage,
});

const STEPS = ["Personal Details", "Academic Details", "Documents"] as const;

const REQUIRED_DOCS = [
  "10th Marksheet",
  "12th Marksheet",
  "Passport Photo",
  "Government ID Proof",
];

function ApplyPage() {
  const [step, setStep] = useState(0);
  const [uploads, setUploads] = useState<Record<string, boolean>>({});
  const [declared, setDeclared] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit() {
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-6">
        <div className="w-full max-w-md text-center space-y-4">
          <div className="mx-auto h-20 w-20 rounded-full bg-green-100 dark:bg-green-900/30 grid place-items-center">
            <CheckCircle2 className="h-10 w-10 text-green-600 dark:text-green-400" />
          </div>
          <h1 className="font-display text-2xl font-semibold">Application Submitted!</h1>
          <p className="text-muted-foreground">
            Your application has been received and is under review.
          </p>
          <Badge variant="outline" className="text-lg font-mono px-4 py-2">
            AP-2026-0149
          </Badge>
          <p className="text-sm text-muted-foreground">
            Save this application number for future reference. You will receive
            updates at the email address you provided.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-primary hover:underline font-medium mt-4"
          >
            <ArrowLeft className="h-4 w-4" /> Back to login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header bar */}
      <header className="border-b bg-card">
        <div className="mx-auto max-w-3xl flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <img
              src={UNIVERSITY.logo}
              alt=""
              className="h-10 w-10 rounded-full object-cover object-left"
            />
            <div>
              <div className="font-display text-sm font-semibold leading-tight">
                {UNIVERSITY.name}
              </div>
              <div className="text-[11px] uppercase tracking-wider text-muted-foreground">
                Admission Portal
              </div>
            </div>
          </div>
          <Link
            to="/"
            className="text-sm text-muted-foreground hover:text-foreground transition flex items-center gap-1.5"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to login
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-8 space-y-6">
        <div>
          <h1 className="font-display text-2xl font-semibold">
            Admission Application
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Fill in your details to apply for admission to {UNIVERSITY.name}{" "}
            programs.
          </p>
        </div>

        {/* Stepper */}
        <div className="flex items-center gap-2">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center gap-2 flex-1">
              <div
                className={cn(
                  "flex items-center gap-2 rounded-lg border p-3 flex-1 transition",
                  i === step && "border-primary bg-primary/5 ring-1 ring-primary/30",
                  i < step && "border-green-500 bg-green-500/5",
                  i > step && "opacity-50",
                )}
              >
                <span
                  className={cn(
                    "grid h-7 w-7 shrink-0 place-items-center rounded-full text-xs font-medium",
                    i < step
                      ? "bg-green-500 text-white"
                      : i === step
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground",
                  )}
                >
                  {i < step ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
                </span>
                <span className="text-sm font-medium">{s}</span>
              </div>
              {i < STEPS.length - 1 && (
                <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
              )}
            </div>
          ))}
        </div>

        {/* Form card */}
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          {step === 0 && (
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-1.5">
                <Label>Full Name *</Label>
                <Input placeholder="Enter your full name" />
              </div>
              <div className="space-y-1.5">
                <Label>Email *</Label>
                <Input type="email" placeholder="you@example.com" />
              </div>
              <div className="space-y-1.5">
                <Label>Phone Number *</Label>
                <Input type="tel" placeholder="+91 XXXXX XXXXX" />
              </div>
              <div className="space-y-1.5">
                <Label>Date of Birth *</Label>
                <Input type="date" />
              </div>
              <div className="space-y-1.5">
                <Label>Gender *</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Father's / Guardian's Name *</Label>
                <Input placeholder="Enter guardian's name" />
              </div>
              <div className="space-y-1.5 md:col-span-2">
                <Label>Address *</Label>
                <Textarea placeholder="Enter your complete address" rows={3} />
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-1.5">
                <Label>10th Marks (%) *</Label>
                <Input type="number" placeholder="e.g. 92" />
              </div>
              <div className="space-y-1.5">
                <Label>12th Marks (%) *</Label>
                <Input type="number" placeholder="e.g. 88" />
              </div>
              <div className="space-y-1.5 md:col-span-2">
                <Label>Previous Institution *</Label>
                <Input placeholder="Name of your school / college" />
              </div>
              <div className="space-y-1.5">
                <Label>Program Applied For *</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose program" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="btech-cse">B.Tech CSE</SelectItem>
                    <SelectItem value="btech-ece">B.Tech ECE</SelectItem>
                    <SelectItem value="mba">MBA</SelectItem>
                    <SelectItem value="bsc-ds">B.Sc Data Science</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Entrance Exam Score</Label>
                <Input type="number" placeholder="e.g. 285" />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Upload the following required documents:
              </p>
              <div className="space-y-3">
                {REQUIRED_DOCS.map((doc) => (
                  <div
                    key={doc}
                    className="flex items-center justify-between rounded-lg border p-4"
                  >
                    <div className="flex items-center gap-3">
                      {uploads[doc] ? (
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                      ) : (
                        <div className="h-5 w-5 rounded-full border-2 border-muted-foreground/30" />
                      )}
                      <span className="text-sm font-medium">{doc}</span>
                    </div>
                    <Button
                      size="sm"
                      variant={uploads[doc] ? "ghost" : "outline"}
                      onClick={() =>
                        setUploads((u) => ({ ...u, [doc]: !u[doc] }))
                      }
                    >
                      {uploads[doc] ? (
                        <>
                          <CheckCircle2 className="h-3.5 w-3.5 mr-1.5 text-green-500" />{" "}
                          Uploaded
                        </>
                      ) : (
                        <>
                          <Upload className="h-3.5 w-3.5 mr-1.5" /> Upload
                        </>
                      )}
                    </Button>
                  </div>
                ))}
              </div>
              <div className="flex items-start gap-2 pt-2">
                <Checkbox
                  id="declare"
                  checked={declared}
                  onCheckedChange={(v) => setDeclared(v === true)}
                />
                <label
                  htmlFor="declare"
                  className="text-sm text-muted-foreground leading-tight"
                >
                  I declare that all information provided is accurate and
                  complete. I understand that any false information may lead to
                  cancellation of my admission.
                </label>
              </div>
            </div>
          )}

          <div className="flex justify-between mt-6 pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => setStep((s) => s - 1)}
              disabled={step === 0}
            >
              <ChevronLeft className="h-4 w-4 mr-1" /> Previous
            </Button>
            {step < 2 ? (
              <Button onClick={() => setStep((s) => s + 1)}>
                Next <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            ) : (
              <Button onClick={handleSubmit} disabled={!declared}>
                Submit Application
              </Button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
