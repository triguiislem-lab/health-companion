import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Search, CalendarClock, Mic, Trash2, Pencil, ChevronRight, Stethoscope } from "lucide-react";
import { useConsultationStore, type ConsultationStatus } from "@/lib/stores/consultation-store";
import { ConsultationFormDialog } from "@/components/clinical/ConsultationFormDialog";

export const Route = createFileRoute("/consultations")({
  head: () => ({ meta: [{ title: "Consultations — MedAssist CDSS" }] }),
  component: ConsultationsPage,
});

const statusMeta: Record<ConsultationStatus, { label: string; cls: string }> = {
  scheduled:  { label: "Programmée",  cls: "bg-info-soft text-info border-info/30" },
  in_progress:{ label: "En cours",    cls: "bg-warning-soft text-warning-foreground border-warning/30" },
  completed:  { label: "Terminée",    cls: "bg-success-soft text-success border-success/30" },
  cancelled:  { label: "Annulée",     cls: "bg-muted text-muted-foreground border-border" },
};

function ConsultationsPage() {
  const consultations = useConsultationStore((s) => s.consultations);
  const remove = useConsultationStore((s) => s.remove);
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<ConsultationStatus | "all">("all");
  const [editing, setEditing] = useState<string | "new" | null>(null);
  const [confirmDel, setConfirmDel] = useState<string | null>(null);
  const navigate = useNavigate();

  const filtered = consultations.filter((c) => {
    if (filter !== "all" && c.status !== filter) return false;
    const s = q.trim().toLowerCase();
    if (!s) return true;
    return c.patientName.toLowerCase().includes(s) || c.reason.toLowerCase().includes(s) || c.id.toLowerCase().includes(s);
  });

  return (
    <div className="p-4 lg:p-8 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Consultations</h1>
          <p className="text-sm text-muted-foreground mt-1">Plan, conduct and review patient consultations.</p>
        </div>
        <button onClick={() => setEditing("new")} className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-smooth">
          <Plus className="h-4 w-4" /> New consultation
        </button>
      </div>

      <div className="rounded-xl border border-border bg-card shadow-card">
        <div className="flex flex-wrap items-center gap-2 p-3 border-b border-border">
          <div className="flex flex-1 min-w-[220px] items-center gap-2 rounded-lg border border-input bg-background px-3 py-2 text-sm">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Rechercher patient, motif, ID…" className="flex-1 bg-transparent outline-none" />
          </div>
          <div className="flex items-center gap-1">
            {(["all","scheduled","in_progress","completed","cancelled"] as const).map((s) => (
              <button key={s} onClick={() => setFilter(s)} className={`rounded-md px-2.5 py-1.5 text-xs font-medium transition-smooth ${filter === s ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"}`}>
                {s === "all" ? "Toutes" : statusMeta[s].label}
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="p-12 text-center text-sm text-muted-foreground">
            <Stethoscope className="h-8 w-8 mx-auto text-muted-foreground/50 mb-2" />
            Aucune consultation trouvée.
          </div>
        ) : (
          <ul className="divide-y divide-border">
            {filtered.map((c) => {
              const st = statusMeta[c.status];
              return (
                <li key={c.id} className="flex items-center gap-3 px-5 py-3.5 hover:bg-muted/40 transition-smooth">
                  <Link to="/consultations/$consultationId" params={{ consultationId: c.id }} className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-xs text-muted-foreground">{c.id}</span>
                      <span className={`inline-flex rounded-full border px-2 py-0.5 text-[11px] font-semibold ${st.cls}`}>{st.label}</span>
                      {c.recordingDurationSec ? <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground"><Mic className="h-3 w-3" /> {Math.round(c.recordingDurationSec/60)} min</span> : null}
                    </div>
                    <div className="mt-1 font-medium text-sm">{c.patientName} — {c.reason}</div>
                    <div className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1.5">
                      <CalendarClock className="h-3 w-3" /> {new Date(c.scheduledAt).toLocaleString("fr-FR")} · {c.doctor}
                    </div>
                  </Link>
                  <div className="flex items-center gap-1">
                    <button onClick={() => setEditing(c.id)} className="rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground" aria-label="Edit"><Pencil className="h-4 w-4" /></button>
                    <button onClick={() => setConfirmDel(c.id)} className="rounded-md p-2 text-muted-foreground hover:bg-critical-soft hover:text-critical" aria-label="Delete"><Trash2 className="h-4 w-4" /></button>
                    <button onClick={() => navigate({ to: "/consultations/$consultationId", params: { consultationId: c.id } })} className="rounded-md p-2 text-muted-foreground hover:bg-muted" aria-label="Open"><ChevronRight className="h-4 w-4" /></button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {editing !== null && (
        <ConsultationFormDialog
          open
          onClose={() => setEditing(null)}
          editingId={editing === "new" ? undefined : editing}
        />
      )}

      {confirmDel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-xl border border-border bg-card shadow-elevated p-5">
            <h3 className="font-semibold">Supprimer la consultation</h3>
            <p className="text-sm text-muted-foreground mt-2">Cette action est irréversible.</p>
            <div className="mt-4 flex justify-end gap-2">
              <button onClick={() => setConfirmDel(null)} className="rounded-lg border border-input bg-card px-3 py-2 text-sm font-semibold hover:bg-muted">Annuler</button>
              <button onClick={() => { remove(confirmDel); setConfirmDel(null); }} className="inline-flex items-center gap-1.5 rounded-lg bg-critical text-critical-foreground px-3 py-2 text-sm font-semibold hover:bg-critical/90">
                <Trash2 className="h-4 w-4" /> Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
