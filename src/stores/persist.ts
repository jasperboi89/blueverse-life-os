import { useSyncExternalStore } from "react";
import { create, type StateCreator } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

// Safe storage: SSR-friendly, falls back to no-op on the server.
const isBrowser = typeof window !== "undefined";

export function makePersistentStore<T>(
  name: string,
  initializer: StateCreator<T, [], [["zustand/persist", unknown]]>,
) {
  return create<T>()(
    persist(initializer, {
      name: `blueverse:${name}`,
      storage: createJSONStorage(() =>
        isBrowser ? window.localStorage : (undefined as unknown as Storage),
      ),
      skipHydration: !isBrowser,
    }),
  );
}

type PersistedStore = {
  persist: {
    hasHydrated: () => boolean;
    onFinishHydration: (fn: () => void) => () => void;
  };
};

/**
 * True once the store has been rehydrated from localStorage (StoreBoot
 * triggers this after mount). Lets views distinguish "still loading"
 * from "genuinely empty" — always false during SSR.
 */
export function useStoreHydrated(store: PersistedStore) {
  return useSyncExternalStore(
    (onChange) => store.persist.onFinishHydration(onChange),
    () => store.persist.hasHydrated(),
    () => false,
  );
}
