# BlueVerse Life OS

A local-first personal operating system for missions, finances, memory, reflection, and long-term direction, presented through a cinematic starship-inspired command interface.

BlueVerse Life OS is designed to make personal planning feel less like juggling disconnected apps and more like operating from one coherent bridge.

## What it does

| Module | Purpose |
| --- | --- |
| **Bridge** (`/`) | Command overview with flagship mission, financial weather, navigator, and momentum feed |
| **Missions** (`/missions`) | Plan missions with milestones, tasks, risks, and recovery paths |
| **Finance** (`/finance`) | Track bills, income, debts, and savings goals with a manual-first workflow |
| **Timeline** (`/timeline`) | Review the full momentum and activity feed |
| **Archive** (`/archive`) | Store memory capsules, chronicles, audio capsules, letters to the future, and Book of Ages entries |
| **Observatory** (`/observatory`) | View mission progress across the wider system |
| **Constitution** (`/constitution`) | Maintain a living personal philosophy with revision history |
| **Settings** (`/settings`) | Configure call sign, navigator name, focus score, and local data reset |
| **Knowledge / Communications** | Planned expansion areas for future phases |

## Design principles

- **Local-first**: personal data stays in the browser instead of requiring a remote backend.
- **One coherent system**: missions, memory, finances, and reflection live in the same interface.
- **Human-readable state**: information is organized around meaningful life concepts instead of raw database objects.
- **Recoverable planning**: missions include risks and recovery paths, not just ideal-state checklists.

## Tech stack

- [TanStack Start](https://tanstack.com/start) with file-based routing
- React 19 + TypeScript
- Tailwind CSS v4
- shadcn/ui primitives
- Zustand for client state and persistence
- TanStack Query
- Framer Motion
- Lucide React
- date-fns
- Zod

## Local data model

All application data is stored in browser `localStorage` under `blueverse:*` keys. There is currently no backend service.

On first run, `src/lib/seed.ts` seeds demo missions, finance entries, and constitution content. Seeding is guarded by the `blueverse:seeded:v1` flag.

The **Wipe local data** control in Settings clears stored application state and allows the seed data to be recreated on reload.

## Getting started

### Requirements

- Bun
- A modern browser

### Run locally

```sh
bun install
bun dev
```

### Quality checks

```sh
bun run build
bun run lint
bun run format
```

## Project status

BlueVerse Life OS is an active experimental project exploring how a personal operating system can combine planning, memory, finances, reflection, and identity-oriented tools without requiring cloud-first storage.

The current implementation focuses on the core command experience and browser-local persistence. Knowledge and Communications are planned expansion areas.

## Repository layout

```text
src/
├── components/     # Shared interface components
├── lib/            # Application helpers and seed data
├── routes/         # TanStack Start routes
├── stores/         # Zustand state and persistence
└── styles.css      # Theme and global utilities
```

## Privacy

Because the current implementation uses local browser storage and no backend, data remains on the device/browser profile running the application unless it is exported or otherwise moved by the user.

## About BlueVerse

BlueVerse is an ongoing exploration of model-independent, local-first personal AI and life-management systems. Life OS focuses on the human-facing command layer: turning goals, memories, finances, and reflection into a single navigable environment.
