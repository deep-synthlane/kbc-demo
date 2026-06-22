import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import {
  Bell,
  ChevronRight,
  GraduationCap,
  LogOut,
  Menu,
  Search,
  Sparkles,
} from "lucide-react";
import { useEffect, useState, type ComponentType, type ReactNode } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { clearSession, getSession, type Session } from "@/lib/session";
import { UNIVERSITY, NOTIFICATIONS, type Role } from "@/lib/mockData";

export type NavItem = {
  label: string;
  to: string;
  icon: ComponentType<{ className?: string }>;
  badge?: string;
};

const ROLE_LABEL: Record<Role, string> = {
  student: "Student Portal",
  teacher: "Faculty Portal",
  admin: "Administrator Console",
  staff: "Staff Workspace",
};

export function RoleShell({
  role,
  nav,
  children,
}: {
  role: Role;
  nav: NavItem[];
  children: ReactNode;
}) {
  const navigate = useNavigate();
  const [session, setSessionState] = useState<Session | null>(null);
  useEffect(() => {
    setSessionState(getSession());
  }, []);

  const initials = (session?.name ?? "KC")
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  function handleLogout() {
    clearSession();
    navigate({ to: "/" });
  }

  return (
    <div className="flex min-h-screen bg-muted/30">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-64 shrink-0 flex-col bg-sidebar text-sidebar-foreground">
        <SidebarInner role={role} nav={nav} />
      </aside>

      <div className="flex flex-1 min-w-0 flex-col">
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b bg-card px-4 lg:px-6 shadow-sm">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 bg-sidebar p-0 text-sidebar-foreground">
              <SidebarInner role={role} nav={nav} />
            </SheetContent>
          </Sheet>

          <div className="hidden md:flex items-center gap-2 text-sm">
            <Badge variant="secondary" className="rounded-sm bg-secondary/70">
              {ROLE_LABEL[role]}
            </Badge>
            <span className="text-muted-foreground">·</span>
            <span className="text-muted-foreground">Academic Year 2025-26</span>
          </div>

          <div className="relative ml-auto hidden md:block w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search courses, students, rooms…"
              className="pl-9 bg-background"
            />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-destructive" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {NOTIFICATIONS.map((n) => (
                <DropdownMenuItem key={n.id} className="flex flex-col items-start gap-1 py-2">
                  <span className="text-sm font-medium">{n.title}</span>
                  <span className="text-xs text-muted-foreground">{n.time}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 rounded-full pl-1 pr-3 py-1 hover:bg-muted transition">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden sm:flex flex-col items-start leading-tight">
                  <span className="text-sm font-medium truncate max-w-[10rem]">
                    {session?.name ?? "Guest"}
                  </span>
                  <span className="text-[11px] text-muted-foreground">
                    {session?.email ?? "guest@kcgu.edu.in"}
                  </span>
                </div>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>{session?.name}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>

        <main className="flex-1 min-w-0 p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}

function SidebarInner({ role, nav }: { role: Role; nav: NavItem[] }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-3 px-6 py-5 border-b border-sidebar-border">
        <div className="grid h-10 w-10 place-items-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground shrink-0">
          <GraduationCap className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <div className="font-display text-base font-semibold leading-tight truncate">
            {UNIVERSITY.name}
          </div>
          <div className="text-[11px] uppercase tracking-wider text-sidebar-foreground/60 truncate">
            Digital Campus
          </div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
        {nav.map((item) => {
          const Icon = item.icon;
          const active =
            pathname === item.to || (item.to !== `/${role}` && pathname.startsWith(item.to));
          return (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "group flex items-center gap-3 rounded-md px-3 py-2 text-sm transition",
                active
                  ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                  : "text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground",
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span className="flex-1 truncate">{item.label}</span>
              {item.badge && (
                <Badge className="bg-sidebar-primary text-sidebar-primary-foreground text-[10px]">
                  {item.badge}
                </Badge>
              )}
              {active && <ChevronRight className="h-3.5 w-3.5 opacity-70" />}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-sidebar-border p-3">
        <Link
          to="/ai/interview"
          className="flex items-center gap-3 rounded-md bg-sidebar-primary/10 px-3 py-2.5 text-sm text-sidebar-primary-foreground hover:bg-sidebar-primary/20 transition"
        >
          <Sparkles className="h-4 w-4 text-sidebar-primary" />
          <div className="flex-1">
            <div className="font-medium text-sidebar-foreground">AI & Smart Features</div>
            <div className="text-[11px] text-sidebar-foreground/60">Interview · Proctoring</div>
          </div>
        </Link>
      </div>
    </div>
  );
}

export function PageHeader({
  title,
  subtitle,
  actions,
}: {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        <h1 className="font-display text-2xl sm:text-3xl font-semibold text-foreground">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
        )}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

export function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  tone = "primary",
}: {
  label: string;
  value: string | number;
  hint?: string;
  icon: ComponentType<{ className?: string }>;
  tone?: "primary" | "success" | "warning" | "destructive" | "gold";
}) {
  const toneClass: Record<string, string> = {
    primary: "bg-primary/10 text-primary",
    success: "bg-success/15 text-success",
    warning: "bg-warning/20 text-warning-foreground",
    destructive: "bg-destructive/10 text-destructive",
    gold: "bg-gold/20 text-foreground",
  };
  return (
    <div className="rounded-xl border bg-card p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {label}
          </p>
          <p className="mt-2 font-display text-3xl font-semibold text-foreground">{value}</p>
          {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
        </div>
        <div className={cn("grid h-10 w-10 place-items-center rounded-lg shrink-0", toneClass[tone])}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}
