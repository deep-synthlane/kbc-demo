
# KCG University Digital Learning & Academic Management Platform — Demo Plan

A fully clickable, front-end-only prototype with realistic dummy data. No backend; role + "logged-in user" stored in localStorage so navigation feels real.

## Scope & Approach

- Pure frontend demo (TanStack Start routes, mock data in `src/data/*`).
- 4 role portals (Student, Teacher, Admin, Staff) + shared AI Features section.
- Shared layout shell per role: top bar (university brand, search, notifications, avatar) + collapsible sidebar nav.
- Charts via `recharts`, icons via `lucide-react`, tables/cards via existing shadcn components.

## Design System

- Clean enterprise SaaS, white background, deep university blue primary (`oklch` token), gold accent for academic feel.
- Typography: Inter for UI, serif display (e.g. Fraunces) for university branding headers.
- Tokens added to `src/styles.css`: `--primary` (university blue), `--accent` (gold), chart palette, semantic surfaces.
- Reusable: `StatCard`, `SectionHeader`, `ChartCard`, `DataTable`, `StatusBadge`, `PageHeader`.

## Route Map

```
/                                  Landing → redirects to /login
/login                             Role-selector login
/student                           Layout (sidebar)
  /dashboard, /courses, /courses/$courseId,
  /courses/$courseId/lesson/$lessonId, /courses/$courseId/quiz/$quizId,
  /assessments, /live-classes, /timetable, /profile
/teacher
  /dashboard, /courses, /courses/$courseId,
  /content, /content/new, /assessments, /assessments/evaluate/$id,
  /live-classes
/admin
  /dashboard, /admissions, /curriculum, /students, /students/$id,
  /timetable, /examinations, /reports, /ai
/staff
  /dashboard, /tasks, /records, /announcements
/ai (shared, linked from Admin)
  /interview, /meeting, /proctoring, /feedback
```

Each layout route renders `<Outlet />`; every route file gets its own `head()` metadata.

## Role Portals — Page Contents

**Auth**
- `/login`: split-screen — left: university crest, tagline, accreditation badges; right: email/password form, SSO buttons (Google Workspace / Microsoft / DigiLocker mock), role selector (Student/Teacher/Admin/Staff). Submit → write role to localStorage → redirect to `/{role}/dashboard`.

**Student**
- Dashboard: stat cards (Enrolled Courses, Attendance %, Credits, Assignments Due), enrolled course cards with progress (DS, DBMS, AI, OS), upcoming exams list, notifications feed, attendance line chart.
- Courses list → Course detail (Units → Lessons → Quizzes accordion, progress bar). Lesson page: video player mock + PDF viewer tab + "Mark complete". Quiz page: MCQ flow with result screen (18/20, performance label, per-question review, faculty feedback panel).
- Assessments: tabs Quizzes / Assignments / Results. Submission upload mock, results table with charts.
- Live Classes: upcoming sessions cards with "Join Meet" / "Join Teams" buttons, attendance log table, recordings grid.
- Timetable: weekly grid (Mon–Sat × periods), classroom + faculty per cell, upcoming exams panel.
- Profile: SIS view — personal details, enrollment no., department, semester, academic history timeline, transcript table, grade distribution chart.

**Teacher**
- Dashboard: Courses Managed, Students Enrolled, Pending Evaluations, Upcoming Classes; performance trend chart.
- Courses: course cards → manage units/lessons/quizzes (CRUD UI, no persistence).
- Content Management: upload modal (PDF/PPT/Video/SCORM), workflow status (Draft → Review → Published) with badges and Kanban-style columns.
- Assessments: question bank table, quiz builder, assignment list, evaluate-submission screen with rubric + feedback textarea + grade input; student analytics chart.
- Live Classes: schedule meeting modal (auto-generates Meet/Teams link), attendance tracker, session history table.

**Admin**
- Dashboard: KPI cards (Total Students, Teachers, Active Courses, Exams Scheduled), attendance trend line, enrollment by department bar, fee collection donut.
- Admissions: applications table (name, program, status, docs, verification) with Approve/Reject/Request Changes actions; workflow stepper drawer.
- Curriculum & Academic Calendar: programs/courses/electives tabs + calendar view (month grid) with semester boundaries, holidays, exam windows.
- Students: searchable directory table → student detail (reuses Student profile in read-only).
- Timetable: builder UI — drag-free grid with faculty/room assignment selects, conflict-detection banner.
- Examinations: schedule exams form, hall ticket preview (printable card with student photo, seat, room, QR), seating plan grid, results publishing table.
- Reports: charts and downloadable-looking report cards.
- AI Features link → `/ai/*`.

**Staff**
- Dashboard: pending tasks, today's announcements, quick links (records, fee desk, hostel, library).
- Tasks: kanban of operational tasks. Records: document verification queue. Announcements: composer + history.

**AI & Smart Features** (linked from Admin sidebar, accessible to all roles)
- Interview Assistant: candidate video tile placeholder, AI question panel, live scores (confidence/communication/technical), final summary card with radar chart.
- Meeting Intelligence: live transcript stream (canned, animated), speaker chips, key points list, action items checklist, AI summary.
- Proctoring Dashboard: grid of exam takers with status chips (Face Detected, Identity Verified, Gaze OK, Alerts), integrity report with timeline of flags.
- Feedback Engine: sentiment donut, faculty performance bar chart, course satisfaction heatmap, sample feedback cards with sentiment tags.

## Mock Data

`src/data/` modules: `users.ts`, `courses.ts`, `lessons.ts`, `quizzes.ts`, `assignments.ts`, `liveClasses.ts`, `timetable.ts`, `applications.ts`, `students.ts`, `exams.ts`, `notifications.ts`, `ai.ts`. Realistic Indian university context (KCG University, departments: CSE, ECE, MECH, MBA; sample faculty names; semester 5; etc.).

## Out of Scope (demo)

- No real auth, DB, file uploads, or video streaming — all mocked.
- No Lovable Cloud / Supabase — pure UI.
- Forms submit to local state with toast confirmations.

## Deliverable

After build, user lands on `/login`, picks a role, and can traverse every navigation item with realistic content, charts, and interactions suitable for stakeholder presentation.
