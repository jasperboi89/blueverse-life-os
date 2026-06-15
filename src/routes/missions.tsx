import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { GlassPanel } from "@/components/shell/GlassPanel";
import { useMissions, type Mission } from "@/stores/missions";
import { useMomentum } from "@/stores/momentum";
import {
  MISSION_CLASSES, MISSION_DIFFICULTIES, MISSION_HEALTHS, MISSION_PRIORITIES, MISSION_STATUSES, SECTORS,
  HEALTH_COLOR,
} from "@/lib/enums";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Plus, Star } from "lucide-react";

export const Route = createFileRoute("/missions")({
  head: () => ({
    meta: [
      { title: "Mission Command · BlueVerse" },
      { name: "description", content: "Declare, track, and complete the missions that shape your life." },
      { property: "og:title", content: "Mission Command · BlueVerse" },
      { property: "og:description", content: "Every flagship and supporting mission in one command deck." },
    ],
  }),
  component: MissionsPage,
});

function MissionsPage() {
  const missions = useMissions((s) => s.missions);
  const [filter, setFilter] = useState<"All" | "Active" | "Flagship" | "Archived">("Active");

  const filtered = useMemo(() => {
    if (filter === "All") return missions;
    if (filter === "Flagship") return missions.filter((m) => m.flagship);
    if (filter === "Archived") return missions.filter((m) => m.status === "Archived");
    return missions.filter((m) => m.status === "Active");
  }, [missions, filter]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-3">
        <div className="min-w-0">
          <p className="hud-text">Mission Command</p>
          <h1 className="font-display text-3xl text-gradient-cosmic sm:text-4xl">Missions</h1>
          <p className="text-sm text-muted-foreground">The missions that shape this era of your life.</p>
        </div>
        <NewMissionDialog />
      </div>

      <div className="flex flex-wrap gap-2">
        {(["Active", "Flagship", "All", "Archived"] as const).map((f) => (
          <Button
            key={f}
            variant={filter === f ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter(f)}
            className={filter === f ? "" : "bg-background/30"}
          >
            {f}
          </Button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <GlassPanel>
          <p className="text-sm text-muted-foreground">No missions in this view. Declare one.</p>
        </GlassPanel>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((m) => <MissionCard key={m.id} m={m} />)}
        </div>
      )}
    </div>
  );
}

function MissionCard({ m }: { m: Mission }) {
  return (
    <Link to="/missions/$id" params={{ id: m.id }} className="group">
      <GlassPanel className="h-full transition-transform group-hover:-translate-y-0.5">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
          <div className="min-w-0">
            <p className="hud-text">{m.missionClass} · {m.domain}</p>
            <h3 className="truncate font-display text-lg text-foreground">{m.name}</h3>
          </div>
          {m.flagship && <Star className="h-4 w-4 shrink-0 text-primary" fill="currentColor" />}
        </div>
        <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{m.story || "No story yet."}</p>
        <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-primary/15">
          <div className="h-full bg-gradient-to-r from-primary to-accent" style={{ width: `${m.progress}%` }} />
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          <Badge variant="outline" className="bg-background/30">{m.difficulty}</Badge>
          <Badge variant="outline" className="bg-background/30">{m.status}</Badge>
          <Badge variant="outline" className={`bg-background/30 ${HEALTH_COLOR[m.health]}`}>{m.health}</Badge>
        </div>
      </GlassPanel>
    </Link>
  );
}

function NewMissionDialog() {
  const add = useMissions((s) => s.add);
  const log = useMomentum((s) => s.log);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    domain: "Work" as (typeof SECTORS)[number],
    missionClass: "Project" as (typeof MISSION_CLASSES)[number],
    difficulty: "Focused" as (typeof MISSION_DIFFICULTIES)[number],
    priority: "Medium" as (typeof MISSION_PRIORITIES)[number],
    status: "Active" as (typeof MISSION_STATUSES)[number],
    health: "Healthy" as (typeof MISSION_HEALTHS)[number],
    progress: 0,
    flagship: false,
    supportingFlagship: false,
    story: "",
    successCriteria: "",
    notes: "",
    recoveryPath: "",
  });

  const submit = () => {
    if (!form.name.trim()) return;
    const m = add(form);
    log("mission", `Declared mission: ${m.name}`);
    setOpen(false);
    setForm({ ...form, name: "", story: "", successCriteria: "", notes: "" });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="shrink-0"><Plus className="mr-1 h-4 w-4" /> New Mission</Button>
      </DialogTrigger>
      <DialogContent className="glass-panel holo-border max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-gradient-cosmic">Declare a Mission</DialogTitle>
          <DialogDescription>Name it, scope it, commit to it.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Mission Name" className="sm:col-span-2">
            <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Ship BlueVerse v1" />
          </Field>
          <Field label="Domain">
            <SimpleSelect value={form.domain} onChange={(v) => setForm({ ...form, domain: v as typeof form.domain })} options={SECTORS} />
          </Field>
          <Field label="Class">
            <SimpleSelect value={form.missionClass} onChange={(v) => setForm({ ...form, missionClass: v as typeof form.missionClass })} options={MISSION_CLASSES} />
          </Field>
          <Field label="Difficulty">
            <SimpleSelect value={form.difficulty} onChange={(v) => setForm({ ...form, difficulty: v as typeof form.difficulty })} options={MISSION_DIFFICULTIES} />
          </Field>
          <Field label="Priority">
            <SimpleSelect value={form.priority} onChange={(v) => setForm({ ...form, priority: v as typeof form.priority })} options={MISSION_PRIORITIES} />
          </Field>
          <Field label="Status">
            <SimpleSelect value={form.status} onChange={(v) => setForm({ ...form, status: v as typeof form.status })} options={MISSION_STATUSES} />
          </Field>
          <Field label="Health">
            <SimpleSelect value={form.health} onChange={(v) => setForm({ ...form, health: v as typeof form.health })} options={MISSION_HEALTHS} />
          </Field>
          <div className="flex items-center gap-3">
            <Switch checked={form.flagship} onCheckedChange={(v) => setForm({ ...form, flagship: v })} id="fl" />
            <Label htmlFor="fl">Flagship</Label>
          </div>
          <div className="flex items-center gap-3">
            <Switch checked={form.supportingFlagship} onCheckedChange={(v) => setForm({ ...form, supportingFlagship: v })} id="sf" />
            <Label htmlFor="sf">Supporting flagship</Label>
          </div>
          <Field label="Mission Story" className="sm:col-span-2">
            <Textarea rows={3} value={form.story} onChange={(e) => setForm({ ...form, story: e.target.value })} placeholder="Why this mission, in your own voice." />
          </Field>
          <Field label="Success Criteria" className="sm:col-span-2">
            <Textarea rows={2} value={form.successCriteria} onChange={(e) => setForm({ ...form, successCriteria: e.target.value })} placeholder="How will you know it's complete?" />
          </Field>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={submit}>Declare</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function Field({ label, className, children }: { label: string; className?: string; children: React.ReactNode }) {
  return (
    <div className={className}>
      <Label className="hud-text mb-1 block">{label}</Label>
      {children}
    </div>
  );
}

function SimpleSelect({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: readonly string[] }) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="bg-background/40"><SelectValue /></SelectTrigger>
      <SelectContent>
        {options.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}
      </SelectContent>
    </Select>
  );
}
