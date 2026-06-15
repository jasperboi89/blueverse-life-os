import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { GlassPanel } from "@/components/shell/GlassPanel";
import { useFinance } from "@/stores/finance";
import { useMissions } from "@/stores/missions";
import { FINANCIAL_HEALTHS, FINANCIAL_WEATHERS, WEATHER_GRADIENT } from "@/lib/enums";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, Cloud, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";

export const Route = createFileRoute("/finance")({
  head: () => ({
    meta: [
      { title: "Financial Command · BlueVerse" },
      { name: "description", content: "Manual-first financial command: weather, bills, income, debt, savings, forecast." },
      { property: "og:title", content: "Financial Command · BlueVerse" },
      { property: "og:description", content: "Track the weather of your finances and steer the vessel." },
    ],
  }),
  component: FinancePage,
});

function FinancePage() {
  const f = useFinance();
  const financialMissions = useMissions((s) => s.missions.filter((m) => m.missionClass === "Financial"));

  const totalIncome = f.incomes.reduce((a, i) => a + i.amount * (i.cadence === "Weekly" ? 4 : i.cadence === "Bi-weekly" ? 2 : 1), 0);
  const totalBills = f.bills.reduce((a, b) => a + b.amount, 0);
  const net = totalIncome - totalBills;

  return (
    <div className="space-y-6">
      <div>
        <p className="hud-text">Financial Command</p>
        <h1 className="font-display text-3xl text-gradient-cosmic sm:text-4xl">Finance</h1>
        <p className="text-sm text-muted-foreground">Manual-first. Eyes on the weather. Hands on the wheel.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <GlassPanel eyebrow="Status" title="Financial Health">
          <Select value={f.health} onValueChange={(v) => f.setHealth(v as typeof f.health)}>
            <SelectTrigger className="bg-background/40"><SelectValue /></SelectTrigger>
            <SelectContent>{FINANCIAL_HEALTHS.map((h) => <SelectItem key={h} value={h}>{h}</SelectItem>)}</SelectContent>
          </Select>
          <p className="mt-3 text-sm text-muted-foreground">Net monthly ≈ <span className={cn("font-display", net >= 0 ? "text-primary" : "text-destructive")}>${net.toLocaleString()}</span></p>
        </GlassPanel>

        <GlassPanel eyebrow="Climate" title="Financial Weather" className={cn("bg-gradient-to-br", WEATHER_GRADIENT[f.weather])}>
          <div className="flex items-center gap-3">
            <Cloud className="h-8 w-8 text-foreground" />
            <p className="font-display text-3xl text-foreground">{f.weather}</p>
          </div>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {FINANCIAL_WEATHERS.map((w) => (
              <button key={w} onClick={() => f.setWeather(w)}
                className={cn("rounded-full px-2.5 py-1 text-xs", f.weather === w ? "bg-foreground/20 text-foreground" : "bg-background/40 text-muted-foreground hover:text-foreground")}>
                {w}
              </button>
            ))}
          </div>
        </GlassPanel>

        <GlassPanel eyebrow="Forecast" title="Next 30 days">
          <p className="text-sm text-muted-foreground">Inflow ≈ <span className="font-display text-primary">${totalIncome.toLocaleString()}</span></p>
          <p className="text-sm text-muted-foreground">Outflow ≈ <span className="font-display text-accent">${totalBills.toLocaleString()}</span></p>
          <p className="mt-2 text-xs text-muted-foreground">{/* future: adaptive */} Adaptive forecast lands in a future phase.</p>
        </GlassPanel>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <BillsCard />
        <IncomeCard />
        <DebtsCard />
        <SavingsCard />
      </div>

      <GlassPanel eyebrow="Linked Missions" title="Financial Missions"
        action={<Button asChild variant="ghost" size="sm" className="text-primary"><Link to="/missions">All <ArrowRight className="ml-1 h-4 w-4" /></Link></Button>}>
        {financialMissions.length === 0 ? (
          <p className="text-sm text-muted-foreground">No financial-class missions yet.</p>
        ) : (
          <ul className="grid gap-2 sm:grid-cols-2">
            {financialMissions.map((m) => (
              <li key={m.id}>
                <Link to="/missions/$id" params={{ id: m.id }} className="block rounded-xl border border-primary/15 bg-primary/5 p-3 hover:bg-primary/10">
                  <p className="font-display text-foreground">{m.name}</p>
                  <Progress value={m.progress} className="mt-2" />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </GlassPanel>

      <GlassPanel eyebrow="Calendar" title="Upcoming Obligations">
        {f.bills.length === 0 ? (
          <p className="text-sm text-muted-foreground">No bills logged.</p>
        ) : (
          <ul className="divide-y divide-primary/10">
            {[...f.bills].sort((a, b) => a.dueDay - b.dueDay).map((b) => (
              <li key={b.id} className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 py-2">
                <span className="hud-text text-primary">Day {b.dueDay}</span>
                <span className="truncate text-foreground">{b.name}</span>
                <span className="font-display text-foreground">${b.amount.toLocaleString()}</span>
              </li>
            ))}
          </ul>
        )}
      </GlassPanel>
    </div>
  );
}

function BillsCard() {
  const { bills, addBill, removeBill } = useFinance();
  const [n, setN] = useState(""); const [a, setA] = useState(""); const [d, setD] = useState("1");
  return (
    <GlassPanel eyebrow="Recurring" title="Bills">
      <div className="grid grid-cols-[1fr_90px_70px_auto] gap-2">
        <Input placeholder="Name" value={n} onChange={(e) => setN(e.target.value)} />
        <Input type="number" placeholder="$" value={a} onChange={(e) => setA(e.target.value)} />
        <Input type="number" placeholder="Day" min={1} max={31} value={d} onChange={(e) => setD(e.target.value)} />
        <Button size="icon" onClick={() => { if (!n || !a) return; addBill({ name: n, amount: +a, dueDay: +d || 1 }); setN(""); setA(""); }}><Plus className="h-4 w-4" /></Button>
      </div>
      <ul className="mt-3 space-y-1.5">
        {bills.map((b) => (
          <li key={b.id} className="grid grid-cols-[auto_minmax(0,1fr)_auto_auto] items-center gap-2 rounded-md border border-primary/10 bg-primary/5 px-2 py-1.5">
            <span className="hud-text text-primary">D{b.dueDay}</span>
            <span className="truncate">{b.name}</span>
            <span className="font-display">${b.amount.toLocaleString()}</span>
            <Button size="icon" variant="ghost" onClick={() => removeBill(b.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
          </li>
        ))}
      </ul>
    </GlassPanel>
  );
}

function IncomeCard() {
  const { incomes, addIncome, removeIncome } = useFinance();
  const [n, setN] = useState(""); const [a, setA] = useState(""); const [c, setC] = useState<"Monthly" | "Weekly" | "Bi-weekly" | "One-time">("Monthly");
  return (
    <GlassPanel eyebrow="Inflow" title="Income / Paychecks">
      <div className="grid grid-cols-[1fr_90px_110px_auto] gap-2">
        <Input placeholder="Source" value={n} onChange={(e) => setN(e.target.value)} />
        <Input type="number" placeholder="$" value={a} onChange={(e) => setA(e.target.value)} />
        <Select value={c} onValueChange={(v) => setC(v as typeof c)}>
          <SelectTrigger className="bg-background/40"><SelectValue /></SelectTrigger>
          <SelectContent>{["Weekly","Bi-weekly","Monthly","One-time"].map((x) => <SelectItem key={x} value={x}>{x}</SelectItem>)}</SelectContent>
        </Select>
        <Button size="icon" onClick={() => { if (!n || !a) return; addIncome({ source: n, amount: +a, cadence: c }); setN(""); setA(""); }}><Plus className="h-4 w-4" /></Button>
      </div>
      <ul className="mt-3 space-y-1.5">
        {incomes.map((i) => (
          <li key={i.id} className="grid grid-cols-[minmax(0,1fr)_auto_auto_auto] items-center gap-2 rounded-md border border-primary/10 bg-primary/5 px-2 py-1.5">
            <span className="truncate">{i.source}</span>
            <span className="hud-text text-primary">{i.cadence}</span>
            <span className="font-display">${i.amount.toLocaleString()}</span>
            <Button size="icon" variant="ghost" onClick={() => removeIncome(i.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
          </li>
        ))}
      </ul>
    </GlassPanel>
  );
}

function DebtsCard() {
  const { debts, addDebt, removeDebt } = useFinance();
  const [n, setN] = useState(""); const [b, setB] = useState("");
  return (
    <GlassPanel eyebrow="Liabilities" title="Debt Accounts">
      <div className="grid grid-cols-[1fr_110px_auto] gap-2">
        <Input placeholder="Account" value={n} onChange={(e) => setN(e.target.value)} />
        <Input type="number" placeholder="Balance" value={b} onChange={(e) => setB(e.target.value)} />
        <Button size="icon" onClick={() => { if (!n || !b) return; addDebt({ name: n, balance: +b }); setN(""); setB(""); }}><Plus className="h-4 w-4" /></Button>
      </div>
      <ul className="mt-3 space-y-1.5">
        {debts.map((d) => (
          <li key={d.id} className="grid grid-cols-[minmax(0,1fr)_auto_auto] items-center gap-2 rounded-md border border-primary/10 bg-primary/5 px-2 py-1.5">
            <span className="truncate">{d.name}</span>
            <span className="font-display">${d.balance.toLocaleString()}</span>
            <Button size="icon" variant="ghost" onClick={() => removeDebt(d.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
          </li>
        ))}
      </ul>
    </GlassPanel>
  );
}

function SavingsCard() {
  const { savings, addSaving, updateSaving, removeSaving } = useFinance();
  const [n, setN] = useState(""); const [t, setT] = useState("");
  return (
    <GlassPanel eyebrow="Future Self" title="Savings Goals">
      <div className="grid grid-cols-[1fr_110px_auto] gap-2">
        <Input placeholder="Goal" value={n} onChange={(e) => setN(e.target.value)} />
        <Input type="number" placeholder="Target $" value={t} onChange={(e) => setT(e.target.value)} />
        <Button size="icon" onClick={() => { if (!n || !t) return; addSaving({ name: n, target: +t, current: 0 }); setN(""); setT(""); }}><Plus className="h-4 w-4" /></Button>
      </div>
      <ul className="mt-3 space-y-2">
        {savings.map((s) => {
          const pct = s.target > 0 ? Math.min(100, (s.current / s.target) * 100) : 0;
          return (
            <li key={s.id} className="rounded-md border border-primary/10 bg-primary/5 px-3 py-2">
              <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2">
                <Label className="truncate">{s.name}</Label>
                <Button size="icon" variant="ghost" onClick={() => removeSaving(s.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
              </div>
              <Progress value={pct} className="mt-2" />
              <div className="mt-1.5 flex items-center justify-between text-xs text-muted-foreground">
                <Input type="number" value={s.current} onChange={(e) => updateSaving(s.id, { current: +e.target.value })} className="h-7 w-28" />
                <span>of ${s.target.toLocaleString()}</span>
              </div>
            </li>
          );
        })}
      </ul>
    </GlassPanel>
  );
}
