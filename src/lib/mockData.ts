// Centralized mock data for the KCG Smart Campus demo.

export type Role = "student" | "teacher" | "admin" | "staff";

export const ROLES: { id: Role; label: string; tagline: string }[] = [
  { id: "student", label: "Student", tagline: "Learn, attend, excel." },
  { id: "teacher", label: "Faculty", tagline: "Teach, evaluate, inspire." },
  { id: "admin", label: "Administrator", tagline: "Govern the campus." },
  { id: "staff", label: "Staff", tagline: "Run the operations." },
];

export const UNIVERSITY = {
  name: "Knowledge Consortium of Gujarat",
  short: "KCG",
  tagline: "Department of Education · Government of Gujarat",
  motto: "Knowledge · Innovation · Excellence",
  established: 2014,
  location: "Gandhinagar, Gujarat",
  accreditations: ["Govt. of Gujarat", "Dept. of Education", "UGC Recognised", "NAAC Accredited"],
  logo: "/kcg-logo.png",
};

export const COURSES = [
  {
    id: "ds",
    code: "CSE301",
    title: "Data Structures",
    faculty: "Dr. Priya Ramanathan",
    department: "Computer Science",
    credits: 4,
    progress: 72,
    color: "from-indigo-500 to-blue-600",
    students: 86,
    units: 6,
    pending: 3,
  },
  {
    id: "dbms",
    code: "CSE305",
    title: "Database Management Systems",
    faculty: "Prof. Arjun Krishnan",
    department: "Computer Science",
    credits: 4,
    progress: 58,
    color: "from-emerald-500 to-teal-600",
    students: 92,
    units: 5,
    pending: 1,
  },
  {
    id: "ai",
    code: "CSE402",
    title: "Artificial Intelligence",
    faculty: "Dr. Meera Subramanian",
    department: "Computer Science",
    credits: 3,
    progress: 41,
    color: "from-violet-500 to-fuchsia-600",
    students: 74,
    units: 7,
    pending: 5,
  },
  {
    id: "os",
    code: "CSE304",
    title: "Operating Systems",
    faculty: "Dr. Karthik Venkatesan",
    department: "Computer Science",
    credits: 4,
    progress: 65,
    color: "from-amber-500 to-orange-600",
    students: 88,
    units: 6,
    pending: 2,
  },
];

export const UNITS = [
  {
    id: "u1",
    title: "Unit 1 · Arrays & Linked Lists",
    status: "completed",
    lessons: [
      { id: "l1", title: "Introduction to Arrays", type: "video", duration: "12 min", done: true },
      { id: "l2", title: "Singly Linked Lists", type: "video", duration: "18 min", done: true },
      { id: "l3", title: "Reference Notes (PDF)", type: "pdf", duration: "8 pages", done: true },
      { id: "q1", title: "Quiz: Linear Structures", type: "quiz", duration: "20 min", done: true },
    ],
  },
  {
    id: "u2",
    title: "Unit 2 · Stacks & Queues",
    status: "in-progress",
    lessons: [
      { id: "l4", title: "Stack ADT", type: "video", duration: "15 min", done: true },
      { id: "l5", title: "Queue Variants", type: "video", duration: "14 min", done: true },
      { id: "l6", title: "Hands-on Notebook", type: "pdf", duration: "12 pages", done: false },
      { id: "q2", title: "Quiz: Stacks & Queues", type: "quiz", duration: "20 min", done: false },
    ],
  },
  {
    id: "u3",
    title: "Unit 3 · Trees & Heaps",
    status: "locked",
    lessons: [
      { id: "l7", title: "Binary Trees", type: "video", duration: "22 min", done: false },
      { id: "l8", title: "Heap Operations", type: "video", duration: "18 min", done: false },
      { id: "q3", title: "Quiz: Trees", type: "quiz", duration: "25 min", done: false },
    ],
  },
];

export const QUIZ_RESULT = {
  title: "Quiz: Linear Structures",
  score: 18,
  total: 20,
  performance: "Excellent",
  timeTaken: "14 min",
  facultyFeedback:
    "Outstanding grasp of pointer manipulation. Revise edge cases for circular linked lists before the unit test.",
  breakdown: [
    { topic: "Arrays", correct: 5, total: 5 },
    { topic: "Linked Lists", correct: 6, total: 7 },
    { topic: "Complexity", correct: 4, total: 4 },
    { topic: "Edge Cases", correct: 3, total: 4 },
  ],
};

export const ATTENDANCE_TREND = [
  { month: "Aug", attendance: 92 },
  { month: "Sep", attendance: 88 },
  { month: "Oct", attendance: 90 },
  { month: "Nov", attendance: 86 },
  { month: "Dec", attendance: 91 },
  { month: "Jan", attendance: 89 },
];

export const UPCOMING_EXAMS = [
  { id: "e1", course: "Data Structures", date: "28 Jun 2026", time: "10:00 AM", room: "Hall A-201", type: "Mid-Sem" },
  { id: "e2", course: "DBMS", date: "30 Jun 2026", time: "02:00 PM", room: "Hall B-104", type: "Mid-Sem" },
  { id: "e3", course: "AI", date: "03 Jul 2026", time: "10:00 AM", room: "Hall A-105", type: "Mid-Sem" },
  { id: "e4", course: "Operating Systems", date: "05 Jul 2026", time: "02:00 PM", room: "Hall C-301", type: "Mid-Sem" },
];

export const ASSIGNMENTS = [
  { id: "a1", title: "Implement LRU Cache", course: "Data Structures", due: "24 Jun", status: "Pending", weight: 10 },
  { id: "a2", title: "ER Diagram for Library System", course: "DBMS", due: "26 Jun", status: "Submitted", weight: 8 },
  { id: "a3", title: "Min-Max Search Tree", course: "AI", due: "29 Jun", status: "Pending", weight: 12 },
  { id: "a4", title: "Process Scheduling Sim", course: "OS", due: "01 Jul", status: "Draft", weight: 10 },
];

export const NOTIFICATIONS = [
  { id: "n1", title: "Mid-Sem timetable published", time: "2h ago", type: "academic" },
  { id: "n2", title: "AI assignment deadline extended", time: "5h ago", type: "course" },
  { id: "n3", title: "Library fine reminder · ₹40", time: "1d ago", type: "admin" },
  { id: "n4", title: "Live class · DBMS at 3:00 PM", time: "1d ago", type: "class" },
];

export const LIVE_CLASSES = [
  {
    id: "lc1",
    title: "DBMS · Normalization Deep Dive",
    faculty: "Prof. Arjun Krishnan",
    platform: "Google Meet",
    date: "Today",
    time: "3:00 PM – 4:00 PM",
    status: "live",
  },
  {
    id: "lc2",
    title: "AI · Reinforcement Learning Intro",
    faculty: "Dr. Meera Subramanian",
    platform: "Microsoft Teams",
    date: "Tomorrow",
    time: "10:30 AM – 11:30 AM",
    status: "upcoming",
  },
  {
    id: "lc3",
    title: "OS · Synchronisation Primitives",
    faculty: "Dr. Karthik Venkatesan",
    platform: "Google Meet",
    date: "24 Jun",
    time: "2:00 PM – 3:00 PM",
    status: "upcoming",
  },
];

export const RECORDINGS = [
  { id: "r1", title: "Data Structures · Linked Lists", date: "14 Jun", duration: "58:12", views: 142 },
  { id: "r2", title: "DBMS · Joins & Subqueries", date: "12 Jun", duration: "1:04:30", views: 168 },
  { id: "r3", title: "AI · Search Algorithms", date: "10 Jun", duration: "47:55", views: 121 },
  { id: "r4", title: "OS · Memory Management", date: "08 Jun", duration: "52:18", views: 134 },
];

export const TIMETABLE = {
  periods: ["09:00", "10:00", "11:00", "12:00", "01:00", "02:00", "03:00", "04:00"],
  days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  grid: [
    ["DS · A-201", "DBMS · B-104", "—", "AI · A-105", "Lunch", "OS · C-301", "Lab · CSL-1", "Lab · CSL-1"],
    ["AI · A-105", "DS · A-201", "OS · C-301", "—", "Lunch", "DBMS · B-104", "Seminar", "—"],
    ["DBMS · B-104", "OS · C-301", "DS · A-201", "AI · A-105", "Lunch", "Mentor", "Lab · CSL-2", "Lab · CSL-2"],
    ["OS · C-301", "AI · A-105", "DBMS · B-104", "DS · A-201", "Lunch", "Library", "Lab · CSL-1", "—"],
    ["DS · A-201", "DBMS · B-104", "AI · A-105", "OS · C-301", "Lunch", "Sports", "Club", "—"],
    ["Workshop", "Workshop", "—", "—", "—", "—", "—", "—"],
  ],
};

export const STUDENT_PROFILE = {
  name: "Ananya Iyer",
  enrollment: "KCGU/22/CSE/0184",
  email: "ananya.iyer@kcgu.edu.in",
  department: "Computer Science & Engineering",
  semester: "Semester 6",
  batch: "2022 – 2026",
  cgpa: 8.74,
  attendance: 89,
  credits: 142,
  totalCredits: 180,
  mentor: "Dr. Priya Ramanathan",
};

export const TRANSCRIPT = [
  { sem: "Sem 1", gpa: 8.5, credits: 24, status: "Completed" },
  { sem: "Sem 2", gpa: 8.7, credits: 24, status: "Completed" },
  { sem: "Sem 3", gpa: 8.6, credits: 26, status: "Completed" },
  { sem: "Sem 4", gpa: 8.9, credits: 24, status: "Completed" },
  { sem: "Sem 5", gpa: 8.8, credits: 22, status: "Completed" },
  { sem: "Sem 6", gpa: 8.7, credits: 22, status: "Ongoing" },
];

export const GRADE_DISTRIBUTION = [
  { grade: "O", count: 8 },
  { grade: "A+", count: 12 },
  { grade: "A", count: 6 },
  { grade: "B+", count: 2 },
  { grade: "B", count: 1 },
];

// --- Admin / Institutional data ---

export const ADMIN_KPIS = {
  students: 4862,
  teachers: 312,
  courses: 184,
  exams: 36,
};

export const ENROLLMENT_BY_DEPT = [
  { dept: "BBA", students: 1240 },
  { dept: "BCA", students: 980 },
  { dept: "BE", students: 720 },
  { dept: "BCom", students: 540 },
  { dept: "MBA", students: 612 },
  { dept: "B.Sc", students: 770 },
];

export const FEE_COLLECTION = [
  { name: "Collected", value: 78 },
  { name: "Pending", value: 14 },
  { name: "Overdue", value: 8 },
];

export { APPLICATIONS } from "./admissions";
export type { AdmissionApplication, ApplicationDocument } from "./admissions";

export const STUDENTS_DIRECTORY = [
  { slug: "s0", id: "KCGU/22/CSE/0184", name: "Ananya Iyer",  dept: "CSE",   sem: 6, cgpa: 8.74, attendance: 89 },
  { slug: "s1", id: "KCGU/22/CSE/0185", name: "Rahul Verma",  dept: "CSE",   sem: 6, cgpa: 8.12, attendance: 82 },
  { slug: "s2", id: "KCGU/22/ECE/0091", name: "Priya Nair",   dept: "ECE",   sem: 6, cgpa: 9.02, attendance: 94 },
  { slug: "s3", id: "KCGU/23/MECH/0040",name: "Imran Khan",   dept: "MECH",  sem: 4, cgpa: 7.65, attendance: 78 },
  { slug: "s4", id: "KCGU/24/MBA/0018", name: "Ritika Bose",  dept: "MBA",   sem: 2, cgpa: 8.92, attendance: 91 },
  { slug: "s5", id: "KCGU/23/CIVIL/0022",name:"Suresh Babu",  dept: "CIVIL", sem: 4, cgpa: 7.41, attendance: 74 },
];

export const STUDENT_DETAIL: Record<string, {
  email: string; phone: string; batch: string; mentor: string; status: string; credits: number; totalCredits: number;
  transcript: { sem: string; gpa: number; credits: number; status: string }[];
  courses: { code: string; title: string; faculty: string; grade: string }[];
  gradeDistribution: { grade: string; count: number }[];
  timeline: { semester: string; year: string; courses: number; credits: number; status: string }[];
}> = {
  s0: {
    email: "ananya.iyer@kcg.edu.in", phone: "+91 98765 43210", batch: "2022–26", mentor: "Dr. Priya Ramanathan", status: "Active · Good Standing", credits: 120, totalCredits: 160,
    transcript: [
      { sem: "Semester 1", gpa: 8.4, credits: 22, status: "Completed" },
      { sem: "Semester 2", gpa: 8.6, credits: 22, status: "Completed" },
      { sem: "Semester 3", gpa: 8.9, credits: 24, status: "Completed" },
      { sem: "Semester 4", gpa: 8.7, credits: 24, status: "Completed" },
      { sem: "Semester 5", gpa: 8.8, credits: 28, status: "Completed" },
      { sem: "Semester 6", gpa: 0,   credits: 0,  status: "Ongoing"   },
    ],
    courses: [
      { code: "CSE301", title: "Data Structures",  faculty: "Dr. Priya Ramanathan", grade: "A" },
      { code: "CSE305", title: "DBMS",             faculty: "Prof. Arjun Krishnan",  grade: "A+" },
      { code: "CSE402", title: "AI",               faculty: "Dr. Meera Subramanian", grade: "A" },
      { code: "CSE304", title: "Operating Systems",faculty: "Dr. Karthik Venkatesan",grade: "B+" },
    ],
    gradeDistribution: [{ grade:"A+",count:8 },{ grade:"A",count:12 },{ grade:"B+",count:5 },{ grade:"B",count:2 },{ grade:"C",count:1 }],
    timeline: [
      { semester:"Semester 1",year:"2022–23",courses:6,credits:22,status:"Completed" },
      { semester:"Semester 2",year:"2022–23",courses:6,credits:22,status:"Completed" },
      { semester:"Semester 3",year:"2023–24",courses:7,credits:24,status:"Completed" },
      { semester:"Semester 4",year:"2023–24",courses:7,credits:24,status:"Completed" },
      { semester:"Semester 5",year:"2024–25",courses:8,credits:28,status:"Completed" },
      { semester:"Semester 6",year:"2025–26",courses:6,credits:0, status:"Ongoing"   },
    ],
  },
  s1: {
    email: "rahul.verma@kcg.edu.in", phone: "+91 91234 56789", batch: "2022–26", mentor: "Dr. Priya Ramanathan", status: "Active", credits: 108, totalCredits: 160,
    transcript: [
      { sem: "Semester 1", gpa: 7.9, credits: 22, status: "Completed" },
      { sem: "Semester 2", gpa: 8.1, credits: 22, status: "Completed" },
      { sem: "Semester 3", gpa: 8.2, credits: 24, status: "Completed" },
      { sem: "Semester 4", gpa: 8.0, credits: 24, status: "Completed" },
      { sem: "Semester 5", gpa: 8.3, credits: 16, status: "Completed" },
      { sem: "Semester 6", gpa: 0,   credits: 0,  status: "Ongoing"   },
    ],
    courses: [
      { code: "CSE301", title: "Data Structures",  faculty: "Dr. Priya Ramanathan", grade: "A" },
      { code: "CSE305", title: "DBMS",             faculty: "Prof. Arjun Krishnan",  grade: "A" },
      { code: "CSE402", title: "AI",               faculty: "Dr. Meera Subramanian", grade: "B+" },
      { code: "CSE304", title: "Operating Systems",faculty: "Dr. Karthik Venkatesan",grade: "B+" },
    ],
    gradeDistribution: [{ grade:"A+",count:3 },{ grade:"A",count:10 },{ grade:"B+",count:9 },{ grade:"B",count:4 },{ grade:"C",count:2 }],
    timeline: [
      { semester:"Semester 1",year:"2022–23",courses:6,credits:22,status:"Completed" },
      { semester:"Semester 2",year:"2022–23",courses:6,credits:22,status:"Completed" },
      { semester:"Semester 3",year:"2023–24",courses:7,credits:24,status:"Completed" },
      { semester:"Semester 4",year:"2023–24",courses:7,credits:24,status:"Completed" },
      { semester:"Semester 5",year:"2024–25",courses:5,credits:16,status:"Completed" },
      { semester:"Semester 6",year:"2025–26",courses:6,credits:0, status:"Ongoing"   },
    ],
  },
  s2: {
    email: "priya.nair@kcg.edu.in", phone: "+91 99887 76655", batch: "2022–26", mentor: "Prof. Anjali Mehta", status: "Active · Honours", credits: 126, totalCredits: 160,
    transcript: [
      { sem: "Semester 1", gpa: 9.1, credits: 22, status: "Completed" },
      { sem: "Semester 2", gpa: 9.0, credits: 22, status: "Completed" },
      { sem: "Semester 3", gpa: 9.2, credits: 24, status: "Completed" },
      { sem: "Semester 4", gpa: 8.9, credits: 24, status: "Completed" },
      { sem: "Semester 5", gpa: 9.1, credits: 34, status: "Completed" },
      { sem: "Semester 6", gpa: 0,   credits: 0,  status: "Ongoing"   },
    ],
    courses: [
      { code: "ECE401", title: "VLSI Design",      faculty: "Prof. Anjali Mehta",   grade: "A+" },
      { code: "ECE405", title: "Signal Processing", faculty: "Dr. Rajan Kumar",      grade: "A+" },
      { code: "ECE307", title: "Microprocessors",   faculty: "Dr. Sunita Pillai",    grade: "A"  },
    ],
    gradeDistribution: [{ grade:"A+",count:14 },{ grade:"A",count:9 },{ grade:"B+",count:3 },{ grade:"B",count:1 },{ grade:"C",count:0 }],
    timeline: [
      { semester:"Semester 1",year:"2022–23",courses:6,credits:22,status:"Completed" },
      { semester:"Semester 2",year:"2022–23",courses:6,credits:22,status:"Completed" },
      { semester:"Semester 3",year:"2023–24",courses:7,credits:24,status:"Completed" },
      { semester:"Semester 4",year:"2023–24",courses:7,credits:24,status:"Completed" },
      { semester:"Semester 5",year:"2024–25",courses:9,credits:34,status:"Completed" },
      { semester:"Semester 6",year:"2025–26",courses:6,credits:0, status:"Ongoing"   },
    ],
  },
  s3: {
    email: "imran.khan@kcg.edu.in", phone: "+91 97654 32109", batch: "2023–27", mentor: "Dr. Sameer Rao", status: "Active", credits: 70, totalCredits: 160,
    transcript: [
      { sem: "Semester 1", gpa: 7.5, credits: 22, status: "Completed" },
      { sem: "Semester 2", gpa: 7.6, credits: 22, status: "Completed" },
      { sem: "Semester 3", gpa: 7.8, credits: 26, status: "Completed" },
      { sem: "Semester 4", gpa: 0,   credits: 0,  status: "Ongoing"   },
    ],
    courses: [
      { code: "ME301", title: "Thermodynamics",   faculty: "Dr. Sameer Rao",     grade: "B+" },
      { code: "ME305", title: "Fluid Mechanics",  faculty: "Prof. Dinesh Patil", grade: "B"  },
      { code: "ME401", title: "Machine Design",   faculty: "Dr. Rekha Shah",     grade: "A"  },
    ],
    gradeDistribution: [{ grade:"A+",count:1 },{ grade:"A",count:5 },{ grade:"B+",count:8 },{ grade:"B",count:7 },{ grade:"C",count:3 }],
    timeline: [
      { semester:"Semester 1",year:"2023–24",courses:6,credits:22,status:"Completed" },
      { semester:"Semester 2",year:"2023–24",courses:6,credits:22,status:"Completed" },
      { semester:"Semester 3",year:"2024–25",courses:7,credits:26,status:"Completed" },
      { semester:"Semester 4",year:"2024–25",courses:6,credits:0, status:"Ongoing"   },
    ],
  },
  s4: {
    email: "ritika.bose@kcg.edu.in", phone: "+91 98001 12345", batch: "2024–26", mentor: "Prof. Nandini Gupta", status: "Active · Good Standing", credits: 44, totalCredits: 80,
    transcript: [
      { sem: "Semester 1", gpa: 8.8, credits: 22, status: "Completed" },
      { sem: "Semester 2", gpa: 9.0, credits: 22, status: "Completed" },
      { sem: "Semester 3", gpa: 0,   credits: 0,  status: "Ongoing"   },
    ],
    courses: [
      { code: "MBA201", title: "Marketing Management", faculty: "Prof. Nandini Gupta", grade: "A+" },
      { code: "MBA205", title: "Financial Accounting",  faculty: "Dr. Prakash Iyer",    grade: "A"  },
      { code: "MBA301", title: "Operations Research",   faculty: "Dr. Leela Nair",      grade: "A"  },
    ],
    gradeDistribution: [{ grade:"A+",count:6 },{ grade:"A",count:8 },{ grade:"B+",count:4 },{ grade:"B",count:0 },{ grade:"C",count:0 }],
    timeline: [
      { semester:"Semester 1",year:"2024–25",courses:6,credits:22,status:"Completed" },
      { semester:"Semester 2",year:"2024–25",courses:6,credits:22,status:"Completed" },
      { semester:"Semester 3",year:"2025–26",courses:5,credits:0, status:"Ongoing"   },
    ],
  },
  s5: {
    email: "suresh.babu@kcg.edu.in", phone: "+91 96321 54780", batch: "2023–27", mentor: "Prof. Vijay Kumar", status: "Active · Warning", credits: 66, totalCredits: 160,
    transcript: [
      { sem: "Semester 1", gpa: 7.2, credits: 20, status: "Completed" },
      { sem: "Semester 2", gpa: 7.0, credits: 22, status: "Completed" },
      { sem: "Semester 3", gpa: 7.6, credits: 24, status: "Completed" },
      { sem: "Semester 4", gpa: 0,   credits: 0,  status: "Ongoing"   },
    ],
    courses: [
      { code: "CE301", title: "Structural Analysis",  faculty: "Prof. Vijay Kumar",  grade: "B+" },
      { code: "CE305", title: "Geotechnical Engg",    faculty: "Dr. Kavitha Menon",  grade: "B"  },
      { code: "CE401", title: "Transportation Engg",  faculty: "Dr. Mohan Reddy",    grade: "B+" },
    ],
    gradeDistribution: [{ grade:"A+",count:0 },{ grade:"A",count:4 },{ grade:"B+",count:9 },{ grade:"B",count:9 },{ grade:"C",count:2 }],
    timeline: [
      { semester:"Semester 1",year:"2023–24",courses:5,credits:20,status:"Completed" },
      { semester:"Semester 2",year:"2023–24",courses:6,credits:22,status:"Completed" },
      { semester:"Semester 3",year:"2024–25",courses:7,credits:24,status:"Completed" },
      { semester:"Semester 4",year:"2024–25",courses:6,credits:0, status:"Ongoing"   },
    ],
  },
};

export const EXAM_SCHEDULE = [
  { id: "ex1", course: "CSE301 · Data Structures", date: "28 Jun 2026", session: "FN", hall: "A-201", invigilator: "Dr. Suresh" },
  { id: "ex2", course: "CSE305 · DBMS", date: "30 Jun 2026", session: "AN", hall: "B-104", invigilator: "Prof. Latha" },
  { id: "ex3", course: "CSE402 · AI", date: "03 Jul 2026", session: "FN", hall: "A-105", invigilator: "Dr. Joseph" },
  { id: "ex4", course: "CSE304 · OS", date: "05 Jul 2026", session: "AN", hall: "C-301", invigilator: "Dr. Anita" },
];

export const CONTENT_ITEMS = [
  { id: "c1", title: "DS · Unit 3 Lecture Slides", type: "PPT", status: "Published", updated: "12 Jun", version: "v3.0" },
  { id: "c2", title: "DBMS · Normalization Walkthrough", type: "Video", status: "Review", updated: "13 Jun", version: "v2.1" },
  { id: "c3", title: "AI · Reinforcement Learning Notes", type: "PDF", status: "Draft", updated: "14 Jun", version: "v1.0" },
  { id: "c4", title: "OS · Scheduling SCORM Module", type: "SCORM", status: "Published", updated: "10 Jun", version: "v2.0" },
  { id: "c5", title: "DS · Trees Lab Manual", type: "PDF", status: "Review", updated: "15 Jun", version: "v1.2" },
];

export const QUESTION_BANK = [
  { id: "qb1", topic: "Stacks", type: "MCQ", difficulty: "Easy", count: 24 },
  { id: "qb2", topic: "Linked Lists", type: "MCQ", difficulty: "Medium", count: 38 },
  { id: "qb3", topic: "Normalization", type: "Short", difficulty: "Medium", count: 18 },
  { id: "qb4", topic: "Search Algorithms", type: "MCQ", difficulty: "Hard", count: 21 },
  { id: "qb5", topic: "Page Replacement", type: "Long", difficulty: "Hard", count: 12 },
];

export const SUBMISSIONS_TO_GRADE = [
  { id: "s1", student: "Ananya Iyer", assignment: "LRU Cache", submitted: "23 Jun", status: "Pending" },
  { id: "s2", student: "Rahul Verma", assignment: "LRU Cache", submitted: "23 Jun", status: "Pending" },
  { id: "s3", student: "Priya Nair", assignment: "ER Diagram", submitted: "22 Jun", status: "Graded" },
  { id: "s4", student: "Imran Khan", assignment: "Min-Max Tree", submitted: "21 Jun", status: "Pending" },
];

export const STAFF_TASKS = [
  { id: "t1", title: "Verify Sneha Pillai's bonafide", column: "Today", priority: "High" },
  { id: "t2", title: "Process hostel allotment batch #14", column: "Today", priority: "High" },
  { id: "t3", title: "Issue transfer certificates (3)", column: "In Progress", priority: "Medium" },
  { id: "t4", title: "Library overdue follow-ups", column: "In Progress", priority: "Low" },
  { id: "t5", title: "Mid-sem hall ticket distribution", column: "Done", priority: "High" },
  { id: "t6", title: "Update fee receipts for 24 students", column: "Done", priority: "Medium" },
];

// --- AI features ---

export const INTERVIEW_QA = [
  { q: "Walk me through the difference between a process and a thread.", a: "Discussed PCB, address space sharing, context-switch cost." },
  { q: "Design a URL shortener at 100M req/day.", a: "Covered base62, sharded KV, cache layer, write-through pattern." },
  { q: "Tell me about a conflict you resolved in a team project.", a: "STAR format response on the inter-club fest planning." },
];

export const MEETING_TRANSCRIPT = [
  { t: "00:02", speaker: "Dean", text: "Let's review the mid-semester academic calendar updates." },
  { t: "00:18", speaker: "Registrar", text: "Exam window is locked between June 28 and July 8." },
  { t: "00:41", speaker: "HoD CSE", text: "We need an extra lab slot for AI – proposing Thursday 4 PM." },
  { t: "01:05", speaker: "Dean", text: "Approved. Please publish via the LMS by tomorrow." },
  { t: "01:24", speaker: "Registrar", text: "Hall tickets will auto-generate after attendance freeze on the 26th." },
];

export const PROCTOR_FEED = [
  { id: "p1", student: "Ananya Iyer", face: true, identity: true, gaze: "OK", flags: 0 },
  { id: "p2", student: "Rahul Verma", face: true, identity: true, gaze: "OK", flags: 1 },
  { id: "p3", student: "Priya Nair", face: true, identity: true, gaze: "Left", flags: 0 },
  { id: "p4", student: "Imran Khan", face: false, identity: true, gaze: "OK", flags: 3 },
  { id: "p5", student: "Ritika Bose", face: true, identity: true, gaze: "OK", flags: 0 },
  { id: "p6", student: "Suresh Babu", face: true, identity: false, gaze: "Down", flags: 2 },
];

export const FEEDBACK_SENTIMENT = [
  { name: "Positive", value: 68 },
  { name: "Neutral", value: 22 },
  { name: "Negative", value: 10 },
];

export const FACULTY_RATINGS = [
  { faculty: "Dr. Priya R.", rating: 4.7 },
  { faculty: "Prof. Arjun K.", rating: 4.5 },
  { faculty: "Dr. Meera S.", rating: 4.8 },
  { faculty: "Dr. Karthik V.", rating: 4.4 },
  { faculty: "Dr. Suresh M.", rating: 4.2 },
];

// --- Quiz questions for student quiz-taking flow ---

export const QUIZ_QUESTIONS = [
  {
    id: "qq1",
    question: "Which data structure uses LIFO (Last In, First Out) ordering?",
    options: ["Queue", "Stack", "Linked List", "Tree"],
    correctAnswer: 1,
  },
  {
    id: "qq2",
    question: "What is the time complexity of searching in a balanced BST?",
    options: ["O(n)", "O(log n)", "O(n log n)", "O(1)"],
    correctAnswer: 1,
  },
  {
    id: "qq3",
    question: "Which traversal visits the root node between the left and right subtrees?",
    options: ["Preorder", "Postorder", "Inorder", "Level-order"],
    correctAnswer: 2,
  },
  {
    id: "qq4",
    question: "A circular linked list's last node points to:",
    options: ["null", "The head node", "The previous node", "Itself"],
    correctAnswer: 1,
  },
  {
    id: "qq5",
    question: "Which sorting algorithm has the best average-case time complexity?",
    options: ["Bubble Sort — O(n²)", "Merge Sort — O(n log n)", "Selection Sort — O(n²)", "Insertion Sort — O(n²)"],
    correctAnswer: 1,
  },
];

// --- Enrollment history for student profile ---

export const ENROLLMENT_HISTORY = [
  { semester: "Semester 1", year: "2022-23", status: "Completed", courses: 6, credits: 24 },
  { semester: "Semester 2", year: "2022-23", status: "Completed", courses: 6, credits: 24 },
  { semester: "Semester 3", year: "2023-24", status: "Completed", courses: 7, credits: 26 },
  { semester: "Semester 4", year: "2023-24", status: "Completed", courses: 6, credits: 24 },
  { semester: "Semester 5", year: "2024-25", status: "Completed", courses: 5, credits: 22 },
  { semester: "Semester 6", year: "2025-26", status: "Ongoing", courses: 5, credits: 22 },
];

// --- Student curriculum (semester-wise course list) ---

export const STUDENT_CURRICULUM = [
  {
    semester: 1, courses: [
      { code: "CSE101", title: "Programming in C", credits: 4, type: "Core" },
      { code: "MAT101", title: "Engineering Mathematics I", credits: 4, type: "Core" },
      { code: "PHY101", title: "Engineering Physics", credits: 3, type: "Core" },
      { code: "ENG101", title: "Technical English", credits: 2, type: "Core" },
      { code: "CSE102", title: "Computer Lab I", credits: 2, type: "Lab" },
      { code: "PHY102", title: "Physics Lab", credits: 1, type: "Lab" },
    ],
  },
  {
    semester: 2, courses: [
      { code: "CSE201", title: "Object-Oriented Programming", credits: 4, type: "Core" },
      { code: "MAT201", title: "Engineering Mathematics II", credits: 4, type: "Core" },
      { code: "CHE201", title: "Engineering Chemistry", credits: 3, type: "Core" },
      { code: "EEE201", title: "Basic Electrical Engineering", credits: 3, type: "Core" },
      { code: "CSE202", title: "OOP Lab", credits: 2, type: "Lab" },
      { code: "CHE202", title: "Chemistry Lab", credits: 1, type: "Lab" },
    ],
  },
  {
    semester: 3, courses: [
      { code: "CSE301", title: "Data Structures", credits: 4, type: "Core" },
      { code: "CSE302", title: "Digital Logic Design", credits: 3, type: "Core" },
      { code: "MAT301", title: "Discrete Mathematics", credits: 4, type: "Core" },
      { code: "CSE303", title: "Computer Organisation", credits: 3, type: "Core" },
      { code: "CSE304", title: "DS Lab", credits: 2, type: "Lab" },
      { code: "HSS301", title: "Economics for Engineers", credits: 2, type: "Elective" },
      { code: "CSE305", title: "Mini Project I", credits: 1, type: "Lab" },
    ],
  },
  {
    semester: 4, courses: [
      { code: "CSE401", title: "Design & Analysis of Algorithms", credits: 4, type: "Core" },
      { code: "CSE402", title: "Database Management Systems", credits: 4, type: "Core" },
      { code: "CSE403", title: "Operating Systems", credits: 4, type: "Core" },
      { code: "MAT401", title: "Probability & Statistics", credits: 3, type: "Core" },
      { code: "CSE404", title: "DBMS Lab", credits: 2, type: "Lab" },
      { code: "CSE405", title: "OS Lab", credits: 2, type: "Lab" },
    ],
  },
  {
    semester: 5, courses: [
      { code: "CSE501", title: "Computer Networks", credits: 4, type: "Core" },
      { code: "CSE502", title: "Software Engineering", credits: 3, type: "Core" },
      { code: "CSE503", title: "Theory of Computation", credits: 3, type: "Core" },
      { code: "CSE504", title: "Machine Learning", credits: 3, type: "Elective" },
      { code: "CSE505", title: "Networks Lab", credits: 2, type: "Lab" },
    ],
  },
  {
    semester: 6, courses: [
      { code: "CSE601", title: "Data Structures (Advanced)", credits: 4, type: "Core" },
      { code: "CSE602", title: "DBMS (Advanced)", credits: 4, type: "Core" },
      { code: "CSE603", title: "Artificial Intelligence", credits: 3, type: "Core" },
      { code: "CSE604", title: "Operating Systems (Advanced)", credits: 4, type: "Core" },
      { code: "CSE605", title: "Cloud Computing", credits: 3, type: "Elective" },
    ],
  },
  {
    semester: 7, courses: [
      { code: "CSE701", title: "Compiler Design", credits: 4, type: "Core" },
      { code: "CSE702", title: "Information Security", credits: 3, type: "Core" },
      { code: "CSE703", title: "Deep Learning", credits: 3, type: "Elective" },
      { code: "CSE704", title: "Industry Internship", credits: 6, type: "Core" },
      { code: "CSE705", title: "Seminar", credits: 2, type: "Core" },
    ],
  },
  {
    semester: 8, courses: [
      { code: "CSE801", title: "Project Work", credits: 10, type: "Core" },
      { code: "CSE802", title: "Comprehensive Viva", credits: 2, type: "Core" },
      { code: "CSE803", title: "Blockchain & Web3", credits: 3, type: "Elective" },
      { code: "CSE804", title: "Ethics in Computing", credits: 2, type: "Core" },
    ],
  },
];
