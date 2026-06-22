import type { Role } from "./mockData";

const KEY = "kcgu_session";

export type Session = { role: Role; name: string; email: string };

const DEFAULT_NAMES: Record<Role, { name: string; email: string }> = {
  student: { name: "Ananya Iyer", email: "ananya.iyer@kcgu.edu.in" },
  teacher: { name: "Dr. Priya Ramanathan", email: "priya.r@kcgu.edu.in" },
  admin: { name: "Dr. Vikram Acharya", email: "registrar@kcgu.edu.in" },
  staff: { name: "Mahesh Kumar", email: "mahesh.k@kcgu.edu.in" },
};

export function setSession(role: Role) {
  if (typeof window === "undefined") return;
  const s: Session = { role, ...DEFAULT_NAMES[role] };
  window.localStorage.setItem(KEY, JSON.stringify(s));
}

export function getSession(): Session | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as Session;
  } catch {
    return null;
  }
}

export function clearSession() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(KEY);
}

export function defaultsFor(role: Role) {
  return DEFAULT_NAMES[role];
}
