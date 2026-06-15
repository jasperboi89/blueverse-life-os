import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { GlassPanel } from "@/components/shell/GlassPanel";
import { useArchive } from "@/stores/archive";
import { useMissions } from "@/stores/missions";
import { AUDIO_CAPSULE_TYPES } from "@/lib/enums";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, Upload } from "lucide-react";
import { format } from "date-fns";

export const Route = createFileRoute("/archive")({
  head: () => ({
    meta: [
      { title: "Archive · BlueVerse" },
      { name: "description", content: "Memory capsules, mission chronicles, audio capsules, letters to the future, and the Book of Ages." },
      { property: "og:title", content: "Archive · BlueVerse" },
      { property: "og:description", content: "Preserve the signal of your life." },
    ],
  }),
  component: ArchivePage,
});

function ArchivePage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="hud-text">Archive</p>
        <h1 className="font-display text-3xl text-gradient-cosmic sm:text-4xl">Memory Vault</h1>
        <p className="text-sm text-muted-foreground">Preserve the signal. Build the chronicle.</p>
      </div>

      <Tabs defaultValue="memories">
        <TabsList className="glass-panel holo-border flex w-full flex-wrap gap-1 bg-transparent p-1">
          <TabsTrigger value="memories">Memory Capsules</TabsTrigger>
          <TabsTrigger value="chronicles">Mission Chronicles</TabsTrigger>
          <TabsTrigger value="audio">Audio Capsules</TabsTrigger>
          <TabsTrigger value="letters">Temporal Vault</TabsTrigger>
          <TabsTrigger value="ages">Book of Ages</TabsTrigger>
        </TabsList>

        <TabsContent value="memories" className="mt-4"><MemoriesTab /></TabsContent>
        <TabsContent value="chronicles" className="mt-4"><ChroniclesTab /></TabsContent>
        <TabsContent value="audio" className="mt-4"><AudioTab /></TabsContent>
        <TabsContent value="letters" className="mt-4"><LettersTab /></TabsContent>
        <TabsContent value="ages" className="mt-4"><AgesTab /></TabsContent>
      </Tabs>
    </div>
  );
}

function MemoriesTab() {
  const { memories, addMemory, remove } = useArchive();
  const [title, setTitle] = useState(""); const [body, setBody] = useState("");
  return (
    <GlassPanel eyebrow="Capsule" title="Memory Capsules">
      <div className="grid gap-2 sm:grid-cols-[1fr_auto]">
        <Input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
        <Button onClick={() => { if (!body.trim()) return; addMemory({ title: title || "Untitled", body, tags: [] }); setTitle(""); setBody(""); }}>
          <Plus className="mr-1 h-4 w-4" /> Capsule
        </Button>
      </div>
      <Textarea className="mt-2" rows={3} placeholder="The moment, the feeling, the detail…" value={body} onChange={(e) => setBody(e.target.value)} />
      <ul className="mt-4 grid gap-3 sm:grid-cols-2">
        {memories.map((m) => (
          <li key={m.id} className="rounded-xl border border-primary/15 bg-primary/5 p-3">
            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-2">
              <p className="truncate font-display text-foreground">{m.title}</p>
              <Button variant="ghost" size="sm" onClick={() => remove("memories", m.id)}>Remove</Button>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">{m.body}</p>
            <p className="hud-text mt-2">{format(new Date(m.createdAt), "PPP")}</p>
          </li>
        ))}
      </ul>
    </GlassPanel>
  );
}

function ChroniclesTab() {
  const { chronicles, addChronicle, remove } = useArchive();
  const missions = useMissions((s) => s.missions);
  const [title, setTitle] = useState(""); const [body, setBody] = useState(""); const [missionId, setMissionId] = useState<string>("");
  return (
    <GlassPanel eyebrow="Story" title="Mission Chronicles">
      <div className="grid gap-2 sm:grid-cols-[1fr_220px_auto]">
        <Input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
        <Select value={missionId} onValueChange={setMissionId}>
          <SelectTrigger className="bg-background/40"><SelectValue placeholder="Linked mission (optional)" /></SelectTrigger>
          <SelectContent>{missions.map((m) => <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>)}</SelectContent>
        </Select>
        <Button onClick={() => { if (!body.trim()) return; addChronicle({ title: title || "Chronicle", body, missionId: missionId || undefined }); setTitle(""); setBody(""); setMissionId(""); }}>
          <Plus className="mr-1 h-4 w-4" /> Chronicle
        </Button>
      </div>
      <Textarea className="mt-2" rows={4} placeholder="What happened? What did it cost? What did you learn?" value={body} onChange={(e) => setBody(e.target.value)} />
      <ul className="mt-4 space-y-3">
        {chronicles.map((c) => {
          const m = missions.find((x) => x.id === c.missionId);
          return (
            <li key={c.id} className="rounded-xl border border-primary/15 bg-primary/5 p-3">
              <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-2">
                <p className="truncate font-display text-foreground">{c.title}</p>
                <Button variant="ghost" size="sm" onClick={() => remove("chronicles", c.id)}>Remove</Button>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">{c.body}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {m && <Badge variant="outline">Mission: {m.name}</Badge>}
                <Badge variant="outline" className="bg-background/30">{format(new Date(c.createdAt), "PP")}</Badge>
              </div>
            </li>
          );
        })}
      </ul>
    </GlassPanel>
  );
}

function AudioTab() {
  const { audio, addAudio, updateAudio, remove } = useArchive();
  const missions = useMissions((s) => s.missions);
  const [form, setForm] = useState({
    title: "", type: "Signal Log" as (typeof AUDIO_CAPSULE_TYPES)[number],
    audioUrl: "", transcript: "",
    date: format(new Date(), "yyyy-MM-dd"),
    time: format(new Date(), "HH:mm"),
    weatherSnapshot: "", headlineSnapshot: "",
    linkedMissionId: "", linkedPerson: "", tags: "",
  });

  return (
    <GlassPanel eyebrow="Voice" title="Audio Capsules">
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Title"><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></Field>
        <Field label="Type">
          <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v as typeof form.type })}>
            <SelectTrigger className="bg-background/40"><SelectValue /></SelectTrigger>
            <SelectContent>{AUDIO_CAPSULE_TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
          </Select>
        </Field>
        <Field label="Audio file (placeholder)">
          <div className="flex gap-2">
            <Input value={form.audioUrl} onChange={(e) => setForm({ ...form, audioUrl: e.target.value })} placeholder="paste URL or filename" />
            <Button variant="outline" size="icon" type="button"><Upload className="h-4 w-4" /></Button>
          </div>
        </Field>
        <Field label="Date / Time">
          <div className="grid grid-cols-2 gap-2">
            <Input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
            <Input type="time" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} />
          </div>
        </Field>
        <Field label="Transcript" className="sm:col-span-2">
          <Textarea rows={4} value={form.transcript} onChange={(e) => setForm({ ...form, transcript: e.target.value })} placeholder="Editable transcript. Original is preserved on save." />
        </Field>
        <Field label="Local weather snapshot"><Input value={form.weatherSnapshot} onChange={(e) => setForm({ ...form, weatherSnapshot: e.target.value })} placeholder="e.g. Cold, clear, 6°C" /></Field>
        <Field label="World headline snapshot"><Input value={form.headlineSnapshot} onChange={(e) => setForm({ ...form, headlineSnapshot: e.target.value })} placeholder="What the world was saying" /></Field>
        <Field label="Linked mission">
          <Select value={form.linkedMissionId} onValueChange={(v) => setForm({ ...form, linkedMissionId: v })}>
            <SelectTrigger className="bg-background/40"><SelectValue placeholder="None" /></SelectTrigger>
            <SelectContent>{missions.map((m) => <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>)}</SelectContent>
          </Select>
        </Field>
        <Field label="Linked person"><Input value={form.linkedPerson} onChange={(e) => setForm({ ...form, linkedPerson: e.target.value })} placeholder="Name" /></Field>
        <Field label="Tags (comma separated)" className="sm:col-span-2">
          <Input value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} placeholder="reflection, gratitude, lesson" />
        </Field>
      </div>
      <Button className="mt-3" onClick={() => {
        if (!form.transcript.trim() && !form.title.trim()) return;
        addAudio({
          title: form.title || "Untitled signal",
          type: form.type,
          audioUrl: form.audioUrl || undefined,
          transcript: form.transcript,
          date: form.date, time: form.time,
          weatherSnapshot: form.weatherSnapshot || undefined,
          headlineSnapshot: form.headlineSnapshot || undefined,
          linkedMissionId: form.linkedMissionId || undefined,
          linkedPerson: form.linkedPerson || undefined,
          tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
        });
        setForm({ ...form, title: "", audioUrl: "", transcript: "", weatherSnapshot: "", headlineSnapshot: "", linkedPerson: "", tags: "" });
      }}>
        <Plus className="mr-1 h-4 w-4" /> Capture
      </Button>

      <ul className="mt-6 space-y-3">
        {audio.map((a) => (
          <li key={a.id} className="rounded-xl border border-primary/15 bg-primary/5 p-3">
            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-2">
              <div className="min-w-0">
                <p className="hud-text">{a.type} · {a.date} {a.time}</p>
                <p className="truncate font-display text-foreground">{a.title}</p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => remove("audio", a.id)}>Remove</Button>
            </div>
            <Textarea rows={3} value={a.transcript} onChange={(e) => updateAudio(a.id, { transcript: e.target.value })} className="mt-2" />
            <details className="mt-2 text-xs text-muted-foreground">
              <summary className="cursor-pointer">Original transcript (preserved)</summary>
              <p className="mt-1 whitespace-pre-wrap">{a.originalTranscript}</p>
            </details>
            <div className="mt-2 flex flex-wrap gap-1.5 text-xs">
              {a.weatherSnapshot && <Badge variant="outline">☁ {a.weatherSnapshot}</Badge>}
              {a.headlineSnapshot && <Badge variant="outline">📰 {a.headlineSnapshot}</Badge>}
              {a.linkedPerson && <Badge variant="outline">👤 {a.linkedPerson}</Badge>}
              {a.tags.map((t) => <Badge key={t} variant="outline" className="bg-background/30">#{t}</Badge>)}
            </div>
          </li>
        ))}
      </ul>
    </GlassPanel>
  );
}

function LettersTab() {
  const { letters, addLetter, remove } = useArchive();
  const [title, setTitle] = useState(""); const [body, setBody] = useState(""); const [openDate, setOpenDate] = useState(format(new Date(Date.now() + 1000*60*60*24*365), "yyyy-MM-dd"));
  return (
    <GlassPanel eyebrow="Future Self" title="Temporal Vault Letters">
      <div className="grid gap-2 sm:grid-cols-[1fr_180px_auto]">
        <Input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
        <Input type="date" value={openDate} onChange={(e) => setOpenDate(e.target.value)} />
        <Button onClick={() => { if (!body.trim()) return; addLetter({ title: title || "Letter", body, openDate }); setTitle(""); setBody(""); }}>
          <Plus className="mr-1 h-4 w-4" /> Seal
        </Button>
      </div>
      <Textarea className="mt-2" rows={5} placeholder="To my future self…" value={body} onChange={(e) => setBody(e.target.value)} />
      <ul className="mt-4 space-y-3">
        {letters.map((l) => (
          <li key={l.id} className="rounded-xl border border-primary/15 bg-primary/5 p-3">
            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-2">
              <div className="min-w-0">
                <p className="hud-text">Opens {format(new Date(l.openDate), "PPP")}</p>
                <p className="truncate font-display text-foreground">{l.title}</p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => remove("letters", l.id)}>Remove</Button>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">{l.body}</p>
          </li>
        ))}
      </ul>
    </GlassPanel>
  );
}

function AgesTab() {
  const { ages, addAge, remove } = useArchive();
  const [era, setEra] = useState(""); const [title, setTitle] = useState(""); const [body, setBody] = useState("");
  return (
    <GlassPanel eyebrow="Chronicle" title="Book of Ages">
      <div className="grid gap-2 sm:grid-cols-[160px_1fr_auto]">
        <Input placeholder="Era (e.g. 2026 · Foundations)" value={era} onChange={(e) => setEra(e.target.value)} />
        <Input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
        <Button onClick={() => { if (!body.trim()) return; addAge({ era: era || "Untitled Era", title: title || "Entry", body }); setEra(""); setTitle(""); setBody(""); }}>
          <Plus className="mr-1 h-4 w-4" /> Inscribe
        </Button>
      </div>
      <Textarea className="mt-2" rows={4} placeholder="The arc of this age, in your own hand." value={body} onChange={(e) => setBody(e.target.value)} />
      <ul className="mt-4 space-y-3">
        {ages.map((a) => (
          <li key={a.id} className="rounded-xl border border-primary/15 bg-primary/5 p-3">
            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-2">
              <div className="min-w-0">
                <p className="hud-text">{a.era}</p>
                <p className="truncate font-display text-foreground">{a.title}</p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => remove("ages", a.id)}>Remove</Button>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">{a.body}</p>
          </li>
        ))}
      </ul>
    </GlassPanel>
  );
}

function Field({ label, className, children }: { label: string; className?: string; children: React.ReactNode }) {
  return (
    <div className={className}>
      <Label className="hud-text mb-1 block">{label}</Label>
      {children}
    </div>
  );
}
