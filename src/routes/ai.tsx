import { createFileRoute, Outlet } from "@tanstack/react-router";
import { Bot, Radio, ShieldCheck, MessageSquareHeart } from "lucide-react";
import { RoleShell, type NavItem } from "@/components/RoleShell";

const NAV: NavItem[] = [
  { label: "AI Interview Assistant", to: "/ai/interview", icon: Bot },
  { label: "Meeting Intelligence", to: "/ai/meeting", icon: Radio },
  { label: "Proctoring", to: "/ai/proctoring", icon: ShieldCheck },
  { label: "Feedback Engine", to: "/ai/feedback", icon: MessageSquareHeart },
];

export const Route = createFileRoute("/ai")({
  component: () => (
    <RoleShell role="admin" nav={NAV}>
      <Outlet />
    </RoleShell>
  ),
});
