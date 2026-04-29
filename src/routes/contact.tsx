import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, MapPin, Phone, Send, Check } from "lucide-react";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact us — Synapse Medicine" },
      { name: "description", content: "Talk to our team about integrating Synapse into your healthcare product." },
      { property: "og:title", content: "Contact Synapse Medicine" },
      { property: "og:description", content: "Request a demo or get in touch with our clinical and engineering team." },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const [sent, setSent] = useState(false);

  return (
    <div className="px-6 py-20">
      <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-2">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">Contact</p>
          <h1 className="mt-3 text-balance text-5xl font-bold tracking-tight sm:text-6xl">
            Let's build safer prescribing, together
          </h1>
          <p className="mt-6 max-w-md text-muted-foreground">
            Tell us about your product. We'll reach out within one business day to set up a demo.
          </p>

          <ul className="mt-10 space-y-5 text-sm">
            <li className="flex items-start gap-4">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-soft text-blue-soft-foreground">
                <Mail className="h-5 w-5" />
              </span>
              <div>
                <div className="font-semibold">Email</div>
                <div className="text-muted-foreground">hello@synapse-medicine.com</div>
              </div>
            </li>
            <li className="flex items-start gap-4">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-pink-soft text-pink-soft-foreground">
                <Phone className="h-5 w-5" />
              </span>
              <div>
                <div className="font-semibold">Phone</div>
                <div className="text-muted-foreground">+1 (415) 555-0192</div>
              </div>
            </li>
            <li className="flex items-start gap-4">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-purple-soft text-purple-soft-foreground">
                <MapPin className="h-5 w-5" />
              </span>
              <div>
                <div className="font-semibold">Offices</div>
                <div className="text-muted-foreground">Bordeaux · Paris · New York</div>
              </div>
            </li>
          </ul>
        </div>

        <div className="rounded-3xl border border-border/60 bg-card p-8 shadow-elegant">
          {sent ? (
            <div className="flex h-full flex-col items-center justify-center py-12 text-center">
              <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Check className="h-7 w-7" />
              </span>
              <h3 className="mt-5 text-2xl font-bold">Thanks — we'll be in touch!</h3>
              <p className="mt-2 max-w-sm text-sm text-muted-foreground">
                Your message is on its way to our team. Expect a reply within one business day.
              </p>
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setSent(true);
              }}
              className="space-y-5"
            >
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="First name" name="firstName" required />
                <Field label="Last name" name="lastName" required />
              </div>
              <Field label="Work email" name="email" type="email" required />
              <Field label="Company" name="company" required />
              <div>
                <label className="text-sm font-medium">How can we help?</label>
                <textarea
                  name="message"
                  rows={4}
                  required
                  className="mt-2 w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none transition-smooth focus:border-ring focus:ring-2 focus:ring-ring/20"
                  placeholder="Tell us about your project…"
                />
              </div>
              <button
                type="submit"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-hero px-6 py-3 text-sm font-semibold text-primary-foreground shadow-elegant transition-smooth hover:shadow-glow"
              >
                Send message <Send className="h-4 w-4" />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label htmlFor={name} className="text-sm font-medium">{label}</label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        className="mt-2 w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none transition-smooth focus:border-ring focus:ring-2 focus:ring-ring/20"
      />
    </div>
  );
}
