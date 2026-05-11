import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { z } from "zod";
import { useState } from "react";
import { ArrowLeft, Printer, Stethoscope, ShieldCheck, Building2, User as UserIcon } from "lucide-react";
import { prescriptions } from "@/lib/mock-data";
import { usePatientStore } from "@/lib/stores/patient-store";
import { SendPrescriptionDialog } from "@/components/clinical/SendPrescriptionDialog";
import type { DispatchTarget } from "@/lib/stores/pharmacy-store";

const searchSchema = z.object({ patientId: z.string().optional() });

export const Route = createFileRoute("/prescription/$rxId/ordonnance")({
  head: ({ params }) => ({ meta: [{ title: `Ordonnance ${params.rxId} — MedAssist CDSS` }] }),
  validateSearch: searchSchema,
  component: OrdonnancePage,
  notFoundComponent: () => (
    <div className="p-8 text-center">
      <p className="text-sm text-muted-foreground">Prescription not found.</p>
      <Link to="/prescription/review" className="inline-flex mt-4 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">Back to queue</Link>
    </div>
  ),
  errorComponent: ({ error }) => <div className="p-8 text-sm text-critical">{error.message}</div>,
});

function OrdonnancePage() {
  const { rxId } = Route.useParams();
  const { patientId } = Route.useSearch();
  const rx = prescriptions.find((p) => p.id === rxId);
  const fallbackPatientId = patientId ?? rx?.patientId;
  const patient = usePatientStore((s) => s.patients.find((p) => p.id === fallbackPatientId));

  if (!rx || !patient) throw notFound();

  const today = new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" });

  return (
    <div className="p-4 lg:p-8">
      <div className="mx-auto max-w-3xl space-y-4">
        <div className="flex items-center justify-between print:hidden">
          <Link to="/patients/$patientId" params={{ patientId: patient.id }} className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" /> Back to patient
          </Link>
          <button onClick={() => window.print()} className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90">
            <Printer className="h-4 w-4" /> Print / save PDF
          </button>
        </div>

        <article className="rounded-xl border border-border bg-card shadow-card p-8 print:shadow-none print:border-0 print:p-0">
          <header className="flex items-start justify-between gap-4 border-b border-border pb-5">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <Stethoscope className="h-6 w-6" />
              </span>
              <div>
                <div className="text-lg font-bold">MedAssist · Ordonnance numérique</div>
                <div className="text-xs text-muted-foreground">Digital prescription · {rx.id}</div>
              </div>
            </div>
            <div className="text-right text-xs text-muted-foreground">
              <div>Date: <span className="text-foreground font-semibold">{today}</span></div>
              <div className="mt-0.5">Prescriber: <span className="text-foreground font-semibold">{rx.doctor}</span></div>
            </div>
          </header>

          <section className="mt-5 grid sm:grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Patient</div>
              <div className="mt-1 font-semibold">{patient.name}</div>
              <div className="text-xs text-muted-foreground">{patient.id} · {patient.age} y/o {patient.sex === "F" ? "Female" : "Male"} · {patient.weightKg} kg · {patient.heightCm} cm</div>
              {patient.allergies.length > 0 && (
                <div className="mt-2 text-xs"><span className="font-semibold text-critical">Allergies:</span> {patient.allergies.join(", ")}</div>
              )}
            </div>
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Diagnosis / indication</div>
              <div className="mt-1 font-medium">{rx.diagnosis}</div>
              {rx.notes && <div className="text-xs text-muted-foreground mt-1">{rx.notes}</div>}
            </div>
          </section>

          <section className="mt-6">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">Prescription</div>
            <ol className="space-y-3">
              {rx.medications.map((m, i) => (
                <li key={m.id} className="rounded-lg border border-border p-4">
                  <div className="flex items-baseline justify-between gap-3">
                    <div className="font-semibold">{i + 1}. {m.name}</div>
                    <div className="text-xs text-muted-foreground">{m.indication}</div>
                  </div>
                  <div className="mt-2 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                    <Cell label="Dose" value={m.dose} />
                    <Cell label="Route" value={m.route} />
                    <Cell label="Frequency" value={m.frequency} />
                    <Cell label="Duration" value={m.duration} />
                  </div>
                </li>
              ))}
              {rx.medications.length === 0 && (
                <li className="text-sm text-muted-foreground">No medications recorded.</li>
              )}
            </ol>
          </section>

          <footer className="mt-8 border-t border-border pt-5 flex items-end justify-between">
            <div className="text-[11px] text-muted-foreground max-w-md flex items-start gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 mt-0.5 flex-none" />
              <span>This prescription was generated with AI assistance and explicitly validated by the prescribing clinician, who remains fully responsible.</span>
            </div>
            <div className="text-right">
              <div className="h-12 w-44 border-b border-foreground/40" />
              <div className="text-[11px] text-muted-foreground mt-1">Signature</div>
            </div>
          </footer>
        </article>
      </div>
    </div>
  );
}

function Cell({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="font-medium">{value}</div>
    </div>
  );
}
