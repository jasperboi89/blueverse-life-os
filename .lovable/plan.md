## Mission Command — Build Plan

The Missions route and store already exist with the right enums (Classes, Difficulties, Healths) and basic milestone/task plumbing. The work is to **level up** the list page and detail page into a true Mission Command experience and add the missing data (milestone richness, next milestone, last activity, flagship rules, recovery checklist) — without touching the Bridge, routes, or other modules.

### 1. Data model upgrades (`src/stores/missions.ts`)

Extend `Milestone` to:
```ts
type Milestone = {
  id: string; title: string; description?: string;
  done: boolean; progressContribution: number; // 0-100
  completedAt?: string; notes?: string;
}
```
- Auto-compute mission `progress` from milestone contributions when any exist (else manual slider still works).
- Add `lastActivityAt` updated on any mutation; `nextMilestoneId` derived (first incomplete).
- Add `setPrimaryFlagship(id)` / `setSupportingFlagship(id)` enforcing **only one Primary** and **one Supporting** (auto-demote previous).
- Add `updateMilestone(missionId, milestoneId, patch)` and `removeMilestone`.

### 2. Mission List Page (`src/routes/missions.tsx`)

Redesign the card + add a Navigator strip on top:

- **Header**: keeps "Mission Command" title; adds counters chips (Active / Flagship / At Risk / Dormant).
- **Navigator advisory panel** (placeholder logic): if active missions > 5 → "Captain, your fleet is overextended. Consider pausing or archiving."; if no flagship → "No Primary Flagship set. Choose your North Star."; if any Critical → flag.
- **Filter bar**: Active / Flagship / All / Archived + class chips + health filter.
- **Mission card** (richer cockpit tile):
  - top row: class + domain (hud-text), flagship/supporting star icons
  - title + 2-line story
  - progress bar with % readout
  - row of badges: Difficulty, Status, Health (colored), Priority
  - **Next milestone**: "Next → {title}" or "All milestones complete"
  - **Last activity**: relative time
  - Quick actions row: Open · +Focus (logs momentum) · Complete · Archive
  - Health-tinted left border accent.

### 3. Mission Detail Page (`src/routes/missions.$id.tsx`)

Rebuild into a cockpit:

- **Mission banner** — full-width GlassPanel with class-themed gradient strip, large editable name, hud meta (class · difficulty · domain · priority), health/status badges, flagship star controls (Primary toggle, Supporting toggle — enforced single).
- **Vital stats row** (4 mini-tiles): Progress %, Health, Status, Next Milestone.
- **Two-column body**:
  - Mission Story (textarea)
  - Success Criteria (textarea)
  - **Milestones panel** — richer:
    - add row with title + contribution slider
    - each milestone: checkbox, title (editable), description, progress contribution badge, completedAt timestamp, notes textarea (collapsible)
    - completing updates mission progress automatically
  - Tasks panel (existing, slightly polished)
  - Notes
  - Risk Indicators
- **Recovery Path panel** — when health is At Risk / Critical / Dormant, highlight. Shows the **5-step checklist** the user defined:
  1. Review mission story
  2. Pick one small next task
  3. Start a 15-minute focus session
  4. Update progress
  5. Resume momentum
  Each step is a checkbox (stored as `recoverySteps: boolean[5]`); a "Reset path" button. Free-form recovery notes textarea below. Includes a placeholder Navigator hint line ("Navigator will tailor this path as it learns your patterns.").
- **Completion / archive controls** — sticky footer bar: Mark Complete · Archive · Decommission · Back to Missions.

### 4. Visual style

- Reuse existing `GlassPanel`, `holo-border`, `text-gradient-cosmic`, hud-text — no new theme tokens.
- Class accent gradients via a small `MISSION_CLASS_ACCENT` map in `src/lib/enums.ts` (e.g. Project → cyan→violet, Financial → emerald→cyan, Creative → fuchsia→violet, etc.) for the banner strip & card border.
- Health-tinted glow on cards (uses existing `HEALTH_COLOR`).
- Deep navy / cyan / violet only — no new colors hardcoded.

### 5. Out of scope (explicit)

- Bridge layout, background, hero, Navigator panel — untouched.
- Routes, stores for other modules, data shapes outside missions — untouched.
- No real AI calls — Navigator copy is static placeholder logic based on counts/health.

### Files touched
- `src/lib/enums.ts` — add `MISSION_CLASS_ACCENT` map.
- `src/stores/missions.ts` — extend Milestone, flagship enforcement, recovery steps, lastActivityAt, auto-progress.
- `src/routes/missions.tsx` — redesigned list + Navigator strip.
- `src/routes/missions.$id.tsx` — full Mission Command detail rebuild.
- (Possibly) `src/components/bridge/MissionCard.tsx` shared card extraction — only if reuse is clean; otherwise inline.
