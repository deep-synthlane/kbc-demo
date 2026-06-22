import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { LayoutDashboard, ClipboardList, FileSearch, Megaphone, Users } from "lucide-react";
import { RoleShell, type NavItem } from "@/components/RoleShell";
import { getSession } from "@/lib/session";
import { toast } from "sonner";

const NAV: NavItem[] = [
  { label: "Dashboard", to: "/staff/dashboard", icon: LayoutDashboard },
  { label: "Tasks", to: "/staff/tasks", icon: ClipboardList, badge: "4" },
  { label: "Records", to: "/staff/records", icon: FileSearch },
  { label: "Student Records", to: "/staff/students", icon: Users },
  { label: "Announcements", to: "/staff/announcements", icon: Megaphone },
];

function StaffLayout() {
  const navigate = useNavigate();
  useEffect(() => {
    const session = getSession();
    if (!session) {
      navigate({ to: "/" });
      return;
    }
    if (session.role !== "staff") {
      toast("Access denied — redirecting to your dashboard");
      navigate({ to: `/${session.role}/dashboard` });
    }
  }, [navigate]);

  return (
    <RoleShell role="staff" nav={NAV}>
      <Outlet />
    </RoleShell>
  );
}

export const Route = createFileRoute("/staff")({
  component: StaffLayout,
});
