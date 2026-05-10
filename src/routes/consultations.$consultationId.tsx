import { createFileRoute, Link, useNavigate, notFound } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Mic, Square, Play, Pause, Save, Trash2, Pencil, FilePlus2, User, CalendarClock, Download } from "lucide-react";
import { useConsultationStore } from "@/lib/stores/consultation-store";
import { ConsultationFormDialog } from "@/components/clinical/ConsultationFormDialog";

export const Route = createFileRoute("/consultations/$consultationId")({
  head: ({ params }) => ({ meta: [{ title: `Consultation ${params.consultationId} — MedAssist CDSS` }] }),
  component: ConsultationDetailPage,
  notFoundComponent: () => (
    <div className="p-8 text-center">
      <p className="text-sm text-muted-foreground">Consultation introuvable.</p>
      <Link to="/consultations" className="inline-flex mt-4 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">Retour</Link>
    </div>
  ),
});

function fmtDuration(sec: number) {
  const m = Math.floor(sec / 60).toString().padStart(2, "0");
  const s = Math.floor(sec % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

function ConsultationDetailPage() {
  const { consultationId } = Route.useParams();
  const consultation = useConsultationStore((s) => s.consultations.find((c) => c.id === consultationId));
  const update = useConsultationStore((s) => s.update);
  const remove = useConsultationStore((s) => s.remove);
  const navigate = useNavigate();

  const [editOpen, setEditOpen] = useState(false);
  const [confirmDel, setConfirmDel] = useState(false);
  const [notes, setNotes] = useState(consultation?.notes ?? "");
  const [diagnosis, setDiagnosis] = useState(consultation?.diagnosis ?? "");
  const [savedFlash, setSavedFlash] = useState(false);

  // recorder state
  const [recording, setRecording] = useState(false);
  const [paused, setPaused] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | undefined>(consultation?.recordingUrl);
  const [recError, setRecError] = useState<string | null>(null);
  const mediaRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);
  const startedAtRef = useRef<number>(0);

  useEffect(() => {
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
      mediaRef.current?.state === "recording" && mediaRef.current.stop();
      mediaRef.current?.stream.getTracks().forEach((t) => t.stop());
    };
  }, []);

  if (!consultation) throw notFound();

  const startRecording = async () => {
    setRecError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr = new MediaRecorder(stream);
      chunksRef.current = [];
      mr.ondataavailable = (e) => e.data.size && chunksRef.current.push(e.data);
      mr.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        const dur = Math.round((Date.now() - startedAtRef.current) / 1000);
        update(consultation.id, {
          recordingUrl: url,
          recordingDurationSec: dur,
          endedAt: new Date().toISOString(),
          status: "completed",
        });
        stream.getTracks().forEach((t) => t.stop());
      };
      mediaRef.current = mr;
      mr.start();
      startedAtRef.current = Date.now();
      setElapsed(0);
      timerRef.current = window.setInterval(() => {
        setElapsed(Math.floor((Date.now() - startedAtRef.current) / 1000));
      }, 1000);
      setRecording(true);
      setPaused(false);
      update(consultation.id, { status: "in_progress", startedAt: new Date().toISOString() });
    } catch (e) {
      setRecError("Microphone access denied or unavailable. Please grant permission.");
    }
  };

  const togglePause = () => {
    if (!mediaRef.current) return;
    if (paused) { mediaRef.current.resume(); setPaused(false); }
    else { mediaRef.current.pause(); setPaused(true); }
  };

  const stopRecording = () => {
    if (mediaRef.current && mediaRef.current.state !== "inactive") mediaRef.current.stop();
    if (timerRef.current) window.clearInterval(timerRef.current);
    setRecording(false);
    setPaused(false);
  };

  const saveNotes = () => {
    update(consultation.id, { notes, diagnosis });
    setSavedFlash(true);
    setTimeout(() => setSavedFlash(false), 1500);
  };

  return (
    <div className="p-4 lg:p-8 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <Link to="/consultations" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" /> Consultations
          </Link>
          <span className="text-muted-foreground">/</span>
          <h1 className="text-xl font-bold truncate">{consultation.id} · {consultation.patientName}</h1>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => navigate({ to: "/prescription/new", search: { patientId: consultation.patientId } })} className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90">
            <FilePlus2 className="h-4 w-4" /> Prescrire
          </button>
          <button onClick={() => setEditOpen(true)} className="inline-flex items-center gap-1.5 rounded-lg border border-input bg-card px-3 py-2 text-sm font-semibold hover:bg-muted"><Pencil className="h-4 w-4" /> Modifier</button>
          <button onClick={() => setConfirmDel(true)} className="inline-flex items-center gap-1.5 rounded-lg border border-critical/30 text-critical bg-card px-3 py-2 text-sm font-semibold hover:bg-critical-soft"><Trash2 className="h-4 w-4" /> Supprimer</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Patient + meta */}
        <aside className="lg:col-span-4 space-y-4">
          <div className="rounded-xl border border-border bg-card shadow-card p-5">
            <h2 className="font-semibold">Patient</h2>
            <Link to="/patients/$patientId" params={{ patientId: consultation.patientId }} className="mt-3 flex items-center gap-3 rounded-lg border border-border p-3 hover:bg-muted/40">
              <div className="h-10 w-10 rounded-full bg-primary-soft text-primary flex items-center justify-center"><User className="h-5 w-5" /></div>
              <div className="min-w-0">
                <div className="font-semibold text-sm truncate">{consultation.patientName}</div>
                <div className="text-xs text-muted-foreground">{consultation.patientId}</div>
              </div>
            </Link>
            <dl className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between"><dt className="text-muted-foreground">Motif</dt><dd className="font-medium text-right">{consultation.reason}</dd></div>
              <div className="flex justify-between"><dt className="text-muted-foreground">Médecin</dt><dd className="font-medium">{consultation.doctor}</dd></div>
              <div className="flex justify-between"><dt className="text-muted-foreground">Programmée</dt><dd className="font-medium flex items-center gap-1"><CalendarClock className="h-3 w-3" />{new Date(consultation.scheduledAt).toLocaleString("fr-FR")}</dd></div>
            </dl>
          </div>
        </aside>

        {/* Recording + notes */}
        <section className="lg:col-span-8 space-y-4">
          <div className="rounded-xl border border-border bg-card shadow-card p-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-semibold">Enregistrement de la consultation</h2>
                <p className="text-xs text-muted-foreground mt-0.5">Audio capturé localement dans le navigateur — non transmis sans consentement.</p>
              </div>
              <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${recording ? "bg-critical-soft text-critical animate-pulse-critical" : "bg-muted text-muted-foreground"}`}>
                <span className={`h-2 w-2 rounded-full ${recording ? "bg-critical" : "bg-muted-foreground"}`} />
                {recording ? (paused ? "En pause" : "Enregistrement") : "Inactif"}
              </span>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              {!recording ? (
                <button onClick={startRecording} className="inline-flex items-center gap-2 rounded-lg bg-critical px-4 py-2.5 text-sm font-semibold text-critical-foreground hover:bg-critical/90">
                  <Mic className="h-4 w-4" /> Démarrer la consultation
                </button>
              ) : (
                <>
                  <button onClick={togglePause} className="inline-flex items-center gap-2 rounded-lg border border-input bg-card px-3 py-2 text-sm font-semibold hover:bg-muted">
                    {paused ? <><Play className="h-4 w-4" /> Reprendre</> : <><Pause className="h-4 w-4" /> Pause</>}
                  </button>
                  <button onClick={stopRecording} className="inline-flex items-center gap-2 rounded-lg bg-foreground text-background px-3 py-2 text-sm font-semibold hover:bg-foreground/90">
                    <Square className="h-4 w-4" /> Arrêter
                  </button>
                </>
              )}
              <div className="font-mono text-2xl tabular-nums">{fmtDuration(elapsed || consultation.recordingDurationSec || 0)}</div>
            </div>

            {recError && <div className="mt-3 rounded-lg border border-critical/30 bg-critical-soft p-2.5 text-xs text-critical">{recError}</div>}

            {audioUrl && (
              <div className="mt-4 rounded-lg border border-border bg-muted/30 p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Lecture</div>
                  <a href={audioUrl} download={`${consultation.id}.webm`} className="inline-flex items-center gap-1 text-xs text-primary hover:underline"><Download className="h-3 w-3" /> Télécharger</a>
                </div>
                <audio controls src={audioUrl} className="w-full" />
              </div>
            )}
          </div>

          <div className="rounded-xl border border-border bg-card shadow-card p-5">
            <h2 className="font-semibold">Notes cliniques</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Observations, examen physique, plan thérapeutique.</p>
            <div className="mt-4 space-y-3">
              <label className="block">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Diagnostic</span>
                <input value={diagnosis} onChange={(e) => setDiagnosis(e.target.value)} placeholder="Ex. Pneumopathie communautaire" className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring" />
              </label>
              <label className="block">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Notes</span>
                <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={10} placeholder="Anamnèse, examen, conduite à tenir…" className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring resize-y" />
              </label>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">{notes.length} caractères</span>
                <button onClick={saveNotes} className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90">
                  <Save className="h-4 w-4" /> {savedFlash ? "Enregistré ✓" : "Enregistrer"}
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>

      {editOpen && <ConsultationFormDialog open onClose={() => setEditOpen(false)} editingId={consultation.id} />}

      {confirmDel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-xl border border-border bg-card shadow-elevated p-5">
            <h3 className="font-semibold">Supprimer la consultation</h3>
            <p className="text-sm text-muted-foreground mt-2">Cette action est irréversible.</p>
            <div className="mt-4 flex justify-end gap-2">
              <button onClick={() => setConfirmDel(false)} className="rounded-lg border border-input bg-card px-3 py-2 text-sm font-semibold hover:bg-muted">Annuler</button>
              <button onClick={() => { remove(consultation.id); navigate({ to: "/consultations" }); }} className="inline-flex items-center gap-1.5 rounded-lg bg-critical text-critical-foreground px-3 py-2 text-sm font-semibold hover:bg-critical/90"><Trash2 className="h-4 w-4" /> Supprimer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
