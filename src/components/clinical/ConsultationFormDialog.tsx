import { useEffect, useState } from "react";
import { usePatientStore } from "@/lib/stores/patient-store";
import { useConsultationStore } from "@/lib/stores/consultation-store";

interface Props {
  open: boolean;
  onClose: () => void;
  editingId?: string;
}

export function ConsultationFormDialog({ open, onClose, editingId }: Props) {
  const patients = usePatientStore((s) => s.patients);
  const add = useConsultationStore((s) => s.add);
  const update = useConsultationStore((s) => s.update);
  const existing = useConsultationStore((s) => (editingId ? s.consultations.find((c) => c.id === editingId) : undefined));

  const [patientId, setPatientId] = useState(patients[0]?.id ?? "");
  const [reason, setReason] = useState("");
  const [doctor, setDoctor] = useState("Dr. Jordan Chen");
  const [scheduledAt, setScheduledAt] = useState(() => new Date(Date.now() + 60 * 60 * 1000).toISOString().slice(0, 16));

  useEffect(() => {
    if (existing) {
      setPatientId(existing.patientId);
      setReason(existing.reason);
      setDoctor(existing.doctor);
      setScheduledAt(new Date(existing.scheduledAt).toISOString().slice(0, 16));
    }
  }, [existing]);

  if (!open) return null;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const patient = patients.find((p) => p.id === patientId);
    if (!patient) return;
    const iso = new Date(scheduledAt).toISOString();
    if (existing) {
      update(existing.id, { patientId, patientName: patient.name, reason, doctor, scheduledAt: iso });
    } else {
      add({
        patientId, patientName: patient.name, doctor, reason,
        scheduledAt: iso, status: "scheduled", notes: "",
      });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 backdrop-blur-sm p-4">
      <form onSubmit={submit} className="w-full max-w-lg rounded-xl border border-border bg-card shadow-elevated p-5 space-y-4">
        <div>
          <h3 className="font-semibold">{existing ? "Modifier la consultation" : "Nouvelle consultation"}</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Renseignez le patient et le motif.</p>
        </div>

        <label className="block">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Patient</span>
          <select value={patientId} onChange={(e) => setPatientId(e.target.value)} className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm">
            {patients.map((p) => <option key={p.id} value={p.id}>{p.name} — {p.id}</option>)}
          </select>
        </label>

        <label className="block">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Motif</span>
          <input required value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Ex. Toux fébrile depuis 4 jours" className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" />
        </label>

        <div className="grid grid-cols-2 gap-3">
          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Médecin</span>
            <input value={doctor} onChange={(e) => setDoctor(e.target.value)} className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" />
          </label>
          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Date/heure</span>
            <input type="datetime-local" value={scheduledAt} onChange={(e) => setScheduledAt(e.target.value)} className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" />
          </label>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <button type="button" onClick={onClose} className="rounded-lg border border-input bg-card px-3 py-2 text-sm font-semibold hover:bg-muted">Annuler</button>
          <button type="submit" className="rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90">{existing ? "Enregistrer" : "Créer"}</button>
        </div>
      </form>
    </div>
  );
}
