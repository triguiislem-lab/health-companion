import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Doctor {
  id: string;
  name: string;
  email: string;
  specialty: string;
  phone?: string;
  licenseNumber: string;
  status: "active" | "suspended";
  createdAt: string;
}

export interface Pharmacy {
  id: string;
  name: string;
  city: string;
  address: string;
  phone: string;
  email?: string;
  status: "active" | "inactive";
  createdAt: string;
}

interface AdminState {
  doctors: Doctor[];
  pharmacies: Pharmacy[];
  addDoctor: (d: Omit<Doctor, "id" | "createdAt" | "status"> & { status?: Doctor["status"] }) => Doctor;
  updateDoctor: (id: string, patch: Partial<Doctor>) => void;
  deleteDoctor: (id: string) => void;
  addPharmacy: (p: Omit<Pharmacy, "id" | "createdAt" | "status"> & { status?: Pharmacy["status"] }) => Pharmacy;
  updatePharmacy: (id: string, patch: Partial<Pharmacy>) => void;
  deletePharmacy: (id: string) => void;
}

const seedDoctors: Doctor[] = [
  { id: "DR-001", name: "Dr. Jordan Chen", email: "doctor@medassist.tn", specialty: "Internal Medicine", phone: "+216 71 234 567", licenseNumber: "TN-MED-10234", status: "active", createdAt: new Date(Date.now() - 1000*60*60*24*120).toISOString() },
  { id: "DR-002", name: "Dr. Priya Patel", email: "patel@medassist.tn", specialty: "Cardiology", phone: "+216 71 555 010", licenseNumber: "TN-MED-10567", status: "active", createdAt: new Date(Date.now() - 1000*60*60*24*90).toISOString() },
  { id: "DR-003", name: "Dr. Amira Ben Salah", email: "admin@medassist.tn", specialty: "Administration", phone: "+216 71 999 000", licenseNumber: "TN-MED-10001", status: "active", createdAt: new Date(Date.now() - 1000*60*60*24*200).toISOString() },
  { id: "DR-004", name: "Dr. Karim Trabelsi", email: "trabelsi@medassist.tn", specialty: "Pédiatrie", phone: "+216 71 333 122", licenseNumber: "TN-MED-10987", status: "suspended", createdAt: new Date(Date.now() - 1000*60*60*24*45).toISOString() },
];

const seedPharmacies: Pharmacy[] = [
  { id: "PH-001", name: "Pharmacie El Manar", city: "Tunis", address: "Av. Habib Bourguiba, El Manar", phone: "+216 71 880 100", email: "elmanar@pharma.tn", status: "active", createdAt: new Date(Date.now() - 1000*60*60*24*300).toISOString() },
  { id: "PH-002", name: "Pharmacie Centrale", city: "Sfax", address: "Rue Mongi Slim", phone: "+216 74 220 555", email: "centrale.sfax@pharma.tn", status: "active", createdAt: new Date(Date.now() - 1000*60*60*24*210).toISOString() },
  { id: "PH-003", name: "Pharmacie Carthage", city: "Carthage", address: "Av. de la République", phone: "+216 71 733 010", status: "active", createdAt: new Date(Date.now() - 1000*60*60*24*180).toISOString() },
  { id: "PH-004", name: "Pharmacie Nuit Sousse", city: "Sousse", address: "Bd. 14 Janvier", phone: "+216 73 200 411", status: "inactive", createdAt: new Date(Date.now() - 1000*60*60*24*60).toISOString() },
];

const nextId = (prefix: string, list: { id: string }[]) => {
  const max = list.map(x => parseInt(x.id.replace(/\D/g, ""), 10)).filter(n => !isNaN(n)).reduce((a, b) => Math.max(a, b), 0);
  return `${prefix}-${String(max + 1).padStart(3, "0")}`;
};

export const useAdminStore = create<AdminState>()(
  persist(
    (set, get) => ({
      doctors: seedDoctors,
      pharmacies: seedPharmacies,
      addDoctor: (d) => {
        const doc: Doctor = { ...d, id: nextId("DR", get().doctors), status: d.status ?? "active", createdAt: new Date().toISOString() };
        set({ doctors: [doc, ...get().doctors] });
        return doc;
      },
      updateDoctor: (id, patch) => set({ doctors: get().doctors.map(d => d.id === id ? { ...d, ...patch } : d) }),
      deleteDoctor: (id) => set({ doctors: get().doctors.filter(d => d.id !== id) }),
      addPharmacy: (p) => {
        const ph: Pharmacy = { ...p, id: nextId("PH", get().pharmacies), status: p.status ?? "active", createdAt: new Date().toISOString() };
        set({ pharmacies: [ph, ...get().pharmacies] });
        return ph;
      },
      updatePharmacy: (id, patch) => set({ pharmacies: get().pharmacies.map(p => p.id === id ? { ...p, ...patch } : p) }),
      deletePharmacy: (id) => set({ pharmacies: get().pharmacies.filter(p => p.id !== id) }),
    }),
    { name: "medassist-admin", version: 1 },
  ),
);
