import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, Clock, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { QUIZ_QUESTIONS } from "@/lib/mockData";

export const Route = createFileRoute("/student/quiz/$quizId")({
  head: () => ({ meta: [{ title: "Quiz · KCG" }] }),
  component: QuizPage,
});

function QuizPage() {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [seconds, setSeconds] = useState(15 * 60);

  useEffect(() => {
    if (submitted) return;
    const t = setInterval(() => setSeconds((s) => (s <= 1 ? (setSubmitted(true), 0) : s - 1)), 1000);
    return () => clearInterval(t);
  }, [submitted]);

  const handleSubmit = useCallback(() => setSubmitted(true), []);
  const answered = Object.keys(answers).length;
  const score = submitted
    ? QUIZ_QUESTIONS.reduce((s, q) => s + (answers[q.id] === q.correctAnswer ? 1 : 0), 0)
    : 0;
  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");

  return (
    <div className="space-y-6">
      <Link
        to="/student/assessments"
        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
      >
        <ChevronLeft className="h-4 w-4 mr-1" /> Back to assessments
      </Link>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold">
            {submitted ? "Quiz Results" : "Quiz: Data Structures"}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {submitted
              ? `You scored ${score} out of ${QUIZ_QUESTIONS.length}`
              : `${QUIZ_QUESTIONS.length} questions · MCQ`}
          </p>
        </div>
        {!submitted && (
          <Badge variant="outline" className="text-base font-mono gap-1.5">
            <Clock className="h-4 w-4" /> {mm}:{ss}
          </Badge>
        )}
      </div>

      {submitted && (
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-lg bg-success/10 p-4 text-center">
            <div className="text-3xl font-display font-semibold text-success">
              {score}/{QUIZ_QUESTIONS.length}
            </div>
            <div className="text-xs text-muted-foreground mt-1">Score</div>
          </div>
          <div className="rounded-lg bg-primary/10 p-4 text-center">
            <div className="text-3xl font-display font-semibold text-primary">
              {Math.round((score / QUIZ_QUESTIONS.length) * 100)}%
            </div>
            <div className="text-xs text-muted-foreground mt-1">Percentage</div>
          </div>
          <div className="rounded-lg bg-muted p-4 text-center">
            <div className="text-3xl font-display font-semibold">
              {15 * 60 - seconds < 60
                ? `${15 * 60 - seconds}s`
                : `${Math.floor((15 * 60 - seconds) / 60)}m`}
            </div>
            <div className="text-xs text-muted-foreground mt-1">Time used</div>
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-[1fr_200px] gap-6">
        <div className="space-y-4">
          {QUIZ_QUESTIONS.map((q, qi) => (
            <div key={q.id} className="rounded-xl border bg-card p-5 shadow-sm">
              <div className="flex items-start gap-3 mb-4">
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-primary/10 text-primary text-sm font-semibold">
                  {qi + 1}
                </span>
                <p className="font-medium">{q.question}</p>
              </div>
              <div className="grid gap-2 ml-10">
                {q.options.map((opt, oi) => {
                  const selected = answers[q.id] === oi;
                  const isCorrect = oi === q.correctAnswer;
                  const wasWrong = submitted && selected && !isCorrect;
                  return (
                    <button
                      key={oi}
                      disabled={submitted}
                      onClick={() => setAnswers((a) => ({ ...a, [q.id]: oi }))}
                      className={cn(
                        "flex items-center gap-3 rounded-lg border px-4 py-3 text-sm text-left transition",
                        !submitted && selected && "border-primary bg-primary/5 ring-1 ring-primary/30",
                        !submitted && !selected && "hover:bg-muted/50",
                        submitted && isCorrect && "border-success bg-success/10",
                        wasWrong && "border-destructive bg-destructive/10",
                      )}
                    >
                      <span
                        className={cn(
                          "grid h-6 w-6 shrink-0 place-items-center rounded-full text-xs font-medium",
                          submitted && isCorrect
                            ? "bg-success text-white"
                            : wasWrong
                              ? "bg-destructive text-white"
                              : selected
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted text-muted-foreground",
                        )}
                      >
                        {String.fromCharCode(65 + oi)}
                      </span>
                      <span className="flex-1">{opt}</span>
                      {submitted && isCorrect && <CheckCircle2 className="h-4 w-4 text-success" />}
                      {wasWrong && <XCircle className="h-4 w-4 text-destructive" />}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          {!submitted && (
            <Button size="lg" className="w-full" onClick={handleSubmit} disabled={answered === 0}>
              Submit Quiz ({answered}/{QUIZ_QUESTIONS.length} answered)
            </Button>
          )}

          {submitted && (
            <Button variant="outline" size="lg" className="w-full" asChild>
              <Link to="/student/assessments">Back to Assessments</Link>
            </Button>
          )}
        </div>

        {!submitted && (
          <div className="space-y-4">
            <div className="rounded-xl border bg-card p-4 shadow-sm sticky top-20">
              <h3 className="font-semibold text-sm mb-3">Question Navigator</h3>
              <div className="grid grid-cols-5 gap-2">
                {QUIZ_QUESTIONS.map((q, i) => (
                  <div
                    key={q.id}
                    className={cn(
                      "grid h-9 w-9 place-items-center rounded-full text-sm font-medium border",
                      answers[q.id] !== undefined
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-muted text-muted-foreground",
                    )}
                  >
                    {i + 1}
                  </div>
                ))}
              </div>
              <div className="mt-3">
                <Progress value={(answered / QUIZ_QUESTIONS.length) * 100} className="h-1.5" />
                <p className="text-xs text-muted-foreground mt-1">
                  {answered} of {QUIZ_QUESTIONS.length} answered
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
