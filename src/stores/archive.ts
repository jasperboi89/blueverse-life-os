import { nanoid } from "nanoid";
import { makePersistentStore } from "./persist";
import type { AudioCapsuleType } from "@/lib/enums";

export type MemoryCapsule = {
  id: string;
  title: string;
  body: string;
  createdAt: string;
  tags: string[];
};
export type MissionChronicle = {
  id: string;
  missionId?: string;
  title: string;
  body: string;
  createdAt: string;
};
export type AudioCapsule = {
  id: string;
  title: string;
  type: AudioCapsuleType;
  audioUrl?: string; // placeholder; data URL or file name
  transcript: string; // editable
  originalTranscript: string; // preserved
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  weatherSnapshot?: string; // placeholder text
  headlineSnapshot?: string; // placeholder text
  linkedMissionId?: string;
  linkedPerson?: string;
  tags: string[];
  createdAt: string;
};
export type TemporalLetter = {
  id: string;
  title: string;
  body: string;
  openDate: string;
  createdAt: string;
};
export type BookOfAgesEntry = {
  id: string;
  era: string;
  title: string;
  body: string;
  createdAt: string;
};

type State = {
  memories: MemoryCapsule[];
  chronicles: MissionChronicle[];
  audio: AudioCapsule[];
  letters: TemporalLetter[];
  ages: BookOfAgesEntry[];
  addMemory: (c: Omit<MemoryCapsule, "id" | "createdAt">) => void;
  addChronicle: (c: Omit<MissionChronicle, "id" | "createdAt">) => void;
  addAudio: (c: Omit<AudioCapsule, "id" | "createdAt" | "originalTranscript">) => void;
  updateAudio: (id: string, patch: Partial<AudioCapsule>) => void;
  addLetter: (c: Omit<TemporalLetter, "id" | "createdAt">) => void;
  addAge: (c: Omit<BookOfAgesEntry, "id" | "createdAt">) => void;
  remove: (kind: "memories" | "chronicles" | "audio" | "letters" | "ages", id: string) => void;
};

export const useArchive = makePersistentStore<State>("archive", (set, get) => ({
  memories: [],
  chronicles: [],
  audio: [],
  letters: [],
  ages: [],
  addMemory: (c) =>
    set({
      memories: [{ ...c, id: nanoid(), createdAt: new Date().toISOString() }, ...get().memories],
    }),
  addChronicle: (c) =>
    set({
      chronicles: [
        { ...c, id: nanoid(), createdAt: new Date().toISOString() },
        ...get().chronicles,
      ],
    }),
  addAudio: (c) =>
    set({
      audio: [
        {
          ...c,
          id: nanoid(),
          createdAt: new Date().toISOString(),
          originalTranscript: c.transcript,
        },
        ...get().audio,
      ],
    }),
  updateAudio: (id, patch) =>
    set({ audio: get().audio.map((a) => (a.id === id ? { ...a, ...patch } : a)) }),
  addLetter: (c) =>
    set({
      letters: [{ ...c, id: nanoid(), createdAt: new Date().toISOString() }, ...get().letters],
    }),
  addAge: (c) =>
    set({ ages: [{ ...c, id: nanoid(), createdAt: new Date().toISOString() }, ...get().ages] }),
  remove: (kind, id) =>
    set({
      [kind]: (get()[kind] as Array<{ id: string }>).filter((x) => x.id !== id),
    } as Partial<State>),
}));
