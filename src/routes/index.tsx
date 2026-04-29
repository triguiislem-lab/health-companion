import { createFileRoute, Link } from "@tanstack/react-router";
import heroBg from "@/assets/hero-gradient.jpg";
import { Stethoscope, Database, Sparkles, Lightbulb, Plug, HeartHandshake, Quote, ArrowRight, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Synapse Medicine — Smarter, faster medication decisions" },
      { name: "description", content: "React Native components for clinical decision support, drug information, and e-prescribing — built to simplify workflows for healthcare providers." },
      { property: "og:title", content: "Synapse Medicine — Smarter, faster medication decisions" },
      { property: "og:description", content: "Clinical decision support and drug information components for EHR and e-prescribing software." },
    ],
  }),
  component: Index,
});

const features = [
  { icon: Stethoscope, title: "Personalized clinical decision support", desc: "Patient-specific alerts and recommendations at the point of prescribing.", variant: "blue" },
  { icon: Database, title: "Aggregation of official drug databases", desc: "Continuously updated, sourced from authoritative regulatory references.", variant: "pink" },
  { icon: Sparkles, title: "Reliable AI algorithms", desc: "Validated models that surface insights without disrupting your workflow.", variant: "purple" },
] as const;

const pillars = [
  { icon: Lightbulb, title: "Innovation", desc: "Frontier research turned into production-ready clinical tools." },
  { icon: Plug, title: "Seamless integration", desc: "Drop-in React Native components with first-class APIs." },
  { icon: HeartHandshake, title: "Customer care", desc: "A team of clinicians and engineers obsessed with your success." },
];

const testimonials = [
  { quote: "Synapse changed how our prescribers think about safety — alerts feel useful, not noisy.", author: "Dr. Amélie Laurent", role: "CMO, EHR Vendor" },
  { quote: "Integration took days, not months. The components feel native to our product.", author: "Marcus Hill", role: "VP Engineering, Health SaaS" },
  { quote: "The drug database coverage and update cadence is unmatched in the industry.", author: "Sara Okonkwo", role: "Head of Product, Telehealth" },
];

function Index() {
  return (
    <div className="-mt-24">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 -z-10"
          style={{
            backgroundImage: `url(${heroBg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
          aria-hidden
        />
        <div className="absolute inset-0 -z-10 bg-gradient-hero opacity-80" aria-hidden />
        <div className="absolute -top-32 left-1/2 -z-10 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-primary-glow/40 blur-3xl animate-float-slow" aria-hidden />

        <div className="mx-auto max-w-6xl px-6 pt-44 pb-32 text-center">
          <span className="animate-fade-up inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-1.5 text-xs font-medium text-white backdrop-blur-md">
            <ShieldCheck className="h-3.5 w-3.5" />
            Trusted by healthcare innovators
          </span>
          <h1 className="animate-fade-up mt-6 text-balance text-5xl font-bold leading-[1.05] text-white sm:text-6xl md:text-7xl" style={{ animationDelay: "0.1s" }}>
            Smarter and faster<br />medication decisions
          </h1>
          <p className="animate-fade-up mx-auto mt-6 max-w-2xl text-balance text-base text-white/85 sm:text-lg" style={{ animationDelay: "0.2s" }}>
            Synapse Medicine's React Native components integrate seamlessly into your EHR,
            e-prescribing software, or any workflow needing drug information and clinical decision support.
          </p>
          <div className="animate-fade-up mt-10 flex flex-wrap items-center justify-center gap-3" style={{ animationDelay: "0.3s" }}>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-foreground shadow-elegant transition-smooth hover:-translate-y-0.5 hover:shadow-glow"
            >
              Request a demo
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/product"
              className="inline-flex items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur-md transition-smooth hover:bg-white/20"
            >
              Explore the product
            </Link>
          </div>
        </div>

        {/* Curve transition */}
        <svg className="absolute bottom-0 left-0 w-full" viewBox="0 0 1440 80" preserveAspectRatio="none" aria-hidden>
          <path d="M0 80 C 360 0, 1080 0, 1440 80 L 1440 80 L 0 80 Z" fill="var(--background)" />
        </svg>
      </section>

      {/* Features */}
      <section className="bg-background py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">What we do</p>
            <h2 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">Make every prescription a success</h2>
          </div>
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {features.map((f) => {
              const variantClass =
                f.variant === "blue"
                  ? "bg-gradient-card-blue"
                  : f.variant === "pink"
                  ? "bg-gradient-card-pink"
                  : "bg-gradient-card-purple";
              const iconClass =
                f.variant === "blue"
                  ? "bg-blue-soft text-blue-soft-foreground"
                  : f.variant === "pink"
                  ? "bg-pink-soft text-pink-soft-foreground"
                  : "bg-purple-soft text-purple-soft-foreground";
              return (
                <div
                  key={f.title}
                  className={`group rounded-3xl border border-border/60 p-7 shadow-soft transition-smooth hover:-translate-y-1 hover:shadow-elegant ${variantClass}`}
                >
                  <div className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl ${iconClass}`}>
                    <f.icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-5 text-lg font-semibold">{f.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pillars */}
      <section className="bg-gradient-soft py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">Our approach</p>
            <h2 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">Enabling clinical decision support for medication success</h2>
          </div>
          <div className="mt-14 grid gap-8 md:grid-cols-3">
            {pillars.map((p) => (
              <div key={p.title} className="flex flex-col items-start">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <p.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-5 text-lg font-semibold">{p.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-background py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">Customers</p>
            <h2 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">Don't just take our word for it</h2>
          </div>
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {testimonials.map((t) => (
              <figure key={t.author} className="rounded-3xl border border-border/60 bg-card p-7 shadow-soft transition-smooth hover:shadow-elegant">
                <Quote className="h-6 w-6 text-primary/40" />
                <blockquote className="mt-4 text-sm leading-relaxed text-foreground">"{t.quote}"</blockquote>
                <figcaption className="mt-6">
                  <div className="text-sm font-semibold">{t.author}</div>
                  <div className="text-xs text-muted-foreground">{t.role}</div>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 pb-24">
        <div className="relative mx-auto max-w-6xl overflow-hidden rounded-3xl bg-gradient-hero p-12 text-center shadow-elegant sm:p-16">
          <div className="absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-primary-glow/40 blur-3xl" aria-hidden />
          <h2 className="relative text-balance text-4xl font-bold text-white sm:text-5xl">Ready to power smarter prescriptions?</h2>
          <p className="relative mx-auto mt-4 max-w-xl text-white/85">
            Talk to our team about integrating Synapse into your healthcare product.
          </p>
          <div className="relative mt-8">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-foreground shadow-elegant transition-smooth hover:-translate-y-0.5"
            >
              Request a demo <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
