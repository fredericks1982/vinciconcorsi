import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const subjects = sqliteTable("subjects", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  color: text("color").notNull().default("#6B7280"),
  questionCount: integer("question_count").notNull().default(0),
});

export const questions = sqliteTable("questions", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  subjectId: integer("subject_id")
    .notNull()
    .references(() => subjects.id),
  text: text("text").notNull(),
  optionA: text("option_a").notNull(),
  optionB: text("option_b").notNull(),
  optionC: text("option_c").notNull(),
  correctAnswer: text("correct_answer").notNull(), // "A" | "B" | "C"
  source: text("source").notNull(),
  explanation: text("explanation"),
});
