import { useState } from "react";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useArchive } from "@/stores/archive";
import { useMomentum } from "@/stores/momentum";
import { toast } from "sonner";

export function QuickCapture() {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const addMemory = useArchive((s) => s.addMemory);
  const log = useMomentum((s) => s.log);

  const submit = () => {
    if (!body.trim()) return;
    addMemory({ title: title.trim() || "Untitled signal", body: body.trim(), tags: ["quick-capture"] });
    log("archive", `Captured: ${title.trim() || body.trim().slice(0, 40)}`);
    toast.success("Signal captured to Archive");
    setTitle(""); setBody(""); setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="lg"
          className="fixed right-4 bottom-24 z-40 h-14 w-14 rounded-full p-0 command-glow bg-primary text-primary-foreground hover:bg-primary/90 sm:bottom-28 sm:right-6"
          aria-label="Quick capture"
        >
          <Sparkles className="h-6 w-6" />
        </Button>
      </DialogTrigger>
      <DialogContent className="glass-panel holo-border sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-gradient-cosmic">Quick Capture</DialogTitle>
          <DialogDescription>Drop a signal into the Archive. Refine it later.</DialogDescription>
        </DialogHeader>
        <Input placeholder="Title (optional)" value={title} onChange={(e) => setTitle(e.target.value)} />
        <Textarea
          placeholder="What's the signal?"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={5}
          autoFocus
        />
        <DialogFooter>
          <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={submit}>Transmit</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
