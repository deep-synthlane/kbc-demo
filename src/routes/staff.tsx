import { createFileRoute, Outlet } from "@tanstack/react-router";
import { LayoutDashboard, ClipboardList, FileSearch, Megaphone } from "lucide-react";
import { RoleShell, type NavItem } from "@/components/RoleShell";

const NAV: NavItem[] = [
  { label: "Dashboard", to: "/staff/dashboard", icon: LayoutDashboard },
  { label: "Tasks", to: "/staff/tasks", icon: ClipboardList, badge: "4" },
  { label: "Records", to: "/staff/records", icon: FileSearch },
  { label: "Announcements", to: "/staff/announcements", icon: Megaphone },
];

export const Route = createFileRoute("/staff")({
  component: () => (
    <RoleShell role="staff" nav={NAV}>
      <Outlet />
    </RoleShell>
  ),
});
