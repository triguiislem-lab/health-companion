import type { Patient } from "@/lib/mock-data";
import { AlertTriangle, Activity, Heart, Droplets, Pill, ShieldCheck, User } from "lucide-react";

export function PatientSummary({ patient }: { patient: Patient }) {
  return (
    <div className="rounded-xl border border-border bg-card shadow-card overflow-hidden">
      <div className="bg-gradient-to-br from-primary-soft to-card px-5 py-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
            {patient.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
          </div>
          <div>
            <div className="font-semibold text-base leading-tight">{patient.name}</div>
            <div className="text-xs text-muted-foreground mt-0.5">
              {patient.id} · {patient.age} y/o {patient.sex === "F" ? "Female" : "Male"} · {patient.weightKg} kg · {patient.heightCm} cm
            </div>
          </div>
        </div>
      </div>

      <div className="divide-y divide-border text-sm">
        {patient.missingData && patient.missingData.length > 0 && (
          <div className="px-5 py-3 bg-warning-soft/50 border-l-4 border-warning">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-warning-foreground mt-0.5" />
              <div>
                <div className="text-xs font-semibold text-warning-foreground">Missing patient data</div>
                <ul className="mt-1 text-xs text-warning-foreground/90 list-disc list-inside">
                  {patient.missingData.map((m) => <li key={m}>{m}</li>)}
                </ul>
              </div>
            </div>
          </div>
        )}

        {patient.flags.length > 0 && (
          <div className="px-5 py-3">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">Risk flags</div>
            <div className="flex flex-wrap gap-1.5">
              {patient.flags.map((f) => (
                <span key={f} className="inline-flex items-center gap-1 rounded-full bg-warning-soft text-warning-foreground border border-warning/30 px-2 py-0.5 text-[11px] font-semibold">
                  <AlertTriangle className="h-3 w-3" /> {f}
                </span>
              ))}
            </div>
          </div>
        )}

        <Section title="Allergies" icon={ShieldCheck} accent="critical">
          <div className="flex flex-wrap gap-1.5">
            {patient.allergies.map((a) => (
              <span key={a} className="inline-flex rounded-md bg-critical-soft text-critical border border-critical/30 px-2 py-0.5 text-xs font-medium">{a}</span>
            ))}
          </div>
        </Section>

        <Section title="Current medications" icon={Pill}>
          <ul className="space-y-1.5">
            {patient.currentMedications.length === 0 ? (
              <li className="text-xs text-muted-foreground">None on file</li>
            ) : patient.currentMedications.map((m) => (
              <li key={m.name} className="flex justify-between text-xs">
                <span className="font-medium">{m.name}</span>
                <span className="text-muted-foreground">{m.dose}</span>
              </li>
            ))}
          </ul>
        </Section>

        <Section title="Comorbidities" icon={User}>
          <ul className="space-y-1 text-xs">
            {patient.comorbidities.map((c) => <li key={c}>• {c}</li>)}
          </ul>
        </Section>

        <Section title="Renal & liver" icon={Droplets}>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <div className="text-muted-foreground">eGFR</div>
              <div className="font-semibold">{patient.renal.gfr} mL/min</div>
              <div className="text-[11px] capitalize text-muted-foreground">{patient.renal.status} impairment</div>
            </div>
            <div>
              <div className="text-muted-foreground">Liver</div>
              <div className="font-semibold capitalize">{patient.liver.status}</div>
              {patient.liver.note && <div className="text-[11px] text-muted-foreground">{patient.liver.note}</div>}
            </div>
          </div>
        </Section>

        <Section title="Recent vitals" icon={Activity}>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <Vital label="HR" value={`${patient.vitals.hr} bpm`} icon={Heart} />
            <Vital label="BP" value={patient.vitals.bp} icon={Activity} />
            <Vital label="Temp" value={`${patient.vitals.temp} °C`} icon={Activity} />
            <Vital label="SpO₂" value={`${patient.vitals.spo2}%`} icon={Activity} />
          </div>
        </Section>
      </div>
    </div>
  );
}

function Section({ title, icon: Icon, children, accent }: { title: string; icon: React.ComponentType<{ className?: string }>; children: React.ReactNode; accent?: "critical" }) {
  return (
    <div className="px-5 py-3">
      <div className={`flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider mb-2 ${accent === "critical" ? "text-critical" : "text-muted-foreground"}`}>
        <Icon className="h-3.5 w-3.5" />
        {title}
      </div>
      {children}
    </div>
  );
}

function Vital({ label, value, icon: Icon }: { label: string; value: string; icon: React.ComponentType<{ className?: string }> }) {
  return (
    <div className="rounded-lg bg-muted/50 px-2.5 py-1.5">
      <div className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
        <Icon className="h-3 w-3" /> {label}
      </div>
      <div className="font-semibold text-sm">{value}</div>
    </div>
  );
}
