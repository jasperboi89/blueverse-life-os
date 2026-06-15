import { nanoid } from "nanoid";
import { makePersistentStore } from "./persist";
import type { MissionClass, MissionDifficulty, MissionHealth, MissionPriority, MissionStatus, Sector } from "@/lib/enums";

export type Milestone = { id: string; title: string; done: boolean };
export type Task = { id: string; title: string; done: boolean };

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
  flagship: boolean;
  supportingFlagship: boolean;
  story: string;
  successCriteria: string;
  milestones: Milestone[];
  tasks: Task[];
  notes: string;
  recoveryPath: string;
  risks: string[];
  createdAt: string;
  updatedAt: string;
  dueDate?: string;
};

type State = {
  missions: Mission[];
  add: (m: Omit<Mission, "id" | "createdAt" | "updatedAt" | "milestones" | "tasks" | "risks">) => Mission;
  update: (id: string, patch: Partial<Mission>) => void;
  remove: (id: string) => void;
  addMilestone: (id: string, title: string) => void;
  toggleMilestone: (id: string, mid: string) => void;
  addTask: (id: string, title: string) => void;
  toggleTask: (id: string, tid: string) => void;
  complete: (id: string) => void;
  archive: (id: string) => void;
};

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
      createdAt: now,
      updatedAt: now,
    };
    set({ missions: [mission, ...get().missions] });
    return mission;
  },
  update: (id, patch) =>
    set({
      missions: get().missions.map((m) =>
        m.id === id ? { ...m, ...patch, updatedAt: new Date().toISOString() } : m,
      ),
    }),
  remove: (id) => set({ missions: get().missions.filter((m) => m.id !== id) }),
  addMilestone: (id, title) =>
    get().update(id, {
      milestones: [...(get().missions.find((m) => m.id === id)?.milestones ?? []), { id: nanoid(), title, done: false }],
    }),
  toggleMilestone: (id, mid) => {
    const m = get().missions.find((x) => x.id === id);
    if (!m) return;
    get().update(id, { milestones: m.milestones.map((x) => (x.id === mid ? { ...x, done: !x.done } : x)) });
  },
  addTask: (id, title) =>
    get().update(id, {
      tasks: [...(get().missions.find((m) => m.id === id)?.tasks ?? []), { id: nanoid(), title, done: false }],
    }),
  toggleTask: (id, tid) => {
    const m = get().missions.find((x) => x.id === id);
    if (!m) return;
    get().update(id, { tasks: m.tasks.map((x) => (x.id === tid ? { ...x, done: !x.done } : x)) });
  },
  complete: (id) => get().update(id, { status: "Completed", progress: 100, health: "Healthy" }),
  archive: (id) => get().update(id, { status: "Archived" }),
}));
