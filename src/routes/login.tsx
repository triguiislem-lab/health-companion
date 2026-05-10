import { createFileRoute, useNavigate, Link, Navigate } from "@tanstack/react-router";
import { useState } from "react";
import { Stethoscope, Mail, Lock, LogIn, AlertCircle } from "lucide-react";
import { useAuthStore } from "@/lib/stores/auth-store";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Sign in — MedAssist CDSS" }] }),
  component: LoginPage,
});

function LoginPage() {
  const user = useAuthStore((s) => s.user);
  const login = useAuthStore((s) => s.login);
  const navigate = useNavigate();
  const [email, setEmail] = useState("doctor@medassist.tn");
  const [password, setPassword] = useState("demo1234");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (user) return <Navigate to="/" />;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const res = await login(email, password);
    setLoading(false);
    if (res.ok) navigate({ to: "/" });
    else setError(res.error);
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-background">
      <div className="hidden lg:flex flex-col justify-between p-10 bg-gradient-to-br from-primary to-primary/70 text-primary-foreground">
        <div className="flex items-center gap-2.5">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 backdrop-blur">
            <Stethoscope className="h-5 w-5" />
          </span>
          <div>
            <div className="font-semibold">MedAssist</div>
            <div className="text-xs opacity-80 uppercase tracking-wider">CDSS · v3.2.1</div>
          </div>
        </div>
        <div>
          <h1 className="text-3xl font-bold leading-tight">Clinical decision support, designed for safety.</h1>
          <p className="mt-3 text-sm opacity-90 max-w-md">
            AI-assisted prescribing with mandatory clinician validation, drug interaction checks
            and the Tunisian medicine database.
          </p>
        </div>
        <div className="text-xs opacity-80">© 2026 MedAssist · All clinical decisions remain under physician responsibility.</div>
      </div>

      <div className="flex items-center justify-center p-6 lg:p-10">
        <div className="w-full max-w-sm">
          <div className="lg:hidden flex items-center gap-2.5 mb-8">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground"><Stethoscope className="h-5 w-5" /></span>
            <div className="font-semibold">MedAssist CDSS</div>
          </div>

          <h2 className="text-2xl font-bold">Sign in</h2>
          <p className="text-sm text-muted-foreground mt-1">Access your clinical workspace.</p>

          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Email</span>
              <div className="mt-1 flex items-center gap-2 rounded-lg border border-input bg-card px-3 py-2 focus-within:ring-2 focus-within:ring-ring">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="flex-1 bg-transparent outline-none text-sm" placeholder="you@hospital.tn" />
              </div>
            </label>

            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Password</span>
              <div className="mt-1 flex items-center gap-2 rounded-lg border border-input bg-card px-3 py-2 focus-within:ring-2 focus-within:ring-ring">
                <Lock className="h-4 w-4 text-muted-foreground" />
                <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="flex-1 bg-transparent outline-none text-sm" />
              </div>
            </label>

            {error && (
              <div className="flex items-start gap-2 rounded-lg border border-critical/30 bg-critical-soft p-2.5 text-xs text-critical">
                <AlertCircle className="h-4 w-4 flex-none mt-0.5" /> {error}
              </div>
            )}

            <button type="submit" disabled={loading} className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-smooth disabled:opacity-60">
              <LogIn className="h-4 w-4" /> {loading ? "Signing in…" : "Sign in"}
            </button>
          </form>

          <div className="mt-6 rounded-lg border border-dashed border-border bg-muted/40 p-3 text-xs">
            <div className="font-semibold text-foreground mb-1">Demo accounts</div>
            <div className="text-muted-foreground">doctor@medassist.tn / demo1234</div>
            <div className="text-muted-foreground">admin@medassist.tn / admin1234</div>
          </div>

          <p className="mt-4 text-xs text-muted-foreground">
            By signing in you agree to MedAssist's <Link to="/" className="underline">terms</Link>.
          </p>
        </div>
      </div>
    </div>
  );
}
