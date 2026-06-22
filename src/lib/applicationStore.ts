// localStorage-based application store: applications, notifications, audit log

import type { AdmissionApplication, ApplicationStatus } from "./admissions";
import { APPLICATIONS } from "./admissions";

export type FullApplicationStatus =
  | "Draft"
  | "Submitted"
  | "Payment Completed"
  | "Under Review"
  | "Documents Pending"
  | "Approved"
  | "Rejected"
  | "Enrolled";

export interface AuditEntry {
  id: string;
  action: string;
  by: string;
  role: "student" | "admin";
  note?: string;
  at: string;
}

export interface AppNotification {
  id: string;
  type: string;
  title: string;
  body: string;
  applicationId: string;
  createdAt: string;
  read: boolean;
  for: "student" | "admin";
  studentEmail: string;
}

export interface StoredApplication {
  id: string;
  transactionId: string;
  submittedAt: string;
  lastUpdated: string;
  name: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  guardianName: string;
  address: string;
  tenthMarks: number;
  twelfthMarks: number;
  previousInstitution: string;
  program: string;
  entranceExamScore: number | null;
  paymentMethod: string;
  paymentStatus: "Completed" | "Pending";
  feeAmount: number;
  paymentDate: string;
  documents: Array<{ name: string; uploaded: boolean; fileName?: string }>;
  status: FullApplicationStatus;
  remarks?: string;
  auditLog: AuditEntry[];
  isDemo?: boolean;
}

const APPS_KEY = "kcg_applications";
const NOTIF_KEY = "kcg_notifications";
const COUNTER_KEY = "kcg_app_counter";
const SEEDED_KEY = "kcg_store_seeded";

function getCounter(): number {
  try {
    return parseInt(localStorage.getItem(COUNTER_KEY) ?? "148", 10);
  } catch {
    return 148;
  }
}

function incrementCounter(): number {
  const next = getCounter() + 1;
  try { localStorage.setItem(COUNTER_KEY, String(next)); } catch { /* noop */ }
  return next;
}

export function generateApplicationId(): string {
  const num = incrementCounter();
  return `AP-2026-${String(num).padStart(4, "0")}`;
}

export function generateTransactionId(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "TXN-";
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

function mapLegacyStatus(status: ApplicationStatus): FullApplicationStatus {
  switch (status) {
    case "Approved": return "Approved";
    case "Rejected": return "Rejected";
    case "Documents Required": return "Documents Pending";
    default: return "Under Review";
  }
}

function convertMockToStored(m: AdmissionApplication): StoredApplication {
  const num = m.id.split("-")[2];
  return {
    id: m.id,
    transactionId: `TXN-DEMO${num}`,
    submittedAt: "2026-06-14T09:00:00.000Z",
    lastUpdated: "2026-06-15T10:00:00.000Z",
    name: m.name,
    email: m.email,
    phone: m.phone,
    dateOfBirth: m.dateOfBirth,
    gender: m.gender,
    guardianName: m.guardianName,
    address: m.address,
    tenthMarks: m.tenthMarks,
    twelfthMarks: m.twelfthMarks,
    previousInstitution: m.previousInstitution,
    program: m.program,
    entranceExamScore: m.entranceExamScore,
    paymentMethod: "UPI",
    paymentStatus: m.paymentStatus === "Paid" ? "Completed" : "Pending",
    feeAmount: 1500,
    paymentDate: "2026-06-14T09:15:00.000Z",
    documents: m.documents.map((d) => ({
      name: d.name,
      uploaded: d.uploaded,
      fileName: d.fileName,
    })),
    status: mapLegacyStatus(m.status),
    remarks: undefined,
    auditLog: [
      {
        id: "seed-1",
        action: "Application submitted",
        by: m.name,
        role: "student",
        at: "2026-06-14T09:00:00.000Z",
      },
      {
        id: "seed-2",
        action: "Payment completed",
        by: m.name,
        role: "student",
        at: "2026-06-14T09:15:00.000Z",
      },
    ],
    isDemo: true,
  };
}

export function initApplicationStore(): void {
  try {
    const existing = getApplications();
    if (existing.length === 0) {
      const apps = APPLICATIONS.map(convertMockToStored);
      localStorage.setItem(APPS_KEY, JSON.stringify(apps));
      localStorage.setItem(SEEDED_KEY, "1");
    }
  } catch { /* noop */ }
}

export function getApplications(): StoredApplication[] {
  try {
    const raw = localStorage.getItem(APPS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveApplication(app: StoredApplication): void {
  try {
    const apps = getApplications();
    const idx = apps.findIndex((a) => a.id === app.id);
    if (idx >= 0) apps[idx] = app;
    else apps.unshift(app);
    localStorage.setItem(APPS_KEY, JSON.stringify(apps));
  } catch { /* noop */ }
}

export function getApplicationById(id: string): StoredApplication | null {
  return getApplications().find((a) => a.id === id) ?? null;
}

export function getApplicationsByEmail(email: string): StoredApplication[] {
  return getApplications().filter(
    (a) => a.email.toLowerCase() === email.toLowerCase(),
  );
}

export function updateApplicationStatus(
  id: string,
  status: FullApplicationStatus,
  by: string,
  note?: string,
): StoredApplication | null {
  try {
    const apps = getApplications();
    const idx = apps.findIndex((a) => a.id === id);
    if (idx < 0) return null;
    const prev = apps[idx];
    const updated: StoredApplication = {
      ...prev,
      status,
      remarks: note !== undefined ? note : prev.remarks,
      lastUpdated: new Date().toISOString(),
      auditLog: [
        ...prev.auditLog,
        {
          id: crypto.randomUUID(),
          action: `Status changed to "${status}"`,
          by,
          role: "admin",
          note,
          at: new Date().toISOString(),
        },
      ],
    };
    apps[idx] = updated;
    localStorage.setItem(APPS_KEY, JSON.stringify(apps));

    pushNotification({
      id: crypto.randomUUID(),
      type: "status_change",
      title: `Application ${status}`,
      body: `Your application ${id} is now "${status}"${note ? `. Remarks: ${note}` : ""}.`,
      applicationId: id,
      createdAt: new Date().toISOString(),
      read: false,
      for: "student",
      studentEmail: prev.email,
    });

    pushNotification({
      id: crypto.randomUUID(),
      type: "admin_action",
      title: `${id} → ${status}`,
      body: `${prev.name}'s application status updated to "${status}" by ${by}.`,
      applicationId: id,
      createdAt: new Date().toISOString(),
      read: false,
      for: "admin",
      studentEmail: prev.email,
    });

    return updated;
  } catch {
    return null;
  }
}

export function addRemarks(id: string, remarks: string, by: string): StoredApplication | null {
  try {
    const apps = getApplications();
    const idx = apps.findIndex((a) => a.id === id);
    if (idx < 0) return null;
    const prev = apps[idx];
    const updated: StoredApplication = {
      ...prev,
      remarks,
      lastUpdated: new Date().toISOString(),
      auditLog: [
        ...prev.auditLog,
        {
          id: crypto.randomUUID(),
          action: "Remarks added",
          by,
          role: "admin",
          note: remarks,
          at: new Date().toISOString(),
        },
      ],
    };
    apps[idx] = updated;
    localStorage.setItem(APPS_KEY, JSON.stringify(apps));
    return updated;
  } catch {
    return null;
  }
}

export function requestDocuments(id: string, by: string, note: string): StoredApplication | null {
  const updated = updateApplicationStatus(id, "Documents Pending", by, note);
  if (updated) {
    pushNotification({
      id: crypto.randomUUID(),
      type: "document_request",
      title: "Documents Requested",
      body: `Additional documents requested for application ${id}: ${note}`,
      applicationId: id,
      createdAt: new Date().toISOString(),
      read: false,
      for: "student",
      studentEmail: updated.email,
    });
  }
  return updated;
}

// Notifications

export function pushNotification(notif: AppNotification): void {
  try {
    const notifs = getNotifications();
    notifs.unshift(notif);
    localStorage.setItem(NOTIF_KEY, JSON.stringify(notifs.slice(0, 200)));
  } catch { /* noop */ }
}

export function getNotifications(): AppNotification[] {
  try {
    const raw = localStorage.getItem(NOTIF_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function getStudentNotifications(email: string): AppNotification[] {
  return getNotifications().filter(
    (n) =>
      n.for === "student" &&
      n.studentEmail.toLowerCase() === email.toLowerCase(),
  );
}

export function getAdminNotifications(): AppNotification[] {
  return getNotifications().filter((n) => n.for === "admin");
}

export function markNotificationRead(id: string): void {
  try {
    const notifs = getNotifications().map((n) =>
      n.id === id ? { ...n, read: true } : n,
    );
    localStorage.setItem(NOTIF_KEY, JSON.stringify(notifs));
  } catch { /* noop */ }
}

export function markAllReadForEmail(email: string): void {
  try {
    const notifs = getNotifications().map((n) =>
      n.studentEmail.toLowerCase() === email.toLowerCase()
        ? { ...n, read: true }
        : n,
    );
    localStorage.setItem(NOTIF_KEY, JSON.stringify(notifs));
  } catch { /* noop */ }
}

export function getUnreadCount(email: string): number {
  return getStudentNotifications(email).filter((n) => !n.read).length;
}

export function getAdminUnreadCount(): number {
  return getAdminNotifications().filter((n) => !n.read).length;
}
