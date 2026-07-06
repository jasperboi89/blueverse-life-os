import { nanoid } from "nanoid";
import { makePersistentStore } from "./persist";
import type {
  MissionClass,
  MissionDifficulty,
  MissionHealth,
  MissionPriority,
  MissionStatus,
  Sector,
} from "@/lib/enums";

export type Milestone = {
  id: string;
  title: string;
  description?: string;
  done: boolean;
  progressContribution: number; // 0-100, weight in mission progress
  completedAt?: string;
  notes?: string;
};

export type Task = { id: string; title: string; done: boolean };

export type RecoverySteps = [boolean, boolean, boolean, boolean, boolean];

export const RECOVERY_STEP_LABELS = [
  "Review mission story",
  "Pick one small next task",
  "Start a 15-minute focus session",
  "Update progress",
  "Resume momentum",
] as const;

export type Mission = {
  id: string;
  name: string;
  domain: Sector;
  missionClass: MissionClass;
  difficulty: MissionDifficulty;
  priority: MissionPriority;
  status: MissionStatus;
  progress: number; // 0-100
  health: MissionHealth;
  flagship: boolean; // primary flagship
  supportingFlagship: boolean;
  story: string;
  successCriteria: string;
  milestones: Milestone[];
  tasks: Task[];
  notes: string;
  recoveryPath: string;
  recoverySteps: RecoverySteps;
  risks: string[];
  createdAt: string;
  updatedAt: string;
  lastActivityAt: string;
  dueDate?: string;
};

type AddInput = Omit<
  Mission,
  | "id"
  | "createdAt"
  | "updatedAt"
  | "lastActivityAt"
  | "milestones"
  | "tasks"
  | "risks"
  | "recoverySteps"
>;

type State = {
  missions: Mission[];
  add: (m: AddInput) => Mission;
  update: (id: string, patch: Partial<Mission>) => void;
  remove: (id: string) => void;
  addMilestone: (id: string, title: string, contribution?: number) => void;
  updateMilestone: (id: string, mid: string, patch: Partial<Milestone>) => void;
  removeMilestone: (id: string, mid: string) => void;
  toggleMilestone: (id: string, mid: string) => void;
  addTask: (id: string, title: string) => void;
  toggleTask: (id: string, tid: string) => void;
  setPrimaryFlagship: (id: string) => void;
  setSupportingFlagship: (id: string) => void;
  clearPrimaryFlagship: (id: string) => void;
  clearSupportingFlagship: (id: string) => void;
  toggleRecoveryStep: (id: string, idx: number) => void;
  resetRecoverySteps: (id: string) => void;
  complete: (id: string) => void;
  archive: (id: string) => void;
};

/** Missions currently in the "Active" status. */
export const activeMissions = (missions: Mission[]) =>
  missions.filter((m) => m.status === "Active");

/** The primary flagship (highest-progress, non-archived), or undefined. */
export const flagshipMission = (missions: Mission[]) =>
  missions
    .filter((m) => m.flagship && m.status !== "Archived")
    .sort((a, b) => b.progress - a.progress)[0];

const emptyRecovery = (): RecoverySteps => [false, false, false, false, false];

function recomputeProgress(milestones: Milestone[], fallback: number): number {
  if (milestones.length === 0) return fallback;
  const total = milestones.reduce((s, x) => s + (x.progressContribution || 0), 0);
  if (total <= 0) {
    const done = milestones.filter((x) => x.done).length;
    return Math.round((done / milestones.length) * 100);
  }
  const earned = milestones.reduce((s, x) => s + (x.done ? x.progressContribution || 0 : 0), 0);
  return Math.min(100, Math.round((earned / total) * 100));
}

export const useMissions = makePersistentStore<State>("missions", (set, get) => ({
  missions: [],
  add: (m) => {
    const now = new Date().toISOString();
    const mission: Mission = {
      ...m,
      id: nanoid(),
      milestones: [],
      tasks: [],
      risks: [],
      recoverySteps: emptyRecovery(),
      createdAt: now,
      updatedAt: now,
      lastActivityAt: now,
    };
    let next = [mission, ...get().missions];
    if (mission.flagship)
      next = next.map((x) => (x.id === mission.id ? x : { ...x, flagship: false }));
    if (mission.supportingFlagship)
      next = next.map((x) => (x.id === mission.id ? x : { ...x, supportingFlagship: false }));
    set({ missions: next });
    return mission;
  },
  update: (id, patch) =>
    set({
      missions: get().missions.map((m) =>
        m.id === id
          ? {
              ...m,
              ...patch,
              updatedAt: new Date().toISOString(),
              lastActivityAt: new Date().toISOString(),
            }
          : m,
      ),
    }),
  remove: (id) => set({ missions: get().missions.filter((m) => m.id !== id) }),

  addMilestone: (id, title, contribution = 20) => {
    const m = get().missions.find((x) => x.id === id);
    if (!m) return;
    const milestones = [
      ...m.milestones,
      { id: nanoid(), title, done: false, progressContribution: contribution },
    ];
    get().update(id, { milestones, progress: recomputeProgress(milestones, m.progress) });
  },
  updateMilestone: (id, mid, patch) => {
    const m = get().missions.find((x) => x.id === id);
    if (!m) return;
    const milestones = m.milestones.map((x) => (x.id === mid ? { ...x, ...patch } : x));
    get().update(id, { milestones, progress: recomputeProgress(milestones, m.progress) });
  },
  removeMilestone: (id, mid) => {
    const m = get().missions.find((x) => x.id === id);
    if (!m) return;
    const milestones = m.milestones.filter((x) => x.id !== mid);
    get().update(id, { milestones, progress: recomputeProgress(milestones, m.progress) });
  },
  toggleMilestone: (id, mid) => {
    const m = get().missions.find((x) => x.id === id);
    if (!m) return;
    const milestones = m.milestones.map((x) =>
      x.id === mid
        ? { ...x, done: !x.done, completedAt: !x.done ? new Date().toISOString() : undefined }
        : x,
    );
    get().update(id, { milestones, progress: recomputeProgress(milestones, m.progress) });
  },

  addTask: (id, title) => {
    const m = get().missions.find((x) => x.id === id);
    if (!m) return;
    get().update(id, { tasks: [...m.tasks, { id: nanoid(), title, done: false }] });
  },
  toggleTask: (id, tid) => {
    const m = get().missions.find((x) => x.id === id);
    if (!m) return;
    get().update(id, { tasks: m.tasks.map((x) => (x.id === tid ? { ...x, done: !x.done } : x)) });
  },

  setPrimaryFlagship: (id) =>
    set({
      missions: get().missions.map((m) => ({
        ...m,
        flagship: m.id === id,
        // primary should not also be supporting
        supportingFlagship: m.id === id ? false : m.supportingFlagship,
        updatedAt: m.id === id ? new Date().toISOString() : m.updatedAt,
      })),
    }),
  setSupportingFlagship: (id) =>
    set({
      missions: get().missions.map((m) => ({
        ...m,
        supportingFlagship: m.id === id,
        flagship: m.id === id ? false : m.flagship,
        updatedAt: m.id === id ? new Date().toISOString() : m.updatedAt,
      })),
    }),
  clearPrimaryFlagship: (id) => get().update(id, { flagship: false }),
  clearSupportingFlagship: (id) => get().update(id, { supportingFlagship: false }),

  toggleRecoveryStep: (id, idx) => {
    const m = get().missions.find((x) => x.id === id);
    if (!m) return;
    const steps = [...(m.recoverySteps ?? emptyRecovery())] as RecoverySteps;
    steps[idx] = !steps[idx];
    get().update(id, { recoverySteps: steps });
  },
  resetRecoverySteps: (id) => get().update(id, { recoverySteps: emptyRecovery() }),

  complete: (id) => get().update(id, { status: "Completed", progress: 100, health: "Healthy" }),
  archive: (id) => get().update(id, { status: "Archived" }),
}));
