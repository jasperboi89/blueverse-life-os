import { createFileRoute } from "@tanstack/react-router";
import { GlassPanel } from "@/components/shell/GlassPanel";
import { Field } from "@/components/shell/form";
import { useSettings } from "@/stores/settings";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/settings")({
  head: () =>
    pageHead(
      "Settings · BlueVerse",
      "Configure your Navigator, call sign, and daily focus signal.",
      "Tune the bridge.",
    ),
  component: SettingsPage,
});

function SettingsPage() {
  const { navigatorName, callSign, focusScore, setNavigatorName, setCallSign, setFocusScore } =
    useSettings();

  const clearAll = () => {
    if (typeof window === "undefined") return;
    if (!confirm("Wipe all BlueVerse local data?")) return;
    Object.keys(window.localStorage)
      .filter((k) => k.startsWith("blueverse:"))
      .forEach((k) => window.localStorage.removeItem(k));
    window.location.reload();
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="hud-text">Settings</p>
        <h1 className="font-display text-3xl text-gradient-cosmic sm:text-4xl">
          Bridge Configuration
        </h1>
      </div>

      <GlassPanel eyebrow="Identity" title="Captain & Navigator">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Call sign">
            <Input value={callSign} onChange={(e) => setCallSign(e.target.value)} />
          </Field>
          <Field label="Navigator name">
            <Input value={navigatorName} onChange={(e) => setNavigatorName(e.target.value)} />
          </Field>
        </div>
      </GlassPanel>

      <GlassPanel eyebrow="Signal" title={`Focus · ${focusScore}`}>
        <Slider value={[focusScore]} onValueChange={([v]) => setFocusScore(v)} max={100} step={1} />
        <p className="mt-2 text-xs text-muted-foreground">
          Your manual read on today's focus. Drives the Bridge Focus ring.
        </p>
      </GlassPanel>

      <GlassPanel eyebrow="Danger zone" title="Local Data">
        <p className="text-sm text-muted-foreground mb-3">
          All data is currently stored on this device. Resetting wipes missions, finance, archive,
          and constitution.
        </p>
        <Button variant="destructive" onClick={clearAll}>
          Wipe local data
        </Button>
      </GlassPanel>
    </div>
  );
}
