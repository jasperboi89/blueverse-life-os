import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import type { ComponentProps, ReactNode } from "react";

/** Stacked label + control, the standard form row across the app. */
export function Field({
  label,
  className,
  children,
}: {
  label: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={className}>
      <Label className="label-text mb-1 block">{label}</Label>
      {children}
    </div>
  );
}

/** Plain string-option Select. `className` styles the trigger. */
export function OptionSelect({
  value,
  onChange,
  options,
  placeholder,
  className,
}: {
  value: string;
  onChange: (v: string) => void;
  options: readonly string[];
  placeholder?: string;
  className?: string;
}) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className={cn("bg-background/40", className)}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((o) => (
          <SelectItem key={o} value={o}>
            {o}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

/** Icon + title + hint + optional CTA link, for empty panels. */
export function EmptyState({
  icon,
  title,
  hint,
  cta,
}: {
  icon: ReactNode;
  title: string;
  hint: string;
  cta?: { to: string; label: string };
}) {
  return (
    <div className="flex flex-col items-start gap-3 py-2">
      <div className="flex h-10 w-10 items-center justify-center rounded-full border border-primary/25 bg-primary/10">
        {icon}
      </div>
      <p className="font-display text-base text-foreground">{title}</p>
      <p className="text-sm text-muted-foreground">{hint}</p>
      {cta && (
        <Link
          to={cta.to}
          className="mt-1 inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
        >
          {cta.label} <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      )}
    </div>
  );
}

/**
 * Local draft that commits after a pause in typing (and on blur), so
 * persisted stores aren't re-serialized to localStorage on every keystroke.
 */
function useAutosave(value: string, onCommit: (v: string) => void, delay = 600) {
  const [draft, setDraft] = useState(value);
  const commitRef = useRef(onCommit);
  commitRef.current = onCommit;
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const set = (v: string) => {
    setDraft(v);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => commitRef.current(v), delay);
  };
  const flush = () => {
    window.clearTimeout(timer.current);
    if (draft !== value) commitRef.current(draft);
  };
  return { draft, set, flush };
}

type AutosaveProps = { value: string; onCommit: (v: string) => void };

export function AutosaveInput({
  value,
  onCommit,
  ...props
}: AutosaveProps & Omit<ComponentProps<typeof Input>, "value" | "onChange" | "onBlur">) {
  const { draft, set, flush } = useAutosave(value, onCommit);
  return <Input value={draft} onChange={(e) => set(e.target.value)} onBlur={flush} {...props} />;
}

export function AutosaveTextarea({
  value,
  onCommit,
  ...props
}: AutosaveProps & Omit<ComponentProps<typeof Textarea>, "value" | "onChange" | "onBlur">) {
  const { draft, set, flush } = useAutosave(value, onCommit);
  return <Textarea value={draft} onChange={(e) => set(e.target.value)} onBlur={flush} {...props} />;
}

/** Bare autosaving <input>, for inline editable text like milestone titles. */
export function AutosaveBareInput({
  value,
  onCommit,
  ...props
}: AutosaveProps & Omit<ComponentProps<"input">, "value" | "onChange" | "onBlur">) {
  const { draft, set, flush } = useAutosave(value, onCommit);
  return <input value={draft} onChange={(e) => set(e.target.value)} onBlur={flush} {...props} />;
}
