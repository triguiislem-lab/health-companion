import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Building2, Search, Pill, User, Mail, MessageSquare, Globe, Printer, CheckCircle2, Clock, Package, Truck, XCircle, Filter } from "lucide-react";
import { usePharmacyStore, type DispatchStatus, type DispatchChannel } from "@/lib/stores/pharmacy-store";

export const Route = createFileRoute("/pharmacy")({
  head: () => ({ meta: [{ title: "Pharmacie — MedAssist CDSS" }] }),
  component: PharmacyPage,
});

const statusMeta: Record<DispatchStatus, { label: string; cls: string; icon: typeof Clock }> = {
  sent:       { label: "Envoyée",   cls: "bg-info-soft text-info border-info/30",                icon: Clock },
  received:   { label: "Reçue",     cls: "bg-info-soft text-info border-info/30",                icon: CheckCircle2 },
  preparing:  { label: "En préparation", cls: "bg-warning-soft text-warning-foreground border-warning/30", icon: Package },
  ready:      { label: "Prête",     cls: "bg-success-soft text-success border-success/30",       icon: CheckCircle2 },
  delivered:  { label: "Délivrée",  cls: "bg-success-soft text-success border-success/30",       icon: Truck },
  cancelled:  { label: "Annulée",   cls: "bg-muted text-muted-foreground border-border",         icon: XCircle },
};

const channelIcon: Record<DispatchChannel, typeof Mail> = {
  email: Mail, sms: MessageSquare, portal: Globe, fax: Printer,
};

function PharmacyPage() {
  const dispatches = usePharmacyStore((s) => s.dispatches);
  const updateStatus = usePharmacyStore((s) => s.updateStatus);
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<DispatchStatus | "all" | "pharmacist" | "patient">("all");

  const filtered = dispatches.filter((d) => {
    if (filter === "pharmacist" || filter === "patient") { if (d.target !== filter) return false; }
    else if (filter !== "all" && d.status !== filter) return false;
    const s = q.trim().toLowerCase();
    if (!s) return true;
    return d.patientName.toLowerCase().includes(s) || d.recipient.toLowerCase().includes(s) || d.rxId.toLowerCase().includes(s);
  });

  const counts = {
    pharmacist: dispatches.filter((d) => d.target === "pharmacist").length,
    patient: dispatches.filter((d) => d.target === "patient").length,
    preparing: dispatches.filter((d) => d.status === "preparing").length,
    ready: dispatches.filter((d) => d.status === "ready").length,
  };

  return (
    <div className="p-4 lg:p-8 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Pharmacie</h1>
          <p className="text-sm text-muted-foreground mt-1">Suivi des ordonnances transmises aux pharmacies et aux patients.</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Vers pharmacien", value: counts.pharmacist, icon: Building2, cls: "text-primary" },
          { label: "Vers patient",    value: counts.patient,    icon: User,      cls: "text-info" },
          { label: "En préparation",  value: counts.preparing,  icon: Package,   cls: "text-warning-foreground" },
          { label: "Prêtes",          value: counts.ready,      icon: CheckCircle2, cls: "text-success" },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-border bg-card shadow-card p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">{s.label}</span>
              <s.icon className={`h-4 w-4 ${s.cls}`} />
            </div>
            <div className="mt-2 text-2xl font-bold">{s.value}</div>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-border bg-card shadow-card">
        <div className="flex flex-wrap items-center gap-2 p-3 border-b border-border">
          <div className="flex flex-1 min-w-[220px] items-center gap-2 rounded-lg border border-input bg-background px-3 py-2 text-sm">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Rechercher patient, pharmacie, RX…" className="flex-1 bg-transparent outline-none" />
          </div>
          <div className="flex items-center gap-1 flex-wrap">
            <Filter className="h-3.5 w-3.5 text-muted-foreground mr-1" />
            {(["all","pharmacist","patient","preparing","ready","delivered"] as const).map((s) => (
              <button key={s} onClick={() => setFilter(s)} className={`rounded-md px-2.5 py-1.5 text-xs font-medium transition-smooth ${filter === s ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"}`}>
                {s === "all" ? "Toutes" : s === "pharmacist" ? "Pharmacien" : s === "patient" ? "Patient" : statusMeta[s].label}
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="p-12 text-center text-sm text-muted-foreground">
            <Pill className="h-8 w-8 mx-auto text-muted-foreground/50 mb-2" />
            Aucune ordonnance transmise.
          </div>
        ) : (
          <ul className="divide-y divide-border">
            {filtered.map((d) => {
              const st = statusMeta[d.status];
              const ChIcon = channelIcon[d.channel];
              const TargetIcon = d.target === "pharmacist" ? Building2 : User;
              return (
                <li key={d.id} className="p-5 hover:bg-muted/30 transition-smooth">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-xs text-muted-foreground">{d.id}</span>
                        <Link to="/prescription/$rxId/ordonnance" params={{ rxId: d.rxId }} className="font-mono text-xs text-primary hover:underline">{d.rxId}</Link>
                        <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-semibold ${st.cls}`}>
                          <st.icon className="h-3 w-3" /> {st.label}
                        </span>
                      </div>
                      <div className="mt-1.5 flex items-center gap-2 text-sm font-semibold">
                        <TargetIcon className="h-4 w-4 text-muted-foreground" />
                        {d.recipient}
                        <span className="text-muted-foreground font-normal">·</span>
                        <span className="font-normal text-muted-foreground">{d.patientName}</span>
                      </div>
                      <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="inline-flex items-center gap-1"><ChIcon className="h-3 w-3" /> {d.channel}</span>
                        <span>Envoyée: {new Date(d.sentAt).toLocaleString("fr-FR")}</span>
                      </div>
                      {d.note && <p className="mt-2 text-xs text-muted-foreground italic">"{d.note}"</p>}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <select
                        value={d.status}
                        onChange={(e) => updateStatus(d.id, e.target.value as DispatchStatus)}
                        className="rounded-md border border-input bg-background px-2 py-1.5 text-xs font-medium"
                      >
                        {(Object.keys(statusMeta) as DispatchStatus[]).map((s) => (
                          <option key={s} value={s}>{statusMeta[s].label}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
