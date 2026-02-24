import Link from "next/link";
import { getQuizQuestions } from "@/lib/actions";
import { QuizClient } from "@/components/quiz-client";

interface QuizPageProps {
  searchParams: Promise<{ subjects?: string; count?: string }>;
}

export default async function QuizPage({ searchParams }: QuizPageProps) {
  const params = await searchParams;

  const slugs = params.subjects
    ? params.subjects.split(",").filter(Boolean)
    : [];
  const count = parseInt(params.count ?? "15", 10);
  const safeCount = isNaN(count) || count < 1 ? 15 : count;

  const questions = await getQuizQuestions(slugs, safeCount);

  if (questions.length === 0) {
    return (
      <div className="space-y-4 py-16 text-center">
        <p className="text-lg font-medium">
          Nessuna domanda disponibile per le materie selezionate.
        </p>
        <Link
          href="/"
          className="inline-block rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Torna alla home
        </Link>
      </div>
    );
  }

  return (
    <div>
      <QuizClient questions={questions} />
    </div>
  );
}
