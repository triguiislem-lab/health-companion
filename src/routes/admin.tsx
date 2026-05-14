import { createFileRoute, Navigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Shield, Users, Building2, FileText, GitPullRequest, Plus, Pencil, Trash2, X, CheckCircle2, XCircle, Clock, FileCheck2 } from "lucide-react";
import { useAuthStore } from "@/lib/stores/auth-store";
import { useAdminStore, type Doctor, type Pharmacy } from "@/lib/stores/admin-store";
import { usePatientStore } from "@/lib/stores/patient-store";
import { prescriptions as seedPrescriptions } from "@/lib/mock-data";
import { useContributionsStore } from "@/lib/stores/medicine-contributions-store";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Administration — MedAssist CDSS" }] }),
  component: AdminPage,
});

type Tab = "overview" | "doctors" | "pharmacies" | "prescriptions" | "contributions";

function AdminPage() {
  const user = useAuthStore((s) => s.user);
  const [tab, setTab] = useState<Tab>("overview");

  if (!user) return <Navigate to="/login" />;
  if (user.role !== "admin") {
    return (
      <div className="p-8">
        <div className="max-w-md mx-auto text-center space-y-3 py-16">
          <Shield className="h-10 w-10 mx-auto text-muted-foreground" />
          <h1 className="text-xl font-semibold">Accès restreint</h1>
          <p className="text-sm text-muted-foreground">Cette section est réservée aux administrateurs. Connectez-vous avec un compte admin (ex: admin@medassist.tn).</p>
        </div>
      </div>
    );
  }

  const tabs: { id: Tab; label: string; icon: typeof Users }[] = [
    { id: "overview", label: "Vue d'ensemble", icon: Shield },
    { id: "doctors", label: "Médecins", icon: Users },
    { id: "pharmacies", label: "Pharmacies", icon: Building2 },
    { id: "prescriptions", label: "Prescriptions / médecin", icon: FileText },
    { id: "contributions", label: "Contributions", icon: GitPullRequest },
  ];

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div className="flex items-center gap-3">
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground"><Shield className="h-5 w-5" /></span>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Console Admin</h1>
          <p className="text-sm text-muted-foreground">Gestion des médecins, pharmacies, prescriptions et contributions.</p>
        </div>
      </div>

      <div className="border-b border-border flex flex-wrap gap-1">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 transition-smooth ${tab === t.id ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}>
            <t.icon className="h-4 w-4" />{t.label}
          </button>
        ))}
      </div>

      {tab === "overview" && <OverviewTab />}
      {tab === "doctors" && <DoctorsTab />}
      {tab === "pharmacies" && <PharmaciesTab />}
      {tab === "prescriptions" && <PrescriptionsTab />}
      {tab === "contributions" && <ContributionsTab />}
    </div>
  );
}

/* ----------------- OVERVIEW ----------------- */
function OverviewTab() {
  const doctors = useAdminStore(s => s.doctors);
  const pharmacies = useAdminStore(s => s.pharmacies);
  const patients = usePatientStore(s => s.patients);
  const contributions = useContributionsStore(s => s.items);
  const pendingContrib = contributions.filter(c => c.status === "pending").length;

  const cards = [
    { label: "Médecins actifs", value: doctors.filter(d => d.status === "active").length, total: doctors.length, icon: Users },
    { label: "Pharmacies", value: pharmacies.filter(p => p.status === "active").length, total: pharmacies.length, icon: Building2 },
    { label: "Patients", value: patients.length, icon: Users },
    { label: "Prescriptions", value: seedPrescriptions.length, icon: FileText },
    { label: "Contributions en attente", value: pendingContrib, total: contributions.length, icon: GitPullRequest },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {cards.map(c => (
        <div key={c.label} className="rounded-xl border border-border bg-card p-5 shadow-card">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-xs uppercase tracking-wider text-muted-foreground">{c.label}</div>
              <div className="mt-2 text-3xl font-semibold">{c.value}{c.total !== undefined && <span className="text-base text-muted-foreground"> / {c.total}</span>}</div>
            </div>
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-primary-soft text-primary"><c.icon className="h-4 w-4" /></span>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ----------------- DOCTORS ----------------- */
function DoctorsTab() {
  const { doctors, addDoctor, updateDoctor, deleteDoctor } = useAdminStore();
  const [editing, setEditing] = useState<Doctor | null>(null);
  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Médecins ({doctors.length})</h2>
        <button onClick={() => { setEditing(null); setOpen(true); }} className="inline-flex items-center gap-2 rounded-lg bg-primary text-primary-foreground px-3 py-2 text-sm font-medium hover:opacity-90"><Plus className="h-4 w-4" />Nouveau médecin</button>
      </div>
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-muted-foreground text-xs uppercase tracking-wider">
            <tr><th className="text-left px-4 py-3">Nom</th><th className="text-left px-4 py-3">Email</th><th className="text-left px-4 py-3">Spécialité</th><th className="text-left px-4 py-3">Licence</th><th className="text-left px-4 py-3">Statut</th><th className="px-4 py-3"></th></tr>
          </thead>
          <tbody>
            {doctors.map(d => (
              <tr key={d.id} className="border-t border-border">
                <td className="px-4 py-3 font-medium">{d.name}</td>
                <td className="px-4 py-3 text-muted-foreground">{d.email}</td>
                <td className="px-4 py-3">{d.specialty}</td>
                <td className="px-4 py-3 font-mono text-xs">{d.licenseNumber}</td>
                <td className="px-4 py-3"><span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${d.status === "active" ? "bg-success-soft text-success" : "bg-muted text-muted-foreground"}`}>{d.status === "active" ? "Actif" : "Suspendu"}</span></td>
                <td className="px-4 py-3 text-right">
                  <div className="inline-flex gap-1">
                    <button onClick={() => updateDoctor(d.id, { status: d.status === "active" ? "suspended" : "active" })} className="rounded-md border border-input p-1.5 hover:bg-muted" title="Toggle statut">{d.status === "active" ? <XCircle className="h-3.5 w-3.5" /> : <CheckCircle2 className="h-3.5 w-3.5" />}</button>
                    <button onClick={() => { setEditing(d); setOpen(true); }} className="rounded-md border border-input p-1.5 hover:bg-muted"><Pencil className="h-3.5 w-3.5" /></button>
                    <button onClick={() => { if (confirm(`Supprimer ${d.name} ?`)) deleteDoctor(d.id); }} className="rounded-md border border-input p-1.5 hover:bg-critical/10 text-critical"><Trash2 className="h-3.5 w-3.5" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {open && <DoctorDialog initial={editing} onClose={() => setOpen(false)} onSave={(data) => { editing ? updateDoctor(editing.id, data) : addDoctor(data as Omit<Doctor, "id"|"createdAt"|"status">); setOpen(false); }} />}
    </div>
  );
}

function DoctorDialog({ initial, onClose, onSave }: { initial: Doctor | null; onClose: () => void; onSave: (d: Partial<Doctor>) => void }) {
  const [form, setForm] = useState({
    name: initial?.name ?? "", email: initial?.email ?? "", specialty: initial?.specialty ?? "",
    phone: initial?.phone ?? "", licenseNumber: initial?.licenseNumber ?? "", status: initial?.status ?? "active" as Doctor["status"],
  });
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={onClose}>
      <div className="bg-card rounded-xl border border-border max-w-lg w-full p-6 space-y-4" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center"><h3 className="font-semibold">{initial ? "Modifier" : "Nouveau"} médecin</h3><button onClick={onClose}><X className="h-4 w-4" /></button></div>
        <div className="grid grid-cols-2 gap-3">
          {[
            { k: "name", label: "Nom complet", span: 2 },
            { k: "email", label: "Email", type: "email", span: 2 },
            { k: "specialty", label: "Spécialité" },
            { k: "phone", label: "Téléphone" },
            { k: "licenseNumber", label: "N° licence", span: 2 },
          ].map(f => (
            <label key={f.k} className={`text-sm space-y-1 ${f.span === 2 ? "col-span-2" : ""}`}>
              <span className="text-muted-foreground">{f.label}</span>
              <input type={f.type ?? "text"} value={(form as any)[f.k]} onChange={e => setForm({ ...form, [f.k]: e.target.value })} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
            </label>
          ))}
          <label className="text-sm space-y-1 col-span-2">
            <span className="text-muted-foreground">Statut</span>
            <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value as Doctor["status"] })} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
              <option value="active">Actif</option><option value="suspended">Suspendu</option>
            </select>
          </label>
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <button onClick={onClose} className="px-3 py-2 text-sm rounded-md border border-input">Annuler</button>
          <button onClick={() => onSave(form)} disabled={!form.name || !form.email} className="px-3 py-2 text-sm rounded-md bg-primary text-primary-foreground disabled:opacity-50">Enregistrer</button>
        </div>
      </div>
    </div>
  );
}

/* ----------------- PHARMACIES ----------------- */
function PharmaciesTab() {
  const { pharmacies, addPharmacy, updatePharmacy, deletePharmacy } = useAdminStore();
  const [editing, setEditing] = useState<Pharmacy | null>(null);
  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Pharmacies ({pharmacies.length})</h2>
        <button onClick={() => { setEditing(null); setOpen(true); }} className="inline-flex items-center gap-2 rounded-lg bg-primary text-primary-foreground px-3 py-2 text-sm font-medium hover:opacity-90"><Plus className="h-4 w-4" />Nouvelle pharmacie</button>
      </div>
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-muted-foreground text-xs uppercase tracking-wider">
            <tr><th className="text-left px-4 py-3">Nom</th><th className="text-left px-4 py-3">Ville</th><th className="text-left px-4 py-3">Adresse</th><th className="text-left px-4 py-3">Téléphone</th><th className="text-left px-4 py-3">Statut</th><th className="px-4 py-3"></th></tr>
          </thead>
          <tbody>
            {pharmacies.map(p => (
              <tr key={p.id} className="border-t border-border">
                <td className="px-4 py-3 font-medium">{p.name}</td>
                <td className="px-4 py-3">{p.city}</td>
                <td className="px-4 py-3 text-muted-foreground">{p.address}</td>
                <td className="px-4 py-3 font-mono text-xs">{p.phone}</td>
                <td className="px-4 py-3"><span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${p.status === "active" ? "bg-success-soft text-success" : "bg-muted text-muted-foreground"}`}>{p.status === "active" ? "Active" : "Inactive"}</span></td>
                <td className="px-4 py-3 text-right">
                  <div className="inline-flex gap-1">
                    <button onClick={() => updatePharmacy(p.id, { status: p.status === "active" ? "inactive" : "active" })} className="rounded-md border border-input p-1.5 hover:bg-muted">{p.status === "active" ? <XCircle className="h-3.5 w-3.5" /> : <CheckCircle2 className="h-3.5 w-3.5" />}</button>
                    <button onClick={() => { setEditing(p); setOpen(true); }} className="rounded-md border border-input p-1.5 hover:bg-muted"><Pencil className="h-3.5 w-3.5" /></button>
                    <button onClick={() => { if (confirm(`Supprimer ${p.name} ?`)) deletePharmacy(p.id); }} className="rounded-md border border-input p-1.5 hover:bg-critical/10 text-critical"><Trash2 className="h-3.5 w-3.5" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {open && <PharmacyDialog initial={editing} onClose={() => setOpen(false)} onSave={(data) => { editing ? updatePharmacy(editing.id, data) : addPharmacy(data as Omit<Pharmacy, "id"|"createdAt"|"status">); setOpen(false); }} />}
    </div>
  );
}

function PharmacyDialog({ initial, onClose, onSave }: { initial: Pharmacy | null; onClose: () => void; onSave: (p: Partial<Pharmacy>) => void }) {
  const [form, setForm] = useState({
    name: initial?.name ?? "", city: initial?.city ?? "", address: initial?.address ?? "",
    phone: initial?.phone ?? "", email: initial?.email ?? "", status: initial?.status ?? "active" as Pharmacy["status"],
  });
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={onClose}>
      <div className="bg-card rounded-xl border border-border max-w-lg w-full p-6 space-y-4" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center"><h3 className="font-semibold">{initial ? "Modifier" : "Nouvelle"} pharmacie</h3><button onClick={onClose}><X className="h-4 w-4" /></button></div>
        <div className="grid grid-cols-2 gap-3">
          {[
            { k: "name", label: "Nom", span: 2 },
            { k: "city", label: "Ville" },
            { k: "phone", label: "Téléphone" },
            { k: "address", label: "Adresse", span: 2 },
            { k: "email", label: "Email", type: "email", span: 2 },
          ].map(f => (
            <label key={f.k} className={`text-sm space-y-1 ${f.span === 2 ? "col-span-2" : ""}`}>
              <span className="text-muted-foreground">{f.label}</span>
              <input type={f.type ?? "text"} value={(form as any)[f.k]} onChange={e => setForm({ ...form, [f.k]: e.target.value })} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
            </label>
          ))}
          <label className="text-sm space-y-1 col-span-2">
            <span className="text-muted-foreground">Statut</span>
            <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value as Pharmacy["status"] })} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
              <option value="active">Active</option><option value="inactive">Inactive</option>
            </select>
          </label>
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <button onClick={onClose} className="px-3 py-2 text-sm rounded-md border border-input">Annuler</button>
          <button onClick={() => onSave(form)} disabled={!form.name || !form.city} className="px-3 py-2 text-sm rounded-md bg-primary text-primary-foreground disabled:opacity-50">Enregistrer</button>
        </div>
      </div>
    </div>
  );
}

/* ----------------- PRESCRIPTIONS PER DOCTOR ----------------- */
function PrescriptionsTab() {
  const doctors = useAdminStore(s => s.doctors);
  const patients = usePatientStore(s => s.patients);

  const stats = useMemo(() => {
    return doctors.map(doc => {
      const shortName = doc.name.replace("Dr. ", "").split(" ")[0];
      const rxs = seedPrescriptions.filter(rx => rx.doctor.includes(shortName));
      const patientIds = new Set(rxs.map(r => r.patientId));
      const validated = rxs.filter(r => r.status === "validated").length;
      const pending = rxs.filter(r => r.status === "pending_review").length;
      const rejected = rxs.filter(r => r.status === "rejected").length;
      return { doc, total: rxs.length, validated, pending, rejected, patients: patientIds.size, rxs };
    }).sort((a, b) => b.total - a.total);
  }, [doctors, patients]);

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Activité par médecin</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {stats.map(s => (
          <div key={s.doc.id} className="rounded-xl border border-border bg-card p-5 shadow-card space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <div className="font-semibold">{s.doc.name}</div>
                <div className="text-xs text-muted-foreground">{s.doc.specialty} · {s.doc.email}</div>
              </div>
              <span className={`inline-flex rounded-full px-2 py-0.5 text-xs ${s.doc.status === "active" ? "bg-success-soft text-success" : "bg-muted text-muted-foreground"}`}>{s.doc.status}</span>
            </div>
            <div className="grid grid-cols-4 gap-2 text-center">
              <Stat label="Patients" value={s.patients} />
              <Stat label="Prescriptions" value={s.total} />
              <Stat label="Validées" value={s.validated} tone="success" />
              <Stat label="En attente" value={s.pending} tone="warning" />
            </div>
            {s.rxs.length > 0 && (
              <details className="text-sm">
                <summary className="cursor-pointer text-muted-foreground hover:text-foreground">Voir les prescriptions ({s.rxs.length})</summary>
                <ul className="mt-2 space-y-1">
                  {s.rxs.map(rx => (
                    <li key={rx.id} className="flex justify-between gap-2 py-1 border-b border-border/50 last:border-0">
                      <span className="font-mono text-xs">{rx.id}</span>
                      <span className="flex-1 truncate">{rx.diagnosis}</span>
                      <span className="text-xs text-muted-foreground">{rx.status}</span>
                    </li>
                  ))}
                </ul>
              </details>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function Stat({ label, value, tone }: { label: string; value: number; tone?: "success" | "warning" }) {
  const cls = tone === "success" ? "text-success" : tone === "warning" ? "text-warning-foreground" : "text-foreground";
  return (
    <div className="rounded-lg bg-muted/40 p-2">
      <div className={`text-xl font-semibold ${cls}`}>{value}</div>
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
    </div>
  );
}

/* ----------------- CONTRIBUTIONS OVERVIEW ----------------- */
function ContributionsTab() {
  const items = useContributionsStore(s => s.items);
  const counts = {
    total: items.length,
    pending: items.filter(i => i.status === "pending").length,
    validated: items.filter(i => i.status === "validated").length,
    refused: items.filter(i => i.status === "refused").length,
    new_medicine: items.filter(i => i.kind === "new_medicine").length,
    correction: items.filter(i => i.kind === "correction").length,
    note: items.filter(i => i.kind === "note").length,
  };

  // contributions per author
  const perAuthor = useMemo(() => {
    const map = new Map<string, { name: string; total: number; validated: number; refused: number; pending: number }>();
    items.forEach(i => {
      const cur = map.get(i.authorEmail) ?? { name: i.authorName, total: 0, validated: 0, refused: 0, pending: 0 };
      cur.total++;
      cur[i.status]++;
      map.set(i.authorEmail, cur);
    });
    return Array.from(map.entries()).map(([email, v]) => ({ email, ...v })).sort((a, b) => b.total - a.total);
  }, [items]);

  const sorted = [...items].sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        <MiniStat label="Total" value={counts.total} icon={GitPullRequest} />
        <MiniStat label="En attente" value={counts.pending} icon={Clock} tone="warning" />
        <MiniStat label="Validées" value={counts.validated} icon={CheckCircle2} tone="success" />
        <MiniStat label="Refusées" value={counts.refused} icon={XCircle} tone="critical" />
        <MiniStat label="Nouveaux méd." value={counts.new_medicine} icon={Plus} />
        <MiniStat label="Corrections" value={counts.correction} icon={Pencil} />
        <MiniStat label="Notes" value={counts.note} icon={FileCheck2} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="font-semibold mb-3">Contributeurs</h3>
          <ul className="space-y-2">
            {perAuthor.map(a => (
              <li key={a.email} className="flex items-center justify-between text-sm border-b border-border/50 pb-2 last:border-0">
                <div><div className="font-medium">{a.name}</div><div className="text-xs text-muted-foreground">{a.email}</div></div>
                <div className="flex gap-3 text-xs">
                  <span className="text-muted-foreground">Total <b className="text-foreground">{a.total}</b></span>
                  <span className="text-success">✓ {a.validated}</span>
                  <span className="text-warning-foreground">⏳ {a.pending}</span>
                  <span className="text-critical">✕ {a.refused}</span>
                </div>
              </li>
            ))}
            {perAuthor.length === 0 && <li className="text-sm text-muted-foreground">Aucun contributeur.</li>}
          </ul>
        </div>

        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="font-semibold mb-3">Activité récente</h3>
          <ul className="space-y-2 max-h-80 overflow-y-auto scrollbar-thin">
            {sorted.slice(0, 20).map(c => (
              <li key={c.id} className="text-sm border-b border-border/50 pb-2 last:border-0">
                <div className="flex justify-between gap-2">
                  <span className="font-medium truncate">{c.kind === "new_medicine" ? c.newMedicine?.dci : c.targetMedicineDci}</span>
                  <span className={`text-xs px-1.5 py-0.5 rounded-full ${c.status === "validated" ? "bg-success-soft text-success" : c.status === "refused" ? "bg-critical/10 text-critical" : "bg-warning-soft text-warning-foreground"}`}>{c.status}</span>
                </div>
                <div className="text-xs text-muted-foreground">{c.kind} · par {c.authorName} · {new Date(c.createdAt).toLocaleDateString()}</div>
                {c.refusalReason && <div className="text-xs text-critical mt-1">Refus: {c.refusalReason}</div>}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function MiniStat({ label, value, icon: Icon, tone }: { label: string; value: number; icon: typeof Clock; tone?: "success" | "warning" | "critical" }) {
  const cls = tone === "success" ? "text-success" : tone === "warning" ? "text-warning-foreground" : tone === "critical" ? "text-critical" : "text-foreground";
  return (
    <div className="rounded-lg border border-border bg-card p-3">
      <div className="flex items-center justify-between">
        <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</span>
        <Icon className={`h-3.5 w-3.5 ${cls}`} />
      </div>
      <div className={`text-2xl font-semibold mt-1 ${cls}`}>{value}</div>
    </div>
  );
}
