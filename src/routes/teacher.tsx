import { createFileRoute, Outlet } from "@tanstack/react-router";
import { LayoutDashboard, BookOpen, FolderUp, ClipboardList, Video } from "lucide-react";
import { RoleShell, type NavItem } from "@/components/RoleShell";

const NAV: NavItem[] = [
  { label: "Dashboard", to: "/teacher/dashboard", icon: LayoutDashboard },
  { label: "Courses", to: "/teacher/courses", icon: BookOpen },
  { label: "Content Management", to: "/teacher/content", icon: FolderUp },
  { label: "Assessments", to: "/teacher/assessments", icon: ClipboardList, badge: "12" },
  { label: "Live Classes", to: "/teacher/live-classes", icon: Video },
];

export const Route = createFileRoute("/teacher")({
  component: () => (
    <RoleShell role="teacher" nav={NAV}>
      <Outlet />
    </RoleShell>
  ),
});
