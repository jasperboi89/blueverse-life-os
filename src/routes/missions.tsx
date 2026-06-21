import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { GlassPanel } from "@/components/shell/GlassPanel";
import { useMissions, type Mission } from "@/stores/missions";
import { useMomentum } from "@/stores/momentum";
import {
  MISSION_CLASSES, MISSION_DIFFICULTIES, MISSION_HEALTHS, MISSION_PRIORITIES, MISSION_STATUSES, SECTORS,
  HEALTH_COLOR, HEALTH_DOT, MISSION_CLASS_ACCENT,
  type MissionClass, type MissionHealth,
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
import { Archive, CheckCircle2, Flame, Plus, Sparkles, Star, Target } from "lucide-react";
import { toast } from "sonner";

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

type StatusFilter = "Active" | "Flagship" | "All" | "Archived";

function MissionsPage() {
  const missions = useMissions((s) => s.missions);
  const [filter, setFilter] = useState<StatusFilter>("Active");
  const [classFilter, setClassFilter] = useState<MissionClass | "All">("All");
  const [healthFilter, setHealthFilter] = useState<MissionHealth | "All">("All");

  const counts = useMemo(() => {
    const active = missions.filter((m) => m.status === "Active").length;
    const flagship = missions.filter((m) => m.flagship || m.supportingFlagship).length;
    const atRisk = missions.filter((m) => m.health === "At Risk" || m.health === "Critical").length;
    const dormant = missions.filter((m) => m.health === "Dormant").length;
    const hasPrimary = missions.some((m) => m.flagship && m.status !== "Archived");
    const hasCritical = missions.some((m) => m.health === "Critical" && m.status !== "Archived");
    return { active, flagship, atRisk, dormant, hasPrimary, hasCritical };
  }, [missions]);

  const filtered = useMemo(() => {
    let list = missions;
    if (filter === "Flagship") list = list.filter((m) => m.flagship || m.supportingFlagship);
    else if (filter === "Archived") list = list.filter((m) => m.status === "Archived");
    else if (filter === "Active") list = list.filter((m) => m.status === "Active");
    if (classFilter !== "All") list = list.filter((m) => m.missionClass === classFilter);
    if (healthFilter !== "All") list = list.filter((m) => m.health === healthFilter);
    // primary flagship first, then supporting, then active by lastActivity
    return [...list].sort((a, b) => {
      const af = a.flagship ? 0 : a.supportingFlagship ? 1 : 2;
      const bf = b.flagship ? 0 : b.supportingFlagship ? 1 : 2;
      if (af !== bf) return af - bf;
      const at = new Date(a.lastActivityAt ?? a.updatedAt).getTime();
      const bt = new Date(b.lastActivityAt ?? b.updatedAt).getTime();
      return bt - at;
    });
  }, [missions, filter, classFilter, healthFilter]);

  const advisory = useMemo(() => {
    const lines: string[] = [];
    if (counts.active > 5) lines.push(`Captain, ${counts.active} active missions is an overextended fleet. Consider pausing or archiving.`);
    if (!counts.hasPrimary && counts.active > 0) lines.push("No Primary Flagship is set. Choose your North Star mission.");
    if (counts.hasCritical) lines.push("A mission is in Critical health. Open its Recovery Path before it drifts.");
    if (lines.length === 0 && counts.active > 0) lines.push("Fleet posture nominal. Hold the line and keep shipping.");
    if (counts.active === 0) lines.push("No active missions. Declare one to set a course.");
    return lines;
  }, [counts]);

  return (
    <div className="space-y-6 pb-12">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-3">
        <div className="min-w-0">
          <p className="hud-text">Mission Command</p>
          <h1 className="font-display text-3xl text-gradient-cosmic sm:text-4xl">Missions</h1>
          <p className="text-sm text-muted-foreground">Every flagship and supporting mission in one command deck.</p>
        </div>
        <NewMissionDialog />
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatTile label="Active" value={counts.active} icon={<Target className="h-4 w-4" />} />
        <StatTile label="Flagship" value={counts.flagship} icon={<Star className="h-4 w-4" />} />
        <StatTile label="At Risk" value={counts.atRisk} icon={<Flame className="h-4 w-4" />} tone="warn" />
        <StatTile label="Dormant" value={counts.dormant} icon={<Archive className="h-4 w-4" />} tone="mute" />
      </div>

      <GlassPanel eyebrow="Navigator · Advisory" title="Fleet posture" brackets scan>
        <ul className="space-y-1.5">
          {advisory.map((line, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-foreground/90">
              <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
              <span>{line}</span>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-xs text-muted-foreground">Navigator will tailor these calls as it learns your patterns.</p>
      </GlassPanel>

      <div className="flex flex-wrap items-center gap-2">
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
        <span className="mx-1 h-5 w-px bg-border/60" />
        <ChipSelect value={classFilter} onChange={(v) => setClassFilter(v as MissionClass | "All")} options={["All", ...MISSION_CLASSES]} label="Class" />
        <ChipSelect value={healthFilter} onChange={(v) => setHealthFilter(v as MissionHealth | "All")} options={["All", ...MISSION_HEALTHS]} label="Health" />
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

function StatTile({ label, value, icon, tone = "default" }: { label: string; value: number; icon: React.ReactNode; tone?: "default" | "warn" | "mute" }) {
  const accent =
    tone === "warn" ? "text-orange-300" : tone === "mute" ? "text-muted-foreground" : "text-primary";
  return (
    <GlassPanel brackets={false} scan={false} className="!p-4">
      <div className="flex items-center justify-between">
        <p className="hud-text">{label}</p>
        <span className={accent}>{icon}</span>
      </div>
      <p className={`mt-1 font-display text-3xl ${accent}`}>{value}</p>
    </GlassPanel>
  );
}

function ChipSelect({ value, onChange, options, label }: { value: string; onChange: (v: string) => void; options: readonly string[]; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="hud-text">{label}</span>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="h-8 w-[140px] bg-background/40 text-xs"><SelectValue /></SelectTrigger>
        <SelectContent>
          {options.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}
        </SelectContent>
      </Select>
    </div>
  );
}

function timeAgo(iso: string | undefined): string {
  if (!iso) return "—";
  const d = Date.now() - new Date(iso).getTime();
  const m = Math.floor(d / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const days = Math.floor(h / 24);
  if (days < 30) return `${days}d ago`;
  const mo = Math.floor(days / 30);
  return `${mo}mo ago`;
}

function MissionCard({ m }: { m: Mission }) {
  const log = useMomentum((s) => s.log);
  const { complete, archive } = useMissions();
  const nextMs = m.milestones.find((x) => !x.done);
  const lastActivity = m.lastActivityAt ?? m.updatedAt;
  const accent = MISSION_CLASS_ACCENT[m.missionClass];

  return (
    <GlassPanel className="group relative h-full overflow-hidden !p-0">
      <div className={`absolute left-0 top-0 h-full w-1 bg-gradient-to-b ${accent}`} />
      <div className={`absolute inset-x-0 top-0 h-px bg-gradient-to-r ${accent} opacity-70`} />
      <Link to="/missions/$id" params={{ id: m.id }} className="block p-5">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
          <div className="min-w-0">
            <p className="hud-text truncate">{m.missionClass} · {m.domain} · {m.difficulty}</p>
            <h3 className="truncate font-display text-lg text-foreground transition-colors group-hover:text-primary">{m.name}</h3>
          </div>
          <div className="flex shrink-0 items-center gap-1.5">
            {m.flagship && (
              <span title="Primary Flagship" className="rounded-full bg-primary/15 p-1.5 ring-1 ring-primary/40">
                <Star className="h-3.5 w-3.5 text-primary" fill="currentColor" />
              </span>
            )}
            {m.supportingFlagship && (
              <span title="Supporting Flagship" className="rounded-full bg-accent/15 p-1.5 ring-1 ring-accent/40">
                <Star className="h-3.5 w-3.5 text-accent" />
              </span>
            )}
          </div>
        </div>

        <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{m.story || "No story yet — open to draft one."}</p>

        <div className="mt-3 flex items-center justify-between text-xs">
          <span className="hud-text">Progress</span>
          <span className="font-display text-foreground">{m.progress}%</span>
        </div>
        <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-primary/15">
          <div className={`h-full bg-gradient-to-r ${accent}`} style={{ width: `${m.progress}%` }} />
        </div>

        <div className="mt-3 flex flex-wrap gap-1.5">
          <Badge variant="outline" className="bg-background/30 text-[10px]">{m.priority}</Badge>
          <Badge variant="outline" className="bg-background/30 text-[10px]">{m.status}</Badge>
          <Badge variant="outline" className={`bg-background/30 text-[10px] ${HEALTH_COLOR[m.health]}`}>
            <span className={`mr-1 inline-block h-1.5 w-1.5 rounded-full ${HEALTH_DOT[m.health]}`} />
            {m.health}
          </Badge>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
          <div className="min-w-0">
            <p className="hud-text">Next milestone</p>
            <p className="truncate text-foreground/90">{nextMs ? nextMs.title : m.milestones.length ? "All complete" : "—"}</p>
          </div>
          <div className="min-w-0 text-right">
            <p className="hud-text">Last activity</p>
            <p className="truncate text-foreground/90">{timeAgo(lastActivity)}</p>
          </div>
        </div>
      </Link>

      <div className="flex items-center justify-end gap-1.5 border-t border-border/40 bg-background/20 px-3 py-2">
        <Button
          size="sm"
          variant="ghost"
          className="h-7 px-2 text-xs"
          onClick={(e) => { e.preventDefault(); log("mission", `Focus pulse: ${m.name}`); toast("Logged a focus pulse"); }}
        >
          <Flame className="mr-1 h-3.5 w-3.5" /> Focus
        </Button>
        <Button
          size="sm"
          variant="ghost"
          className="h-7 px-2 text-xs"
          onClick={(e) => { e.preventDefault(); complete(m.id); log("mission", `Completed: ${m.name}`); toast.success("Mission complete"); }}
        >
          <CheckCircle2 className="mr-1 h-3.5 w-3.5" /> Complete
        </Button>
        <Button
          size="sm"
          variant="ghost"
          className="h-7 px-2 text-xs"
          onClick={(e) => { e.preventDefault(); archive(m.id); log("mission", `Archived: ${m.name}`); toast("Archived"); }}
        >
          <Archive className="mr-1 h-3.5 w-3.5" /> Archive
        </Button>
      </div>
    </GlassPanel>
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
            <Switch checked={form.flagship} onCheckedChange={(v) => setForm({ ...form, flagship: v, supportingFlagship: v ? false : form.supportingFlagship })} id="fl" />
            <Label htmlFor="fl">Primary Flagship</Label>
          </div>
          <div className="flex items-center gap-3">
            <Switch checked={form.supportingFlagship} onCheckedChange={(v) => setForm({ ...form, supportingFlagship: v, flagship: v ? false : form.flagship })} id="sf" />
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
