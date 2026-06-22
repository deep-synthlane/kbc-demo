import { createFileRoute, Link } from "@tanstack/react-router";
import { Search, BookOpen, Users, Clock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/RoleShell";
import { COURSES } from "@/lib/mockData";

export const Route = createFileRoute("/student/courses")({
  head: () => ({ meta: [{ title: "My Courses · KCG University" }] }),
  component: StudentCourses,
});

function StudentCourses() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="My Courses"
        subtitle="All enrolled courses for Semester 6"
        actions={
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search courses…" className="pl-9" />
          </div>
        }
      />

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {COURSES.map((c) => (
          <Link
            key={c.id}
            to="/student/courses/$courseId"
            params={{ courseId: c.id }}
            className="group rounded-xl border bg-card overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition"
          >
            <div className={`h-28 bg-gradient-to-br ${c.color} relative`}>
              <div className="absolute inset-0 bg-black/10" />
              <Badge className="absolute top-3 right-3 bg-white/90 text-foreground">
                {c.credits} credits
              </Badge>
              <div className="absolute bottom-3 left-4 text-white">
                <div className="text-xs uppercase tracking-wider opacity-80">{c.code}</div>
              </div>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <h3 className="font-semibold text-lg leading-tight group-hover:text-primary transition">
                  {c.title}
                </h3>
                <div className="text-sm text-muted-foreground mt-1">{c.faculty}</div>
              </div>

              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <BookOpen className="h-3.5 w-3.5" /> {c.units} units
                </span>
                <span className="flex items-center gap-1">
                  <Users className="h-3.5 w-3.5" /> {c.students}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" /> {c.pending} pending
                </span>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-muted-foreground">Course progress</span>
                  <span className="font-medium">{c.progress}%</span>
                </div>
                <Progress value={c.progress} className="h-2" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
