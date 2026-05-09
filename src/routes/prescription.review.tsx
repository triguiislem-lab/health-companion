import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Filter } from "lucide-react";
import { prescriptions } from "@/lib/mock-data";
import { usePatientStore } from "@/lib/stores/patient-store";
import { riskMeta, statusMeta } from "@/lib/clinical-ui";

export const Route = createFileRoute("/prescription/review")({
  head: () => ({ meta: [{ title: "Prescription Review — MedAssist CDSS" }] }),
  component: PrescriptionReview,
});

function PrescriptionReview() {
  const patients = usePatientStore((s) => s.patients);
  return (
    <div className="p-4 lg:p-8 space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Prescription review queue</h1>
          <p className="text-sm text-muted-foreground mt-1">Cases awaiting your validation, edits, or rejection.</p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-lg border border-input bg-card px-3 py-2 text-sm font-semibold hover:bg-muted transition-smooth">
          <Filter className="h-4 w-4" /> Filters
        </button>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {prescriptions.map((rx) => {
          const p = patients.find((x) => x.id === rx.patientId)!;
          const stMeta = statusMeta[rx.status];
          const rkMeta = riskMeta[rx.risk];
          return (
            <div key={rx.id} className="rounded-xl border border-border bg-card shadow-card p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-xs text-muted-foreground font-mono">{rx.id} · {rx.lastUpdate}</div>
                  <div className="font-semibold mt-0.5">{p.name} <span className="text-muted-foreground font-normal">({p.age}{p.sex})</span></div>
                  <div className="text-sm text-muted-foreground mt-1">{rx.diagnosis}</div>
                </div>
                <div className="flex flex-col items-end gap-1.5">
                  <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-semibold ${stMeta.cls}`}>{stMeta.label}</span>
                  <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-semibold ${rkMeta.cls}`}>{rkMeta.label}</span>
                </div>
              </div>
              {rx.medications.length > 0 && (
                <ul className="mt-4 space-y-1.5">
                  {rx.medications.map((m) => (
                    <li key={m.id} className="flex justify-between text-xs rounded-md bg-muted/50 px-2.5 py-1.5">
                      <span className="font-medium">{m.name}</span>
                      <span className="text-muted-foreground">{m.dose} · {m.frequency} · {m.duration}</span>
                    </li>
                  ))}
                </ul>
              )}
              <div className="mt-4 flex items-center justify-between">
                <div className="text-xs text-muted-foreground">{rx.doctor}</div>
                <Link to="/prescription/new" className="inline-flex items-center gap-1 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-smooth">
                  Open <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
