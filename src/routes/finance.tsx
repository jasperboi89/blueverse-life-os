import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { format } from "date-fns";
import {
  ArrowRight,
  ChevronDown,
  ChevronRight,
  Cloud,
  CloudLightning,
  CloudRain,
  Compass,
  Plus,
  Sparkles,
  Sun,
  Trash2,
  Wind,
  X,
} from "lucide-react";
import { GlassPanel } from "@/components/shell/GlassPanel";
import { Field, OptionSelect, AutosaveInput, AutosaveTextarea } from "@/components/shell/form";
import {
  useFinance,
  computeFinancialSignals,
  billCadence,
  billStatus,
  ACCOUNT_TYPES,
  BILL_CADENCES,
  BILL_STATUSES,
  type Account,
  type Bill,
  type Income,
  type SavingsGoal,
} from "@/stores/finance";
import { useMissions } from "@/stores/missions";
import { useMomentum } from "@/stores/momentum";
import { WEATHER_GRADIENT, MISSION_CLASS_ACCENT, type FinancialWeather } from "@/lib/enums";
import { pageHead } from "@/lib/seo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/finance")({
  head: () =>
    pageHead(
      "Financial Command · BlueVerse",
      "Manual-first financial command: accounts, bills, income, journeys, and a living health signal.",
      "Am I financially okay? One glance answers it.",
    ),
  component: FinancePage,
});

const WEATHER_ICON: Record<FinancialWeather, typeof Sun> = {
  Clear: Sun,
  Stable: Cloud,
  Caution: Wind,
  Pressure: CloudRain,
  Storm: CloudLightning,
};

const usd = (n: number) => `$${Math.round(n).toLocaleString()}`;

function FinancePage() {
  const f = useFinance();
  const signals = useMemo(
    () =>
      computeFinancialSignals({
        accounts: f.accounts,
        bills: f.bills,
        incomes: f.incomes,
        debts: f.debts,
        savings: f.savings,
      }),
    [f.accounts, f.bills, f.incomes, f.debts, f.savings],
  );

  // Keep the stored weather/health (read by the Bridge) in step with the computed signal.
  const { setWeather, setHealth } = f;
  useEffect(() => {
    if (signals.weather !== f.weather) setWeather(signals.weather);
    if (signals.health !== f.health) setHealth(signals.health);
  }, [signals.weather, signals.health, f.weather, f.health, setWeather, setHealth]);

  const WeatherIcon = WEATHER_ICON[signals.weather];

  return (
    <div className="space-y-6 pb-12">
      <div>
        <p className="hud-text">Financial Command</p>
        <h1 className="font-display text-3xl text-gradient-cosmic sm:text-4xl">
          Am I financially okay?
        </h1>
        <p className="text-sm text-muted-foreground">
          Manual-first. Eyes on the weather. Hands on the wheel.
        </p>
      </div>

      {/* NAVIGATOR FINANCIAL BRIEF */}
      <GlassPanel eyebrow="Navigator · Financial Brief" title="Current read" brackets scan>
        <ul className="space-y-1.5">
          {signals.brief.map((line, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-foreground/90">
              <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
              <span>{line}</span>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-xs text-muted-foreground">
          Rule-based for now — the Navigator sharpens as your data grows.
        </p>
      </GlassPanel>

      {/* COMMAND HEADER */}
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        <HeaderTile eyebrow="Financial Health" accent>
          <p className="font-display text-2xl text-primary">{signals.health}</p>
          <p className="mt-1 text-xs text-muted-foreground">Signal strength {signals.score}/100</p>
        </HeaderTile>

        <GlassPanel
          brackets={false}
          scan={false}
          className={cn("!p-4 bg-gradient-to-br", WEATHER_GRADIENT[signals.weather])}
        >
          <p className="hud-text">Financial Weather</p>
          <div className="mt-1 flex items-center gap-2">
            <WeatherIcon className="h-6 w-6 text-foreground drop-shadow-[0_0_10px_currentColor]" />
            <p className="font-display text-2xl text-foreground">{signals.weather}</p>
          </div>
        </GlassPanel>

        <HeaderTile eyebrow="Month Snapshot">
          <p className="text-sm text-muted-foreground">
            In <span className="font-display text-primary">{usd(signals.monthlyIncome)}</span> · Out{" "}
            <span className="font-display text-accent">{usd(signals.monthlyBills)}</span>
          </p>
          <p
            className={cn(
              "mt-1 font-display text-xl",
              signals.net >= 0 ? "text-primary" : "text-destructive",
            )}
          >
            {signals.net >= 0 ? "+" : "−"}
            {usd(Math.abs(signals.net))}/mo
          </p>
        </HeaderTile>

        <HeaderTile eyebrow="Upcoming · 30 days">
          <p className="font-display text-xl text-foreground">{usd(signals.upcomingTotal)}</p>
          <p className="mt-1 text-xs text-muted-foreground">
            {signals.upcomingBills.length} obligation{signals.upcomingBills.length === 1 ? "" : "s"}{" "}
            · {Math.round(signals.coverage * 100)}% covered
          </p>
        </HeaderTile>

        <HeaderTile eyebrow="Cash Stability">
          <p className="font-display text-xl text-foreground">
            {signals.runwayMonths.toFixed(1)} mo
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {usd(signals.cashOnHand)} liquid across accounts
          </p>
        </HeaderTile>
      </div>

      {/* HEALTH EXPLANATION */}
      <GlassPanel eyebrow="Why this reading" title={`${signals.health} · ${signals.score}/100`}>
        <ul className="space-y-1.5">
          {signals.explanations.map((line, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-foreground/90">
              <Compass className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
              <span>{line}</span>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-xs text-muted-foreground">
          Blend of obligation coverage (40%), cash stability (25%), credit utilization (15%), debt
          pressure (10%), and savings momentum (10%).
        </p>
      </GlassPanel>

      <AccountsCard />

      <div className="grid gap-6 lg:grid-cols-2">
        <BillsCard upcoming={signals.upcomingBills} />
        <IncomeCard />
      </div>

      <JourneysCard />

      <div className="grid gap-6 lg:grid-cols-2">
        <DebtsCard />
        <FinancialMissionsCard />
      </div>
    </div>
  );
}

function HeaderTile({
  eyebrow,
  accent,
  children,
}: {
  eyebrow: string;
  accent?: boolean;
  children: React.ReactNode;
}) {
  return (
    <GlassPanel brackets={false} scan={false} className={cn("!p-4", accent && "holo-sweep")}>
      <p className="hud-text">{eyebrow}</p>
      <div className="mt-1">{children}</div>
    </GlassPanel>
  );
}

/** Trash-icon trigger + AlertDialog; nothing is deleted without confirmation. */
function ConfirmDelete({ what, onConfirm }: { what: string; onConfirm: () => void }) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button size="icon" variant="ghost" aria-label={`Delete ${what}`} className="h-7 w-7">
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="glass-panel holo-border">
        <AlertDialogHeader>
          <AlertDialogTitle>Delete {what}?</AlertDialogTitle>
          <AlertDialogDescription>
            This removes it from Financial Command permanently.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function ExpandToggle({ open, onClick }: { open: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="rounded p-1 text-muted-foreground hover:bg-primary/10 hover:text-foreground"
      aria-label={open ? "Collapse details" : "Expand details"}
    >
      {open ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
    </button>
  );
}

/* ------------------------------- ACCOUNTS ------------------------------- */

function AccountsCard() {
  const { accounts = [], addAccount, updateAccount, removeAccount } = useFinance();
  const [name, setName] = useState("");
  const [type, setType] = useState<Account["type"]>("Checking");
  const [balance, setBalance] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);

  const submit = () => {
    if (!name.trim() || balance === "") return;
    addAccount({ name: name.trim(), type, balance: +balance || 0 });
    setName("");
    setBalance("");
  };

  return (
    <GlassPanel eyebrow="Account Overview" title="Manual Accounts">
      <div className="grid gap-2 sm:grid-cols-[1fr_150px_120px_auto]">
        <Input placeholder="Account name" value={name} onChange={(e) => setName(e.target.value)} />
        <OptionSelect
          value={type}
          onChange={(v) => setType(v as Account["type"])}
          options={ACCOUNT_TYPES}
        />
        <Input
          type="number"
          placeholder="Balance $"
          value={balance}
          onChange={(e) => setBalance(e.target.value)}
        />
        <Button size="icon" aria-label="Add account" onClick={submit}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {accounts.length === 0 ? (
        <p className="mt-4 text-sm text-muted-foreground">
          No accounts yet. Add checking, savings, credit, or loans to power the health signal.
        </p>
      ) : (
        <ul className="mt-4 grid gap-2 lg:grid-cols-2">
          {accounts.map((a) => {
            const isOpen = expanded === a.id;
            const isCredit = a.type === "Credit Card";
            const util =
              isCredit && (a.creditLimit ?? 0) > 0
                ? Math.min(100, (Math.max(0, a.balance) / a.creditLimit!) * 100)
                : null;
            return (
              <li key={a.id} className="rounded-xl border border-primary/15 bg-primary/5">
                <div className="flex items-center gap-2 px-3 py-2">
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-display text-foreground">{a.name}</p>
                    <p className="label-text">{a.type}</p>
                  </div>
                  <p
                    className={cn(
                      "font-display",
                      isCredit || a.type === "Loan" ? "text-accent" : "text-primary",
                    )}
                  >
                    {usd(a.balance)}
                  </p>
                  <ExpandToggle open={isOpen} onClick={() => setExpanded(isOpen ? null : a.id)} />
                  <ConfirmDelete
                    what={`account "${a.name}"`}
                    onConfirm={() => removeAccount(a.id)}
                  />
                </div>
                {util !== null && (
                  <div className="px-3 pb-2">
                    <Progress value={util} />
                    <p className="mt-1 text-xs text-muted-foreground">
                      {Math.round(util)}% of {usd(a.creditLimit!)} limit
                    </p>
                  </div>
                )}
                {isOpen && (
                  <div className="grid gap-2 border-t border-border/40 px-3 py-3 sm:grid-cols-3">
                    <Field label="Balance $">
                      <Input
                        type="number"
                        value={a.balance}
                        onChange={(e) => updateAccount(a.id, { balance: +e.target.value || 0 })}
                      />
                    </Field>
                    <Field label="Credit limit $">
                      <Input
                        type="number"
                        value={a.creditLimit ?? ""}
                        placeholder="—"
                        onChange={(e) =>
                          updateAccount(a.id, {
                            creditLimit: e.target.value === "" ? undefined : +e.target.value,
                          })
                        }
                      />
                    </Field>
                    <Field label="APR %">
                      <Input
                        type="number"
                        value={a.apr ?? ""}
                        placeholder="—"
                        onChange={(e) =>
                          updateAccount(a.id, {
                            apr: e.target.value === "" ? undefined : +e.target.value,
                          })
                        }
                      />
                    </Field>
                    <Field label="Notes" className="sm:col-span-3">
                      <AutosaveTextarea
                        rows={2}
                        value={a.notes ?? ""}
                        onCommit={(notes) => updateAccount(a.id, { notes })}
                        placeholder="Anything worth remembering about this account."
                      />
                    </Field>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </GlassPanel>
  );
}

/* -------------------------------- BILLS --------------------------------- */

function BillsCard({ upcoming }: { upcoming: { bill: Bill; due: Date }[] }) {
  const { bills, addBill, updateBill, removeBill } = useFinance();
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [dueDay, setDueDay] = useState("1");
  const [cadence, setCadence] = useState<NonNullable<Bill["cadence"]>>("Monthly");
  const [expanded, setExpanded] = useState<string | null>(null);

  const submit = () => {
    if (!name.trim() || !amount) return;
    addBill({
      name: name.trim(),
      amount: +amount,
      dueDay: +dueDay || 1,
      cadence,
      status: "Upcoming",
    });
    setName("");
    setAmount("");
  };

  // upcoming already sorted by next due date; append Paid bills at the end
  const paid = bills.filter((b) => billStatus(b) === "Paid");
  const rows: { bill: Bill; due: Date | null }[] = [
    ...upcoming.map((u) => ({ bill: u.bill, due: u.due as Date | null })),
    ...paid.map((bill) => ({ bill, due: null })),
  ];

  return (
    <GlassPanel eyebrow="Obligations" title="Bills">
      <div className="grid gap-2 sm:grid-cols-[1fr_90px_70px_120px_auto]">
        <Input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
        <Input
          type="number"
          placeholder="$"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <Input
          type="number"
          placeholder="Day"
          min={1}
          max={31}
          value={dueDay}
          onChange={(e) => setDueDay(e.target.value)}
        />
        <OptionSelect
          value={cadence}
          onChange={(v) => setCadence(v as NonNullable<Bill["cadence"]>)}
          options={BILL_CADENCES}
        />
        <Button size="icon" aria-label="Add bill" onClick={submit}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <ul className="mt-3 space-y-1.5">
        {rows.length === 0 && (
          <li className="text-sm text-muted-foreground">No bills logged. Clear skies so far.</li>
        )}
        {rows.map(({ bill: b, due }) => {
          const isOpen = expanded === b.id;
          const status = billStatus(b);
          return (
            <li key={b.id} className="rounded-md border border-primary/10 bg-primary/5">
              <div className="flex items-center gap-2 px-2 py-1.5">
                <span className="hud-text w-14 shrink-0 text-primary">
                  {due ? format(due, "MMM d") : "Paid"}
                </span>
                <span className="min-w-0 flex-1 truncate">{b.name}</span>
                {billCadence(b) !== "Monthly" && (
                  <Badge variant="outline" className="bg-background/30 text-2xs">
                    {billCadence(b)}
                  </Badge>
                )}
                {b.category && (
                  <Badge
                    variant="outline"
                    className="hidden bg-background/30 text-2xs sm:inline-flex"
                  >
                    {b.category}
                  </Badge>
                )}
                <span className={cn("font-display", status === "Paid" && "text-muted-foreground")}>
                  {usd(b.amount)}
                </span>
                <ExpandToggle open={isOpen} onClick={() => setExpanded(isOpen ? null : b.id)} />
                <ConfirmDelete what={`bill "${b.name}"`} onConfirm={() => removeBill(b.id)} />
              </div>
              {isOpen && (
                <div className="grid gap-2 border-t border-border/40 px-3 py-3 sm:grid-cols-3">
                  <Field label="Status">
                    <OptionSelect
                      value={status}
                      onChange={(v) => updateBill(b.id, { status: v as Bill["status"] })}
                      options={BILL_STATUSES}
                    />
                  </Field>
                  <Field label="Cadence">
                    <OptionSelect
                      value={billCadence(b)}
                      onChange={(v) => updateBill(b.id, { cadence: v as Bill["cadence"] })}
                      options={BILL_CADENCES}
                    />
                  </Field>
                  <Field label="Category">
                    <AutosaveInput
                      value={b.category ?? ""}
                      onCommit={(category) => updateBill(b.id, { category })}
                      placeholder="Housing, Utilities…"
                    />
                  </Field>
                  <Field label="Notes" className="sm:col-span-3">
                    <AutosaveTextarea
                      rows={2}
                      value={b.notes ?? ""}
                      onCommit={(notes) => updateBill(b.id, { notes })}
                      placeholder="Autopay date, account it pulls from…"
                    />
                  </Field>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </GlassPanel>
  );
}

/* -------------------------------- INCOME -------------------------------- */

function IncomeCard() {
  const { incomes, addIncome, updateIncome, removeIncome } = useFinance();
  const [source, setSource] = useState("");
  const [amount, setAmount] = useState("");
  const [cadence, setCadence] = useState<Income["cadence"]>("Monthly");
  const [nextDate, setNextDate] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);

  const submit = () => {
    if (!source.trim() || !amount) return;
    addIncome({
      source: source.trim(),
      amount: +amount,
      cadence,
      nextDate: nextDate || undefined,
    });
    setSource("");
    setAmount("");
    setNextDate("");
  };

  return (
    <GlassPanel eyebrow="Inflow" title="Income / Paychecks">
      <div className="grid gap-2 sm:grid-cols-[1fr_90px_110px_auto]">
        <Input placeholder="Source" value={source} onChange={(e) => setSource(e.target.value)} />
        <Input
          type="number"
          placeholder="$"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <OptionSelect
          value={cadence}
          onChange={(v) => setCadence(v as Income["cadence"])}
          options={["Weekly", "Bi-weekly", "Monthly", "One-time"]}
        />
        <Button size="icon" aria-label="Add income" onClick={submit}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      <div className="mt-2">
        <Field label="Next expected date (optional)">
          <Input type="date" value={nextDate} onChange={(e) => setNextDate(e.target.value)} />
        </Field>
      </div>

      <ul className="mt-3 space-y-1.5">
        {incomes.length === 0 && (
          <li className="text-sm text-muted-foreground">No income logged yet.</li>
        )}
        {incomes.map((i) => {
          const isOpen = expanded === i.id;
          return (
            <li key={i.id} className="rounded-md border border-primary/10 bg-primary/5">
              <div className="flex items-center gap-2 px-2 py-1.5">
                <span className="min-w-0 flex-1 truncate">{i.source}</span>
                <span className="hud-text text-primary">{i.cadence}</span>
                {i.nextDate && (
                  <Badge
                    variant="outline"
                    className="hidden bg-background/30 text-2xs sm:inline-flex"
                  >
                    next {format(new Date(i.nextDate + "T00:00"), "MMM d")}
                  </Badge>
                )}
                <span className="font-display">{usd(i.amount)}</span>
                <ExpandToggle open={isOpen} onClick={() => setExpanded(isOpen ? null : i.id)} />
                <ConfirmDelete what={`income "${i.source}"`} onConfirm={() => removeIncome(i.id)} />
              </div>
              {isOpen && (
                <div className="grid gap-2 border-t border-border/40 px-3 py-3 sm:grid-cols-2">
                  <Field label="Next expected date">
                    <Input
                      type="date"
                      value={i.nextDate ?? ""}
                      onChange={(e) =>
                        updateIncome(i.id, { nextDate: e.target.value || undefined })
                      }
                    />
                  </Field>
                  <Field label="Notes" className="sm:col-span-2">
                    <AutosaveTextarea
                      rows={2}
                      value={i.notes ?? ""}
                      onCommit={(notes) => updateIncome(i.id, { notes })}
                      placeholder="Hours, client, reliability…"
                    />
                  </Field>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </GlassPanel>
  );
}

/* ------------------------------- JOURNEYS ------------------------------- */

function JourneysCard() {
  const { savings, addSaving, updateSaving, removeSaving } = useFinance();
  // Subscribe to the stable array and filter in render — a filtering selector
  // returns a fresh array every snapshot and loops useSyncExternalStore.
  const allMissions = useMissions((s) => s.missions);
  const missions = allMissions.filter((m) => m.missionClass === "Financial");
  const log = useMomentum((s) => s.log);
  const [title, setTitle] = useState("");
  const [target, setTarget] = useState("");
  const accent = MISSION_CLASS_ACCENT.Financial;

  const submit = () => {
    if (!title.trim() || !target) return;
    addSaving({ name: title.trim(), target: +target, current: 0 });
    log("finance", `Journey launched: ${title.trim()}`);
    setTitle("");
    setTarget("");
  };

  return (
    <GlassPanel
      eyebrow="Financial Journeys"
      title="Voyages, not spreadsheets"
      action={
        <span className="text-xs text-muted-foreground">
          {savings.length} journey{savings.length === 1 ? "" : "s"}
        </span>
      }
    >
      <div className="grid gap-2 sm:grid-cols-[1fr_140px_auto]">
        <Input
          placeholder="e.g. Build Emergency Fund, Six-Month Runway"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <Input
          type="number"
          placeholder="Target $"
          value={target}
          onChange={(e) => setTarget(e.target.value)}
        />
        <Button onClick={submit}>
          <Plus className="mr-1 h-4 w-4" /> Launch
        </Button>
      </div>

      {savings.length === 0 ? (
        <p className="mt-4 text-sm text-muted-foreground">
          No journeys underway. Launch one — Emergency Fund, Pay Down Credit Card, Subscription
          Cleanup…
        </p>
      ) : (
        <ul className="mt-4 grid gap-3 lg:grid-cols-2">
          {savings.map((j) => (
            <JourneyCard
              key={j.id}
              j={j}
              accent={accent}
              missions={missions}
              onUpdate={updateSaving}
              onRemove={removeSaving}
            />
          ))}
        </ul>
      )}
    </GlassPanel>
  );
}

function JourneyCard({
  j,
  accent,
  missions,
  onUpdate,
  onRemove,
}: {
  j: SavingsGoal;
  accent: string;
  missions: { id: string; name: string }[];
  onUpdate: (id: string, patch: Partial<SavingsGoal>) => void;
  onRemove: (id: string) => void;
}) {
  const [labelDraft, setLabelDraft] = useState("");
  const pct = j.target > 0 ? Math.min(100, Math.round((j.current / j.target) * 100)) : 0;
  const labels = j.milestoneLabels ?? [];
  const linked = missions.find((m) => m.id === j.linkedMissionId);

  const addLabel = () => {
    const parts = labelDraft
      .split(",")
      .map((x) => x.trim())
      .filter(Boolean);
    if (parts.length === 0) return;
    onUpdate(j.id, { milestoneLabels: [...labels, ...parts] });
    setLabelDraft("");
  };

  return (
    <li className="relative overflow-hidden rounded-xl border border-primary/15 bg-primary/5">
      <div className={`absolute left-0 top-0 h-full w-1 bg-gradient-to-b ${accent}`} />
      <div className="p-4 pl-5">
        <div className="flex items-start gap-2">
          <div className="min-w-0 flex-1">
            <p className="hud-text">Journey · {pct}%</p>
            <p className="truncate font-display text-lg text-foreground">{j.name}</p>
          </div>
          <ConfirmDelete what={`journey "${j.name}"`} onConfirm={() => onRemove(j.id)} />
        </div>

        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-primary/15">
          <div className={`h-full bg-gradient-to-r ${accent}`} style={{ width: `${pct}%` }} />
        </div>

        <div className="mt-3 flex items-center justify-between gap-3 text-sm">
          <div className="flex items-center gap-2">
            <span className="label-text">Current $</span>
            <Input
              type="number"
              value={j.current}
              onChange={(e) => onUpdate(j.id, { current: +e.target.value || 0 })}
              className="h-7 w-28"
              aria-label={`Current amount for ${j.name}`}
            />
          </div>
          <span className="text-muted-foreground">of {usd(j.target)}</span>
        </div>

        <div className="mt-3">
          <div className="flex flex-wrap gap-1.5">
            {labels.map((label, i) => (
              <Badge
                key={`${label}-${i}`}
                variant="outline"
                className="cursor-pointer bg-background/30 text-2xs"
                title="Click to remove"
                onClick={() =>
                  onUpdate(j.id, { milestoneLabels: labels.filter((_, idx) => idx !== i) })
                }
              >
                {label} <X className="ml-1 h-3 w-3" />
              </Badge>
            ))}
          </div>
          <div className="mt-2 flex gap-2">
            <Input
              value={labelDraft}
              onChange={(e) => setLabelDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") addLabel();
              }}
              placeholder="Milestone labels (comma separated)"
              className="h-8 text-xs"
            />
            <Button
              size="icon"
              variant="outline"
              aria-label={`Add milestone labels to ${j.name}`}
              className="h-8 w-8 bg-background/30"
              onClick={addLabel}
            >
              <Plus className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>

        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          <Field label="Linked mission">
            <Select
              value={j.linkedMissionId ?? "__none__"}
              onValueChange={(v) =>
                onUpdate(j.id, { linkedMissionId: v === "__none__" ? undefined : v })
              }
            >
              <SelectTrigger className="bg-background/40">
                <SelectValue placeholder="None" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__none__">None</SelectItem>
                {missions.map((m) => (
                  <SelectItem key={m.id} value={m.id}>
                    {m.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field label="Notes">
            <AutosaveTextarea
              rows={1}
              value={j.notes ?? ""}
              onCommit={(notes) => onUpdate(j.id, { notes })}
              placeholder="Why this journey matters."
            />
          </Field>
        </div>

        {linked && (
          <Link
            to="/missions/$id"
            params={{ id: linked.id }}
            className="mt-2 inline-flex items-center gap-1.5 text-xs text-primary hover:underline"
          >
            Open mission: {linked.name} <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        )}
      </div>
    </li>
  );
}

/* ----------------------------- LEGACY DEBTS ----------------------------- */

function DebtsCard() {
  const { debts, addDebt, removeDebt } = useFinance();
  const [name, setName] = useState("");
  const [balance, setBalance] = useState("");

  const submit = () => {
    if (!name.trim() || !balance) return;
    addDebt({ name: name.trim(), balance: +balance });
    setName("");
    setBalance("");
  };

  return (
    <GlassPanel eyebrow="Liabilities" title="Debt Accounts">
      <div className="grid grid-cols-[1fr_110px_auto] gap-2">
        <Input placeholder="Account" value={name} onChange={(e) => setName(e.target.value)} />
        <Input
          type="number"
          placeholder="Balance"
          value={balance}
          onChange={(e) => setBalance(e.target.value)}
        />
        <Button size="icon" aria-label="Add debt" onClick={submit}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      <ul className="mt-3 space-y-1.5">
        {debts.length === 0 && (
          <li className="text-sm text-muted-foreground">No standalone debts logged.</li>
        )}
        {debts.map((d) => (
          <li
            key={d.id}
            className="grid grid-cols-[minmax(0,1fr)_auto_auto_auto] items-center gap-2 rounded-md border border-primary/10 bg-primary/5 px-2 py-1.5"
          >
            <span className="truncate">{d.name}</span>
            {d.rate !== undefined && (
              <Badge variant="outline" className="bg-background/30 text-2xs">
                {d.rate}% APR
              </Badge>
            )}
            <span className="font-display">{usd(d.balance)}</span>
            <ConfirmDelete what={`debt "${d.name}"`} onConfirm={() => removeDebt(d.id)} />
          </li>
        ))}
      </ul>
      <p className="mt-3 text-xs text-muted-foreground">
        Tip: credit cards and loans added as Accounts (with APR + limit) feed the health signal more
        precisely.
      </p>
    </GlassPanel>
  );
}

/* --------------------------- FINANCIAL MISSIONS -------------------------- */

function FinancialMissionsCard() {
  const allMissions = useMissions((s) => s.missions);
  const financialMissions = allMissions.filter(
    (m) => m.missionClass === "Financial" && m.status !== "Archived",
  );

  return (
    <GlassPanel
      eyebrow="Linked Missions"
      title="Financial Missions"
      action={
        <Button asChild variant="ghost" size="sm" className="text-primary">
          <Link to="/missions">
            All <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </Button>
      }
    >
      {financialMissions.length === 0 ? (
        <p className="text-sm text-muted-foreground">No financial-class missions yet.</p>
      ) : (
        <ul className="grid gap-2">
          {financialMissions.map((m) => (
            <li key={m.id}>
              <Link
                to="/missions/$id"
                params={{ id: m.id }}
                className="block rounded-xl border border-primary/15 bg-primary/5 p-3 hover:bg-primary/10"
              >
                <p className="font-display text-foreground">{m.name}</p>
                <Progress value={m.progress} className="mt-2" />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </GlassPanel>
  );
}
