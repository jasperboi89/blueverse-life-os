import { nanoid } from "nanoid";
import { makePersistentStore } from "./persist";
import type { FinancialHealth, FinancialWeather } from "@/lib/enums";

export const ACCOUNT_TYPES = ["Checking", "Savings", "Credit Card", "Loan", "Other"] as const;
export type AccountType = (typeof ACCOUNT_TYPES)[number];

export const BILL_CADENCES = [
  "Weekly",
  "Bi-weekly",
  "Monthly",
  "Quarterly",
  "Yearly",
  "One-time",
] as const;
export type BillCadence = (typeof BILL_CADENCES)[number];

export const BILL_STATUSES = ["Upcoming", "Autopay", "Paid"] as const;
export type BillStatus = (typeof BILL_STATUSES)[number];

export type Account = {
  id: string;
  name: string;
  type: AccountType;
  balance: number;
  creditLimit?: number;
  apr?: number;
  notes?: string;
};

export type Bill = {
  id: string;
  name: string;
  amount: number;
  dueDay: number;
  // Optional so bills saved before Financial Command v1 stay valid.
  cadence?: BillCadence; // default "Monthly"
  status?: BillStatus; // default "Upcoming"
  category?: string;
  notes?: string;
};

export type Income = {
  id: string;
  source: string;
  amount: number;
  cadence: "Weekly" | "Bi-weekly" | "Monthly" | "One-time";
  nextDate?: string;
  notes?: string;
};

export type Debt = {
  id: string;
  name: string;
  balance: number;
  rate?: number;
  minPayment?: number;
};

/** Presented in the UI as a "Financial Journey"; field names kept for data compatibility. */
export type SavingsGoal = {
  id: string;
  name: string;
  target: number;
  current: number;
  deadline?: string;
  milestoneLabels?: string[];
  linkedMissionId?: string;
  notes?: string;
};

type State = {
  weather: FinancialWeather;
  health: FinancialHealth;
  accounts: Account[];
  bills: Bill[];
  incomes: Income[];
  debts: Debt[];
  savings: SavingsGoal[];
  setWeather: (w: FinancialWeather) => void;
  setHealth: (h: FinancialHealth) => void;
  addAccount: (a: Omit<Account, "id">) => void;
  updateAccount: (id: string, patch: Partial<Account>) => void;
  removeAccount: (id: string) => void;
  addBill: (b: Omit<Bill, "id">) => void;
  updateBill: (id: string, patch: Partial<Bill>) => void;
  removeBill: (id: string) => void;
  addIncome: (i: Omit<Income, "id">) => void;
  updateIncome: (id: string, patch: Partial<Income>) => void;
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
  accounts: [],
  bills: [],
  incomes: [],
  debts: [],
  savings: [],
  setWeather: (weather) => set({ weather }),
  setHealth: (health) => set({ health }),
  addAccount: (a) => set({ accounts: [...(get().accounts ?? []), { ...a, id: nanoid() }] }),
  updateAccount: (id, patch) =>
    set({ accounts: (get().accounts ?? []).map((x) => (x.id === id ? { ...x, ...patch } : x)) }),
  removeAccount: (id) => set({ accounts: (get().accounts ?? []).filter((x) => x.id !== id) }),
  addBill: (b) => set({ bills: [...get().bills, { ...b, id: nanoid() }] }),
  updateBill: (id, patch) =>
    set({ bills: get().bills.map((x) => (x.id === id ? { ...x, ...patch } : x)) }),
  removeBill: (id) => set({ bills: get().bills.filter((x) => x.id !== id) }),
  addIncome: (i) => set({ incomes: [...get().incomes, { ...i, id: nanoid() }] }),
  updateIncome: (id, patch) =>
    set({ incomes: get().incomes.map((x) => (x.id === id ? { ...x, ...patch } : x)) }),
  removeIncome: (id) => set({ incomes: get().incomes.filter((x) => x.id !== id) }),
  addDebt: (d) => set({ debts: [...get().debts, { ...d, id: nanoid() }] }),
  removeDebt: (id) => set({ debts: get().debts.filter((x) => x.id !== id) }),
  addSaving: (s) => set({ savings: [...get().savings, { ...s, id: nanoid() }] }),
  updateSaving: (id, patch) =>
    set({ savings: get().savings.map((x) => (x.id === id ? { ...x, ...patch } : x)) }),
  removeSaving: (id) => set({ savings: get().savings.filter((x) => x.id !== id) }),
}));

/* ------------------------------------------------------------------ */
/* Financial signals — pure derivations from the manual data.          */
/* ------------------------------------------------------------------ */

const MONTHLY_INCOME_MULTIPLIER: Record<Income["cadence"], number> = {
  Weekly: 4,
  "Bi-weekly": 2,
  Monthly: 1,
  "One-time": 0,
};

const MONTHLY_BILL_MULTIPLIER: Record<BillCadence, number> = {
  Weekly: 4,
  "Bi-weekly": 2,
  Monthly: 1,
  Quarterly: 1 / 3,
  Yearly: 1 / 12,
  "One-time": 0,
};

export const billCadence = (b: Bill): BillCadence => b.cadence ?? "Monthly";
export const billStatus = (b: Bill): BillStatus => b.status ?? "Upcoming";

/** Next calendar date this bill's dueDay lands on, from `from` (inclusive). */
export function nextDueDate(bill: Bill, from = new Date()): Date {
  const due = Math.min(Math.max(Math.round(bill.dueDay || 1), 1), 31);
  const d = new Date(from.getFullYear(), from.getMonth(), 1);
  // clamp against short months
  const dayIn = (base: Date) =>
    new Date(
      base.getFullYear(),
      base.getMonth(),
      Math.min(due, new Date(base.getFullYear(), base.getMonth() + 1, 0).getDate()),
    );
  let candidate = dayIn(d);
  if (candidate < new Date(from.getFullYear(), from.getMonth(), from.getDate())) {
    candidate = dayIn(new Date(from.getFullYear(), from.getMonth() + 1, 1));
  }
  return candidate;
}

export type FinancialSignals = {
  monthlyIncome: number;
  monthlyBills: number;
  net: number;
  cashOnHand: number;
  upcomingBills: { bill: Bill; due: Date }[];
  upcomingTotal: number;
  coverage: number; // cash ÷ upcoming 30-day obligations
  runwayMonths: number; // cash ÷ monthly outflow
  creditUsed: number;
  creditLimit: number;
  utilization: number | null; // null when no limits recorded
  highAprBalance: number;
  journeyProgress: number | null; // 0..1 avg, null when no journeys
  score: number; // 0-100
  weather: FinancialWeather;
  health: FinancialHealth;
  explanations: string[];
  brief: string[];
};

type SignalInput = Pick<State, "accounts" | "bills" | "incomes" | "debts" | "savings">;

export function computeFinancialSignals(s: SignalInput, now = new Date()): FinancialSignals {
  const accounts = s.accounts ?? [];
  const bills = s.bills ?? [];
  const incomes = s.incomes ?? [];
  const debts = s.debts ?? [];
  const journeys = s.savings ?? [];

  const monthlyIncome = incomes.reduce(
    (sum, i) => sum + i.amount * MONTHLY_INCOME_MULTIPLIER[i.cadence],
    0,
  );
  const monthlyBills = bills.reduce(
    (sum, b) => sum + b.amount * MONTHLY_BILL_MULTIPLIER[billCadence(b)],
    0,
  );
  const net = monthlyIncome - monthlyBills;

  const cashOnHand = accounts
    .filter((a) => a.type === "Checking" || a.type === "Savings" || a.type === "Other")
    .reduce((sum, a) => sum + Math.max(0, a.balance), 0);

  const horizon = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 30);
  const upcomingBills = bills
    .filter((b) => billStatus(b) !== "Paid")
    .map((bill) => ({ bill, due: nextDueDate(bill, now) }))
    .filter(({ due }) => due <= horizon)
    .sort((a, b) => a.due.getTime() - b.due.getTime());
  const upcomingTotal = upcomingBills.reduce((sum, x) => sum + x.bill.amount, 0);

  const coverage = upcomingTotal > 0 ? cashOnHand / upcomingTotal : cashOnHand > 0 ? 2 : 1;
  const runwayMonths = monthlyBills > 0 ? cashOnHand / monthlyBills : cashOnHand > 0 ? 6 : 0;

  const creditAccounts = accounts.filter(
    (a) => a.type === "Credit Card" && (a.creditLimit ?? 0) > 0,
  );
  const creditUsed = creditAccounts.reduce((sum, a) => sum + Math.max(0, a.balance), 0);
  const creditLimit = creditAccounts.reduce((sum, a) => sum + (a.creditLimit ?? 0), 0);
  const utilization = creditLimit > 0 ? Math.min(1, creditUsed / creditLimit) : null;

  const highAprBalance =
    accounts
      .filter((a) => (a.apr ?? 0) > 15 && (a.type === "Credit Card" || a.type === "Loan"))
      .reduce((sum, a) => sum + Math.max(0, a.balance), 0) +
    debts.filter((d) => (d.rate ?? 0) > 15).reduce((sum, d) => sum + Math.max(0, d.balance), 0);

  const activeJourneys = journeys.filter((j) => j.target > 0);
  const journeyProgress = activeJourneys.length
    ? activeJourneys.reduce((sum, j) => sum + Math.min(1, j.current / j.target), 0) /
      activeJourneys.length
    : null;

  // ---- score: coverage 40 · stability 25 · utilization 15 · debt 10 · savings 10 ----
  const coveragePart = Math.min(coverage / 1.5, 1) * 40;
  const stabilityPart = Math.min(runwayMonths / 6, 1) * 25;
  const utilizationPart = (utilization === null ? 0.7 : 1 - utilization) * 15;
  const debtPart =
    (highAprBalance <= 0 ? 1 : Math.max(0, 1 - highAprBalance / Math.max(cashOnHand, 1))) * 10;
  const savingsPart = (journeyProgress === null ? 0.5 : journeyProgress) * 10;
  let score = Math.round(coveragePart + stabilityPart + utilizationPart + debtPart + savingsPart);

  // Hard override: can't cover the next 30 days.
  const overdrawn = upcomingTotal > 0 && cashOnHand < upcomingTotal;
  const severelyOverdrawn = upcomingTotal > 0 && cashOnHand < upcomingTotal * 0.5;
  if (severelyOverdrawn) score = Math.min(score, 20);
  else if (overdrawn) score = Math.min(score, 40);
  score = Math.max(0, Math.min(100, score));

  const tier = score >= 80 ? 0 : score >= 62 ? 1 : score >= 45 ? 2 : score >= 25 ? 3 : 4;
  const weather: FinancialWeather = (["Clear", "Stable", "Caution", "Pressure", "Storm"] as const)[
    tier
  ];
  const health: FinancialHealth = (
    ["Thriving", "Steady", "Tight", "Strained", "Critical"] as const
  )[tier];

  const money = (n: number) => `$${Math.round(n).toLocaleString()}`;
  const explanations: string[] = [
    upcomingTotal > 0
      ? `${money(cashOnHand)} cash vs ${money(upcomingTotal)} due in the next 30 days (${Math.round(coverage * 100)}% covered).`
      : "No unpaid bills inside the next 30 days.",
    monthlyBills > 0
      ? `Cash on hand covers ~${runwayMonths.toFixed(1)} months of obligations.`
      : "No recurring outflow recorded yet.",
  ];
  if (utilization !== null)
    explanations.push(
      `Credit utilization at ${Math.round(utilization * 100)}% of ${money(creditLimit)} limits.`,
    );
  if (highAprBalance > 0) explanations.push(`${money(highAprBalance)} carried above 15% APR.`);
  if (journeyProgress !== null)
    explanations.push(`Journeys averaging ${Math.round(journeyProgress * 100)}% complete.`);

  const brief: string[] = [];
  const noData = accounts.length === 0 && bills.length === 0 && incomes.length === 0;
  if (noData) {
    brief.push("Log accounts, bills, and income to bring the financial picture online.");
  } else {
    if (severelyOverdrawn) brief.push("Storm warning: upcoming bills far exceed available cash.");
    else if (overdrawn) brief.push("Pressure building: upcoming bills exceed available cash.");
    else if (coverage >= 1.5) brief.push("Upcoming obligations look stable.");
    else if (upcomingTotal > 0) brief.push("Obligations covered, but the margin is thin.");
    if (utilization !== null && utilization > 0.5)
      brief.push("Credit pressure detected. Consider prioritizing high APR balances.");
    else if (highAprBalance > 0)
      brief.push(
        `High-APR balance of ${money(highAprBalance)} is the most expensive debt to hold.`,
      );
    if (activeJourneys.some((j) => j.current < j.target))
      brief.push("Savings journey active. Continue small deposits.");
    if (runwayMonths >= 6) brief.push("Six months of stability banked. Course is steady.");
    if (net < 0)
      brief.push(`Monthly outflow exceeds income by ${money(-net)}. Trim or boost inflow.`);
    if (brief.length === 0) brief.push("Financial systems nominal. Hold the course.");
  }

  return {
    monthlyIncome,
    monthlyBills,
    net,
    cashOnHand,
    upcomingBills,
    upcomingTotal,
    coverage,
    runwayMonths,
    creditUsed,
    creditLimit,
    utilization,
    highAprBalance,
    journeyProgress,
    score,
    weather,
    health,
    explanations,
    brief,
  };
}
