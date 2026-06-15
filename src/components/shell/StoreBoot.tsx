import { useEffect } from "react";
import { seedIfEmpty } from "@/lib/seed";
import { useMissions } from "@/stores/missions";
import { useFinance } from "@/stores/finance";
import { useArchive } from "@/stores/archive";
import { useConstitution } from "@/stores/constitution";
import { useMomentum } from "@/stores/momentum";
import { useSettings } from "@/stores/settings";

/**
 * Rehydrates all persisted stores on the client, then seeds defaults
 * on first run. Must mount once, inside the root component.
 */
export function StoreBoot() {
  useEffect(() => {
    // SSR-safe rehydrate of every persisted store.
    Promise.all([
      useMissions.persist.rehydrate(),
      useFinance.persist.rehydrate(),
      useArchive.persist.rehydrate(),
      useConstitution.persist.rehydrate(),
      useMomentum.persist.rehydrate(),
      useSettings.persist.rehydrate(),
    ]).then(() => seedIfEmpty());
  }, []);
  return null;
}
