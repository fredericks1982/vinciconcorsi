"use client";

import { useRouter } from "next/navigation";
import { XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { QuizQuestion } from "@/types";

type AnswerKey = "A" | "B" | "C";

interface AnswerRecord {
  given: AnswerKey;
  correct: boolean;
}

interface QuizResultsProps {
  questions: QuizQuestion[];
  answers: Record<number, AnswerRecord>;
}

function getOptionText(question: QuizQuestion, key: AnswerKey): string {
  if (key === "A") return question.optionA;
  if (key === "B") return question.optionB;
  return question.optionC;
}

export function QuizResults({ questions, answers }: QuizResultsProps) {
  const router = useRouter();

  const total = questions.length;
  const correct = Object.values(answers).filter((a) => a.correct).length;
  const percentage = Math.round((correct / total) * 100);

  // Per-subject breakdown
  const subjectMap = new Map<
    string,
    { name: string; color: string; correct: number; total: number }
  >();
  questions.forEach((q, idx) => {
    const existing = subjectMap.get(q.subjectSlug);
    const isCorrect = answers[idx]?.correct ?? false;
    if (existing) {
      existing.total += 1;
      if (isCorrect) existing.correct += 1;
    } else {
      subjectMap.set(q.subjectSlug, {
        name: q.subjectName,
        color: q.subjectColor,
        correct: isCorrect ? 1 : 0,
        total: 1,
      });
    }
  });

  return (
    <div className="space-y-8">
      {/* Score */}
      <div className="rounded-xl border border-border bg-card p-8 text-center">
        <p className="text-6xl font-bold">
          {correct}/{total}
        </p>
        <p
          className={`mt-2 text-2xl font-semibold ${
            percentage === 100
              ? "text-green-600 dark:text-green-400"
              : percentage >= 80
                ? "text-yellow-500 dark:text-yellow-400"
                : "text-red-600 dark:text-red-400"
          }`}
        >
          {percentage}%
        </p>
      </div>

      {/* Subject breakdown */}
      {subjectMap.size > 1 && (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">Risultati per materia</h2>
          <div className="space-y-2">
            {Array.from(subjectMap.values()).map((s) => (
              <div
                key={s.name}
                className="flex items-center gap-3 rounded-lg border border-border bg-card p-3"
              >
                <div
                  className="h-2.5 w-2.5 shrink-0 rounded-full"
                  style={{ backgroundColor: s.color }}
                />
                <span className="flex-1 text-sm font-medium">{s.name}</span>
                <span className="text-sm text-muted-foreground">
                  {s.correct}/{s.total}
                </span>
                <span
                  className={`text-xs font-medium ${
                    s.correct === s.total
                      ? "text-green-600 dark:text-green-400"
                      : Math.round((s.correct / s.total) * 100) >= 80
                        ? "text-yellow-500 dark:text-yellow-400"
                        : "text-red-600 dark:text-red-400"
                  }`}
                >
                  {Math.round((s.correct / s.total) * 100)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Question review — wrong answers only */}
      {correct < total && (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">Domande sbagliate</h2>
          <div className="space-y-2">
            {questions
              .map((q, idx) => ({ q, answer: answers[idx] }))
              .filter(({ answer }) => answer && !answer.correct)
              .map(({ q, answer }) => (
                <div
                  key={q.id}
                  className="rounded-lg border border-border bg-card p-4"
                >
                  <div className="flex items-start gap-3">
                    <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-500" />
                    <div className="min-w-0 flex-1 space-y-1">
                      <p className="text-sm font-medium leading-snug">
                        {q.text}
                      </p>
                      <div className="space-y-0.5 text-xs text-muted-foreground">
                        <p>
                          <span className="text-red-500">Tua risposta:</span>{" "}
                          {answer!.given}. {getOptionText(q, answer!.given)}
                        </p>
                        <p>
                          <span className="text-green-600 dark:text-green-400">
                            Risposta corretta:
                          </span>{" "}
                          {q.correctAnswer}. {getOptionText(q, q.correctAnswer)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <Button onClick={() => router.push("/")} size="lg" className="w-full">
        Nuovo Quiz
      </Button>
    </div>
  );
}
