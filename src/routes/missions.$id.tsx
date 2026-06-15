import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Check, Plus, Star, Trash2 } from "lucide-react";
import { GlassPanel } from "@/components/shell/GlassPanel";
import { useMissions } from "@/stores/missions";
import { useMomentum } from "@/stores/momentum";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { HEALTH_COLOR, MISSION_HEALTHS, MISSION_STATUSES } from "@/lib/enums";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

export const Route = createFileRoute("/missions/$id")({
  head: ({ params }) => ({
    meta: [
      { title: `Mission · BlueVerse` },
      { name: "description", content: `Mission detail ${params.id}` },
    ],
  }),
  component: MissionDetail,
  notFoundComponent: () => (
    <GlassPanel><p>Mission not found.</p></GlassPanel>
  ),
});

function MissionDetail() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const m = useMissions((s) => s.missions.find((x) => x.id === id));
  const { update, addMilestone, toggleMilestone, addTask, toggleTask, complete, archive, remove } = useMissions();
  const log = useMomentum((s) => s.log);

  const [newMs, setNewMs] = useState("");
  const [newTask, setNewTask] = useState("");
  const [newRisk, setNewRisk] = useState("");

  if (!m) throw notFound();

  const msDone = m.milestones.filter((x) => x.done).length;
  const taskDone = m.tasks.filter((x) => x.done).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button asChild variant="ghost" size="sm">
          <Link to="/missions"><ArrowLeft className="mr-1 h-4 w-4" /> Missions</Link>
        </Button>
        {m.flagship && <Star className="h-4 w-4 text-primary" fill="currentColor" />}
        <Badge variant="outline" className={`bg-background/30 ${HEALTH_COLOR[m.health]}`}>{m.health}</Badge>
        <Badge variant="outline" className="bg-background/30">{m.status}</Badge>
      </div>

      <GlassPanel>
        <Input
          value={m.name}
          onChange={(e) => update(m.id, { name: e.target.value })}
          className="border-none bg-transparent font-display !text-3xl text-gradient-cosmic shadow-none focus-visible:ring-0"
        />
        <p className="hud-text mt-1">{m.missionClass} · {m.difficulty} · {m.domain} · Priority {m.priority}</p>
        <div className="mt-4 grid gap-4 sm:grid-cols-[1fr_auto] sm:items-center">
          <div>
            <Label className="hud-text mb-2 block">Progress · {m.progress}%</Label>
            <Slider value={[m.progress]} onValueChange={([v]) => update(m.id, { progress: v })} max={100} step={1} />
            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-primary/15">
              <div className="h-full bg-gradient-to-r from-primary to-accent" style={{ width: `${m.progress}%` }} />
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <Switch checked={m.flagship} onCheckedChange={(v) => update(m.id, { flagship: v })} id="d-fl" />
              <Label htmlFor="d-fl">Flagship</Label>
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={m.supportingFlagship} onCheckedChange={(v) => update(m.id, { supportingFlagship: v })} id="d-sf" />
              <Label htmlFor="d-sf">Supporting</Label>
            </div>
          </div>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div>
            <Label className="hud-text mb-1 block">Health</Label>
            <Select value={m.health} onValueChange={(v) => update(m.id, { health: v as typeof m.health })}>
              <SelectTrigger className="bg-background/40"><SelectValue /></SelectTrigger>
              <SelectContent>{MISSION_HEALTHS.map((h) => <SelectItem key={h} value={h}>{h}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div>
            <Label className="hud-text mb-1 block">Status</Label>
            <Select value={m.status} onValueChange={(v) => update(m.id, { status: v as typeof m.status })}>
              <SelectTrigger className="bg-background/40"><SelectValue /></SelectTrigger>
              <SelectContent>{MISSION_STATUSES.map((h) => <SelectItem key={h} value={h}>{h}</SelectItem>)}</SelectContent>
            </Select>
          </div>
        </div>
      </GlassPanel>

      <div className="grid gap-6 lg:grid-cols-2">
        <GlassPanel eyebrow="Narrative" title="Mission Story">
          <Textarea rows={4} value={m.story} onChange={(e) => update(m.id, { story: e.target.value })} placeholder="Why this matters." />
        </GlassPanel>
        <GlassPanel eyebrow="Definition of Done" title="Success Criteria">
          <Textarea rows={4} value={m.successCriteria} onChange={(e) => update(m.id, { successCriteria: e.target.value })} placeholder="How you'll know it's complete." />
        </GlassPanel>

        <GlassPanel eyebrow="Beats" title={`Milestones · ${msDone}/${m.milestones.length}`}>
          <ListAdder value={newMs} onChange={setNewMs} onAdd={() => { if (newMs.trim()) { addMilestone(m.id, newMs.trim()); setNewMs(""); } }} placeholder="Add milestone" />
          <ul className="mt-3 space-y-1.5">
            {m.milestones.map((x) => (
              <li key={x.id}>
                <button onClick={() => toggleMilestone(m.id, x.id)} className="flex w-full items-center gap-2 rounded-md px-2 py-1 hover:bg-primary/10">
                  <span className={`flex h-4 w-4 items-center justify-center rounded border ${x.done ? "border-primary bg-primary/30" : "border-primary/40"}`}>
                    {x.done && <Check className="h-3 w-3 text-primary" />}
                  </span>
                  <span className={x.done ? "text-muted-foreground line-through" : "text-foreground"}>{x.title}</span>
                </button>
              </li>
            ))}
          </ul>
        </GlassPanel>

        <GlassPanel eyebrow="Action" title={`Tasks · ${taskDone}/${m.tasks.length}`}>
          <ListAdder value={newTask} onChange={setNewTask} onAdd={() => { if (newTask.trim()) { addTask(m.id, newTask.trim()); setNewTask(""); } }} placeholder="Add task" />
          <ul className="mt-3 space-y-1.5">
            {m.tasks.map((x) => (
              <li key={x.id}>
                <button onClick={() => toggleTask(m.id, x.id)} className="flex w-full items-center gap-2 rounded-md px-2 py-1 hover:bg-primary/10">
                  <span className={`flex h-4 w-4 items-center justify-center rounded border ${x.done ? "border-primary bg-primary/30" : "border-primary/40"}`}>
                    {x.done && <Check className="h-3 w-3 text-primary" />}
                  </span>
                  <span className={x.done ? "text-muted-foreground line-through" : "text-foreground"}>{x.title}</span>
                </button>
              </li>
            ))}
          </ul>
        </GlassPanel>

        <GlassPanel eyebrow="Field Notes" title="Notes">
          <Textarea rows={5} value={m.notes} onChange={(e) => update(m.id, { notes: e.target.value })} placeholder="Captain's log." />
        </GlassPanel>

        <GlassPanel eyebrow="Contingency" title="Recovery Path">
          <Textarea rows={5} value={m.recoveryPath} onChange={(e) => update(m.id, { recoveryPath: e.target.value })} placeholder="If this goes sideways, the way back is…" />
          <p className="mt-2 text-xs text-muted-foreground">{/* future: adaptive */} Navigator will eventually suggest recovery moves here.</p>
        </GlassPanel>

        <GlassPanel eyebrow="Risk Field" title="Risk Indicators" className="lg:col-span-2">
          <ListAdder
            value={newRisk}
            onChange={setNewRisk}
            onAdd={() => { if (newRisk.trim()) { update(m.id, { risks: [...m.risks, newRisk.trim()] }); setNewRisk(""); } }}
            placeholder="Add risk"
          />
          <div className="mt-3 flex flex-wrap gap-2">
            {m.risks.length === 0 && <p className="text-sm text-muted-foreground">No risks flagged.</p>}
            {m.risks.map((r, i) => (
              <Badge key={i} variant="outline" className="bg-destructive/10 text-destructive">{r}</Badge>
            ))}
          </div>
        </GlassPanel>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button onClick={() => { complete(m.id); log("mission", `Completed mission: ${m.name}`); toast.success("Mission complete"); }}>
          Mark Complete
        </Button>
        <Button variant="outline" onClick={() => { archive(m.id); log("mission", `Archived mission: ${m.name}`); toast("Archived"); }}>
          Archive
        </Button>
        <Button variant="destructive" onClick={() => { remove(m.id); log("mission", `Decommissioned: ${m.name}`); navigate({ to: "/missions" }); }}>
          <Trash2 className="mr-1 h-4 w-4" /> Decommission
        </Button>
      </div>
    </div>
  );
}

function ListAdder({ value, onChange, onAdd, placeholder }: { value: string; onChange: (v: string) => void; onAdd: () => void; placeholder: string }) {
  return (
    <div className="flex gap-2">
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); onAdd(); } }}
      />
      <Button size="icon" onClick={onAdd}><Plus className="h-4 w-4" /></Button>
    </div>
  );
}
