import { Outlet, Link, createRootRoute, HeadContent, Scripts, useRouterState } from "@tanstack/react-router";
import { LayoutDashboard, Users, FilePlus2, ClipboardCheck, Activity, Network, ScrollText, Settings, Stethoscope, Bell, Search } from "lucide-react";
import appCss from "../styles.css?url";

const nav = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/patients", label: "Patients", icon: Users },
  { to: "/prescription/new", label: "New Prescription", icon: FilePlus2 },
  { to: "/prescription/review", label: "Prescription Review", icon: ClipboardCheck },
  { to: "/interactions", label: "Drug Interactions", icon: Activity },
  { to: "/knowledge-graph", label: "Knowledge Graph", icon: Network },
  { to: "/audit", label: "Reports & Audit", icon: ScrollText },
  { to: "/settings", label: "Settings", icon: Settings },
] as const;

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <div className="mt-6">
          <Link to="/" className="inline-flex rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
            Go to dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "MedAssist CDSS — Clinical Decision Support" },
      { name: "description", content: "AI-assisted prescription generation with mandatory clinician validation." },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head><HeadContent /></head>
      <body>{children}<Scripts /></body>
    </html>
  );
}

function Sidebar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isActive = (to: string, exact?: boolean) =>
    exact ? pathname === to : pathname === to || pathname.startsWith(to + "/") || pathname === to;

  return (
    <aside className="hidden lg:flex w-64 flex-col border-r border-sidebar-border bg-sidebar">
      <div className="flex items-center gap-2.5 px-5 h-16 border-b border-sidebar-border">
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-card">
          <Stethoscope className="h-5 w-5" />
        </span>
        <div>
          <div className="text-sm font-semibold tracking-tight">MedAssist</div>
          <div className="text-[11px] uppercase tracking-wider text-muted-foreground">CDSS · v3.2.1</div>
        </div>
      </div>
      <nav className="flex-1 overflow-y-auto p-3 scrollbar-thin">
        <div className="px-2 pb-1 pt-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Workspace</div>
        <ul className="space-y-0.5">
          {nav.map((n) => {
            const active = isActive(n.to, n.exact);
            return (
              <li key={n.to}>
                <Link
                  to={n.to}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-smooth ${
                    active
                      ? "bg-sidebar-accent text-sidebar-accent-foreground font-semibold"
                      : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                  }`}
                >
                  <n.icon className={`h-4 w-4 ${active ? "text-primary" : "text-muted-foreground"}`} />
                  {n.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      <div className="border-t border-sidebar-border p-4">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-primary-soft text-primary flex items-center justify-center font-semibold text-sm">JC</div>
          <div className="min-w-0">
            <div className="text-sm font-semibold truncate">Dr. Jordan Chen</div>
            <div className="text-xs text-muted-foreground truncate">Internal Medicine</div>
          </div>
        </div>
      </div>
    </aside>
  );
}

function Topbar() {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border bg-background/85 backdrop-blur px-4 lg:px-8">
      <div className="lg:hidden flex items-center gap-2 font-semibold">
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground"><Stethoscope className="h-4 w-4" /></span>
        MedAssist
      </div>
      <div className="hidden md:flex flex-1 max-w-xl items-center gap-2 rounded-lg border border-input bg-card px-3 py-2 text-sm text-muted-foreground">
        <Search className="h-4 w-4" />
        <input placeholder="Search patients, prescriptions, drugs…" className="flex-1 bg-transparent outline-none placeholder:text-muted-foreground" />
        <kbd className="hidden md:inline-flex rounded border border-border px-1.5 py-0.5 text-[10px] font-mono">⌘K</kbd>
      </div>
      <div className="ml-auto flex items-center gap-2">
        <button className="relative inline-flex h-9 w-9 items-center justify-center rounded-lg border border-input bg-card hover:bg-muted transition-smooth" aria-label="Notifications">
          <Bell className="h-4 w-4" />
          <span className="absolute -top-1 -right-1 h-4 min-w-[16px] rounded-full bg-critical px-1 text-[10px] font-semibold text-critical-foreground flex items-center justify-center animate-pulse-critical">2</span>
        </button>
      </div>
    </header>
  );
}

function MobileNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <nav className="lg:hidden border-b border-border bg-card overflow-x-auto scrollbar-thin">
      <ul className="flex items-center gap-1 px-3 py-2 whitespace-nowrap">
        {nav.map((n) => {
          const active = n.exact ? pathname === n.to : pathname === n.to || pathname.startsWith(n.to + "/");
          return (
            <li key={n.to}>
              <Link to={n.to} className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-smooth ${active ? "bg-primary-soft text-primary" : "text-muted-foreground hover:bg-muted"}`}>
                <n.icon className="h-3.5 w-3.5" />
                {n.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

function RootComponent() {
  return (
    <div className="flex min-h-screen w-full">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar />
        <MobileNav />
        <main className="flex-1 min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
