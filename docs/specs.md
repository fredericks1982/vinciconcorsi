# VinciConcorsi.it — MVP Specifications

## 1. What We're Building

A minimal quiz app to practice multiple-choice questions for an Italian municipal exam. The user selects one or more subject areas, chooses how many questions, and takes a quiz with immediate feedback.

**MVP scope — only these features:**
- Homepage with subject picker and question count
- Quiz page: one question at a time, instant feedback on click
- End-of-quiz results with score and error review
- Questions loaded from DB via seed script

**Explicitly NOT in MVP:**
- No saved sessions / history
- No statistics / trends / charts
- No timer
- No review-errors mode
- No exam simulation mode
- No admin UI for adding questions
- No authentication

---

## 2. Database Schema

Two tables only. Use Drizzle ORM with SQLite (`better-sqlite3`).

### subjects

| Column | Type | Notes |
|---|---|---|
| id | integer PK autoincrement | |
| name | text NOT NULL | Italian display name, e.g. "Ordinamento Enti Locali" |
| slug | text NOT NULL UNIQUE | URL-safe, e.g. "ordinamento-enti-locali" |
| color | text | Hex color for UI badges, e.g. "#3B82F6" |
| questionCount | integer DEFAULT 0 | Denormalized count, updated by seed script |

### questions

| Column | Type | Notes |
|---|---|---|
| id | integer PK autoincrement | |
| subjectId | integer FK → subjects.id | NOT NULL |
| text | text NOT NULL | Question text |
| optionA | text NOT NULL | |
| optionB | text NOT NULL | |
| optionC | text NOT NULL | |
| correctAnswer | text NOT NULL | "A", "B", or "C" |
| source | text NOT NULL | e.g. "busta_1", "riserva_2" |
| explanation | text | Optional short explanation |

### Drizzle schema (src/db/schema.ts)

```typescript
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
```

---

## 3. Subject List

Seed these subjects with their colors:

```typescript
export const SUBJECTS_DATA = [
  { name: "Ordinamento Enti Locali", slug: "ordinamento-enti-locali", color: "#3B82F6" },
  { name: "Stato Civile", slug: "stato-civile", color: "#8B5CF6" },
  { name: "Anagrafe", slug: "anagrafe", color: "#EC4899" },
  { name: "Elettorale", slug: "elettorale", color: "#F59E0B" },
  { name: "Diritto Amministrativo", slug: "diritto-amministrativo", color: "#10B981" },
  { name: "Trasparenza e Privacy", slug: "trasparenza-privacy", color: "#06B6D4" },
  { name: "Pubblico Impiego", slug: "pubblico-impiego", color: "#F97316" },
  { name: "Diritto Penale PA", slug: "diritto-penale-pa", color: "#EF4444" },
  { name: "Contabilità e Bilancio", slug: "contabilita-bilancio", color: "#84CC16" },
  { name: "Servizi Cimiteriali", slug: "servizi-cimiteriali", color: "#6B7280" },
  { name: "Documentazione Amministrativa", slug: "documentazione-amministrativa", color: "#A855F7" },
  { name: "Leva Militare", slug: "leva-militare", color: "#78716C" },
];
```

---

## 4. Seed Data Structure

The full question bank will be added manually later. For now, scaffold the seed script and types with 3-5 example questions so the app is testable.

### Type for seed data (seed-data/questions.ts)

```typescript
export interface SeedQuestion {
  subjectSlug: string;       // matches subjects.slug
  text: string;
  optionA: string;
  optionB: string;
  optionC: string;
  correctAnswer: "A" | "B" | "C";
  source: string;            // e.g. "busta_1"
  explanation?: string;
}

export const QUESTIONS_DATA: SeedQuestion[] = [
  // Example questions for testing — full bank added later
  {
    subjectSlug: "diritto-amministrativo",
    text: "Ai sensi dell'art. 7 della L. 241/1990, ove non sussistano ragioni di impedimento derivanti da particolari esigenze di celerità del procedimento, l'avvio del procedimento stesso a chi è comunicato?",
    optionA: "Esclusivamente ai soggetti che per legge debbono intervenirvi",
    optionB: "Esclusivamente ai soggetti nei confronti dei quali il provvedimento finale è destinato a produrre effetti diretti",
    optionC: "Ai soggetti nei confronti dei quali il provvedimento finale è destinato a produrre effetti diretti ed a quelli che per legge debbono intervenirvi",
    correctAnswer: "C",
    source: "busta_1",
  },
  {
    subjectSlug: "ordinamento-enti-locali",
    text: "Ai sensi dell'art. 109 del TUEL, come vengono conferiti gli incarichi dirigenziali?",
    optionA: "A tempo determinato",
    optionB: "A tempo indeterminato",
    optionC: "Con contratto a prestazione occasionale",
    correctAnswer: "A",
    source: "busta_1",
  },
  {
    subjectSlug: "stato-civile",
    text: "Ai sensi dell'art. 1 del D.LGS. 396/2000 può essere delegato alle funzioni di ufficiale di stato civile:",
    optionA: "Il Segretario Comunale",
    optionB: "Il Sindaco",
    optionC: "Il Prefetto",
    correctAnswer: "A",
    source: "busta_1",
  },
  {
    subjectSlug: "anagrafe",
    text: "Ai sensi dell'ART. 4 del DPR 223/89 costituiscono famiglia anagrafica:",
    optionA: "Due persone coabitanti che hanno dichiarato un vincolo affettivo tra di loro",
    optionB: "Marito e moglie che vivono in due città diverse",
    optionC: "Marito e moglie che coabitano in una casa di cura",
    correctAnswer: "C",
    source: "busta_1",
  },
  {
    subjectSlug: "elettorale",
    text: "Ai sensi del T.U. 223/1967, la revisione dinamica delle liste elettorali:",
    optionA: "Prevede in prima tornata solo ed esclusivamente iscrizioni ed in seconda tornata solo ed esclusivamente cancellazioni",
    optionB: "Prevede solo cancellazioni, in quanto le iscrizioni vengono effettuate con la revisione semestrale",
    optionC: "Prevede sia iscrizioni che cancellazioni",
    correctAnswer: "C",
    source: "busta_1",
  },
];
```

### Seed script behavior (src/db/seed.ts)

1. Clear existing data (questions first, then subjects — respect FK)
2. Insert all subjects from `SUBJECTS_DATA`
3. For each question in `QUESTIONS_DATA`, look up `subjectId` by `subjectSlug`
4. Insert all questions
5. Update `questionCount` on each subject
6. Log summary: "Seeded X subjects and Y questions"

---

## 5. Data Flow

No API routes. Use Next.js Server Actions.

### Server Actions (src/lib/actions.ts)

```typescript
// Fetch all subjects with their question counts
async function getSubjects(): Promise<Subject[]>

// Fetch random questions filtered by subject slugs
// If slugs is empty or undefined, fetch from all subjects
async function getQuizQuestions(
  slugs: string[],
  count: number
): Promise<QuizQuestion[]>
// QuizQuestion includes all fields EXCEPT correctAnswer
// correctAnswer is sent separately (see below)

// After quiz is completed client-side, no server action needed.
// The correct answers are embedded in the page data (see section 6).
```

**Important simplification:** Since there's no session persistence, the quiz page can fetch questions including correct answers in one go via a Server Action, and the client component handles all quiz logic (show/hide answers, scoring) in React state. The correct answers never need a second round-trip.

Concretely:
1. Homepage calls `getSubjects()` to show subject picker with counts.
2. User selects subjects + count, clicks "Inizia Quiz".
3. Navigation to `/quiz?subjects=slug1,slug2&count=10`.
4. Quiz page (server component wrapper) calls `getQuizQuestions(slugs, count)` — returns full question data including `correctAnswer`.
5. Client component receives questions as props, manages quiz state entirely in React.

---

## 6. Pages & UI Behavior

### 6.1 Homepage (`/`)

**Layout:**
- Title: "VinciConcorsi.it" with subtitle "Preparazione Istruttore Amministrativo - Servizi Demografici"
- Subject grid: cards or checkboxes, one per subject. Each shows name + question count + colored badge. All selected by default.
- "Seleziona tutte" / "Deseleziona tutte" toggle
- Number input: "Numero domande" — default 15, min 1, max = total available for selected subjects
- Big primary button: "Inizia Quiz" → navigates to `/quiz?subjects=...&count=...`
- If no subjects selected or count < 1, button is disabled

**Subject card behavior:**
- Clickable to toggle selection
- Shows colored left border or badge matching subject color
- Shows question count (e.g. "12 domande")
- Visual distinction between selected/unselected (opacity, border, check icon)

### 6.2 Quiz Page (`/quiz`)

**URL params:** `?subjects=slug1,slug2&count=10`

**Layout:**
- Progress bar at top: "Domanda 3 di 10"
- Question card (centered, max-width ~700px):
  - Question text (large, readable)
  - Source badge (e.g. "Busta 1") — small, muted
  - Subject badge (colored) — small
  - Three option buttons (A, B, C) — full width, stacked vertically

**Interaction flow for each question:**

1. **Unanswered state:** All three options are neutral (outline style). User clicks one.
2. **Answered state (instant feedback):**
   - If correct: clicked option turns **green** (bg-green-100 border-green-500 or similar)
   - If wrong: clicked option turns **red** (bg-red-100 border-red-500) AND correct option turns **green**
   - All options become non-clickable
   - Optional: show `explanation` text below options if available
3. **"Prossima" button** appears (or "Vedi risultati" if last question). User clicks to advance.

**No going back.** Once answered, move forward only. Keeps it simple.

**State shape (React):**
```typescript
interface QuizState {
  questions: QuizQuestion[];     // full data including correctAnswer
  currentIndex: number;
  answers: {                     // keyed by question index
    [index: number]: {
      given: "A" | "B" | "C";
      correct: boolean;
    };
  };
  finished: boolean;
}
```

### 6.3 Results (same page, after last question)

**When `finished` is true, replace quiz card with results view:**

- Big score display: "24/30" with percentage and colored indicator
  - ≥ 70% (21/30): green — "Superato!"
  - < 70%: red — "Non superato"
  - (Threshold is 21/30 = 70%, matching the real exam)
- Score breakdown by subject: horizontal bars or simple list showing "Materia: X/Y corrette"
- Full question review list:
  - Each question in a compact card
  - Green check or red X icon
  - Question text (truncated to ~100 chars, expandable)
  - If wrong: shows "Tua risposta: B" and "Risposta corretta: A"
- Two buttons at bottom:
  - "Nuovo Quiz" → back to homepage
  - "Ripeti solo gli errori" → navigates to `/quiz` with only the wrong question IDs (stretch goal — can be a simple re-randomization of same subjects for MVP)

---

## 7. Component Breakdown

### subject-picker.tsx
- Props: `subjects: Subject[]`, `selected: string[]`, `onChange: (slugs: string[]) => void`
- Renders grid of subject cards with toggle behavior
- "Seleziona tutte / Deseleziona tutte" button

### quiz-card.tsx
- Props: `question: QuizQuestion`, `onAnswer: (answer: "A"|"B"|"C") => void`, `userAnswer?: {given, correct}`, `showResult: boolean`
- Renders question text, source/subject badges, three option buttons
- Handles visual states: unanswered, correct, wrong

### quiz-progress.tsx
- Props: `current: number`, `total: number`, `correctSoFar: number`
- Renders progress bar + "Domanda X di Y" text

### quiz-results.tsx
- Props: `questions: QuizQuestion[]`, `answers: Record<number, {given, correct}>`, `subjects: Subject[]`
- Renders score, per-subject breakdown, scrollable question review list

---

## 8. Shared Types (src/types/index.ts)

```typescript
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
  subjectName: string;     // joined from subjects table
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
```

---

## 9. Styling Guidelines

- **Font:** System font stack (Next.js default via `next/font` with Inter or Geist)
- **Max content width:** 800px centered
- **Spacing:** Generous — the user reads legal text, needs breathing room
- **Question text:** text-lg or text-xl, font-medium
- **Option buttons:** Large tap targets (min-h-12, p-4), full width, rounded-lg
- **Colors for feedback:**
  - Correct: `bg-green-50 border-green-500 text-green-800` (light) / dark mode equivalent
  - Wrong: `bg-red-50 border-red-500 text-red-800`
  - Neutral: `bg-card border-border` (shadcn defaults)
- **Subject badges:** Use subject's `color` as background with white text, small rounded pill
- **Dark mode:** Supported via shadcn/ui theme. Include a toggle in the header.
- **Mobile-first:** Stack everything vertically. No sidebars.

---

## 10. Edge Cases

- **0 questions available for selected subjects:** Show message, disable start button.
- **User requests more questions than available:** Cap at max available, show notice.
- **Only 1 question:** Quiz works fine, goes straight to results after answering.
- **Very long question text:** Allow text to wrap naturally. No truncation during quiz.
- **Page refresh during quiz:** Progress is lost. This is acceptable for MVP. No warning dialog needed.

---

## 11. Future Enhancements (NOT for MVP)

These are documented here so the code structure doesn't block them:

1. **Session persistence:** Add `quiz_sessions` and `quiz_answers` tables. Save results on completion.
2. **Statistics dashboard:** Track correct rate per subject over time.
3. **Review errors mode:** Re-quiz only previously wrong questions.
4. **Exam simulation:** 30 questions, 60-minute timer, weighted subject distribution.
5. **Question import UI:** Admin page to add/edit questions.
6. **Multi-user:** Authentication + user-scoped data.
7. **PWA offline mode:** Cache questions for studying without internet.
