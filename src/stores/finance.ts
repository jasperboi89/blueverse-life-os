import { nanoid } from "nanoid";
import { makePersistentStore } from "./persist";
import type { FinancialHealth, FinancialWeather } from "@/lib/enums";

export type Bill = { id: string; name: string; amount: number; dueDay: number; category?: string };
export type Income = { id: string; source: string; amount: number; cadence: "Weekly" | "Bi-weekly" | "Monthly" | "One-time"; nextDate?: string };
export type Debt = { id: string; name: string; balance: number; rate?: number; minPayment?: number };
export type SavingsGoal = { id: string; name: string; target: number; current: number; deadline?: string };

type State = {
  weather: FinancialWeather;
  health: FinancialHealth;
  bills: Bill[];
  incomes: Income[];
  debts: Debt[];
  savings: SavingsGoal[];
  setWeather: (w: FinancialWeather) => void;
  setHealth: (h: FinancialHealth) => void;
  addBill: (b: Omit<Bill, "id">) => void;
  removeBill: (id: string) => void;
  addIncome: (i: Omit<Income, "id">) => void;
  removeIncome: (id: string) => void;
  addDebt: (d: Omit<Debt, "id">) => void;
  removeDebt: (id: string) => void;
  addSaving: (s: Omit<SavingsGoal, "id">) => void;
  updateSaving: (id: string, patch: Partial<SavingsGoal>) => void;
  removeSaving: (id: string) => void;
};

export const useFinance = makePersistentStore<State>("finance", (set, get) => ({
  weather: "Stable",
  health: "Steady",
  bills: [],
  incomes: [],
  debts: [],
  savings: [],
  setWeather: (weather) => set({ weather }),
  setHealth: (health) => set({ health }),
  addBill: (b) => set({ bills: [...get().bills, { ...b, id: nanoid() }] }),
  removeBill: (id) => set({ bills: get().bills.filter((x) => x.id !== id) }),
  addIncome: (i) => set({ incomes: [...get().incomes, { ...i, id: nanoid() }] }),
  removeIncome: (id) => set({ incomes: get().incomes.filter((x) => x.id !== id) }),
  addDebt: (d) => set({ debts: [...get().debts, { ...d, id: nanoid() }] }),
  removeDebt: (id) => set({ debts: get().debts.filter((x) => x.id !== id) }),
  addSaving: (s) => set({ savings: [...get().savings, { ...s, id: nanoid() }] }),
  updateSaving: (id, patch) =>
    set({ savings: get().savings.map((x) => (x.id === id ? { ...x, ...patch } : x)) }),
  removeSaving: (id) => set({ savings: get().savings.filter((x) => x.id !== id) }),
}));
