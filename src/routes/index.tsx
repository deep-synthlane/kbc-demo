import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  GraduationCap,
  Users,
  Shield,
  Briefcase,
  ArrowRight,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { setSession, defaultsFor } from "@/lib/session";
import { ROLES, UNIVERSITY, type Role } from "@/lib/mockData";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Sign in · Knowledge Consortium of Gujarat" },
      {
        name: "description",
        content:
          "Single sign-on for students, faculty, administrators and staff at Knowledge Consortium of Gujarat.",
      },
    ],
  }),
  component: LoginPage,
});

const ROLE_ICONS: Record<Role, typeof GraduationCap> = {
  student: GraduationCap,
  teacher: Users,
  admin: Shield,
  staff: Briefcase,
};

function LoginPage() {
  const navigate = useNavigate();
  const [role, setRole] = useState<Role>("student");
  const [email, setEmail] = useState(defaultsFor("student").email);
  const [password, setPassword] = useState("••••••••");

  function selectRole(r: Role) {
    setRole(r);
    setEmail(defaultsFor(r).email);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSession(role);
    navigate({ to: `/${role}/dashboard` });
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-background">
      {/* Brand side */}
      <div className="relative hidden lg:flex flex-col justify-between bg-sidebar text-sidebar-foreground p-12 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.07] [background-image:radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] [background-size:20px_20px]" />
        <div className="absolute -right-20 top-20 h-72 w-72 rounded-full bg-sidebar-primary/20 blur-3xl" />
        <div className="absolute -left-10 bottom-0 h-80 w-80 rounded-full bg-primary/30 blur-3xl" />

        <div className="relative">
          <div className="flex items-center gap-3">
            <img src={UNIVERSITY.logo} alt="" className="h-12 w-12 rounded-full object-cover object-left" />
            <div>
              <div className="font-display text-xl font-semibold">{UNIVERSITY.name}</div>
              <div className="text-xs uppercase tracking-[0.2em] text-sidebar-foreground/60">
                Estd. {UNIVERSITY.established}
              </div>
            </div>
          </div>
        </div>

        <div className="relative space-y-8">
          <div>
            <Badge className="bg-sidebar-primary/20 text-sidebar-primary border-0 mb-4">
              <Sparkles className="h-3 w-3 mr-1" /> Digital Campus 2.0
            </Badge>
            <h1 className="font-display text-4xl xl:text-5xl font-semibold leading-tight">
              One platform for the entire academic journey.
            </h1>
            <p className="mt-4 text-sidebar-foreground/70 max-w-md">
              LMS, examinations, admissions, timetables and AI-powered assistance — unified
              under {UNIVERSITY.short}'s digital campus.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 max-w-md">
            {UNIVERSITY.accreditations.map((a) => (
              <div
                key={a}
                className="flex items-center gap-2 rounded-md border border-sidebar-border/50 bg-sidebar-accent/30 px-3 py-2"
              >
                <CheckCircle2 className="h-4 w-4 text-sidebar-primary shrink-0" />
                <span className="text-xs">{a}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative text-xs text-sidebar-foreground/50">
          {UNIVERSITY.motto} · {UNIVERSITY.location}
        </div>
      </div>

      {/* Form side */}
      <div className="flex items-center justify-center p-6 sm:p-10 lg:p-16">
        <div className="w-full max-w-md">
          <div className="flex lg:hidden items-center gap-3 mb-8">
            <img src={UNIVERSITY.logo} alt="" className="h-10 w-10 rounded-full object-cover object-left" />
            <div className="font-display text-lg font-semibold">{UNIVERSITY.name}</div>
          </div>

          <h2 className="font-display text-3xl font-semibold">Welcome back</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Sign in with your university credentials or SSO provider.
          </p>

          {/* Role selector */}
          <div className="mt-6 grid grid-cols-2 gap-2">
            {ROLES.map((r) => {
              const Icon = ROLE_ICONS[r.id];
              const active = role === r.id;
              return (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => selectRole(r.id)}
                  className={cn(
                    "flex flex-col items-start gap-1.5 rounded-lg border p-3 text-left transition",
                    active
                      ? "border-primary bg-primary/5 ring-1 ring-primary/30"
                      : "border-border hover:border-primary/40 hover:bg-muted/50",
                  )}
                >
                  <div
                    className={cn(
                      "grid h-7 w-7 place-items-center rounded-md",
                      active ? "bg-primary text-primary-foreground" : "bg-muted text-foreground",
                    )}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="text-sm font-medium">{r.label}</div>
                  <div className="text-[11px] text-muted-foreground">{r.tagline}</div>
                </button>
              );
            })}
          </div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email">University email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@kcg.edu.in"
              />
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <a href="#" className="text-xs text-primary hover:underline">
                  Forgot password?
                </a>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <Button type="submit" className="w-full h-11 text-base">
              Sign in to dashboard
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>

            <div className="relative my-2">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-[11px] uppercase">
                <span className="bg-background px-2 text-muted-foreground">or continue via SSO</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <SSO label="Google" />
              <SSO label="Microsoft" />
              <SSO label="DigiLocker" />
            </div>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            New student?{" "}
            <Link to="/apply" className="text-primary hover:underline font-medium">
              Apply here
            </Link>
          </p>

          <p className="mt-3 text-center text-xs text-muted-foreground">
            Demo build · Choose any role and sign in with the prefilled credentials.{" "}
            <Link to="/" className="text-primary hover:underline">
              Help
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

function SSO({ label }: { label: string }) {
  return (
    <button
      type="button"
      className="h-10 rounded-md border bg-background text-xs font-medium hover:bg-muted transition"
    >
      {label}
    </button>
  );
}
