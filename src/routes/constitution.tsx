import { createFileRoute } from "@tanstack/react-router";
import { GlassPanel } from "@/components/shell/GlassPanel";
import { AutosaveTextarea } from "@/components/shell/form";
import { useConstitution } from "@/stores/constitution";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/constitution")({
  head: () =>
    pageHead(
      "Personal Constitution · BlueVerse",
      "Your living philosophy: what matters most, your principles, your vision, and the lessons earned.",
      "Write the operating system of your life.",
    ),
  component: ConstitutionPage,
});

function ConstitutionPage() {
  const c = useConstitution();
  const [note, setNote] = useState("");

  return (
    <div className="space-y-6">
      <div>
        <p className="hud-text">Personal Constitution</p>
        <h1 className="font-display text-3xl text-gradient-cosmic sm:text-4xl">
          Living Philosophy
        </h1>
        <p className="text-sm text-muted-foreground">The document that shapes the captain.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Section
          label="What Matters Most"
          value={c.whatMatters}
          onChange={(v) => c.setField("whatMatters", v)}
        />
        <Section
          label="Guiding Principles"
          value={c.principles}
          onChange={(v) => c.setField("principles", v)}
        />
        <Section label="Life Vision" value={c.vision} onChange={(v) => c.setField("vision", v)} />
        <Section
          label="Lessons Learned"
          value={c.lessons}
          onChange={(v) => c.setField("lessons", v)}
        />
      </div>

      <GlassPanel eyebrow="History" title="Revision Log">
        <div className="grid gap-2 sm:grid-cols-[1fr_auto]">
          <Input
            placeholder="Note this revision…"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
          <Button
            onClick={() => {
              if (!note.trim()) return;
              c.pushRevision(note.trim());
              setNote("");
            }}
          >
            Record
          </Button>
        </div>
        <ul className="mt-3 space-y-1.5 text-sm">
          {c.revisions.length === 0 && <li className="text-muted-foreground">No revisions yet.</li>}
          {c.revisions.map((r) => (
            <li
              key={r.id}
              className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-3 rounded-md border border-primary/10 bg-primary/5 px-3 py-1.5"
            >
              <span className="hud-text text-primary">{format(new Date(r.at), "PP")}</span>
              <span className="truncate">{r.summary}</span>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-xs text-muted-foreground">
          {/* future: adaptive */} Full versioning of every constitution edit arrives in a later
          phase.
        </p>
      </GlassPanel>
    </div>
  );
}

function Section({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <GlassPanel eyebrow="Section" title={label}>
      <Label className="sr-only">{label}</Label>
      <AutosaveTextarea
        rows={7}
        value={value}
        onCommit={onChange}
        placeholder={`Write your ${label.toLowerCase()}…`}
      />
    </GlassPanel>
  );
}
