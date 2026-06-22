import { createFileRoute } from "@tanstack/react-router";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PageHeader } from "@/components/RoleShell";
import { EXAM_SCHEDULE } from "@/lib/mockData";
import { toast } from "sonner";

export const Route = createFileRoute("/teacher/examinations")({
  head: () => ({ meta: [{ title: "Examinations · Faculty · KCG" }] }),
  component: TeacherExams,
});

const GRADE_DATA = [
  { course: "CSE301 · Data Structures", enrolled: 86, submitted: 72, deadline: "10 Jul 2026", status: "In Progress" },
  { course: "CSE305 · DBMS", enrolled: 92, submitted: 92, deadline: "12 Jul 2026", status: "Submitted" },
  { course: "CSE402 · AI", enrolled: 74, submitted: 0, deadline: "15 Jul 2026", status: "Not Started" },
];

function TeacherExams() {
  return (
    <div className="space-y-6">
      <PageHeader title="Examination & Invigilation" subtitle="Invigilation duties and grade submission" />

      <Tabs defaultValue="invigilation">
        <TabsList>
          <TabsTrigger value="invigilation">My Invigilation Duties</TabsTrigger>
          <TabsTrigger value="grades">Grade Submission</TabsTrigger>
        </TabsList>

        <TabsContent value="invigilation">
          <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Course</TableHead>
                  <TableHead>Session</TableHead>
                  <TableHead>Hall</TableHead>
                  <TableHead>Role</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {EXAM_SCHEDULE.map((e, i) => (
                  <TableRow key={e.id}>
                    <TableCell className="font-medium">{e.date}</TableCell>
                    <TableCell>{e.course}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{e.session}</Badge>
                    </TableCell>
                    <TableCell>{e.hall}</TableCell>
                    <TableCell>
                      <Badge className={i === 0 ? "bg-primary/10 text-primary border-0" : "bg-muted text-muted-foreground border-0"}>
                        {i === 0 ? "Chief Invigilator" : "Invigilator"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="grades">
          <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Course</TableHead>
                  <TableHead>Students</TableHead>
                  <TableHead>Grades Submitted</TableHead>
                  <TableHead>Deadline</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {GRADE_DATA.map((g) => {
                  const pct = Math.round((g.submitted / g.enrolled) * 100);
                  return (
                    <TableRow key={g.course}>
                      <TableCell className="font-medium">{g.course}</TableCell>
                      <TableCell>{g.enrolled}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3 min-w-32">
                          <Progress value={pct} className="h-1.5 flex-1" />
                          <span className="text-xs text-muted-foreground">
                            {g.submitted}/{g.enrolled}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{g.deadline}</TableCell>
                      <TableCell>
                        <Badge
                          className={
                            g.status === "Submitted"
                              ? "bg-success/15 text-success border-0"
                              : g.status === "In Progress"
                                ? "bg-warning/20 text-warning-foreground border-0"
                                : "bg-muted text-muted-foreground border-0"
                          }
                        >
                          {g.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="sm"
                          variant={g.status === "Submitted" ? "ghost" : "outline"}
                          onClick={() =>
                            toast(`Grades submitted for ${g.course.split(" · ")[1]}`)
                          }
                        >
                          {g.status === "Submitted" ? "Resubmit" : "Submit Grades"}
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
