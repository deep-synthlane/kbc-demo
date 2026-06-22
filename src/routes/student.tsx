import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import {
  LayoutDashboard,
  BookOpen,
  ClipboardList,
  Video,
  Calendar,
  User,
  Ticket,
  BookMarked,
} from "lucide-react";
import { RoleShell, type NavItem } from "@/components/RoleShell";
import { getSession } from "@/lib/session";
import { toast } from "sonner";

const NAV: NavItem[] = [
  { label: "Dashboard", to: "/student/dashboard", icon: LayoutDashboard },
  { label: "Courses", to: "/student/courses", icon: BookOpen },
  { label: "Assessments", to: "/student/assessments", icon: ClipboardList, badge: "3" },
  { label: "Live Classes", to: "/student/live-classes", icon: Video },
  { label: "Timetable", to: "/student/timetable", icon: Calendar },
  { label: "Curriculum", to: "/student/curriculum", icon: BookMarked },
  { label: "Hall Ticket", to: "/student/hall-ticket", icon: Ticket },
  { label: "Profile", to: "/student/profile", icon: User },
];

function StudentLayout() {
  const navigate = useNavigate();
  useEffect(() => {
    const session = getSession();
    if (!session) {
      navigate({ to: "/" });
      return;
    }
    if (session.role !== "student") {
      toast("Access denied — redirecting to your dashboard");
      navigate({ to: `/${session.role}/dashboard` });
    }
  }, [navigate]);

  return (
    <RoleShell role="student" nav={NAV}>
      <Outlet />
    </RoleShell>
  );
}

export const Route = createFileRoute("/student")({
  component: StudentLayout,
});
