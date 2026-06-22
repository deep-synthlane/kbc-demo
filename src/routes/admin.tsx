import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  FileCheck,
  BookCopy,
  Users,
  Calendar,
  FileSpreadsheet,
  BarChart3,
  Sparkles,
  Eye,
} from "lucide-react";
import { RoleShell, type NavItem } from "@/components/RoleShell";
import { getSession } from "@/lib/session";
import { toast } from "sonner";
import { CONTENT_ITEMS } from "@/lib/mockData";

const reviewCount = CONTENT_ITEMS.filter((c) => c.status === "Review").length;

const NAV: NavItem[] = [
  { label: "Dashboard", to: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Admissions", to: "/admin/admissions", icon: FileCheck, badge: "7" },
  { label: "Curriculum", to: "/admin/curriculum", icon: BookCopy },
  { label: "Content Review", to: "/admin/content-review", icon: Eye, badge: String(reviewCount) },
  { label: "Students", to: "/admin/students", icon: Users },
  { label: "Timetable", to: "/admin/timetable", icon: Calendar },
  { label: "Examinations", to: "/admin/examinations", icon: FileSpreadsheet },
  { label: "Reports", to: "/admin/reports", icon: BarChart3 },
  { label: "AI Features", to: "/ai/interview", icon: Sparkles },
];

function AdminLayout() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const session = getSession();
    if (!session) {
      navigate({ to: "/" });
      return;
    }
    if (session.role !== "admin") {
      toast("Access denied — redirecting to your dashboard");
      navigate({ to: `/${session.role}/dashboard` });
      return;
    }
    setReady(true);
  }, [navigate]);

  if (!ready) return null;
  return (
    <RoleShell role="admin" nav={NAV}>
      <Outlet />
    </RoleShell>
  );
}

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
});
