import { getSubjects } from "@/lib/actions";
import { SubjectPicker } from "@/components/subject-picker";

export default async function HomePage() {
  const subjects = await getSubjects();

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          VinciConcorsi.it
        </h1>
        <p className="text-muted-foreground">
          Preparazione Istruttore Amministrativo - Servizi Demografici
        </p>
      </div>

      <SubjectPicker subjects={subjects} />
    </div>
  );
}
