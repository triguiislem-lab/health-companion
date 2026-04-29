import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

const nav = [
  { to: "/product", label: "Synapse Prescribe" },
  { to: "/resources", label: "Resources" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4">
      <div
        className={`mx-auto flex max-w-6xl items-center justify-between rounded-2xl border border-border/60 bg-background/80 px-5 py-3 backdrop-blur-xl transition-smooth ${
          scrolled ? "shadow-soft" : ""
        }`}
      >
        <Link to="/" className="flex items-center gap-2 font-bold text-lg tracking-tight">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-hero text-primary-foreground shadow-elegant">
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M4 12c2-3 5-3 8 0s6 3 8 0" strokeLinecap="round" />
            </svg>
          </span>
          synapse<sup className="text-[0.5rem] text-muted-foreground ml-0.5">MED</sup>
        </Link>

        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-foreground/80">
          {nav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className="transition-smooth hover:text-foreground"
              activeProps={{ className: "text-foreground font-semibold" }}
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            to="/contact"
            className="hidden sm:inline-flex items-center rounded-xl px-3.5 py-2 text-sm font-medium text-foreground/80 transition-smooth hover:bg-muted hover:text-foreground"
          >
            Demo
          </Link>
          <Link
            to="/contact"
            className="hidden sm:inline-flex items-center rounded-xl bg-gradient-hero px-4 py-2 text-sm font-semibold text-primary-foreground shadow-elegant transition-smooth hover:shadow-glow"
          >
            Contact us
          </Link>
          <button
            onClick={() => setOpen((o) => !o)}
            className="md:hidden inline-flex h-9 w-9 items-center justify-center rounded-lg hover:bg-muted"
            aria-label="Menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden mx-auto mt-2 max-w-6xl rounded-2xl border border-border/60 bg-background/95 p-4 backdrop-blur-xl shadow-soft">
          <div className="flex flex-col gap-1">
            {nav.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2 text-sm font-medium hover:bg-muted"
              >
                {n.label}
              </Link>
            ))}
            <Link
              to="/contact"
              onClick={() => setOpen(false)}
              className="mt-2 rounded-lg bg-gradient-hero px-3 py-2 text-center text-sm font-semibold text-primary-foreground"
            >
              Contact us
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
