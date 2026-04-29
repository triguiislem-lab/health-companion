import { createFileRoute } from "@tanstack/react-router";
import { BookOpen, FileText, Video, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/resources")({
  head: () => ({
    meta: [
      { title: "Resources — Synapse Medicine" },
      { name: "description", content: "Whitepapers, case studies, and articles on clinical decision support and medication safety." },
      { property: "og:title", content: "Resources — Synapse Medicine" },
      { property: "og:description", content: "Insights on medication safety, AI in healthcare, and clinical decision support." },
    ],
  }),
  component: ResourcesPage,
});

const resources = [
  { type: "Whitepaper", icon: FileText, title: "The state of e-prescribing in 2026", desc: "How modern EHRs are leveraging AI to reduce medication errors.", color: "blue" },
  { type: "Case study", icon: BookOpen, title: "How TeleCare cut adverse events by 41%", desc: "A look inside one telehealth platform's safety transformation.", color: "pink" },
  { type: "Webinar", icon: Video, title: "Designing trustworthy AI for clinicians", desc: "A conversation with leading CMIOs on AI adoption.", color: "purple" },
  { type: "Article", icon: FileText, title: "What 'official drug database' really means", desc: "Why source provenance matters more than ever.", color: "blue" },
  { type: "Whitepaper", icon: FileText, title: "Polypharmacy: a software design challenge", desc: "Patterns for safer multi-drug prescription review.", color: "purple" },
  { type: "Case study", icon: BookOpen, title: "Integrating Synapse in 7 days", desc: "From kickoff to production with a 3-engineer team.", color: "pink" },
] as const;

function ResourcesPage() {
  return (
    <div>
      <section className="px-6 py-20 text-center">
        <div className="mx-auto max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">Resources</p>
          <h1 className="mt-3 text-balance text-5xl font-bold tracking-tight sm:text-6xl">
            Insights for the future of safe prescribing
          </h1>
          <p className="mt-6 text-balance text-lg text-muted-foreground">
            Research, case studies, and product updates from the Synapse team.
          </p>
        </div>
      </section>

      <section className="px-6 pb-24">
        <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-2 lg:grid-cols-3">
          {resources.map((r) => {
            const variant =
              r.color === "blue"
                ? "bg-gradient-card-blue"
                : r.color === "pink"
                ? "bg-gradient-card-pink"
                : "bg-gradient-card-purple";
            const iconClass =
              r.color === "blue"
                ? "bg-blue-soft text-blue-soft-foreground"
                : r.color === "pink"
                ? "bg-pink-soft text-pink-soft-foreground"
                : "bg-purple-soft text-purple-soft-foreground";
            return (
              <article
                key={r.title}
                className={`group flex flex-col rounded-3xl border border-border/60 p-7 shadow-soft transition-smooth hover:-translate-y-1 hover:shadow-elegant ${variant}`}
              >
                <div className="flex items-center justify-between">
                  <div className={`inline-flex h-11 w-11 items-center justify-center rounded-2xl ${iconClass}`}>
                    <r.icon className="h-5 w-5" />
                  </div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{r.type}</span>
                </div>
                <h3 className="mt-5 text-lg font-semibold">{r.title}</h3>
                <p className="mt-2 flex-1 text-sm text-muted-foreground">{r.desc}</p>
                <a href="#" className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-primary group-hover:gap-2 transition-smooth">
                  Read more <ArrowRight className="h-4 w-4" />
                </a>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}
