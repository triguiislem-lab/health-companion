import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { z } from "zod";
import { Sparkles, RefreshCw, Save, X, Pencil, ShieldCheck, Brain, ChevronDown, FileText, Users } from "lucide-react";
import { prescriptions, safetyAlerts, type Medication } from "@/lib/mock-data";
import { usePatientStore } from "@/lib/stores/patient-store";
import { PatientSummary } from "@/components/clinical/PatientSummary";
import { SafetyPanel } from "@/components/clinical/SafetyPanel";

const searchSchema = z.object({
  patientId: z.string().optional(),
});

export const Route = createFileRoute("/prescription/new")({
  head: () => ({ meta: [{ title: "New Prescription — MedAssist CDSS" }] }),
  validateSearch: searchSchema,
  component: NewPrescription,
});

function NewPrescription() {
  const { patientId } = Route.useSearch();
  const navigate = Route.useNavigate();
  const patients = usePatientStore((s) => s.patients);

  const patient = useMemo(
    () => patients.find((p) => p.id === patientId) ?? patients[0],
    [patients, patientId],
  );

  const initialRx = prescriptions[0];
  const [diagnosis, setDiagnosis] = useState("");
  const [notes, setNotes] = useState("");
  const [meds, setMeds] = useState<Medication[]>([]);
  const [generated, setGenerated] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);

  const generate = () => {
    setGenerating(true);
    setTimeout(() => {
      setMeds(initialRx.medications.map((m) => ({ ...m, status: "ai_proposed" })));
      setGenerated(true);
      setGenerating(false);
    }, 900);
  };

  const updateMed = (id: string, patch: Partial<Medication>) =>
    setMeds((ms) => ms.map((m) => (m.id === id ? { ...m, ...patch, status: "edited" } : m)));

  const removeMed = (id: string) => setMeds((ms) => ms.filter((m) => m.id !== id));

  const hasMissingData = !!patient?.missingData?.length;

  if (!patient) {
    return (
      <div className="p-8 text-center">
        <p className="text-sm text-muted-foreground">No patients in your panel.</p>
        <Link to="/patients" className="inline-flex mt-4 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">Add a patient</Link>
      </div>
    );
  }

  const selectPatient = (id: string) => {
    navigate({ search: { patientId: id } });
    setPickerOpen(false);
  };

  return (
    <div className="p-4 lg:p-6 space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">New prescription</h1>
          <p className="text-sm text-muted-foreground mt-1">AI proposes — you decide. Validation is mandatory.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <button onClick={() => setPickerOpen((o) => !o)} className="inline-flex items-center gap-2 rounded-lg border border-input bg-card px-3 py-2 text-sm font-semibold hover:bg-muted transition-smooth">
              <Users className="h-4 w-4" />
              <span className="truncate max-w-[180px]">{patient.name}</span>
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </button>
            {pickerOpen && (
              <div className="absolute right-0 mt-1 z-30 w-72 rounded-lg border border-border bg-card shadow-elevated p-1 max-h-80 overflow-y-auto scrollbar-thin">
                {patients.map((p) => (
                  <button key={p.id} onClick={() => selectPatient(p.id)} className={`flex w-full items-center justify-between gap-2 rounded-md px-3 py-2 text-left text-sm hover:bg-muted ${p.id === patient.id ? "bg-primary-soft text-primary" : ""}`}>
                    <span className="truncate">
                      <span className="font-medium">{p.name}</span>
                      <span className="text-xs text-muted-foreground ml-1">{p.age}{p.sex}</span>
                    </span>
                    <span className="text-[11px] text-muted-foreground font-mono">{p.id}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="text-xs text-muted-foreground">Model v3.2.1</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-3 lg:sticky lg:top-20 self-start">
          <PatientSummary patient={patient} />
        </div>

        <div className="lg:col-span-6 space-y-4">
          <div className="rounded-xl border border-border bg-card shadow-card p-5">
            <h2 className="text-sm font-semibold mb-3">Clinical context</h2>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-muted-foreground">Diagnosis / indication thérapeutique</label>
                <input
                  value={diagnosis}
                  onChange={(e) => setDiagnosis(e.target.value.slice(0, 200))}
                  maxLength={200}
                  className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring/20"
                  placeholder="e.g. Community-acquired pneumonia"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground">Clinical notes</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value.slice(0, 1000))}
                  maxLength={1000}
                  rows={3}
                  className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring/20 resize-none"
                  placeholder="Symptoms, exam findings, relevant labs…"
                />
              </div>
              <button
                onClick={generate}
                disabled={generating || !diagnosis.trim()}
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-card hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-smooth"
              >
                <Sparkles className={`h-4 w-4 ${generating ? "animate-spin" : ""}`} />
                {generating ? "Generating…" : "Generate AI prescription"}
              </button>
            </div>
          </div>

          {generated && (
            <div className="rounded-xl border border-border bg-card shadow-card overflow-hidden">
              <div className="px-5 py-4 border-b border-border flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <Brain className="h-4 w-4 text-primary" />
                    <h2 className="text-sm font-semibold">AI prescription proposal</h2>
                    <span className="inline-flex rounded-full bg-info-soft text-info border border-info/30 px-2 py-0.5 text-[11px] font-semibold">Proposal · awaiting clinician</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Every row is editable. Confidence is informational, not a guarantee.</p>
                </div>
              </div>

              <div className="divide-y divide-border">
                {meds.map((m) => (
                  <MedRow key={m.id} med={m} onChange={(p) => updateMed(m.id, p)} onRemove={() => removeMed(m.id)} />
                ))}
                {meds.length === 0 && (
                  <div className="px-5 py-10 text-center text-sm text-muted-foreground">No medications. Generate or add manually.</div>
                )}
              </div>

              <div className="px-5 py-4 border-t border-border bg-muted/30 flex flex-wrap gap-2">
                <button onClick={generate} className="inline-flex items-center gap-1.5 rounded-lg border border-input bg-card px-3 py-2 text-xs font-semibold hover:bg-muted transition-smooth">
                  <RefreshCw className="h-3.5 w-3.5" /> Regenerate
                </button>
                <button className="inline-flex items-center gap-1.5 rounded-lg border border-input bg-card px-3 py-2 text-xs font-semibold hover:bg-muted transition-smooth">
                  <Save className="h-3.5 w-3.5" /> Save draft
                </button>
                <button className="inline-flex items-center gap-1.5 rounded-lg border border-critical/40 text-critical bg-card px-3 py-2 text-xs font-semibold hover:bg-critical-soft transition-smooth">
                  <X className="h-3.5 w-3.5" /> Reject proposal
                </button>
                <div className="ml-auto flex gap-2">
                  <button
                    disabled={hasMissingData}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-success px-4 py-2 text-xs font-semibold text-success-foreground shadow-card hover:bg-success/90 disabled:opacity-50 disabled:cursor-not-allowed transition-smooth"
                    title={hasMissingData ? "Resolve missing patient data first" : ""}
                  >
                    <ShieldCheck className="h-3.5 w-3.5" /> Validate
                  </button>
                  <Link
                    to="/prescription/$rxId/ordonnance"
                    params={{ rxId: initialRx.id }}
                    search={{ patientId: patient.id }}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-primary/30 bg-primary-soft text-primary px-3 py-2 text-xs font-semibold hover:bg-primary-soft/70 transition-smooth"
                  >
                    <FileText className="h-3.5 w-3.5" /> Generate ordonnance
                  </Link>
                </div>
              </div>

              <div className="px-5 py-3 border-t border-border bg-warning-soft/40 text-[11px] text-warning-foreground flex items-center gap-2">
                <ShieldCheck className="h-3.5 w-3.5" />
                You, the prescribing clinician, remain fully responsible for this prescription. AI output requires explicit validation.
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-3 lg:sticky lg:top-20 self-start">
          <SafetyPanel alerts={safetyAlerts} />
        </div>
      </div>
    </div>
  );
}

function MedRow({ med, onChange, onRemove }: { med: Medication; onChange: (p: Partial<Medication>) => void; onRemove: () => void }) {
  const confColor = med.confidence >= 85 ? "bg-success" : med.confidence >= 65 ? "bg-warning" : "bg-critical";
  const confText = med.confidence >= 85 ? "text-success" : med.confidence >= 65 ? "text-warning-foreground" : "text-critical";
  const statusBadge =
    med.status === "edited" ? "bg-info-soft text-info border-info/30" :
    med.status === "validated" ? "bg-success-soft text-success border-success/30" :
    med.status === "rejected" ? "bg-critical-soft text-critical border-critical/30" :
    "bg-muted text-muted-foreground border-border";
  const statusLabel = med.status === "ai_proposed" ? "AI proposed" : med.status.replace("_", " ");

  return (
    <div className="px-5 py-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <input value={med.name} onChange={(e) => onChange({ name: e.target.value })} className="font-semibold bg-transparent outline-none border-b border-transparent focus:border-ring px-0.5" />
            <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-semibold capitalize ${statusBadge}`}>
              <Pencil className="h-2.5 w-2.5" /> {statusLabel}
            </span>
          </div>
          <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
            <Field label="Dose" value={med.dose} onChange={(v) => onChange({ dose: v })} />
            <Field label="Route" value={med.route} onChange={(v) => onChange({ route: v })} />
            <Field label="Frequency" value={med.frequency} onChange={(v) => onChange({ frequency: v })} />
            <Field label="Duration" value={med.duration} onChange={(v) => onChange({ duration: v })} />
            <Field label="Indication" value={med.indication} onChange={(v) => onChange({ indication: v })} className="col-span-2 sm:col-span-1" />
          </div>
        </div>
        <button onClick={onRemove} className="text-muted-foreground hover:text-critical transition-smooth p-1 rounded-md" aria-label="Remove">
          <X className="h-4 w-4" />
        </button>
      </div>
      <div className="mt-3 flex items-center gap-2">
        <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">AI confidence</div>
        <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden max-w-xs">
          <div className={`h-full ${confColor}`} style={{ width: `${med.confidence}%` }} />
        </div>
        <div className={`text-xs font-semibold ${confText}`}>{med.confidence}%</div>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, className = "" }: { label: string; value: string; onChange: (v: string) => void; className?: string }) {
  return (
    <div className={className}>
      <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</div>
      <input value={value} onChange={(e) => onChange(e.target.value.slice(0, 100))} maxLength={100} className="mt-0.5 w-full rounded-md border border-input bg-background px-2 py-1 text-xs outline-none focus:ring-2 focus:ring-ring/20" />
    </div>
  );
}
