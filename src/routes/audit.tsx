import { createFileRoute } from "@tanstack/react-router";
import { Download, Search } from "lucide-react";
import { auditEntries } from "@/lib/mock-data";
import { statusMeta } from "@/lib/clinical-ui";

export const Route = createFileRoute("/audit")({
  head: () => ({ meta: [{ title: "Reports & Audit — MedAssist CDSS" }] }),
  component: AuditPage,
});

function AuditPage() {
  return (
    <div className="p-4 lg:p-8 space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Reports & audit trail</h1>
          <p className="text-sm text-muted-foreground mt-1">Immutable log of every AI recommendation, doctor decision, and override.</p>
        </div>
        <div className="flex gap-2">
          <div className="flex items-center gap-2 rounded-lg border border-input bg-card px-3 py-2 text-sm w-64">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input placeholder="Search by patient, doctor, RX…" className="flex-1 bg-transparent outline-none" />
          </div>
          <button className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-smooth">
            <Download className="h-4 w-4" /> Export
          </button>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card shadow-card overflow-hidden">
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full text-sm">
            <thead className="text-left text-xs uppercase tracking-wider text-muted-foreground bg-muted/40">
              <tr>
                <th className="px-4 py-3 font-semibold">RX ID</th>
                <th className="px-4 py-3 font-semibold">Patient</th>
                <th className="px-4 py-3 font-semibold">Doctor</th>
                <th className="px-4 py-3 font-semibold">Model</th>
                <th className="px-4 py-3 font-semibold">AI recommendation</th>
                <th className="px-4 py-3 font-semibold">Doctor modification</th>
                <th className="px-4 py-3 font-semibold">Overrides</th>
                <th className="px-4 py-3 font-semibold">Final status</th>
                <th className="px-4 py-3 font-semibold">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {auditEntries.map((e) => {
                const st = statusMeta[e.finalStatus];
                return (
                  <tr key={e.id} className="hover:bg-muted/30 align-top">
                    <td className="px-4 py-3 font-mono text-xs">{e.prescriptionId}</td>
                    <td className="px-4 py-3 font-medium">{e.patient}</td>
                    <td className="px-4 py-3 text-muted-foreground">{e.doctor}</td>
                    <td className="px-4 py-3 text-xs font-mono text-muted-foreground">{e.modelVersion}</td>
                    <td className="px-4 py-3 max-w-xs">{e.recommendation}</td>
                    <td className="px-4 py-3 max-w-xs">
                      <div>{e.doctorModification}</div>
                      {e.overrideReason && (
                        <div className="mt-1 text-[11px] text-warning-foreground bg-warning-soft border border-warning/30 rounded px-2 py-1">
                          <span className="font-semibold">Override reason:</span> {e.overrideReason}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {e.alertsOverridden > 0 ? (
                        <span className="inline-flex items-center justify-center h-6 min-w-[24px] rounded-full bg-warning-soft text-warning-foreground border border-warning/30 px-1.5 text-xs font-semibold">{e.alertsOverridden}</span>
                      ) : <span className="text-muted-foreground text-xs">—</span>}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-semibold ${st.cls}`}>{st.label}</span>
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">{e.timestamp}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
