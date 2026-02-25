"use client";

import { useReducer } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { QuizCard } from "@/components/quiz-card";
import { QuizProgress } from "@/components/quiz-progress";
import { QuizResults } from "@/components/quiz-results";
import type { QuizQuestion } from "@/types";

type AnswerKey = "A" | "B" | "C";

interface AnswerRecord {
  given: AnswerKey;
  correct: boolean;
}

interface QuizState {
  questions: QuizQuestion[];
  currentIndex: number;
  answers: Record<number, AnswerRecord>;
  finished: boolean;
}

type QuizAction =
  | { type: "ANSWER"; answer: AnswerKey }
  | { type: "NEXT" };

function quizReducer(state: QuizState, action: QuizAction): QuizState {
  if (action.type === "ANSWER") {
    const question = state.questions[state.currentIndex];
    const isCorrect = action.answer === question.correctAnswer;
    return {
      ...state,
      answers: {
        ...state.answers,
        [state.currentIndex]: { given: action.answer, correct: isCorrect },
      },
    };
  }

  if (action.type === "NEXT") {
    const isLast = state.currentIndex === state.questions.length - 1;
    return {
      ...state,
      currentIndex: isLast ? state.currentIndex : state.currentIndex + 1,
      finished: isLast,
    };
  }

  return state;
}

interface QuizClientProps {
  questions: QuizQuestion[];
  showSubject: boolean;
}

export function QuizClient({ questions, showSubject }: QuizClientProps) {
  const router = useRouter();
  const [state, dispatch] = useReducer(quizReducer, {
    questions,
    currentIndex: 0,
    answers: {},
    finished: false,
  });

  function handleAbort() {
    if (window.confirm("Vuoi interrompere il quiz e tornare alla home?")) {
      router.push("/");
    }
  }

  if (state.finished) {
    return (
      <QuizResults questions={state.questions} answers={state.answers} />
    );
  }

  const currentQuestion = state.questions[state.currentIndex];
  const userAnswer = state.answers[state.currentIndex];
  const correctSoFar = Object.values(state.answers).filter(
    (a) => a.correct
  ).length;
  const isLast = state.currentIndex === questions.length - 1;

  return (
    <div className="space-y-6">
      <QuizProgress
        current={state.currentIndex + 1}
        total={questions.length}
        correctSoFar={correctSoFar}
      />
      <QuizCard
        question={currentQuestion}
        onAnswer={(answer) => dispatch({ type: "ANSWER", answer })}
        userAnswer={userAnswer}
        isLast={isLast}
        onNext={() => dispatch({ type: "NEXT" })}
        showSubject={showSubject}
      />
      <Button
        variant="ghost"
        className="w-full text-muted-foreground hover:text-foreground"
        onClick={handleAbort}
      >
        Abbandona quiz
      </Button>
    </div>
  );
}
