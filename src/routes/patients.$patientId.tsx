import { createFileRoute, Link, useNavigate, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, FilePlus2, Pencil, Trash2, FileText, ChevronRight } from "lucide-react";
import { usePatientStore } from "@/lib/stores/patient-store";
import { PatientFormDialog } from "@/components/clinical/PatientFormDialog";
import { PatientSummary } from "@/components/clinical/PatientSummary";
import { prescriptions } from "@/lib/mock-data";
import { riskMeta, statusMeta } from "@/lib/clinical-ui";

export const Route = createFileRoute("/patients/$patientId")({
  head: ({ params }) => ({ meta: [{ title: `Patient ${params.patientId} — MedAssist CDSS` }] }),
  component: PatientDetailPage,
  notFoundComponent: () => (
    <div className="p-8 text-center">
      <p className="text-sm text-muted-foreground">Patient not found.</p>
      <Link to="/patients" className="inline-flex mt-4 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">Back to patients</Link>
    </div>
  ),
  errorComponent: ({ error }) => <div className="p-8 text-sm text-critical">{error.message}</div>,
});

function PatientDetailPage() {
  const { patientId } = Route.useParams();
  const patient = usePatientStore((s) => s.patients.find((p) => p.id === patientId));
  const deletePatient = usePatientStore((s) => s.deletePatient);
  const navigate = useNavigate();
  const [editOpen, setEditOpen] = useState(false);
  const [confirmDel, setConfirmDel] = useState(false);

  if (!patient) throw notFound();

  const history = prescriptions.filter((rx) => rx.patientId === patient.id);

  return (
    <div className="p-4 lg:p-8 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Link to="/patients" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" /> Patients
          </Link>
          <span className="text-muted-foreground">/</span>
          <h1 className="text-xl font-bold">{patient.name}</h1>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => navigate({ to: "/prescription/new", search: { patientId: patient.id } })} className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-smooth">
            <FilePlus2 className="h-4 w-4" /> New prescription
          </button>
          <button onClick={() => setEditOpen(true)} className="inline-flex items-center gap-1.5 rounded-lg border border-input bg-card px-3 py-2 text-sm font-semibold hover:bg-muted transition-smooth">
            <Pencil className="h-4 w-4" /> Edit
          </button>
          <button onClick={() => setConfirmDel(true)} className="inline-flex items-center gap-1.5 rounded-lg border border-critical/30 text-critical bg-card px-3 py-2 text-sm font-semibold hover:bg-critical-soft transition-smooth">
            <Trash2 className="h-4 w-4" /> Delete
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-4">
          <PatientSummary patient={patient} />
        </div>

        <div className="lg:col-span-8 space-y-4">
          <div className="rounded-xl border border-border bg-card shadow-card overflow-hidden">
            <div className="px-5 py-4 border-b border-border flex items-center justify-between">
              <div>
                <h2 className="font-semibold">Prescription history</h2>
                <p className="text-xs text-muted-foreground mt-0.5">{history.length} prescription{history.length === 1 ? "" : "s"} on file</p>
              </div>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </div>
            {history.length === 0 ? (
              <div className="p-8 text-center text-sm text-muted-foreground">No prescriptions yet for this patient.</div>
            ) : (
              <ul className="divide-y divide-border">
                {history.map((rx) => {
                  const st = statusMeta[rx.status];
                  const rk = riskMeta[rx.risk];
                  return (
                    <li key={rx.id}>
                      <Link to="/prescription/$rxId/ordonnance" params={{ rxId: rx.id }} className="flex items-center justify-between gap-3 px-5 py-3.5 hover:bg-muted/40 transition-smooth">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-mono text-xs text-muted-foreground">{rx.id}</span>
                            <span className={`inline-flex rounded-full border px-2 py-0.5 text-[11px] font-semibold ${st.cls}`}>{st.label}</span>
                            <span className={`inline-flex rounded-full border px-2 py-0.5 text-[11px] font-semibold ${rk.cls}`}>{rk.label}</span>
                          </div>
                          <div className="mt-1 font-medium text-sm">{rx.diagnosis}</div>
                          <div className="text-xs text-muted-foreground mt-0.5">{rx.doctor} · {rx.lastUpdate} · {rx.medications.length} medication{rx.medications.length === 1 ? "" : "s"}</div>
                        </div>
                        <ChevronRight className="h-4 w-4 text-muted-foreground flex-none" />
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          <div className="rounded-xl border border-border bg-card shadow-card p-5">
            <h2 className="font-semibold">Antécédents médicaux</h2>
            <div className="mt-3 grid sm:grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">Comorbidities</div>
                {patient.comorbidities.length === 0 ? <p className="text-xs text-muted-foreground">None recorded</p> : (
                  <ul className="space-y-1">{patient.comorbidities.map((c) => <li key={c}>• {c}</li>)}</ul>
                )}
              </div>
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">Allergies</div>
                {patient.allergies.length === 0 ? <p className="text-xs text-muted-foreground">NKDA</p> : (
                  <div className="flex flex-wrap gap-1.5">
                    {patient.allergies.map((a) => <span key={a} className="inline-flex rounded-md bg-critical-soft text-critical border border-critical/30 px-2 py-0.5 text-xs font-medium">{a}</span>)}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <PatientFormDialog open={editOpen} onClose={() => setEditOpen(false)} editing={patient} />

      {confirmDel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 backdrop-blur-sm p-4" role="dialog" aria-modal="true">
          <div className="w-full max-w-md rounded-xl border border-border bg-card shadow-elevated p-5">
            <h3 className="font-semibold">Delete patient</h3>
            <p className="text-sm text-muted-foreground mt-2">
              Permanently remove <span className="font-semibold text-foreground">{patient.name}</span>? This action cannot be undone.
            </p>
            <div className="mt-4 flex justify-end gap-2">
              <button onClick={() => setConfirmDel(false)} className="rounded-lg border border-input bg-card px-3 py-2 text-sm font-semibold hover:bg-muted">Cancel</button>
              <button onClick={() => { deletePatient(patient.id); navigate({ to: "/patients" }); }} className="inline-flex items-center gap-1.5 rounded-lg bg-critical text-critical-foreground px-3 py-2 text-sm font-semibold hover:bg-critical/90">
                <Trash2 className="h-4 w-4" /> Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
