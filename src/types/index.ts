export interface Subject {
  id: number;
  name: string;
  slug: string;
  color: string;
  questionCount: number;
}

export interface QuizQuestion {
  id: number;
  subjectId: number;
  subjectName: string; // joined from subjects table
  subjectSlug: string;
  subjectColor: string;
  text: string;
  optionA: string;
  optionB: string;
  optionC: string;
  correctAnswer: "A" | "B" | "C";
  source: string;
  explanation: string | null;
}
