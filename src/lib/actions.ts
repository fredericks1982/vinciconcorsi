"use server";

import { db } from "@/db";
import { subjects, questions } from "@/db/schema";
import { eq, inArray, sql } from "drizzle-orm";
import type { Subject, QuizQuestion } from "@/types";

export async function getSubjects(): Promise<Subject[]> {
  const rows = db.select().from(subjects).orderBy(subjects.name).all();
  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    slug: row.slug,
    color: row.color,
    questionCount: row.questionCount,
  }));
}

export async function getQuizQuestions(
  slugs: string[],
  count: number
): Promise<QuizQuestion[]> {
  const query = db
    .select({
      id: questions.id,
      subjectId: questions.subjectId,
      subjectName: subjects.name,
      subjectSlug: subjects.slug,
      subjectColor: subjects.color,
      text: questions.text,
      optionA: questions.optionA,
      optionB: questions.optionB,
      optionC: questions.optionC,
      correctAnswer: questions.correctAnswer,
      source: questions.source,
      explanation: questions.explanation,
    })
    .from(questions)
    .innerJoin(subjects, eq(questions.subjectId, subjects.id));

  const filtered =
    slugs.length > 0
      ? query.where(inArray(subjects.slug, slugs))
      : query;

  const rows = filtered
    .orderBy(sql`RANDOM()`)
    .limit(count)
    .all();

  return rows.map((row) => ({
    id: row.id,
    subjectId: row.subjectId,
    subjectName: row.subjectName,
    subjectSlug: row.subjectSlug,
    subjectColor: row.subjectColor,
    text: row.text,
    optionA: row.optionA,
    optionB: row.optionB,
    optionC: row.optionC,
    correctAnswer: row.correctAnswer as "A" | "B" | "C",
    source: row.source,
    explanation: row.explanation,
  }));
}
