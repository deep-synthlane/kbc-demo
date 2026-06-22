import { createFileRoute, Outlet } from "@tanstack/react-router";
import {
  LayoutDashboard,
  FileCheck,
  BookCopy,
  Users,
  Calendar,
  FileSpreadsheet,
  BarChart3,
  Sparkles,
} from "lucide-react";
import { RoleShell, type NavItem } from "@/components/RoleShell";

const NAV: NavItem[] = [
  { label: "Dashboard", to: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Admissions", to: "/admin/admissions", icon: FileCheck, badge: "7" },
  { label: "Curriculum", to: "/admin/curriculum", icon: BookCopy },
  { label: "Students", to: "/admin/students", icon: Users },
  { label: "Timetable", to: "/admin/timetable", icon: Calendar },
  { label: "Examinations", to: "/admin/examinations", icon: FileSpreadsheet },
  { label: "Reports", to: "/admin/reports", icon: BarChart3 },
  { label: "AI Features", to: "/ai/interview", icon: Sparkles },
];

export const Route = createFileRoute("/admin")({
  component: () => (
    <RoleShell role="admin" nav={NAV}>
      <Outlet />
    </RoleShell>
  ),
});
