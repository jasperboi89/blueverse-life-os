import { nanoid } from "nanoid";
import { makePersistentStore } from "./persist";

export type Revision = { id: string; at: string; summary: string };

type State = {
  whatMatters: string;
  principles: string;
  vision: string;
  lessons: string;
  revisions: Revision[];
  setField: (field: "whatMatters" | "principles" | "vision" | "lessons", value: string) => void;
  pushRevision: (summary: string) => void;
};

export const useConstitution = makePersistentStore<State>("constitution", (set, get) => ({
  whatMatters: "",
  principles: "",
  vision: "",
  lessons: "",
  revisions: [],
  setField: (field, value) => set({ [field]: value } as Partial<State>),
  pushRevision: (summary) =>
    set({
      revisions: [
        { id: nanoid(), at: new Date().toISOString(), summary },
        ...get().revisions,
      ].slice(0, 50),
    }),
}));
