# BlueVerse Life OS

A personal "life operating system" styled as a starship bridge: missions, finances,
memories, and a personal constitution, all in one cinematic command deck.

## Modules

- **Bridge** (`/`) — command overview: flagship mission, financial weather, navigator, momentum feed
- **Missions** (`/missions`) — declare and track missions with milestones, tasks, risks, and a recovery path
- **Finance** (`/finance`) — manual-first bills, income, debts, and savings goals
- **Timeline** (`/timeline`) — the full momentum feed
- **Archive** (`/archive`) — memory capsules, chronicles, audio capsules, letters to the future, Book of Ages
- **Observatory** (`/observatory`) — sector-level overview of all missions
- **Constitution** (`/constitution`) — living philosophy with a revision log
- **Settings** (`/settings`) — call sign, navigator name, focus score, local-data reset
- **Knowledge / Communications** — placeholders for future phases

## Stack

- [TanStack Start](https://tanstack.com/start) (file-based routing in `src/routes/`)
- React 19, TypeScript
- Tailwind CSS v4 (theme + custom utilities in `src/styles.css`)
- shadcn/ui primitives (`src/components/ui/` — generated, avoid hand-editing)
- Zustand with localStorage persistence (`src/stores/`, shared helper in `src/stores/persist.ts`)
- framer-motion, lucide-react, date-fns

## Development

```sh
bun install
bun dev          # start the dev server
bun run build    # production build
bun run lint     # eslint
bun run format   # prettier
```

## Data

All data lives in this browser's `localStorage` under `blueverse:*` keys — there is
no backend. On first run, `src/lib/seed.ts` seeds a small set of demo missions,
finance entries, and constitution text (guarded by the `blueverse:seeded:v1` flag).
"Wipe local data" in Settings clears everything and re-seeds on reload.
