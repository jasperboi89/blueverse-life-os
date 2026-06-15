
# BlueVerse Life OS — MVP Plan

A cinematic "starship bridge" personal operating system. This plan builds the full MVP foundation: shell, design system, navigation, all six primary sections, and persistent storage. Advanced AI behaviors are stubbed as future-ready placeholders.

## 1. Design System & Atmosphere

Deep cosmic blue / cyan / violet glassmorphism, set in `src/styles.css`:

- Tokens: `--background` (near-black cosmic indigo), `--foreground` (soft starlight), `--primary` (electric cyan), `--accent` (violet), `--card` (translucent glass), plus `--glow-primary`, `--gradient-nebula`, `--shadow-holo`.
- Custom utilities: `.glass-panel`, `.holo-border`, `.command-glow`, `.hud-text`.
- Typography pair: display = **Orbitron** (HUD headings), body = **Inter** (loaded via `<link>` in `__root.tsx`, NOT `@import` in CSS).
- Background: animated nebula layer (CSS gradients + slow drifting blurred radial blobs) + a lightweight canvas particle field component (`<NebulaField />`). No heavy WebGL.
- Motion: framer-motion for panel mount/fade, subtle pulse on the Command Core, dock item hover.

## 2. App Shell & Navigation

`src/routes/__root.tsx` wraps everything with:

- `<NebulaBackground />` fixed layer
- `<NavigatorPresence />` floating top-right (avatar placeholder, calm status line)
- `<CommandDock />` — adaptive dock (bottom on desktop, collapsible bottom-sheet on mobile) with stable destinations:
  Bridge · Missions · Finance · Timeline · Knowledge · Communications · Observatory · Archive · Constitution · Settings
- `<Outlet />` in a glass content frame
- `<QuickCaptureButton />` global FAB

Routes created under `src/routes/`:

```
index.tsx              -> /          (Bridge)
missions.tsx           -> /missions  (list + create)
missions.$id.tsx       -> mission detail
finance.tsx            -> /finance
timeline.tsx           -> /timeline  (placeholder w/ momentum feed)
knowledge.tsx          -> /knowledge (placeholder)
communications.tsx     -> /communications (placeholder)
observatory.tsx        -> /observatory
archive.tsx            -> /archive
archive.$id.tsx        -> capsule detail
constitution.tsx       -> /constitution
settings.tsx           -> /settings
```

Each route gets its own `head()` with unique title + description. Every route has `errorComponent` + `notFoundComponent`.

## 3. Section Contents

**Bridge (`/`)** — cinematic cockpit grid:
- Central **Vessel + Dynamic Command Core** (animated SVG/CSS orb that pulses to overall Mission Progress)
- Three core metric rings: Mission Progress, Financial Health, Focus
- Navigator presence panel (avatar placeholder, greeting, daily signal line — placeholder for adaptive briefing)
- Active Missions preview (top 3 flagship/in-progress)
- Financial snapshot (weather + net flow)
- Timeline preview (recent events)
- Momentum feed (recent progress entries)
- Quick Capture button

**Mission Command (`/missions`)** — list grid + "New Mission" dialog + detail page with every field listed: name, domain, class, difficulty, priority, status, progress %, health, flagship toggle, supporting-flagship toggle, story, success criteria, milestones (sub-list), tasks (sub-list w/ check), notes, recovery path section (placeholder editor), risk indicators (auto from health + due dates), complete/archive actions. Enums implemented for classes, difficulty, health.

**Financial Command (`/finance`)** — manual-first. Cards for: Financial Health status, Financial Weather selector (Clear→Storm with themed gradients), Bills, Income/Paychecks, Debt Accounts, Savings Goals, Financial Missions (filtered missions w/ class=Financial), Forecast cards (placeholder), Upcoming Obligations (auto from bills).

**Observatory (`/observatory`)** — visual overview:
- Vessel render (shared with Bridge, larger)
- 8 sector tiles (Work, Finance, Growth, Creative, Wellbeing, Personal, Relationships, Archive) with domain level bars
- Active missions constellation (simple SVG node map)
- Legacy banner placeholders
- Simplified universe map (decorative SVG)

**Archive (`/archive`)** — tabs for Memory Capsules, Mission Chronicles, Audio Capsules, Temporal Vault Letters, Book of Ages. Audio Capsule form covers all listed fields (title, type enum, audio upload placeholder, transcript + editable transcript + preserved original, date, time, weather snapshot, headline snapshot, linked mission, linked person, tags).

**Personal Constitution (`/constitution`)** — sections: What Matters Most, Guiding Principles, Life Vision, Lessons Learned, Revision History (placeholder list).

Other dock destinations (Timeline, Knowledge, Communications, Settings) get minimal but styled placeholder pages so the dock is fully navigable.

## 4. Data & Persistence

MVP uses **localStorage-backed Zustand stores** (no backend yet — keeps it instant and offline). Each store exposes typed CRUD:

- `missionsStore` · `financeStore` (bills, income, debts, savings, weather, health) · `archiveStore` (all capsule types) · `constitutionStore` · `momentumStore` (auto-logged events) · `settingsStore` · `navigatorStore`.

Single seed on first load so the Bridge isn't empty. Future-ready: stores are written so they can swap to Lovable Cloud later without changing component code.

## 5. Future-Ready Placeholders

Clearly marked `// future: adaptive` stubs for: daily briefing text, recovery path suggestions, financial forecast, universe evolution, risk auto-detection beyond simple rules, Navigator adaptive lines.

## Technical Details

- Stack: existing TanStack Start + Tailwind v4 + shadcn. Add deps: `framer-motion`, `zustand`, `date-fns`, `lucide-react` (already), `nanoid`.
- File layout:
  - `src/components/bridge/*` (Vessel, CommandCore, MetricRing, MomentumFeed, NavigatorPresence)
  - `src/components/shell/*` (CommandDock, NebulaBackground, NebulaField, QuickCapture, GlassPanel)
  - `src/components/missions/*`, `src/components/finance/*`, `src/components/archive/*`, `src/components/observatory/*`
  - `src/stores/*` (one file per store)
  - `src/lib/enums.ts` (mission classes, difficulty, health, weather, sectors, capsule types)
  - `src/lib/seed.ts`
- All colors via semantic tokens — zero hardcoded hex in components.
- Desktop-first layout, responsive collapse: dock → bottom sheet, Bridge grid → stacked, with `grid-cols-[minmax(0,1fr)_auto]` + `min-w-0` on header rows.
- Avatar placeholder: generated image at `src/assets/navigator-placeholder.jpg` (calm portrait silhouette, cosmic backdrop).

## Out of Scope (Future Phases)

- Real AI briefings / adaptive Navigator dialogue
- Real audio recording + transcription
- Real weather/headline fetch
- Cloud sync, auth, multi-device
- Knowledge graph, Communications inbox logic — UI shells only
- Complex universe-evolution visualization

## Deliverable

A navigable, persistent, visually cinematic MVP where the user can on day one: create missions, log finances, capture archive entries, write their constitution, and feel the bridge come alive.
