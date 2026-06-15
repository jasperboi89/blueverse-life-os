# Bridge → Cinematic Cockpit Redesign

Visual + layout only on `/`. No changes to routes, stores, enums, or data flow. All existing Bridge sections (Vessel, 3 metrics, Active Flagships, Financial Snapshot, Timeline, Momentum) are preserved and recomposed.

## Layout (desktop-first, 12-col cockpit grid)

```text
┌───── BRIDGE STATUS BAR — StarDate · Vessel Systems · Navigator Signal · Focus pulse ─────┐
│                                                                                          │
│  LEFT CONSOLE (3 cols)   │     CENTER HERO (6 cols)     │   RIGHT CONSOLE (3 cols)      │
│  • Active Flagship       │   COMMAND CORE               │   • Navigator Presence (lg)   │
│  • Financial Weather     │   3 concentric metric rings  │   • Mission Field summary     │
│  • Sector Pulse (8 dots) │   + vessel silhouette        │   • Archive Echoes            │
│                          │   + directive chip below     │                               │
├──────────────── LOWER DECK (full width, 3 panels) ──────────────────────────────────────┤
│  Momentum Stream  │  Timeline Horizon  │  Universe State (links to /observatory)        │
└──────────────────────────────────────────────────────────────────────────────────────────┘
```

Mobile collapses to single column: Status → Core → Navigator → left panels → lower deck.

## Hero centerpiece — new `src/components/bridge/CommandCore.tsx`

Single ~520px SVG, replaces current `<Vessel />` + 3 separate ring cards:
- Outer ring: Mission Progress (cyan), middle: Financial Health (violet), inner: Focus (azure) — each animated stroke-dashoffset with framer-motion
- Tick marks every 30°, small value labels at ring ends
- Center: stylized vessel silhouette (SVG arrowhead echoing the uploaded logo) + pulsing core glow + radial highlight
- Orbiting dots (rotate animation)
- "Active Directive" chip pinned at base of core with top mission title + CTA → `/missions/$id`
- 4 corner brackets framing the hero panel

## Console upgrade — `src/components/shell/GlassPanel.tsx`

Add depth without breaking existing usage:
- Layered glass gradient + inner bottom violet wash
- Optional `corner-brackets` and `scanlines` overlay (default on)
- Optional `holo-sweep` rotating border for `variant="hero"`
- HUD label strip stays at top

## New small Bridge panels (`src/components/bridge/`)

- `BridgeStatusBar.tsx` — StarDate, system pills (Vessel Systems / Navigator Signal / Momentum), blinking signal dot
- `FlagshipPanel.tsx` — top flagship mission card; empty: "No flagship mission yet. Declare one."
- `FinancialWeatherPanel.tsx` — weather glyph + gradient, bills due count, total; empty: "No bills logged. Financial systems ready."
- `NavigatorPanel.tsx` — large 96px avatar with cyan halo, "Standing by, Captain.", one recommendation line, one quick action button (opens QuickCapture)
- `SectorPulsePanel.tsx` — 8 sector dots sized by mission count
- `MissionFieldPanel.tsx` — counts by status (Active / Planned / Paused)
- `ArchiveEchoesPanel.tsx` — last memory capsule snippet; empty: "Archive quiet. First memory capsule awaits."
- `UniverseStatePanel.tsx` — mini SVG constellation linking to `/observatory`
- Reuse existing `MomentumFeed` and a small timeline preview panel — empty momentum: "No momentum logged yet. Make a move."

The shell `NavigatorPresence` (top-right) stays for global routes but is hidden on `/` so the Bridge-local Navigator panel is the focal one.

## Background upgrade — `src/components/shell/NebulaBackground.tsx`

Keep existing canvas starfield. Add CSS layers:
- 2 large radial nebula blooms with slow `nebula-drift`
- Faint concentric orbital ring SVG behind hero
- Diagonal light-sweep div with 18s `light-sweep` animation
- 3 distant blurred sector glows

All CSS/SVG; no extra canvas work.

## Command Dock upgrade — `src/components/shell/CommandDock.tsx`

- Larger padding, taller buttons, clearer labels at `sm:`
- Active item: glowing pill + top tick + brighter icon
- New floating row above dock: 3 adaptive shortcut chips (route-aware, e.g. `+ Mission`, `Log Momentum`, `Open Vault`)
- Inner glass + holo border + corner brackets

## Styling — `src/styles.css`

Add utilities (Tailwind v4 `@utility`): `holo-sweep`, `corner-brackets`, `scanlines`, `text-gradient-flare`. Add keyframes: `holo-spin`, `orbit-spin`, `light-sweep`, `signal-blink`. Strengthen `glass-panel` with layered gradient + inner violet wash.

No hardcoded color classes — all via existing tokens.

## BlueVerse vocabulary

Section labels use: StarDate · Bridge Status · Vessel Systems · Navigator Signal · Active Flagship · Financial Weather · Mission Field · Momentum Stream · Archive Echoes · Universe State.

## Files

Edit: `src/routes/index.tsx`, `src/styles.css`, `src/components/shell/GlassPanel.tsx`, `src/components/shell/NebulaBackground.tsx`, `src/components/shell/CommandDock.tsx`, `src/routes/__root.tsx` (hide top NavigatorPresence on `/`).

Create: `src/components/bridge/CommandCore.tsx`, `BridgeStatusBar.tsx`, `FlagshipPanel.tsx`, `FinancialWeatherPanel.tsx`, `NavigatorPanel.tsx`, `SectorPulsePanel.tsx`, `MissionFieldPanel.tsx`, `ArchiveEchoesPanel.tsx`, `UniverseStatePanel.tsx`.

Existing `Vessel.tsx` and `MetricRing.tsx` remain unchanged (still importable elsewhere). No new dependencies.

## Out of scope

Real adaptive AI logic, observatory rewrite, mobile-specific cockpit variant beyond responsive stack, changes to other routes.
