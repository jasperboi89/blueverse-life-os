# Bridge Redesign — Cinematic Command Deck

Replace the cramped 12-column HUD with a spacious, premium cockpit. Keep all routes, stores, data, and existing panel components — only recompose the Bridge page, upsize the hero, and tune typography/spacing for cinematic calm.

## Layout (full-width, breathing)

```text
┌─────────────────────────────────────────────────────────────┐
│  STATUS BAR  (slim, full-width, large readable time/call)   │
├──────────────┬──────────────────────────────┬───────────────┤
│ LEFT (3/12)  │   HERO CENTERPIECE (6/12)    │ RIGHT (3/12)  │
│              │                              │               │
│ Flagship     │   Holographic Vessel         │ Navigator     │
│ Mission      │   + Command Core glow        │ Liam          │
│              │                              │ (portrait)    │
│ Financial    │   3 large metric rings:      │               │
│ Weather      │   Mission · Finance · Focus  │ Mission       │
│              │                              │ Field         │
│              │   Dynamic directive line     │               │
├──────────────┴──────────────────────────────┴───────────────┤
│  LOWER DECK (3 wide panels)                                 │
│  Momentum Stream  │  Timeline Horizon  │  Archive Echoes    │
└─────────────────────────────────────────────────────────────┘
                  [ Command Dock — fixed, glassy ]
```

Exactly 6 main panels above the dock + hero + status bar. Generous gaps (`gap-8`), generous padding (`p-8`), max width ~1680px centered with side breathing room.

## Hero Centerpiece (biggest change)

- Hero panel grows to ~640px tall on desktop (currently ~520).
- Replace triangle vessel with an elegant **holographic personal ship**: layered SVG — slim arrowhead fuselage, swept wings, twin engine glow trails, soft cyan rim-light, parallax floating (`y: [0,-6,0]`, 6s).
- Behind it: a **soft command core** — large radial bloom (cyan→violet), slow-rotating concentric rings, faint particle dust (CSS, no canvas to avoid hydration mismatch).
- 3 metric rings move **below** the vessel as larger, readable cards (not tiny corners): each ~140px ring with big numeric center (32px), label below (13px caps).
- Directive line below rings: large serif/display, ~22px, e.g. _"Course set: {flagship name}"_ or empty-state _"Awaiting first flagship. Set your course."_

## Panels (recompose, keep components)

Left console: `FlagshipPanel`, `FinancialWeatherPanel`. (Drop `SectorPulsePanel` from first screen — moves to Universe page; keeps panel count at 6.)
Right console: `NavigatorPanel` (enlarged), Mission Field (inline list from index).
Lower deck: Momentum Stream (`MomentumFeed`), Timeline Horizon, `ArchiveEchoesPanel`.
Remove `UniverseStatePanel` from Bridge (link to it instead from status bar).

## Navigator Liam panel

Larger portrait (128px circle, keep current Liam image + halo/scan animation), warmer copy block:
- Eyebrow: `NAVIGATOR · LIAM`
- Title: `Standing by, Captain.`
- 1–2 line contextual suggestion (calm, not alert-style)
- 2 quick actions (Capture, Brief)

## Typography pass

In `src/styles.css`:
- `.hud-text` bump from ~10px to **12px**, letter-spacing relaxed.
- Body default 15px (currently small).
- Panel titles: display font, 22–26px.
- Hero directive: 22px display.
- Remove most ALL-CAPS except small labels/eyebrows.

## Visual polish

- `GlassPanel` keeps holo border + brackets, but softer (lower opacity, larger radius `rounded-3xl`, more inner padding).
- `NebulaBackground`: keep current radial blooms; ensure inline style uses shorthand `background` (already fixed) — no canvas particles on SSR path (prevents hydration mismatch).
- Status bar: render time only after mount (avoid SSR/client time skew currently causing hydration error).

## Empty states (rewrite copy)

- Flagship: _"No flagship mission yet. Declare your first flagship."_
- Finance: _"Financial systems ready. Add your first bill or account."_
- Archive: _"Archive quiet. First memory capsule awaits."_
- Momentum: _"Momentum stream idle. Make a move."_
- Timeline: _"Horizon clear. Chart a due date to set a waypoint."_

## Command Dock

Keep `CommandDock`. Increase height (h-16), larger icons (22px), bigger labels (12px), stronger active glow on Bridge item, ensure page has `pb-28` so content never hides behind it.

## Files touched

Edit only:
- `src/routes/index.tsx` — recompose layout, drop 2 panels, larger hero, new spacing/typography wrappers.
- `src/components/bridge/CommandCore.tsx` — taller, new holographic vessel SVG, larger rings, directive typography.
- `src/components/bridge/Vessel.tsx` — replace triangle with elegant ship SVG.
- `src/components/bridge/BridgeStatusBar.tsx` — mount-gated time to fix hydration mismatch.
- `src/components/bridge/NavigatorPanel.tsx` — larger portrait, warmer copy, refined layout.
- `src/components/shell/GlassPanel.tsx` — softer border, larger radius/padding option.
- `src/components/shell/CommandDock.tsx` — taller, bigger labels.
- `src/styles.css` — typography scale, softer glass, remove canvas-driven nebula bits if any.

No new files, no new dependencies, no data/route/store changes.

## Out of scope

- Other routes (Missions, Finance, Archive, etc.).
- Real 3D/WebGL vessel — stays as crafted SVG for performance and SSR safety.
- Mobile-specific cockpit variant (stacks responsively, but desktop is the target).