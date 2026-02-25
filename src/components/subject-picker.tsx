"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Subject } from "@/types";

interface SubjectPickerProps {
  subjects: Subject[];
}

export function SubjectPicker({ subjects }: SubjectPickerProps) {
  const router = useRouter();
  const [selected, setSelected] = useState<string[]>(
    subjects.map((s) => s.slug)
  );
  const [count, setCount] = useState(30);
  const [showSubject, setShowSubject] = useState(false);

  const totalAvailable = useMemo(
    () =>
      subjects
        .filter((s) => selected.includes(s.slug))
        .reduce((sum, s) => sum + s.questionCount, 0),
    [subjects, selected]
  );

  const allSelected = selected.length === subjects.length;

  const toggleSubject = (slug: string) => {
    setSelected((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
    );
  };

  const toggleAll = () => {
    setSelected(allSelected ? [] : subjects.map((s) => s.slug));
  };

  const handleCountChange = (value: string) => {
    const parsed = parseInt(value, 10);
    if (!isNaN(parsed)) {
      setCount(Math.max(1, Math.min(parsed, totalAvailable)));
    }
  };

  const handleStart = () => {
    const params = new URLSearchParams({
      subjects: selected.join(","),
      count: String(Math.min(count, totalAvailable)),
      ...(showSubject && { showSubject: "1" }),
    });
    router.push(`/quiz?${params.toString()}`);
  };

  const isDisabled = selected.length === 0 || count < 1 || totalAvailable === 0;

  return (
    <div suppressHydrationWarning>
      {/* Header row */}
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          <span className="font-medium text-foreground">{selected.length}</span>
          {" "}/ {subjects.length} materie selezionate
        </p>
        <Button variant="outline" size="sm" onClick={toggleAll}>
          {allSelected ? "Deseleziona tutte" : "Seleziona tutte"}
        </Button>
      </div>

      {/* Subject grid — inline style for Safari compatibility */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
          gap: "8px",
        }}
      >
        {subjects.map((subject) => {
          const isSelected = selected.includes(subject.slug);
          const questionLabel =
            subject.questionCount === 1 ? "1 domanda" : `${subject.questionCount} domande`;
          return (
            <button
              key={subject.slug}
              onClick={() => toggleSubject(subject.slug)}
              className={`relative overflow-hidden rounded-lg border px-3 pb-3 pt-5 text-left transition-all duration-150 ${
                isSelected
                  ? "border-border bg-accent"
                  : "border-border/40 bg-card opacity-40 hover:opacity-75"
              }`}
            >
              {/* Colored top bar — absolute, immune from CSS specificity conflicts */}
              <span
                className="absolute inset-x-0 top-0 h-1.5"
                style={{ backgroundColor: subject.color }}
              />
              {/* Content */}
              <div className="flex items-start gap-3">
                {/* Checkbox */}
                <div
                  className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border-2 transition-colors ${
                    isSelected
                      ? "border-primary bg-primary"
                      : "border-muted-foreground/40"
                  }`}
                >
                  {isSelected && (
                    <Check className="h-2.5 w-2.5 text-primary-foreground" />
                  )}
                </div>
                {/* Text */}
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold leading-snug">
                    {subject.name}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {questionLabel}
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Show subject toggle */}
      <div className="mt-4 flex items-center gap-2">
        <button
          role="checkbox"
          aria-checked={showSubject}
          onClick={() => setShowSubject((v) => !v)}
          className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border-2 transition-colors ${
            showSubject
              ? "border-primary bg-primary"
              : "border-muted-foreground/40"
          }`}
        >
          {showSubject && (
            <Check className="h-2.5 w-2.5 text-primary-foreground" />
          )}
        </button>
        <label
          className="cursor-pointer select-none text-sm text-muted-foreground"
          onClick={() => setShowSubject((v) => !v)}
        >
          Mostra argomento nelle domande
        </label>
      </div>

      {/* Controls row */}
      <div className="mt-4 flex items-center justify-between gap-3 rounded-lg border border-border bg-card p-4">
        <div className="flex items-center gap-3">
          <label htmlFor="count" className="shrink-0 text-sm font-medium">
            Numero domande
          </label>
          <input
            id="count"
            type="number"
            min={1}
            max={totalAvailable || 1}
            value={count}
            onChange={(e) => handleCountChange(e.target.value)}
            className="w-20 rounded-md border border-input bg-background px-3 py-1.5 text-center text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <p className="text-xs text-muted-foreground">
            {totalAvailable > 0
              ? `Max: ${totalAvailable}`
              : selected.length > 0
                ? "Nessuna domanda disponibile"
                : "Seleziona almeno una materia"}
          </p>
        </div>
        <Button onClick={handleStart} disabled={isDisabled}>
          Inizia Quiz →
        </Button>
      </div>
    </div>
  );
}
