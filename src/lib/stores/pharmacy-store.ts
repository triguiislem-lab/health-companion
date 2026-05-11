import { create } from "zustand";
import { persist } from "zustand/middleware";

export type DispatchTarget = "pharmacist" | "patient";
export type DispatchChannel = "email" | "sms" | "portal" | "fax";
export type DispatchStatus = "sent" | "received" | "preparing" | "ready" | "delivered" | "cancelled";

export interface Dispatch {
  id: string;
  rxId: string;
  patientId: string;
  patientName: string;
  target: DispatchTarget;
  recipient: string; // pharmacy name or patient contact
  channel: DispatchChannel;
  status: DispatchStatus;
  note?: string;
  sentAt: string;
  updatedAt: string;
}

interface PharmacyState {
  dispatches: Dispatch[];
  send: (data: Omit<Dispatch, "id" | "sentAt" | "updatedAt" | "status"> & { status?: DispatchStatus }) => Dispatch;
  updateStatus: (id: string, status: DispatchStatus) => void;
  remove: (id: string) => void;
}

const seed: Dispatch[] = [
  {
    id: "D-7001",
    rxId: "RX-2042",
    patientId: "P-1043",
    patientName: "Marcus Tanaka",
    target: "pharmacist",
    recipient: "Pharmacie El Manar",
    channel: "portal",
    status: "preparing",
    sentAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
  },
  {
    id: "D-7000",
    rxId: "RX-2041",
    patientId: "P-1042",
    patientName: "Eleanor Whitfield",
    target: "patient",
    recipient: "eleanor.w@example.com",
    channel: "email",
    status: "delivered",
    sentAt: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 25).toISOString(),
  },
];

const nextId = (existing: Dispatch[]) => {
  const nums = existing.map((d) => parseInt(d.id.replace(/\D/g, ""), 10)).filter((n) => !isNaN(n));
  return `D-${(nums.length ? Math.max(...nums) : 7000) + 1}`;
};

export const usePharmacyStore = create<PharmacyState>()(
  persist(
    (set, get) => ({
      dispatches: seed,
      send: (data) => {
        const now = new Date().toISOString();
        const d: Dispatch = {
          ...data,
          id: nextId(get().dispatches),
          status: data.status ?? "sent",
          sentAt: now,
          updatedAt: now,
        };
        set({ dispatches: [d, ...get().dispatches] });
        return d;
      },
      updateStatus: (id, status) =>
        set({
          dispatches: get().dispatches.map((d) =>
            d.id === id ? { ...d, status, updatedAt: new Date().toISOString() } : d,
          ),
        }),
      remove: (id) => set({ dispatches: get().dispatches.filter((d) => d.id !== id) }),
    }),
    { name: "medassist-pharmacy", version: 1 },
  ),
);
