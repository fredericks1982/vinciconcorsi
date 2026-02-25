import { Button } from "@/components/ui/button";
import type { QuizQuestion } from "@/types";

type AnswerKey = "A" | "B" | "C";

interface UserAnswer {
  given: AnswerKey;
  correct: boolean;
}

interface QuizCardProps {
  question: QuizQuestion;
  onAnswer: (answer: AnswerKey) => void;
  userAnswer?: UserAnswer;
  isLast: boolean;
  onNext: () => void;
  showSubject: boolean;
}

const OPTIONS: AnswerKey[] = ["A", "B", "C"];

function getOptionText(question: QuizQuestion, key: AnswerKey): string {
  if (key === "A") return question.optionA;
  if (key === "B") return question.optionB;
  return question.optionC;
}

function getOptionStyle(
  key: AnswerKey,
  userAnswer: UserAnswer | undefined,
  correctAnswer: AnswerKey
): string {
  const base =
    "w-full rounded-lg border-2 p-4 text-left min-h-14 transition-colors";

  if (!userAnswer) {
    return `${base} border-border bg-card hover:bg-accent hover:border-primary cursor-pointer`;
  }

  if (key === correctAnswer) {
    return `${base} border-green-500 bg-green-50 text-green-800 dark:bg-green-950 dark:text-green-200 cursor-default`;
  }

  if (key === userAnswer.given && !userAnswer.correct) {
    return `${base} border-red-500 bg-red-50 text-red-800 dark:bg-red-950 dark:text-red-200 cursor-default`;
  }

  return `${base} border-border bg-card opacity-50 cursor-default`;
}

export function QuizCard({
  question,
  onAnswer,
  userAnswer,
  isLast,
  onNext,
  showSubject,
}: QuizCardProps) {
  const answered = userAnswer !== undefined;

  return (
    <div className="space-y-6">
      {/* Badges */}
      <div className="flex flex-wrap items-center gap-2">
        {showSubject && (
          <span
            className="rounded-full px-2.5 py-0.5 text-xs font-medium text-white"
            style={{ backgroundColor: question.subjectColor }}
          >
            {question.subjectName}
          </span>
        )}
        <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs text-muted-foreground">
          {question.source.replace(/_/g, " ")}
        </span>
      </div>

      {/* Question text */}
      <p className="text-lg font-medium leading-relaxed">{question.text}</p>

      {/* Options */}
      <div className="space-y-3">
        {OPTIONS.map((key) => (
          <button
            key={key}
            onClick={() => !answered && onAnswer(key)}
            disabled={answered}
            className={getOptionStyle(key, userAnswer, question.correctAnswer)}
          >
            <span className="font-semibold">{key}.</span>{" "}
            {getOptionText(question, key)}
          </button>
        ))}
      </div>

      {/* Explanation */}
      {answered && question.explanation && (
        <div className="rounded-lg border border-border bg-muted/50 p-4">
          <p className="text-sm text-muted-foreground">
            <span className="font-semibold">Spiegazione:</span>{" "}
            {question.explanation}
          </p>
        </div>
      )}

      {/* Next button */}
      {answered && (
        <Button onClick={onNext} size="lg" className="w-full">
          {isLast ? "Vedi risultati" : "Prossima →"}
        </Button>
      )}
    </div>
  );
}
