import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useRef } from "react";
import {
  Plus,
  Users,
  BookOpen,
  PlayCircle,
  FileText,
  HelpCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PageHeader } from "@/components/RoleShell";
import { useCourses } from "@/lib/courseStore";
import { toast } from "sonner";

export const Route = createFileRoute("/teacher/courses/")({
  head: () => ({ meta: [{ title: "My Courses · Faculty · KCG" }] }),
  component: TeacherCourses,
});

const COLOR_OPTIONS = [
  { value: "from-indigo-500 to-blue-600", label: "Indigo → Blue" },
  { value: "from-emerald-500 to-teal-600", label: "Emerald → Teal" },
  { value: "from-violet-500 to-fuchsia-600", label: "Violet → Fuchsia" },
  { value: "from-amber-500 to-orange-600", label: "Amber → Orange" },
  { value: "from-rose-500 to-pink-600", label: "Rose → Pink" },
  { value: "from-cyan-500 to-sky-600", label: "Cyan → Sky" },
];

function TeacherCourses() {
  const { courses, addCourse, addLesson, addQuiz } = useCourses();
  const navigate = useNavigate();
  const [showCreate, setShowCreate] = useState(false);
  const [showLesson, setShowLesson] = useState<string | null>(null);
  const [showQuiz, setShowQuiz] = useState<string | null>(null);

  // Create course form state
  const [newCode, setNewCode] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [newDept, setNewDept] = useState("Computer Science");
  const [newCredits, setNewCredits] = useState("3");
  const [newColor, setNewColor] = useState(COLOR_OPTIONS[0].value);

  // Add lesson form state
  const [lessonUnit, setLessonUnit] = useState("");
  const [lessonType, setLessonType] = useState<"video" | "pdf">("video");
  const [lessonTitle, setLessonTitle] = useState("");
  const [lessonDuration, setLessonDuration] = useState("");

  // Quiz form state
  const [quizUnit, setQuizUnit] = useState("");
  const [quizTitle, setQuizTitle] = useState("");
  const [quizDuration, setQuizDuration] = useState("15 min");
  const qKeyRef = useRef(0);
  const [quizQuestions, setQuizQuestions] = useState<
    { _key: number; question: string; options: string[]; correctAnswer: number }[]
  >([{ _key: 0, question: "", options: ["", "", "", ""], correctAnswer: 0 }]);

  function openQuizDialog(courseId: string) {
    const course = courses.find((c) => c.id === courseId);
    setShowQuiz(courseId);
    setQuizTitle("");
    setQuizDuration("15 min");
    qKeyRef.current = 1;
    setQuizQuestions([{ _key: 0, question: "", options: ["", "", "", ""], correctAnswer: 0 }]);
    if (course && course.units.length > 0) {
      setQuizUnit(course.units[0].id);
    } else {
      setQuizUnit("");
    }
  }

  function handleCreateCourse() {
    if (!newCode || !newTitle) {
      toast.error("Code and title are required");
      return;
    }
    addCourse({
      code: newCode,
      title: newTitle,
      faculty: "Dr. Priya Ramanathan",
      department: newDept,
      credits: Number(newCredits),
      color: newColor,
    });
    toast.success(`Course "${newTitle}" created`);
    setShowCreate(false);
    setNewCode("");
    setNewTitle("");
  }

  function handleAddLesson() {
    if (!lessonUnit || !lessonTitle || !lessonDuration) {
      toast.error("All fields are required");
      return;
    }
    const courseId = showLesson!;
    addLesson(courseId, lessonUnit, { title: lessonTitle, type: lessonType, duration: lessonDuration });
    toast.success(`Lesson "${lessonTitle}" added`);
    setShowLesson(null);
    setLessonTitle("");
    setLessonDuration("");
    setLessonUnit("");
  }

  function handleAddQuiz() {
    if (!quizUnit || !quizTitle) {
      toast.error("Unit and title are required");
      return;
    }
    const validQs = quizQuestions
      .filter((q) => q.question && q.options.every((o) => o))
      .map(({ _key: _, ...rest }) => rest);
    if (validQs.length === 0) {
      toast.error("Add at least one complete question");
      return;
    }
    addQuiz(showQuiz!, quizUnit, quizTitle, quizDuration, validQs);
    toast.success(`Quiz "${quizTitle}" added with ${validQs.length} question(s)`);
    setShowQuiz(null);
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Course Management"
        subtitle="Create courses, organise units, manage lessons and assessments"
        actions={
          <Button onClick={() => setShowCreate(true)}>
            <Plus className="h-4 w-4 mr-2" /> Create Course
          </Button>
        }
      />

      <div className="grid gap-4 md:grid-cols-2">
        {courses.map((c) => (
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
                  <BookOpen className="h-3.5 w-3.5" /> {c.units.length} units
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
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1"
                  onClick={() => navigate({ to: "/teacher/courses/$courseId", params: { courseId: c.id } })}
                >
                  Manage Units
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setShowLesson(c.id);
                    if (c.units.length > 0) setLessonUnit(c.units[0].id);
                  }}
                >
                  Add Lesson
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1"
                  onClick={() => openQuizDialog(c.id)}
                >
                  New Quiz
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create Course Dialog */}
      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Course</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label>Course Code *</Label>
                <Input placeholder="e.g. CSE405" value={newCode} onChange={(e) => setNewCode(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label>Credits *</Label>
                <Input type="number" min={1} max={6} value={newCredits} onChange={(e) => setNewCredits(e.target.value)} />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Course Title *</Label>
              <Input placeholder="e.g. Compiler Design" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>Department</Label>
              <Select value={newDept} onValueChange={setNewDept}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Computer Science">Computer Science</SelectItem>
                  <SelectItem value="Electronics">Electronics</SelectItem>
                  <SelectItem value="Mechanical">Mechanical</SelectItem>
                  <SelectItem value="Civil">Civil</SelectItem>
                  <SelectItem value="Management">Management</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Color Theme</Label>
              <div className="grid grid-cols-3 gap-2">
                {COLOR_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setNewColor(opt.value)}
                    className={`h-8 rounded-md bg-gradient-to-r ${opt.value} border-2 transition ${newColor === opt.value ? "border-foreground ring-2 ring-ring" : "border-transparent"}`}
                  />
                ))}
              </div>
            </div>
            <Button onClick={handleCreateCourse}>Create Course</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Lesson Dialog */}
      <Dialog open={!!showLesson} onOpenChange={(v) => !v && setShowLesson(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Lesson</DialogTitle>
          </DialogHeader>
          {showLesson && (
            <div className="grid gap-4">
              <div className="space-y-1.5">
                <Label>Unit *</Label>
                <Select value={lessonUnit} onValueChange={setLessonUnit}>
                  <SelectTrigger><SelectValue placeholder="Select unit" /></SelectTrigger>
                  <SelectContent>
                    {courses.find((c) => c.id === showLesson)?.units.map((u) => (
                      <SelectItem key={u.id} value={u.id}>{u.title}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {courses.find((c) => c.id === showLesson)?.units.length === 0 && (
                  <p className="text-xs text-destructive">No units yet. Add units first via Manage Units.</p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label>Lesson Type</Label>
                <div className="flex gap-2">
                  <Button
                    variant={lessonType === "video" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setLessonType("video")}
                  >
                    <PlayCircle className="h-3.5 w-3.5 mr-1.5" /> Video
                  </Button>
                  <Button
                    variant={lessonType === "pdf" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setLessonType("pdf")}
                  >
                    <FileText className="h-3.5 w-3.5 mr-1.5" /> PDF
                  </Button>
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>Title *</Label>
                <Input placeholder="e.g. Introduction to Parsing" value={lessonTitle} onChange={(e) => setLessonTitle(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label>{lessonType === "video" ? "Duration" : "Pages"} *</Label>
                <Input placeholder={lessonType === "video" ? "e.g. 18 min" : "e.g. 12 pages"} value={lessonDuration} onChange={(e) => setLessonDuration(e.target.value)} />
              </div>
              <Button onClick={handleAddLesson}>Add Lesson</Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* New Quiz Dialog */}
      <Dialog open={!!showQuiz} onOpenChange={(v) => !v && setShowQuiz(null)}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create Quiz</DialogTitle>
          </DialogHeader>
          {showQuiz && (
            <div className="grid gap-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label>Unit *</Label>
                  <Select value={quizUnit} onValueChange={setQuizUnit}>
                    <SelectTrigger><SelectValue placeholder="Select unit" /></SelectTrigger>
                    <SelectContent>
                      {courses.find((c) => c.id === showQuiz)?.units.map((u) => (
                        <SelectItem key={u.id} value={u.id}>{u.title}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>Duration</Label>
                  <Input value={quizDuration} onChange={(e) => setQuizDuration(e.target.value)} placeholder="e.g. 20 min" />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>Quiz Title *</Label>
                <Input value={quizTitle} onChange={(e) => setQuizTitle(e.target.value)} placeholder="e.g. Quiz: Normalization" />
              </div>

              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-semibold">Questions</Label>
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={quizQuestions.length >= 10}
                    onClick={() => {
                      const key = qKeyRef.current++;
                      setQuizQuestions((prev) => [...prev, { _key: key, question: "", options: ["", "", "", ""], correctAnswer: 0 }]);
                    }}
                  >
                    <Plus className="h-3.5 w-3.5 mr-1" /> Add Question
                  </Button>
                </div>
                {quizQuestions.map((q, qi) => (
                  <div key={q._key} className="rounded-lg border p-4 space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-primary/10 text-primary text-xs font-semibold">
                        {qi + 1}
                      </span>
                      <Input
                        placeholder="Question text"
                        value={q.question}
                        onChange={(e) => {
                          const updated = [...quizQuestions];
                          updated[qi] = { ...updated[qi], question: e.target.value };
                          setQuizQuestions(updated);
                        }}
                      />
                    </div>
                    <div className="grid gap-2 sm:grid-cols-2 ml-8">
                      {q.options.map((opt, oi) => (
                        <div key={oi} className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              const updated = [...quizQuestions];
                              updated[qi] = { ...updated[qi], correctAnswer: oi };
                              setQuizQuestions(updated);
                            }}
                            className={`grid h-6 w-6 shrink-0 place-items-center rounded-full text-xs font-medium border transition ${
                              q.correctAnswer === oi
                                ? "bg-green-500 text-white border-green-500"
                                : "bg-muted text-muted-foreground"
                            }`}
                          >
                            {String.fromCharCode(65 + oi)}
                          </button>
                          <Input
                            placeholder={`Option ${String.fromCharCode(65 + oi)}`}
                            value={opt}
                            onChange={(e) => {
                              const updated = [...quizQuestions];
                              const newOpts = [...updated[qi].options];
                              newOpts[oi] = e.target.value;
                              updated[qi] = { ...updated[qi], options: newOpts };
                              setQuizQuestions(updated);
                            }}
                            className="h-8 text-sm"
                          />
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground ml-8">
                      <HelpCircle className="h-3 w-3 inline mr-1" />
                      Click letter to mark correct answer (green = correct)
                    </p>
                  </div>
                ))}
              </div>

              <Button onClick={handleAddQuiz}>Create Quiz</Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
