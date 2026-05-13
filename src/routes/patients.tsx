import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, AlertTriangle, FilePlus2, Plus, Pencil, Trash2, Eye, RotateCcw } from "lucide-react";
import { usePatientStore } from "@/lib/stores/patient-store";
import { PatientFormDialog } from "@/components/clinical/PatientFormDialog";
import type { Patient } from "@/lib/mock-data";

export const Route = createFileRoute("/patients")({
  head: () => ({ meta: [{ title: "Patients — MedAssist CDSS" }] }),
  component: PatientsPage,
});

function PatientsPage() {
  const patients = usePatientStore((s) => s.patients);
  const deletePatient = usePatientStore((s) => s.deletePatient);
  const resetSeed = usePatientStore((s) => s.resetSeed);
  const navigate = useNavigate();

  const [query, setQuery] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Patient | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<Patient | null>(null);
  const [page, setPage] = useState(1);
  const pageSize = 9;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return patients;
    return patients.filter((p) => p.name.toLowerCase().includes(q) || p.id.toLowerCase().includes(q));
  }, [patients, query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const paged = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="p-4 lg:p-8 space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Patients</h1>
          <p className="text-sm text-muted-foreground mt-1">{patients.length} patients in your active panel</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2 rounded-lg border border-input bg-card px-3 py-2 text-sm w-full sm:w-72">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by name or ID" className="flex-1 bg-transparent outline-none" />
          </div>
          <button onClick={resetSeed} title="Reset to demo data" className="inline-flex items-center gap-1.5 rounded-lg border border-input bg-card px-3 py-2 text-sm font-semibold hover:bg-muted transition-smooth">
            <RotateCcw className="h-4 w-4" />
          </button>
          <button onClick={() => { setEditing(null); setDialogOpen(true); }} className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground shadow-card hover:bg-primary/90 transition-smooth">
            <Plus className="h-4 w-4" /> New patient
          </button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-card p-10 text-center">
          <p className="text-sm text-muted-foreground">No patients match your search.</p>
        </div>
      ) : (
        <>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 items-stretch">
          {paged.map((p) => (
            <div key={p.id} className="flex flex-col h-full rounded-xl border border-border bg-card p-5 shadow-card transition-smooth hover:shadow-elevated">
              <div className="flex items-start justify-between">
                <Link to="/patients/$patientId" params={{ patientId: p.id }} className="flex items-center gap-3 group">
                  <div className="h-11 w-11 rounded-full bg-primary-soft text-primary flex items-center justify-center font-semibold">
                    {p.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                  </div>
                  <div>
                    <div className="font-semibold group-hover:text-primary transition-smooth">{p.name}</div>
                    <div className="text-xs text-muted-foreground">{p.id} · {p.age}{p.sex} · {p.weightKg} kg</div>
                  </div>
                </Link>
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

              <div className="mt-4 min-h-[26px] flex flex-wrap gap-1.5">
                {p.flags.map((f) => (
                  <span key={f} className="inline-flex items-center rounded-full bg-warning-soft text-warning-foreground border border-warning/30 px-2 py-0.5 text-[11px] font-medium">{f}</span>
                ))}
              </div>

              <div className="mt-auto pt-5 grid grid-cols-4 gap-2">
                <button onClick={() => navigate({ to: "/prescription/new", search: { patientId: p.id } })} className="col-span-2 inline-flex items-center justify-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-smooth">
                  <FilePlus2 className="h-3.5 w-3.5" /> New Rx
                </button>
                <Link to="/patients/$patientId" params={{ patientId: p.id }} className="inline-flex items-center justify-center rounded-lg border border-input bg-card px-2 py-2 text-xs font-semibold hover:bg-muted transition-smooth" title="Open chart">
                  <Eye className="h-3.5 w-3.5" />
                </Link>
                <div className="flex gap-1">
                  <button onClick={() => { setEditing(p); setDialogOpen(true); }} className="flex-1 inline-flex items-center justify-center rounded-lg border border-input bg-card px-2 py-2 text-xs font-semibold hover:bg-muted transition-smooth" title="Edit">
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                  <button onClick={() => setConfirmDelete(p)} className="flex-1 inline-flex items-center justify-center rounded-lg border border-critical/30 bg-card px-2 py-2 text-xs font-semibold text-critical hover:bg-critical-soft transition-smooth" title="Delete">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        {totalPages > 1 && (
          <div className="flex items-center justify-between pt-2">
            <div className="text-xs text-muted-foreground">
              Showing {(currentPage - 1) * pageSize + 1}–{Math.min(currentPage * pageSize, filtered.length)} of {filtered.length}
            </div>
            <div className="flex items-center gap-1">
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1} className="rounded-lg border border-input bg-card px-3 py-1.5 text-xs font-semibold hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed">Previous</button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                <button key={n} onClick={() => setPage(n)} className={`min-w-[32px] rounded-lg border px-2 py-1.5 text-xs font-semibold ${n === currentPage ? "bg-primary text-primary-foreground border-primary" : "border-input bg-card hover:bg-muted"}`}>{n}</button>
              ))}
              <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="rounded-lg border border-input bg-card px-3 py-1.5 text-xs font-semibold hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed">Next</button>
            </div>
          </div>
        )}
        </>
      )}

      <PatientFormDialog open={dialogOpen} onClose={() => setDialogOpen(false)} editing={editing} />

      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 backdrop-blur-sm p-4" role="dialog" aria-modal="true">
          <div className="w-full max-w-md rounded-xl border border-border bg-card shadow-elevated p-5">
            <h3 className="font-semibold">Delete patient</h3>
            <p className="text-sm text-muted-foreground mt-2">
              Permanently remove <span className="font-semibold text-foreground">{confirmDelete.name}</span> ({confirmDelete.id}) from your panel? This action cannot be undone.
            </p>
            <div className="mt-4 flex justify-end gap-2">
              <button onClick={() => setConfirmDelete(null)} className="rounded-lg border border-input bg-card px-3 py-2 text-sm font-semibold hover:bg-muted">Cancel</button>
              <button onClick={() => { deletePatient(confirmDelete.id); setConfirmDelete(null); }} className="inline-flex items-center gap-1.5 rounded-lg bg-critical text-critical-foreground px-3 py-2 text-sm font-semibold hover:bg-critical/90">
                <Trash2 className="h-4 w-4" /> Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
