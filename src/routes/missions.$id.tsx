import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowLeft,
  Check,
  ChevronDown,
  ChevronRight,
  Plus,
  Sparkles,
  Star,
  Trash2,
  X,
} from "lucide-react";
import { GlassPanel } from "@/components/shell/GlassPanel";
import {
  Field,
  OptionSelect,
  AutosaveInput,
  AutosaveTextarea,
  AutosaveBareInput,
} from "@/components/shell/form";
import { useMissions, RECOVERY_STEP_LABELS, type Mission } from "@/stores/missions";
import { useStoreHydrated } from "@/stores/persist";
import { useMomentum } from "@/stores/momentum";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
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
  HEALTH_COLOR,
  HEALTH_DOT,
  MISSION_CLASS_ACCENT,
  MISSION_CLASSES,
  MISSION_DIFFICULTIES,
  MISSION_HEALTHS,
  MISSION_PRIORITIES,
  MISSION_STATUSES,
  SECTORS,
} from "@/lib/enums";
import { pageHead } from "@/lib/seo";
import { toast } from "sonner";

export const Route = createFileRoute("/missions/$id")({
  head: ({ params }) => pageHead("Mission · BlueVerse", `Mission detail ${params.id}`),
  component: MissionDetail,
  notFoundComponent: () => (
    <GlassPanel>
      <p>Mission not found.</p>
    </GlassPanel>
  ),
});

function MissionDetail() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const hydrated = useStoreHydrated(useMissions);
  const m = useMissions((s) => s.missions.find((x) => x.id === id));
  const {
    update,
    addMilestone,
    updateMilestone,
    removeMilestone,
    toggleMilestone,
    addTask,
    toggleTask,
    complete,
    archive,
    remove,
    setPrimaryFlagship,
    clearPrimaryFlagship,
    setSupportingFlagship,
    clearSupportingFlagship,
    toggleRecoveryStep,
    resetRecoverySteps,
  } = useMissions();
  const log = useMomentum((s) => s.log);

  const [newMs, setNewMs] = useState("");
  const [newMsWeight, setNewMsWeight] = useState(20);
  const [newTask, setNewTask] = useState("");
  const [newRisk, setNewRisk] = useState("");
  const [expandedMs, setExpandedMs] = useState<string | null>(null);

  if (!m) {
    // The store rehydrates from localStorage after mount; don't declare
    // a mission missing until we've actually loaded them.
    if (!hydrated) {
      return (
        <GlassPanel brackets={false} scan={false}>
          <p className="text-sm text-muted-foreground">Retrieving mission…</p>
        </GlassPanel>
      );
    }
    throw notFound();
  }

  const accent = MISSION_CLASS_ACCENT[m.missionClass];
  const msDone = m.milestones.filter((x) => x.done).length;
  const taskDone = m.tasks.filter((x) => x.done).length;
  const nextMs = m.milestones.find((x) => !x.done);
  const recoverySteps = m.recoverySteps ?? [false, false, false, false, false];
  const needsRecovery = m.health === "At Risk" || m.health === "Critical" || m.health === "Dormant";

  return (
    <div className="space-y-6 pb-32">
      <div className="flex items-center gap-3">
        <Button asChild variant="ghost" size="sm">
          <Link to="/missions">
            <ArrowLeft className="mr-1 h-4 w-4" /> Missions
          </Link>
        </Button>
        <Badge variant="outline" className={`bg-background/30 ${HEALTH_COLOR[m.health]}`}>
          <span className={`mr-1 inline-block h-1.5 w-1.5 rounded-full ${HEALTH_DOT[m.health]}`} />
          {m.health}
        </Badge>
        <Badge variant="outline" className="bg-background/30">
          {m.status}
        </Badge>
        <Badge variant="outline" className="bg-background/30">
          Priority · {m.priority}
        </Badge>
      </div>

      {/* MISSION BANNER */}
      <GlassPanel variant="hero" className="!p-0 overflow-hidden">
        <div className={`h-1.5 w-full bg-gradient-to-r ${accent}`} />
        <div className="p-6 sm:p-7">
          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start">
            <div className="min-w-0">
              <p className="hud-text">
                {m.missionClass} · {m.domain} · {m.difficulty}
              </p>
              <AutosaveInput
                key={m.id}
                value={m.name}
                onCommit={(name) => update(m.id, { name })}
                className="mt-1 border-none bg-transparent px-0 font-display !text-3xl text-gradient-cosmic shadow-none focus-visible:ring-0 sm:!text-4xl"
              />
              <div className="mt-2 flex flex-wrap items-center gap-2">
                {m.flagship && (
                  <Badge className="bg-primary/20 text-primary ring-1 ring-primary/40">
                    <Star className="mr-1 h-3 w-3" fill="currentColor" /> Primary Flagship
                  </Badge>
                )}
                {m.supportingFlagship && (
                  <Badge className="bg-accent/20 text-accent ring-1 ring-accent/40">
                    <Star className="mr-1 h-3 w-3" /> Supporting Flagship
                  </Badge>
                )}
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                size="sm"
                variant={m.flagship ? "default" : "outline"}
                onClick={() => (m.flagship ? clearPrimaryFlagship(m.id) : setPrimaryFlagship(m.id))}
                className={m.flagship ? "" : "bg-background/30"}
              >
                <Star className="mr-1 h-3.5 w-3.5" fill={m.flagship ? "currentColor" : "none"} />
                {m.flagship ? "Primary" : "Set Primary"}
              </Button>
              <Button
                size="sm"
                variant={m.supportingFlagship ? "default" : "outline"}
                onClick={() =>
                  m.supportingFlagship ? clearSupportingFlagship(m.id) : setSupportingFlagship(m.id)
                }
                className={m.supportingFlagship ? "" : "bg-background/30"}
              >
                <Star className="mr-1 h-3.5 w-3.5" />
                {m.supportingFlagship ? "Supporting" : "Set Supporting"}
              </Button>
            </div>
          </div>

          {/* Progress */}
          <div className="mt-5">
            <div className="flex items-center justify-between">
              <Label className="hud-text">Progress · {m.progress}%</Label>
              {m.milestones.length > 0 && (
                <span className="text-xs text-muted-foreground">Auto from milestones</span>
              )}
            </div>
            <Slider
              value={[m.progress]}
              onValueChange={([v]) => update(m.id, { progress: v })}
              max={100}
              step={1}
              disabled={m.milestones.length > 0}
              className="mt-2"
            />
            <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-primary/15">
              <div
                className={`h-full bg-gradient-to-r ${accent}`}
                style={{ width: `${m.progress}%` }}
              />
            </div>
          </div>

          {/* Vital stats */}
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Stat label="Progress" value={`${m.progress}%`} />
            <Stat
              label="Health"
              value={
                <span className={`inline-flex items-center gap-1.5 ${HEALTH_COLOR[m.health]}`}>
                  <span
                    className={`inline-block h-1.5 w-1.5 rounded-full ${HEALTH_DOT[m.health]}`}
                  />
                  {m.health}
                </span>
              }
            />
            <Stat label="Status" value={m.status} />
            <Stat
              label="Next milestone"
              value={nextMs ? nextMs.title : m.milestones.length ? "All complete" : "—"}
            />
          </div>

          {/* Inline editors */}
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Field label="Class">
              <OptionSelect
                value={m.missionClass}
                options={MISSION_CLASSES}
                onChange={(v) => update(m.id, { missionClass: v as Mission["missionClass"] })}
              />
            </Field>
            <Field label="Domain">
              <OptionSelect
                value={m.domain}
                options={SECTORS}
                onChange={(v) => update(m.id, { domain: v as Mission["domain"] })}
              />
            </Field>
            <Field label="Difficulty">
              <OptionSelect
                value={m.difficulty}
                options={MISSION_DIFFICULTIES}
                onChange={(v) => update(m.id, { difficulty: v as Mission["difficulty"] })}
              />
            </Field>
            <Field label="Priority">
              <OptionSelect
                value={m.priority}
                options={MISSION_PRIORITIES}
                onChange={(v) => update(m.id, { priority: v as Mission["priority"] })}
              />
            </Field>
            <Field label="Health">
              <OptionSelect
                value={m.health}
                options={MISSION_HEALTHS}
                onChange={(v) => update(m.id, { health: v as Mission["health"] })}
              />
            </Field>
            <Field label="Status">
              <OptionSelect
                value={m.status}
                options={MISSION_STATUSES}
                onChange={(v) => update(m.id, { status: v as Mission["status"] })}
              />
            </Field>
          </div>
        </div>
      </GlassPanel>

      {/* BODY */}
      <div className="grid gap-6 lg:grid-cols-2">
        <GlassPanel eyebrow="Narrative" title="Mission Story">
          <AutosaveTextarea
            key={m.id}
            rows={5}
            value={m.story}
            onCommit={(story) => update(m.id, { story })}
            placeholder="Why this matters, in your voice."
          />
        </GlassPanel>

        <GlassPanel eyebrow="Definition of Done" title="Success Criteria">
          <AutosaveTextarea
            key={m.id}
            rows={5}
            value={m.successCriteria}
            onCommit={(successCriteria) => update(m.id, { successCriteria })}
            placeholder="How you'll know it's complete."
          />
        </GlassPanel>

        {/* MILESTONES */}
        <GlassPanel
          eyebrow="Beats"
          title={`Milestones · ${msDone}/${m.milestones.length}`}
          className="lg:col-span-2"
        >
          <div className="grid gap-2 sm:grid-cols-[1fr_auto_auto]">
            <Input
              value={newMs}
              onChange={(e) => setNewMs(e.target.value)}
              placeholder="Add milestone"
              onKeyDown={(e) => {
                if (e.key === "Enter" && newMs.trim()) {
                  addMilestone(m.id, newMs.trim(), newMsWeight);
                  setNewMs("");
                }
              }}
            />
            <div className="flex items-center gap-2 rounded-md border border-border/40 bg-background/30 px-3">
              <span className="label-text">Weight</span>
              <Input
                type="number"
                min={1}
                max={100}
                value={newMsWeight}
                onChange={(e) =>
                  setNewMsWeight(Math.max(1, Math.min(100, Number(e.target.value) || 0)))
                }
                className="h-8 w-16 border-none bg-transparent px-0 text-right focus-visible:ring-0"
              />
              <span className="text-xs text-muted-foreground">%</span>
            </div>
            <Button
              onClick={() => {
                if (newMs.trim()) {
                  addMilestone(m.id, newMs.trim(), newMsWeight);
                  setNewMs("");
                }
              }}
            >
              <Plus className="mr-1 h-4 w-4" /> Add
            </Button>
          </div>

          <ul className="mt-4 space-y-2">
            {m.milestones.length === 0 && (
              <li className="text-sm text-muted-foreground">
                No milestones yet. Break this mission into beats.
              </li>
            )}
            {m.milestones.map((x) => {
              const isOpen = expandedMs === x.id;
              return (
                <li key={x.id} className="rounded-lg border border-border/40 bg-background/20">
                  <div className="flex items-center gap-2 px-3 py-2">
                    <button
                      onClick={() => toggleMilestone(m.id, x.id)}
                      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border ${x.done ? "border-primary bg-primary/30" : "border-primary/40 hover:bg-primary/10"}`}
                      aria-label="Toggle milestone"
                    >
                      {x.done && <Check className="h-3 w-3 text-primary" />}
                    </button>
                    <AutosaveBareInput
                      value={x.title}
                      onCommit={(title) => updateMilestone(m.id, x.id, { title })}
                      className={`min-w-0 flex-1 bg-transparent text-sm outline-none ${x.done ? "text-muted-foreground line-through" : "text-foreground"}`}
                    />
                    <Badge variant="outline" className="bg-background/30 text-2xs">
                      {x.progressContribution}%
                    </Badge>
                    {x.completedAt && (
                      <span className="hidden text-2xs text-muted-foreground sm:inline">
                        {new Date(x.completedAt).toLocaleDateString()}
                      </span>
                    )}
                    <button
                      onClick={() => setExpandedMs(isOpen ? null : x.id)}
                      className="rounded p-1 text-muted-foreground hover:bg-primary/10 hover:text-foreground"
                      aria-label="Expand milestone"
                    >
                      {isOpen ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </button>
                    <button
                      onClick={() => removeMilestone(m.id, x.id)}
                      className="rounded p-1 text-muted-foreground hover:bg-destructive/20 hover:text-destructive"
                      aria-label="Remove milestone"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  {isOpen && (
                    <div className="space-y-2 border-t border-border/40 px-3 py-3">
                      <Field label="Description">
                        <AutosaveTextarea
                          rows={2}
                          value={x.description ?? ""}
                          onCommit={(description) => updateMilestone(m.id, x.id, { description })}
                          placeholder="What does this beat unlock?"
                        />
                      </Field>
                      <div className="grid gap-2 sm:grid-cols-[1fr_auto]">
                        <div>
                          <Label className="label-text mb-1 block">
                            Progress contribution · {x.progressContribution}%
                          </Label>
                          <Slider
                            value={[x.progressContribution]}
                            onValueChange={([v]) =>
                              updateMilestone(m.id, x.id, { progressContribution: v })
                            }
                            max={100}
                            step={5}
                          />
                        </div>
                        {x.completedAt && (
                          <div className="text-right">
                            <Label className="label-text mb-1 block">Completed</Label>
                            <p className="text-xs text-muted-foreground">
                              {new Date(x.completedAt).toLocaleString()}
                            </p>
                          </div>
                        )}
                      </div>
                      <Field label="Notes">
                        <AutosaveTextarea
                          rows={2}
                          value={x.notes ?? ""}
                          onCommit={(notes) => updateMilestone(m.id, x.id, { notes })}
                          placeholder="Field notes for this beat."
                        />
                      </Field>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </GlassPanel>

        {/* TASKS */}
        <GlassPanel eyebrow="Action" title={`Tasks · ${taskDone}/${m.tasks.length}`}>
          <div className="flex gap-2">
            <Input
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              placeholder="Add task"
              onKeyDown={(e) => {
                if (e.key === "Enter" && newTask.trim()) {
                  addTask(m.id, newTask.trim());
                  setNewTask("");
                }
              }}
            />
            <Button
              size="icon"
              aria-label="Add task"
              onClick={() => {
                if (newTask.trim()) {
                  addTask(m.id, newTask.trim());
                  setNewTask("");
                }
              }}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <ul className="mt-3 space-y-1.5">
            {m.tasks.length === 0 && (
              <li className="text-sm text-muted-foreground">No tasks yet.</li>
            )}
            {m.tasks.map((x) => (
              <li key={x.id}>
                <button
                  onClick={() => toggleTask(m.id, x.id)}
                  className="flex w-full items-center gap-2 rounded-md px-2 py-1 hover:bg-primary/10"
                >
                  <span
                    className={`flex h-4 w-4 items-center justify-center rounded border ${x.done ? "border-primary bg-primary/30" : "border-primary/40"}`}
                  >
                    {x.done && <Check className="h-3 w-3 text-primary" />}
                  </span>
                  <span
                    className={x.done ? "text-muted-foreground line-through" : "text-foreground"}
                  >
                    {x.title}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </GlassPanel>

        {/* NOTES */}
        <GlassPanel eyebrow="Field Notes" title="Notes">
          <AutosaveTextarea
            key={m.id}
            rows={6}
            value={m.notes}
            onCommit={(notes) => update(m.id, { notes })}
            placeholder="Captain's log."
          />
        </GlassPanel>

        {/* RISKS */}
        <GlassPanel eyebrow="Risk Field" title="Risk Indicators" className="lg:col-span-2">
          <div className="flex gap-2">
            <Input
              value={newRisk}
              onChange={(e) => setNewRisk(e.target.value)}
              placeholder="Add risk"
              onKeyDown={(e) => {
                if (e.key === "Enter" && newRisk.trim()) {
                  update(m.id, { risks: [...m.risks, newRisk.trim()] });
                  setNewRisk("");
                }
              }}
            />
            <Button
              size="icon"
              aria-label="Add risk"
              onClick={() => {
                if (newRisk.trim()) {
                  update(m.id, { risks: [...m.risks, newRisk.trim()] });
                  setNewRisk("");
                }
              }}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {m.risks.length === 0 && (
              <p className="text-sm text-muted-foreground">No risks flagged.</p>
            )}
            {m.risks.map((r, i) => (
              <Badge
                key={i}
                variant="outline"
                className="cursor-pointer bg-destructive/10 text-destructive hover:bg-destructive/20"
                onClick={() => update(m.id, { risks: m.risks.filter((_, j) => j !== i) })}
                title="Click to remove"
              >
                {r} <X className="ml-1 h-3 w-3" />
              </Badge>
            ))}
          </div>
        </GlassPanel>

        {/* RECOVERY PATH */}
        <GlassPanel
          eyebrow="Contingency"
          title="Recovery Path"
          className={`lg:col-span-2 ${needsRecovery ? "ring-1 ring-orange-400/40" : ""}`}
        >
          {needsRecovery && (
            <div className="mb-3 flex items-start gap-2 rounded-lg border border-orange-400/30 bg-orange-400/5 px-3 py-2 text-sm text-orange-200">
              <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              <p>
                Mission health is <strong>{m.health}</strong>. Walk the five-step path to resume
                momentum.
              </p>
            </div>
          )}

          <ol className="space-y-2">
            {RECOVERY_STEP_LABELS.map((label, idx) => (
              <li key={idx}>
                <button
                  onClick={() => toggleRecoveryStep(m.id, idx)}
                  className="flex w-full items-center gap-3 rounded-md border border-border/40 bg-background/20 px-3 py-2 text-left transition-colors hover:bg-primary/10"
                >
                  <span
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${recoverySteps[idx] ? "border-primary bg-primary/30" : "border-primary/40"}`}
                  >
                    {recoverySteps[idx] ? (
                      <Check className="h-3 w-3 text-primary" />
                    ) : (
                      <span className="text-2xs text-muted-foreground">{idx + 1}</span>
                    )}
                  </span>
                  <span
                    className={
                      recoverySteps[idx] ? "text-muted-foreground line-through" : "text-foreground"
                    }
                  >
                    {label}
                  </span>
                </button>
              </li>
            ))}
          </ol>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
            <p className="text-xs text-muted-foreground">
              Navigator will tailor this path as it learns your patterns.
            </p>
            <Button size="sm" variant="ghost" onClick={() => resetRecoverySteps(m.id)}>
              Reset path
            </Button>
          </div>

          <div className="mt-3">
            <Field label="Recovery notes">
              <AutosaveTextarea
                key={m.id}
                rows={3}
                value={m.recoveryPath}
                onCommit={(recoveryPath) => update(m.id, { recoveryPath })}
                placeholder="If this goes sideways, the way back is…"
              />
            </Field>
          </div>
        </GlassPanel>
      </div>

      {/* COMPLETION CONTROLS */}
      <GlassPanel brackets={false} scan={false} className="!p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-muted-foreground">
            Created {new Date(m.createdAt).toLocaleDateString()} · Last activity{" "}
            {new Date(m.lastActivityAt ?? m.updatedAt).toLocaleString()}
          </p>
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={() => {
                complete(m.id);
                log("mission", `Completed mission: ${m.name}`);
                toast.success("Mission complete");
              }}
            >
              <Check className="mr-1 h-4 w-4" /> Mark Complete
            </Button>
            <Button
              variant="outline"
              className="bg-background/30"
              onClick={() => {
                archive(m.id);
                log("mission", `Archived mission: ${m.name}`);
                toast("Archived");
              }}
            >
              Archive
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">
                  <Trash2 className="mr-1 h-4 w-4" /> Decommission
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="glass-panel holo-border">
                <AlertDialogHeader>
                  <AlertDialogTitle>Decommission "{m.name}"?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This permanently deletes the mission, its milestones, tasks, and notes. If you
                    just want it out of the way, Archive keeps the record.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => {
                      remove(m.id);
                      log("mission", `Decommissioned: ${m.name}`);
                      navigate({ to: "/missions" });
                    }}
                  >
                    Decommission
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </GlassPanel>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border/40 bg-background/30 p-3">
      <p className="hud-text">{label}</p>
      <p className="mt-1 truncate font-display text-lg text-foreground">{value}</p>
    </div>
  );
}
