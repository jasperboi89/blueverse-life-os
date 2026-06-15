import { makePersistentStore } from "./persist";

type State = {
  navigatorName: string;
  callSign: string;
  focusScore: number; // 0-100, manual
  setNavigatorName: (n: string) => void;
  setCallSign: (n: string) => void;
  setFocusScore: (n: number) => void;
};

export const useSettings = makePersistentStore<State>("settings", (set) => ({
  navigatorName: "Liam",
  callSign: "Captain",
  focusScore: 72,
  setNavigatorName: (navigatorName) => set({ navigatorName }),
  setCallSign: (callSign) => set({ callSign }),
  setFocusScore: (focusScore) => set({ focusScore }),
}));
