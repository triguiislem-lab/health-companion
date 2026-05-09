import { useEffect, useState } from "react";
import { X, Save, UserPlus } from "lucide-react";
import type { Patient } from "@/lib/mock-data";
import { usePatientStore, type PatientInput } from "@/lib/stores/patient-store";

interface Props {
  open: boolean;
  onClose: () => void;
  editing?: Patient | null;
  onSaved?: (p: Patient) => void;
}

const empty: PatientInput = {
  name: "",
  age: 40,
  sex: "F",
  weightKg: 70,
  heightCm: 170,
  allergies: [],
  currentMedications: [],
  comorbidities: [],
  renal: { gfr: 90, status: "normal" },
  liver: { status: "normal" },
  vitals: { hr: 72, bp: "120/80", temp: 36.7, spo2: 98 },
  flags: [],
};

const renalStatus = (gfr: number): Patient["renal"]["status"] =>
  gfr >= 90 ? "normal" : gfr >= 60 ? "mild" : gfr >= 30 ? "moderate" : "severe";

export function PatientFormDialog({ open, onClose, editing, onSaved }: Props) {
  const addPatient = usePatientStore((s) => s.addPatient);
  const updatePatient = usePatientStore((s) => s.updatePatient);
  const [form, setForm] = useState<PatientInput>(empty);
  const [allergiesText, setAllergiesText] = useState("");
  const [comorbText, setComorbText] = useState("");
  const [medsText, setMedsText] = useState("");

  useEffect(() => {
    if (editing) {
      setForm(editing);
      setAllergiesText(editing.allergies.join(", "));
      setComorbText(editing.comorbidities.join(", "));
      setMedsText(editing.currentMedications.map((m) => `${m.name} — ${m.dose}`).join("\n"));
    } else {
      setForm(empty);
      setAllergiesText("");
      setComorbText("");
      setMedsText("");
    }
  }, [editing, open]);

  if (!open) return null;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    const allergies = allergiesText.split(",").map((s) => s.trim()).filter(Boolean);
    const comorbidities = comorbText.split(",").map((s) => s.trim()).filter(Boolean);
    const currentMedications = medsText
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const [name, dose] = line.split(/—|-/).map((s) => s?.trim() ?? "");
        return { name: name || line, dose: dose || "" };
      });
    const payload: PatientInput = {
      ...form,
      name: form.name.trim().slice(0, 80),
      age: Math.max(0, Math.min(120, Number(form.age) || 0)),
      weightKg: Math.max(0, Math.min(400, Number(form.weightKg) || 0)),
      heightCm: Math.max(0, Math.min(260, Number(form.heightCm) || 0)),
      allergies,
      comorbidities,
      currentMedications,
      renal: { ...form.renal, status: renalStatus(Number(form.renal.gfr) || 90) },
    };
    if (editing) {
      updatePatient(editing.id, payload);
      onSaved?.({ ...editing, ...payload } as Patient);
    } else {
      const created = addPatient(payload);
      onSaved?.(created);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 backdrop-blur-sm p-4" role="dialog" aria-modal="true">
      <form onSubmit={submit} className="w-full max-w-2xl rounded-xl border border-border bg-card shadow-elevated max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div className="flex items-center gap-2">
            <UserPlus className="h-4 w-4 text-primary" />
            <h2 className="font-semibold">{editing ? "Edit patient" : "New patient"}</h2>
          </div>
          <button type="button" onClick={onClose} className="p-1 rounded-md hover:bg-muted" aria-label="Close">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="overflow-y-auto p-5 space-y-4 scrollbar-thin">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Field label="Full name" className="col-span-2 sm:col-span-4">
              <input required maxLength={80} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={input} placeholder="e.g. Marie Dupont" />
            </Field>
            <Field label="Age">
              <input type="number" min={0} max={120} value={form.age} onChange={(e) => setForm({ ...form, age: Number(e.target.value) })} className={input} />
            </Field>
            <Field label="Sex">
              <select value={form.sex} onChange={(e) => setForm({ ...form, sex: e.target.value as "M" | "F" })} className={input}>
                <option value="F">Female</option>
                <option value="M">Male</option>
              </select>
            </Field>
            <Field label="Weight (kg)">
              <input type="number" min={0} max={400} value={form.weightKg} onChange={(e) => setForm({ ...form, weightKg: Number(e.target.value) })} className={input} />
            </Field>
            <Field label="Height (cm)">
              <input type="number" min={0} max={260} value={form.heightCm} onChange={(e) => setForm({ ...form, heightCm: Number(e.target.value) })} className={input} />
            </Field>
          </div>

          <Field label="Allergies (comma-separated)">
            <input value={allergiesText} onChange={(e) => setAllergiesText(e.target.value)} className={input} placeholder="Penicillin, Sulfa drugs" />
          </Field>

          <Field label="Comorbidities / antécédents (comma-separated)">
            <input value={comorbText} onChange={(e) => setComorbText(e.target.value)} className={input} placeholder="Hypertension, Type 2 Diabetes" />
          </Field>

          <Field label="Current medications (one per line, format: Name — dose)">
            <textarea rows={3} value={medsText} onChange={(e) => setMedsText(e.target.value)} className={`${input} resize-none`} placeholder={"Warfarin — 5 mg daily\nMetformin — 1000 mg BID"} />
          </Field>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Field label="eGFR (mL/min)">
              <input type="number" min={0} max={200} value={form.renal.gfr} onChange={(e) => setForm({ ...form, renal: { ...form.renal, gfr: Number(e.target.value) } })} className={input} />
            </Field>
            <Field label="Liver">
              <select value={form.liver.status} onChange={(e) => setForm({ ...form, liver: { ...form.liver, status: e.target.value as "normal" | "impaired" } })} className={input}>
                <option value="normal">Normal</option>
                <option value="impaired">Impaired</option>
              </select>
            </Field>
            <Field label="HR (bpm)">
              <input type="number" value={form.vitals.hr} onChange={(e) => setForm({ ...form, vitals: { ...form.vitals, hr: Number(e.target.value) } })} className={input} />
            </Field>
            <Field label="BP">
              <input value={form.vitals.bp} onChange={(e) => setForm({ ...form, vitals: { ...form.vitals, bp: e.target.value.slice(0, 10) } })} className={input} placeholder="120/80" />
            </Field>
          </div>
        </div>

        <div className="px-5 py-3 border-t border-border bg-muted/30 flex items-center justify-end gap-2">
          <button type="button" onClick={onClose} className="rounded-lg border border-input bg-card px-3 py-2 text-sm font-semibold hover:bg-muted transition-smooth">Cancel</button>
          <button type="submit" className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-smooth">
            <Save className="h-4 w-4" /> {editing ? "Save changes" : "Create patient"}
          </button>
        </div>
      </form>
    </div>
  );
}

const input = "w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring/20";

function Field({ label, children, className = "" }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <label className={`block ${className}`}>
      <span className="text-xs font-semibold text-muted-foreground">{label}</span>
      <div className="mt-1">{children}</div>
    </label>
  );
}
