/**
 * TEMPLATE FILE — committed to the public repo.
 * Copy this to questions.ts and fill in your actual questions.
 *
 * questions.ts is listed in .gitignore and must never be committed.
 */

export interface SeedQuestion {
  subjectSlug: string; // must match a slug in SUBJECTS_DATA
  text: string;
  optionA: string;
  optionB: string;
  optionC: string;
  correctAnswer: "A" | "B" | "C";
  source: string; // e.g. "busta_1", "concorso_2023"
  explanation?: string;
}

export interface SeedSubject {
  name: string;
  slug: string;
  color: string; // hex color
}

export const SUBJECTS_DATA: SeedSubject[] = [
  { name: "Ordinamento Enti Locali", slug: "ordinamento-enti-locali", color: "#3B82F6" },
  { name: "Stato Civile", slug: "stato-civile", color: "#8B5CF6" },
  { name: "Anagrafe", slug: "anagrafe", color: "#EC4899" },
  { name: "Elettorale", slug: "elettorale", color: "#F59E0B" },
  { name: "Diritto Amministrativo", slug: "diritto-amministrativo", color: "#10B981" },
  { name: "Trasparenza Amministrativa", slug: "trasparenza", color: "#06B6D4" },
  { name: "Privacy e GDPR", slug: "privacy", color: "#D946EF" },
  { name: "Pubblico Impiego", slug: "pubblico-impiego", color: "#F97316" },
  { name: "Diritto Penale PA", slug: "diritto-penale-pa", color: "#EF4444" },
  { name: "Contabilità e Bilancio", slug: "contabilita-bilancio", color: "#84CC16" },
  { name: "Servizi Cimiteriali", slug: "servizi-cimiteriali", color: "#6B7280" },
  { name: "Documentazione Amministrativa", slug: "documentazione-amministrativa", color: "#A855F7" },
  { name: "Leva Militare", slug: "leva-militare", color: "#78716C" },
];

export const QUESTIONS_DATA: SeedQuestion[] = [
  {
    subjectSlug: "diritto-amministrativo",
    text: "Testo della domanda?",
    optionA: "Risposta A",
    optionB: "Risposta B",
    optionC: "Risposta C",
    correctAnswer: "A",
    source: "concorso_YYYY",
    explanation: "Spiegazione facoltativa.",
  },
  // Add more questions here...
];
