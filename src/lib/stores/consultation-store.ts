import { create } from "zustand";
import { persist } from "zustand/middleware";

export type ConsultationStatus = "scheduled" | "in_progress" | "completed" | "cancelled";

export interface Consultation {
  id: string;
  patientId: string;
  patientName: string;
  doctor: string;
  reason: string;
  scheduledAt: string; // ISO
  status: ConsultationStatus;
  notes: string;
  recordingUrl?: string; // object URL (in-memory; not persisted)
  recordingDurationSec?: number;
  startedAt?: string;
  endedAt?: string;
  diagnosis?: string;
  createdAt: string;
}

export type ConsultationInput = Omit<Consultation, "id" | "createdAt"> & { id?: string };

interface ConsultationState {
  consultations: Consultation[];
  add: (data: ConsultationInput) => Consultation;
  update: (id: string, patch: Partial<Consultation>) => void;
  remove: (id: string) => void;
  get: (id: string) => Consultation | undefined;
}

const seed: Consultation[] = [
  {
    id: "C-3001",
    patientId: "P-1042",
    patientName: "Eleanor Whitfield",
    doctor: "Dr. Jordan Chen",
    reason: "Suivi cardiaque + toux productive",
    scheduledAt: new Date(Date.now() + 1000 * 60 * 60 * 2).toISOString(),
    status: "scheduled",
    notes: "",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
  {
    id: "C-3000",
    patientId: "P-1043",
    patientName: "Marcus Tanaka",
    doctor: "Dr. Jordan Chen",
    reason: "Contrôle HTA",
    scheduledAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
    status: "completed",
    notes: "TA 128/78. Patient asymptomatique. Continuer Amlodipine 10 mg.",
    diagnosis: "HTA contrôlée",
    recordingDurationSec: 412,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(),
  },
];

const nextId = (existing: Consultation[]) => {
  const nums = existing.map((c) => parseInt(c.id.replace(/\D/g, ""), 10)).filter((n) => !isNaN(n));
  const max = nums.length ? Math.max(...nums) : 3000;
  return `C-${max + 1}`;
};

export const useConsultationStore = create<ConsultationState>()(
  persist(
    (set, get) => ({
      consultations: seed,
      add: (data) => {
        const c: Consultation = {
          ...(data as Consultation),
          id: data.id ?? nextId(get().consultations),
          createdAt: new Date().toISOString(),
        };
        set({ consultations: [c, ...get().consultations] });
        return c;
      },
      update: (id, patch) =>
        set({ consultations: get().consultations.map((c) => (c.id === id ? { ...c, ...patch } : c)) }),
      remove: (id) => set({ consultations: get().consultations.filter((c) => c.id !== id) }),
      get: (id) => get().consultations.find((c) => c.id === id),
    }),
    {
      name: "medassist-consultations",
      version: 1,
      partialize: (s) => ({
        consultations: s.consultations.map(({ recordingUrl, ...rest }) => rest), // don't persist blob URL
      }),
    },
  ),
);
