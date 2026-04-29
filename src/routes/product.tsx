import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, Pill, AlertTriangle, FileSearch, Layers, Code2, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/product")({
  head: () => ({
    meta: [
      { title: "Synapse Prescribe — Clinical decision support components" },
      { name: "description", content: "Drop-in React Native modules for drug interaction checks, dosing, allergy alerts, and prescription guidance." },
      { property: "og:title", content: "Synapse Prescribe" },
      { property: "og:description", content: "Drop-in clinical decision support for your prescribing workflow." },
    ],
  }),
  component: ProductPage,
});

const modules = [
  { icon: AlertTriangle, title: "Interaction checks", desc: "Real-time drug-drug, drug-disease, and allergy detection." },
  { icon: Pill, title: "Dosing guidance", desc: "Personalized dosing based on age, renal function, and indication." },
  { icon: FileSearch, title: "Drug monographs", desc: "Searchable, structured drug information from authoritative sources." },
  { icon: Layers, title: "Prescription review", desc: "End-to-end medication review for polypharmacy patients." },
  { icon: Code2, title: "Developer-first SDK", desc: "Typed APIs, React Native components, and detailed docs." },
  { icon: Check, title: "Compliance ready", desc: "HIPAA-aware, GDPR-compliant, and clinically validated." },
];

function ProductPage() {
  return (
    <div>
      <section className="px-6 py-20">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">Synapse Prescribe</p>
          <h1 className="mt-3 text-balance text-5xl font-bold tracking-tight sm:text-6xl">
            Clinical decision support, ready to integrate
          </h1>
          <p className="mt-6 text-balance text-lg text-muted-foreground">
            A library of React Native components and APIs that bring drug intelligence,
            safety checks, and prescribing guidance into any healthcare product.
          </p>
          <div className="mt-8 flex justify-center gap-3">
            <Link to="/contact" className="inline-flex items-center gap-2 rounded-xl bg-gradient-hero px-6 py-3 text-sm font-semibold text-primary-foreground shadow-elegant transition-smooth hover:shadow-glow">
              Request a demo <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-gradient-soft py-20 px-6">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {modules.map((m) => (
              <div key={m.title} className="rounded-3xl border border-border/60 bg-card p-7 shadow-soft transition-smooth hover:-translate-y-1 hover:shadow-elegant">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-soft text-blue-soft-foreground">
                  <m.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-5 text-lg font-semibold">{m.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{m.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-6">
        <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-2 md:items-center">
          <div>
            <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">Built by clinicians, loved by developers</h2>
            <p className="mt-4 text-muted-foreground">
              Every component is designed alongside practicing physicians and engineered with the
              quality standards of modern product teams. You ship faster, your users prescribe safer.
            </p>
            <ul className="mt-6 space-y-3 text-sm">
              {["TypeScript-first SDK", "WCAG accessible UI", "Multi-region drug databases", "99.99% uptime SLA"].map((p) => (
                <li key={p} className="flex items-start gap-3">
                  <span className="mt-0.5 inline-flex h-5 w-5 flex-none items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Check className="h-3 w-3" />
                  </span>
                  {p}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-3xl bg-gradient-hero p-1 shadow-elegant">
            <pre className="overflow-x-auto rounded-[calc(theme(borderRadius.3xl)-4px)] bg-foreground p-6 text-xs leading-relaxed text-background">
{`import { PrescribeFlow } from "@synapse/prescribe";

<PrescribeFlow
  patient={patient}
  onPrescribe={(rx) => save(rx)}
  safetyChecks={["interactions", "allergy", "renal"]}
/>`}
            </pre>
          </div>
        </div>
      </section>
    </div>
  );
}
