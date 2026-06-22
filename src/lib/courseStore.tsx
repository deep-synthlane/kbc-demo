import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { COURSES as SEED_COURSES, UNITS as SEED_UNITS } from "./mockData";

// --- Types ---

export type LessonType = "video" | "pdf" | "quiz";

export type Lesson = {
  id: string;
  title: string;
  type: LessonType;
  duration: string;
  done: boolean;
};

export type UnitStatus = "completed" | "in-progress" | "locked";

export type Unit = {
  id: string;
  title: string;
  status: UnitStatus;
  lessons: Lesson[];
};

export type QuizQuestion = {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
};

export type Course = {
  id: string;
  code: string;
  title: string;
  faculty: string;
  department: string;
  credits: number;
  progress: number;
  color: string;
  students: number;
  units: Unit[];
  pending: number;
};

export type CourseActions = {
  addCourse: (data: Omit<Course, "id" | "units" | "progress" | "students" | "pending">) => void;
  addUnit: (courseId: string, title: string) => void;
  editUnit: (courseId: string, unitId: string, data: { title?: string; status?: UnitStatus }) => void;
  deleteUnit: (courseId: string, unitId: string) => void;
  addLesson: (courseId: string, unitId: string, lesson: Omit<Lesson, "id" | "done">) => void;
  deleteLesson: (courseId: string, unitId: string, lessonId: string) => void;
  addQuiz: (courseId: string, unitId: string, title: string, duration: string, questions: Omit<QuizQuestion, "id">[]) => void;
  getQuizQuestions: (quizId: string) => QuizQuestion[];
  markLessonDone: (courseId: string, unitId: string, lessonId: string) => void;
  findQuizLocation: (quizId: string) => { courseId: string; unitId: string } | null;
};

type CourseContextValue = {
  courses: Course[];
  quizBank: Record<string, QuizQuestion[]>;
} & CourseActions;

// --- Seed data ---

const SEED_QUIZ_QUESTIONS: Record<string, QuizQuestion[]> = {
  q1: [
    { id: "qq1", question: "Which data structure uses LIFO (Last In, First Out) ordering?", options: ["Queue", "Stack", "Linked List", "Tree"], correctAnswer: 1 },
    { id: "qq2", question: "What is the time complexity of searching in a balanced BST?", options: ["O(n)", "O(log n)", "O(n log n)", "O(1)"], correctAnswer: 1 },
    { id: "qq3", question: "Which traversal visits the root node between the left and right subtrees?", options: ["Preorder", "Postorder", "Inorder", "Level-order"], correctAnswer: 2 },
    { id: "qq4", question: "A circular linked list's last node points to:", options: ["null", "The head node", "The previous node", "Itself"], correctAnswer: 1 },
    { id: "qq5", question: "Which sorting algorithm has the best average-case time complexity?", options: ["Bubble Sort — O(n²)", "Merge Sort — O(n log n)", "Selection Sort — O(n²)", "Insertion Sort — O(n²)"], correctAnswer: 1 },
  ],
  q2: [
    { id: "qq6", question: "Which data structure is used in BFS?", options: ["Stack", "Queue", "Priority Queue", "Linked List"], correctAnswer: 1 },
    { id: "qq7", question: "A stack can be implemented using:", options: ["Arrays only", "Linked lists only", "Both arrays and linked lists", "Neither"], correctAnswer: 2 },
    { id: "qq8", question: "In a queue, insertion happens at:", options: ["Front", "Rear", "Middle", "Both ends"], correctAnswer: 1 },
  ],
  q3: [
    { id: "qq9", question: "A binary tree with n nodes has at most ___ leaves:", options: ["n/2", "n-1", "⌈n/2⌉", "log n"], correctAnswer: 2 },
    { id: "qq10", question: "Which is NOT a heap property?", options: ["Complete binary tree", "Parent ≥ children (max-heap)", "Sorted left to right", "Shape property"], correctAnswer: 2 },
  ],
};

function buildSeedCourses(): Course[] {
  return SEED_COURSES.map((c) => ({
    ...c,
    units: c.id === "ds" ? (SEED_UNITS as Unit[]) : generateUnitsForCourse(c.id, c.units),
  }));
}

function generateUnitsForCourse(courseId: string, count: number): Unit[] {
  const topics: Record<string, string[]> = {
    dbms: ["ER Modelling", "Relational Algebra", "Normalization", "SQL & PL/SQL", "Transactions"],
    ai: ["Search Algorithms", "Knowledge Representation", "Machine Learning Basics", "Neural Networks", "NLP Intro", "Reinforcement Learning", "AI Ethics"],
    os: ["Process Management", "CPU Scheduling", "Memory Management", "File Systems", "I/O Systems", "Deadlocks"],
  };
  const unitTopics = topics[courseId] || Array.from({ length: count }, (_, i) => `Topic ${i + 1}`);
  return unitTopics.slice(0, count).map((topic, i) => ({
    id: `${courseId}-u${i + 1}`,
    title: `Unit ${i + 1} · ${topic}`,
    status: i === 0 ? "completed" : i === 1 ? "in-progress" : "locked",
    lessons: [
      { id: `${courseId}-l${i * 2 + 1}`, title: `${topic} — Lecture`, type: "video" as LessonType, duration: `${12 + i * 3} min`, done: i === 0 },
      { id: `${courseId}-l${i * 2 + 2}`, title: `${topic} — Notes`, type: "pdf" as LessonType, duration: `${6 + i} pages`, done: i === 0 },
    ],
  }));
}

let idCounter = 1000;
function genId(prefix: string) {
  return `${prefix}${++idCounter}`;
}

// --- Context ---

const CourseContext = createContext<CourseContextValue | null>(null);

export function CourseProvider({ children }: { children: ReactNode }) {
  const [courses, setCourses] = useState<Course[]>(buildSeedCourses);
  const [quizBank, setQuizBank] = useState<Record<string, QuizQuestion[]>>(SEED_QUIZ_QUESTIONS);

  const addCourse = useCallback((data: Omit<Course, "id" | "units" | "progress" | "students" | "pending">) => {
    const id = genId("course-");
    setCourses((prev) => [
      ...prev,
      { ...data, id, units: [], progress: 0, students: 0, pending: 0 },
    ]);
  }, []);

  const addUnit = useCallback((courseId: string, title: string) => {
    setCourses((prev) =>
      prev.map((c) =>
        c.id === courseId
          ? {
              ...c,
              units: [
                ...c.units,
                { id: genId("u-"), title, status: "locked" as UnitStatus, lessons: [] },
              ],
            }
          : c,
      ),
    );
  }, []);

  const editUnit = useCallback((courseId: string, unitId: string, data: { title?: string; status?: UnitStatus }) => {
    setCourses((prev) =>
      prev.map((c) =>
        c.id === courseId
          ? {
              ...c,
              units: c.units.map((u) =>
                u.id === unitId ? { ...u, ...data } : u,
              ),
            }
          : c,
      ),
    );
  }, []);

  const deleteUnit = useCallback((courseId: string, unitId: string) => {
    setCourses((prev) =>
      prev.map((c) =>
        c.id === courseId
          ? { ...c, units: c.units.filter((u) => u.id !== unitId) }
          : c,
      ),
    );
  }, []);

  const addLesson = useCallback((courseId: string, unitId: string, lesson: Omit<Lesson, "id" | "done">) => {
    const id = genId("l-");
    setCourses((prev) =>
      prev.map((c) =>
        c.id === courseId
          ? {
              ...c,
              units: c.units.map((u) =>
                u.id === unitId
                  ? { ...u, lessons: [...u.lessons, { ...lesson, id, done: false }] }
                  : u,
              ),
            }
          : c,
      ),
    );
  }, []);

  const deleteLesson = useCallback((courseId: string, unitId: string, lessonId: string) => {
    setCourses((prev) =>
      prev.map((c) =>
        c.id === courseId
          ? {
              ...c,
              units: c.units.map((u) =>
                u.id === unitId
                  ? { ...u, lessons: u.lessons.filter((l) => l.id !== lessonId) }
                  : u,
              ),
            }
          : c,
      ),
    );
  }, []);

  const addQuiz = useCallback((courseId: string, unitId: string, title: string, duration: string, questions: Omit<QuizQuestion, "id">[]) => {
    const quizId = genId("quiz-");
    const qqs = questions.map((q, i) => ({ ...q, id: `${quizId}-q${i + 1}` }));
    setQuizBank((prev) => ({ ...prev, [quizId]: qqs }));
    setCourses((prev) =>
      prev.map((c) =>
        c.id === courseId
          ? {
              ...c,
              units: c.units.map((u) =>
                u.id === unitId
                  ? { ...u, lessons: [...u.lessons, { id: quizId, title, type: "quiz" as LessonType, duration, done: false }] }
                  : u,
              ),
            }
          : c,
      ),
    );
  }, []);

  const getQuizQuestions = useCallback((quizId: string): QuizQuestion[] => {
    return quizBank[quizId] ?? [];
  }, [quizBank]);

  const markLessonDone = useCallback((courseId: string, unitId: string, lessonId: string) => {
    setCourses((prev) =>
      prev.map((c) =>
        c.id === courseId
          ? {
              ...c,
              units: c.units.map((u) =>
                u.id === unitId
                  ? { ...u, lessons: u.lessons.map((l) => (l.id === lessonId ? { ...l, done: true } : l)) }
                  : u,
              ),
            }
          : c,
      ),
    );
  }, []);

  const findQuizLocation = useCallback((quizId: string): { courseId: string; unitId: string } | null => {
    for (const course of courses) {
      for (const unit of course.units) {
        if (unit.lessons.some((l) => l.id === quizId && l.type === "quiz")) {
          return { courseId: course.id, unitId: unit.id };
        }
      }
    }
    return null;
  }, [courses]);

  return (
    <CourseContext.Provider
      value={{ courses, quizBank, addCourse, addUnit, editUnit, deleteUnit, addLesson, deleteLesson, addQuiz, getQuizQuestions, markLessonDone, findQuizLocation }}
    >
      {children}
    </CourseContext.Provider>
  );
}

export function useCourses() {
  const ctx = useContext(CourseContext);
  if (!ctx) throw new Error("useCourses must be used within CourseProvider");
  return ctx;
}
