import { createFileRoute, Outlet } from "@tanstack/react-router";
import {
  LayoutDashboard,
  BookOpen,
  ClipboardList,
  Video,
  Calendar,
  User,
} from "lucide-react";
import { RoleShell, type NavItem } from "@/components/RoleShell";

const NAV: NavItem[] = [
  { label: "Dashboard", to: "/student/dashboard", icon: LayoutDashboard },
  { label: "Courses", to: "/student/courses", icon: BookOpen },
  { label: "Assessments", to: "/student/assessments", icon: ClipboardList, badge: "3" },
  { label: "Live Classes", to: "/student/live-classes", icon: Video },
  { label: "Timetable", to: "/student/timetable", icon: Calendar },
  { label: "Profile", to: "/student/profile", icon: User },
];

export const Route = createFileRoute("/student")({
  component: () => (
    <RoleShell role="student" nav={NAV}>
      <Outlet />
    </RoleShell>
  ),
});
