import { Progress } from "@/components/ui/progress";

interface QuizProgressProps {
  current: number;
  total: number;
  correctSoFar: number;
}

export function QuizProgress({ current, total, correctSoFar }: QuizProgressProps) {
  const percentage = Math.round((current / total) * 100);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium">
          Domanda {current} di {total}
        </span>
        <span className="text-muted-foreground">
          {correctSoFar} corrette
        </span>
      </div>
      <Progress value={percentage} className="h-2" />
    </div>
  );
}
