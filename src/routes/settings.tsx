import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Save, Brain, ShieldAlert, Database, Network, Users, Download } from "lucide-react";
import type { Severity } from "@/lib/mock-data";
import { severityMeta, severityOrder } from "@/lib/clinical-ui";

export const Route = createFileRoute("/settings")({
  head: () => ({ meta: [{ title: "Settings — MedAssist CDSS" }] }),
  component: SettingsPage,
});

function SettingsPage() {
  const [model, setModel] = useState("MedAssist-LLM v3.2.1");
  const [drugDb, setDrugDb] = useState("Lexicomp + RxNorm (combined)");
  const [kgSource, setKgSource] = useState("SNOMED CT + DrugBank");
  const [thresholds, setThresholds] = useState<Record<Severity, boolean>>({ critical: true, major: true, moderate: true, minor: false, info: false });
  const [rules, setRules] = useState({
    requireOverrideJustification: true,
    blockValidationOnMissingData: true,
    requireINRForAnticoagulants: true,
    showConfidenceScores: true,
  });

  return (
    <div className="p-4 lg:p-8 space-y-6 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">Model, safety rules, data sources and access control for MedAssist.</p>
      </div>

      <Card icon={Brain} title="Model configuration" desc="Active LLM and inference settings.">
        <Row label="Model version">
          <select value={model} onChange={(e) => setModel(e.target.value)} className="rounded-md border border-input bg-card px-3 py-2 text-sm">
            <option>MedAssist-LLM v3.2.1</option>
            <option>MedAssist-LLM v3.2.0</option>
            <option>MedAssist-LLM v3.1.4</option>
          </select>
        </Row>
        <Toggle label="Show AI confidence scores in workspace" checked={rules.showConfidenceScores} onChange={(v) => setRules((r) => ({ ...r, showConfidenceScores: v }))} />
      </Card>

      <Card icon={ShieldAlert} title="Safety rules" desc="Hard guardrails for prescription validation.">
        <Toggle label="Require written justification when overriding major/critical alerts" checked={rules.requireOverrideJustification} onChange={(v) => setRules((r) => ({ ...r, requireOverrideJustification: v }))} />
        <Toggle label="Block validation when patient data is missing" checked={rules.blockValidationOnMissingData} onChange={(v) => setRules((r) => ({ ...r, blockValidationOnMissingData: v }))} />
        <Toggle label="Require INR check for new prescriptions on anticoagulated patients" checked={rules.requireINRForAnticoagulants} onChange={(v) => setRules((r) => ({ ...r, requireINRForAnticoagulants: v }))} />
      </Card>

      <Card icon={ShieldAlert} title="Alert severity thresholds" desc="Choose which severities surface as actionable alerts.">
        <div className="grid sm:grid-cols-5 gap-2">
          {severityOrder.map((s) => {
            const m = severityMeta[s];
            const active = thresholds[s];
            return (
              <button
                key={s}
                onClick={() => setThresholds((t) => ({ ...t, [s]: !t[s] }))}
                className={`rounded-lg border px-3 py-2.5 text-left transition-smooth ${active ? `${m.bg} ${m.border} ${m.text}` : "bg-card border-border text-muted-foreground"}`}
              >
                <div className="flex items-center gap-1.5">
                  <span className={`h-2 w-2 rounded-full ${m.dot}`} />
                  <span className="text-xs font-semibold uppercase">{m.label}</span>
                </div>
                <div className="text-[11px] mt-1">{active ? "Surfaced" : "Hidden"}</div>
              </button>
            );
          })}
        </div>
      </Card>

      <Card icon={Database} title="Drug database source" desc="Authoritative reference for drug data.">
        <Row label="Active source">
          <select value={drugDb} onChange={(e) => setDrugDb(e.target.value)} className="rounded-md border border-input bg-card px-3 py-2 text-sm">
            <option>Lexicomp + RxNorm (combined)</option>
            <option>FDA Orange Book</option>
            <option>BNF (UK)</option>
            <option>Vidal (FR)</option>
          </select>
        </Row>
      </Card>

      <Card icon={Network} title="Knowledge graph source" desc="Ontologies powering reasoning.">
        <Row label="Active source">
          <select value={kgSource} onChange={(e) => setKgSource(e.target.value)} className="rounded-md border border-input bg-card px-3 py-2 text-sm">
            <option>SNOMED CT + DrugBank</option>
            <option>UMLS Metathesaurus</option>
            <option>Custom in-house graph</option>
          </select>
        </Row>
      </Card>

      <Card icon={Users} title="User roles" desc="Access levels across the team.">
        <ul className="divide-y divide-border text-sm">
          {[
            { name: "Dr. Jordan Chen", role: "Prescriber · Admin" },
            { name: "Dr. Priya Patel", role: "Prescriber" },
            { name: "Sam Reyes, RN", role: "Pharmacist reviewer" },
            { name: "Compliance team", role: "Audit (read-only)" },
          ].map((u) => (
            <li key={u.name} className="flex items-center justify-between py-2.5">
              <span className="font-medium">{u.name}</span>
              <span className="text-xs text-muted-foreground">{u.role}</span>
            </li>
          ))}
        </ul>
      </Card>

      <Card icon={Download} title="Export settings" desc="Audit and clinical data exports.">
        <div className="flex flex-wrap gap-2">
          <button className="inline-flex items-center gap-1.5 rounded-lg border border-input bg-card px-3 py-2 text-sm font-semibold hover:bg-muted transition-smooth">
            <Download className="h-4 w-4" /> Export audit log (CSV)
          </button>
          <button className="inline-flex items-center gap-1.5 rounded-lg border border-input bg-card px-3 py-2 text-sm font-semibold hover:bg-muted transition-smooth">
            <Download className="h-4 w-4" /> Export prescriptions (JSON)
          </button>
        </div>
      </Card>

      <div className="flex justify-end">
        <button className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-card hover:bg-primary/90 transition-smooth">
          <Save className="h-4 w-4" /> Save changes
        </button>
      </div>
    </div>
  );
}

function Card({ icon: Icon, title, desc, children }: { icon: React.ComponentType<{ className?: string }>; title: string; desc: string; children: React.ReactNode }) {
  return (
    <section className="rounded-xl border border-border bg-card shadow-card">
      <header className="px-5 py-4 border-b border-border flex items-center gap-3">
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-primary-soft text-primary"><Icon className="h-4 w-4" /></span>
        <div>
          <h2 className="font-semibold">{title}</h2>
          <p className="text-xs text-muted-foreground">{desc}</p>
        </div>
      </header>
      <div className="p-5 space-y-3">{children}</div>
    </section>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <label className="text-sm font-medium">{label}</label>
      {children}
    </div>
  );
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button onClick={() => onChange(!checked)} className="flex items-center justify-between w-full text-left gap-3 group">
      <span className="text-sm font-medium">{label}</span>
      <span className={`relative inline-flex h-6 w-11 flex-none items-center rounded-full transition-smooth ${checked ? "bg-primary" : "bg-border"}`}>
        <span className={`inline-block h-5 w-5 transform rounded-full bg-card shadow transition-smooth ${checked ? "translate-x-5" : "translate-x-0.5"}`} />
      </span>
    </button>
  );
}
