import { nanoid } from "nanoid";
import { makePersistentStore } from "./persist";

export type MomentumEvent = {
  id: string;
  at: string;
  kind: "mission" | "finance" | "archive" | "constitution" | "system";
  text: string;
};

type State = {
  events: MomentumEvent[];
  log: (kind: MomentumEvent["kind"], text: string) => void;
  clear: () => void;
};

export const useMomentum = makePersistentStore<State>("momentum", (set, get) => ({
  events: [],
  log: (kind, text) =>
    set({ events: [{ id: nanoid(), at: new Date().toISOString(), kind, text }, ...get().events].slice(0, 200) }),
  clear: () => set({ events: [] }),
}));
