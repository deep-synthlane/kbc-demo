import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  BookOpen,
  ClipboardList,
  Video,
  Calendar,
  User,
  Ticket,
  BookMarked,
  IndianRupee,
  FileBadge,
  Library,
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
  { label: "Fees", to: "/student/fees", icon: IndianRupee },
  { label: "Curriculum", to: "/student/curriculum", icon: BookMarked },
  {
    label: "eLibrary",
    to: "https://nitpy.knimbus.com/portal/v2/default/home",
    icon: Library,
    external: true,
  },
  { label: "My Applications", to: "/student/applications", icon: FileBadge },
  { label: "Hall Ticket", to: "/student/hall-ticket", icon: Ticket },
  { label: "Profile", to: "/student/profile", icon: User },
];

function StudentLayout() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const session = getSession();
    if (!session) {
      navigate({ to: "/" });
      return;
    }
    if (session.role !== "student") {
      toast("Access denied — redirecting to your dashboard");
      navigate({ to: `/${session.role}/dashboard` });
      return;
    }
    setReady(true);
  }, [navigate]);

  if (!ready) return null;
  return (
    <RoleShell role="student" nav={NAV}>
      <Outlet />
    </RoleShell>
  );
}

export const Route = createFileRoute("/student")({
  component: StudentLayout,
});
