# Bridge v3 — Cinematic Command Lounge

Throw away the HUD cockpit. Rebuild the Bridge page as a calm, spacious, Apple-Vision-Pro-grade command lounge. Keep every route, store, data shape, and panel component — only the Bridge composition and a few visual primitives change.

## Layout (exactly 5 sections above the dock)

```text
┌──────────────────────────────────────────────────────────────┐
│ 1. CINEMATIC HEADER                                          │
│    "Welcome aboard, Captain."  ·  Stardate · Local time      │
│    Chips: Vessel · Signal · Missions · Momentum              │
├──────────────────────────────────────────────────────────────┤
│ 2. HERO — Holographic Personal Vessel                        │
│    Nebula bloom · floating starship · glass overlay          │
│    Directive: "Course set: Build Six-Month Runway"           │
│    [ Mission Progress ] [ Financial Health ] [ Focus ]       │
├───────────────────────────┬──────────────────────────────────┤
│ 3. LEFT CONSOLE           │ 4. RIGHT CONSOLE                 │
│    Active Flagship        │    Navigator · Liam              │
│    Financial Weather      │    Mission Field                 │
├───────────────────────────┴──────────────────────────────────┤
│ 5. LOWER DECK                                                │
│    Momentum Stream · Timeline Horizon · Archive Echoes       │
└──────────────────────────────────────────────────────────────┘
                  [ Command Dock — fixed, glassy ]
```

`max-w-[1680px]`, `px-10`, `gap-10`, `pb-32` so the dock never overlaps.

## Hero — the centerpiece

- Remove `CommandCore` rings/ticks/radar entirely from the Bridge.
- New component `CinematicHero` (replaces `CommandCore`'s slot):
  - Soft layered nebula bloom (radial gradients, no canvas) — cyan top-left, violet bottom-right, deep navy base.
  - Subtle parallax starfield (CSS background, two layers drifting slowly).
  - New `HoloVessel.tsx` SVG: a slim personal starship — long fuselage, cockpit canopy, swept delta wings, twin engine nacelles with cyan glow plumes, soft rim-light, gentle 6s float + 12s yaw. Not a triangle, not an arrow, not an icon.
  - Translucent "command glass" plate behind the directive line.
  - Directive: large display type (~28px), e.g. _"Course set: {flagship.name}"_ — fallback _"Awaiting your first flagship."_
  - Three large metric cards in a row beneath: **Mission Progress · Financial Health · Focus**. Each ~180px tall: big number (44px), label (14px, sentence case), thin progress bar, one-line context.

## Header (replaces `BridgeStatusBar`)

- One line greeting: `Welcome aboard, Captain {callSign}.` (display font, ~22px).
- Second line: Stardate `2026.166` · local time (mount-gated, no SSR mismatch).
- Right side: 4 status chips (Vessel · Signal · Missions · Momentum) — pill, dot indicator, 13px label, soft glass.

## Left console

`FlagshipPanel` and `FinancialWeatherPanel` stacked, `gap-8`, large titles (24px), generous padding (`p-8`), `rounded-3xl`.

## Right console

`NavigatorPanel` (already has Liam portrait — keep, just resize portrait to 112px and soften halo) + Mission Field (existing inline list from `index.tsx`, moved into a `GlassPanel`).

Navigator copy:
- Title: _"Standing by, Captain."_
- Body: _"You have {n} active missions. Pick one flagship for the next 90 minutes."_
- Buttons: **Brief Me**, **Log Signal**.

## Lower deck

Three equal `GlassPanel`s in a 3-col grid: `MomentumFeed`, Timeline Horizon (existing inline), `ArchiveEchoesPanel`.

## Visual + typography pass

`src/styles.css`:
- Body 15px, line-height 1.6.
- `.hud-text`: only used for chips/eyebrows, 12px, +1 tracking. Strip all-caps elsewhere.
- New `.display-xl` (28px), `.display-lg` (22px) display-font utilities.
- Soften glass: lower border opacity, larger blur, `rounded-3xl`.
- Remove ring-tick CSS no longer used.

`GlassPanel`: bigger default padding (`p-7`), softer border, keep brackets but at 40% opacity.

`CommandDock`: keep height `h-16`, ensure page wrapper has `pb-32`; active Bridge item gets a soft inner glow (no harsh ring).

## Files

Edit:
- `src/routes/index.tsx` — full recomposition into the 5 sections above.
- `src/components/bridge/BridgeStatusBar.tsx` — rewrite as cinematic header.
- `src/components/bridge/NavigatorPanel.tsx` — shrink portrait, simplify copy, ensure two buttons.
- `src/components/shell/GlassPanel.tsx` — soften, larger radius/padding.
- `src/components/shell/CommandDock.tsx` — softer active state, confirm spacing.
- `src/styles.css` — typography scale + glass tokens.

Create:
- `src/components/bridge/CinematicHero.tsx` — nebula + vessel + directive + 3 metric cards.
- `src/components/bridge/HoloVessel.tsx` — SVG personal starship with engine glow and float animation.
- `src/components/bridge/MetricCard.tsx` — large readable metric card used in the hero.

Delete from Bridge usage (files stay in repo, just unused on `/`):
- `CommandCore.tsx`, `Vessel.tsx`, `SectorPulsePanel.tsx`, `UniverseStatePanel.tsx`.

No new dependencies. No route, store, or data changes. Runtime 504 on `@radix-ui/react-tabs` will self-heal on next dev restart after the edits land; if not, restart the dev server.

## Out of scope

- Real WebGL/3D vessel (stays as crafted SVG for SSR + perf).
- Other routes.
- Mobile-specific composition (stacks responsively, desktop is the target).
