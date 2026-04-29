import { createFileRoute, Link } from "@tanstack/react-router";
import { Search, AlertTriangle, FilePlus2 } from "lucide-react";
import { patients } from "@/lib/mock-data";

export const Route = createFileRoute("/patients")({
  head: () => ({ meta: [{ title: "Patients — MedAssist CDSS" }] }),
  component: PatientsPage,
});

function PatientsPage() {
  return (
    <div className="p-4 lg:p-8 space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Patients</h1>
          <p className="text-sm text-muted-foreground mt-1">{patients.length} patients in your active panel</p>
        </div>
        <div className="flex items-center gap-2 rounded-lg border border-input bg-card px-3 py-2 text-sm w-full sm:w-72">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input placeholder="Search by name or ID" className="flex-1 bg-transparent outline-none" />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {patients.map((p) => (
          <div key={p.id} className="rounded-xl border border-border bg-card p-5 shadow-card transition-smooth hover:shadow-elevated">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="h-11 w-11 rounded-full bg-primary-soft text-primary flex items-center justify-center font-semibold">
                  {p.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                </div>
                <div>
                  <div className="font-semibold">{p.name}</div>
                  <div className="text-xs text-muted-foreground">{p.id} · {p.age}{p.sex} · {p.weightKg} kg</div>
                </div>
              </div>
              {p.missingData && p.missingData.length > 0 && (
                <span className="inline-flex items-center gap-1 rounded-full bg-warning-soft text-warning-foreground px-2 py-0.5 text-[11px] font-semibold border border-warning/30">
                  <AlertTriangle className="h-3 w-3" /> Data
                </span>
              )}
            </div>

            <div className="mt-4 grid grid-cols-2 gap-y-2 text-xs">
              <div className="text-muted-foreground">eGFR</div>
              <div className="font-medium">{p.renal.gfr} mL/min</div>
              <div className="text-muted-foreground">Comorbidities</div>
              <div className="font-medium">{p.comorbidities.length}</div>
              <div className="text-muted-foreground">Active meds</div>
              <div className="font-medium">{p.currentMedications.length}</div>
            </div>

            {p.flags.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-1.5">
                {p.flags.map((f) => (
                  <span key={f} className="inline-flex items-center rounded-full bg-warning-soft text-warning-foreground border border-warning/30 px-2 py-0.5 text-[11px] font-medium">
                    {f}
                  </span>
                ))}
              </div>
            )}

            <div className="mt-5 flex gap-2">
              <Link to="/prescription/new" className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-smooth">
                <FilePlus2 className="h-3.5 w-3.5" /> New Rx
              </Link>
              <button className="flex-1 inline-flex items-center justify-center rounded-lg border border-input bg-card px-3 py-2 text-xs font-semibold hover:bg-muted transition-smooth">
                Open chart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
