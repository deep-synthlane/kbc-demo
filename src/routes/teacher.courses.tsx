import { createFileRoute } from "@tanstack/react-router";
import { Plus, Users, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { PageHeader } from "@/components/RoleShell";
import { COURSES } from "@/lib/mockData";

export const Route = createFileRoute("/teacher/courses")({
  head: () => ({ meta: [{ title: "My Courses · Faculty · KCG University" }] }),
  component: TeacherCourses,
});

function TeacherCourses() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Course Management"
        subtitle="Create courses, organise units, manage lessons and assessments"
        actions={
          <Button>
            <Plus className="h-4 w-4 mr-2" /> Create Course
          </Button>
        }
      />

      <div className="grid gap-4 md:grid-cols-2">
        {COURSES.map((c) => (
          <div key={c.id} className="rounded-xl border bg-card overflow-hidden shadow-sm">
            <div className={`h-2 bg-gradient-to-r ${c.color}`} />
            <div className="p-5 space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-xs text-muted-foreground">{c.code}</div>
                  <h3 className="font-semibold text-lg leading-tight mt-0.5">{c.title}</h3>
                </div>
                <Badge variant="outline">{c.credits} cr</Badge>
              </div>

              <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Users className="h-3.5 w-3.5" /> {c.students} students
                </span>
                <span className="flex items-center gap-1">
                  <BookOpen className="h-3.5 w-3.5" /> {c.units} units
                </span>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-muted-foreground">Syllabus coverage</span>
                  <span className="font-medium">{c.progress}%</span>
                </div>
                <Progress value={c.progress} className="h-1.5" />
              </div>

              <div className="flex gap-2 pt-1">
                <Button size="sm" variant="outline" className="flex-1">
                  Manage Units
                </Button>
                <Button size="sm" variant="outline" className="flex-1">
                  Add Lesson
                </Button>
                <Button size="sm" variant="outline" className="flex-1">
                  New Quiz
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
