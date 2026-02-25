import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { eq, sql } from "drizzle-orm";
import { subjects, questions } from "./schema";
import { SUBJECTS_DATA, QUESTIONS_DATA } from "../../seed-data/questions-unique";

const sqlite = new Database("quiz.db");
const db = drizzle(sqlite, { schema: { subjects, questions } });

async function seed() {
  // Clear existing data (FK order: questions first, then subjects)
  db.delete(questions).run();
  db.delete(subjects).run();

  // Insert subjects
  const insertedSubjects = db
    .insert(subjects)
    .values(SUBJECTS_DATA)
    .returning()
    .all();

  // Build slug → id map
  const slugToId = new Map<string, number>();
  for (const subject of insertedSubjects) {
    slugToId.set(subject.slug, subject.id);
  }

  // Insert questions
  const questionsToInsert = QUESTIONS_DATA.map((q) => {
    const subjectId = slugToId.get(q.subjectSlug);
    if (!subjectId) {
      throw new Error(`Subject not found for slug: ${q.subjectSlug}`);
    }
    return {
      subjectId,
      text: q.text,
      optionA: q.optionA,
      optionB: q.optionB,
      optionC: q.optionC,
      correctAnswer: q.correctAnswer,
      source: q.source,
      explanation: q.explanation ?? null,
    };
  });

  db.insert(questions).values(questionsToInsert).run();

  // Update questionCount for each subject
  for (const subject of insertedSubjects) {
    const count = db
      .select({ count: sql<number>`count(*)` })
      .from(questions)
      .where(eq(questions.subjectId, subject.id))
      .get();

    db.update(subjects)
      .set({ questionCount: count?.count ?? 0 })
      .where(eq(subjects.id, subject.id))
      .run();
  }

  console.log(
    `Seeded ${insertedSubjects.length} subjects and ${questionsToInsert.length} questions`
  );
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
