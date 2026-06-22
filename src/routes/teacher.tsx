import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  BookOpen,
  FolderUp,
  ClipboardList,
  Video,
  Calendar,
  ClipboardCheck,
  BookMarked,
} from "lucide-react";
import { RoleShell, type NavItem } from "@/components/RoleShell";
import { getSession } from "@/lib/session";
import { toast } from "sonner";

const NAV: NavItem[] = [
  { label: "Dashboard", to: "/teacher/dashboard", icon: LayoutDashboard },
  { label: "Courses", to: "/teacher/courses", icon: BookOpen },
  { label: "Content Management", to: "/teacher/content", icon: FolderUp },
  { label: "Assessments", to: "/teacher/assessments", icon: ClipboardList, badge: "12" },
  { label: "Live Classes", to: "/teacher/live-classes", icon: Video },
  { label: "Timetable", to: "/teacher/timetable", icon: Calendar },
  { label: "Examinations", to: "/teacher/examinations", icon: ClipboardCheck },
  { label: "Curriculum", to: "/teacher/curriculum", icon: BookMarked },
];

function TeacherLayout() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const session = getSession();
    if (!session) {
      navigate({ to: "/" });
      return;
    }
    if (session.role !== "teacher") {
      toast("Access denied — redirecting to your dashboard");
      navigate({ to: `/${session.role}/dashboard` });
      return;
    }
    setReady(true);
  }, [navigate]);

  if (!ready) return null;
  return (
    <RoleShell role="teacher" nav={NAV}>
      <Outlet />
    </RoleShell>
  );
}

export const Route = createFileRoute("/teacher")({
  component: TeacherLayout,
});
