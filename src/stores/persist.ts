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
