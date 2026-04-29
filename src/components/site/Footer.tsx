import { Link } from "@tanstack/react-router";

export function Footer() {
  return (
    <footer className="border-t border-border bg-gradient-soft">
      <div className="mx-auto max-w-6xl px-6 py-14">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 text-lg font-bold">
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-hero text-primary-foreground shadow-elegant">
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M4 12c2-3 5-3 8 0s6 3 8 0" strokeLinecap="round" />
                </svg>
              </span>
              synapse<sup className="text-[0.5rem] text-muted-foreground ml-0.5">MED</sup>
            </div>
            <p className="mt-4 max-w-sm text-sm text-muted-foreground">
              Smarter, safer medication decisions — built for healthcare software teams.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold">Product</h4>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li><Link to="/product" className="hover:text-foreground">Synapse Prescribe</Link></li>
              <li><Link to="/resources" className="hover:text-foreground">Resources</Link></li>
              <li><Link to="/contact" className="hover:text-foreground">Request demo</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold">Company</h4>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li><Link to="/contact" className="hover:text-foreground">Contact</Link></li>
              <li><a href="#" className="hover:text-foreground">Privacy</a></li>
              <li><a href="#" className="hover:text-foreground">Terms</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 flex flex-col gap-2 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Synapse Medicine. All rights reserved.</p>
          <p>Made with care for clinicians worldwide.</p>
        </div>
      </div>
    </footer>
  );
}
