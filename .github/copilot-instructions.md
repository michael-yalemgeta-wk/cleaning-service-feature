## Guidance for AI coding agents working on this repo

- **Big picture:** This is a Next.js (app-router) TypeScript site in `src/app/`. UI components live in `src/components/`. Server API routes are under `src/app/api/*` and use Next.js Route Handlers (`route.ts`) to read/write JSON files in the repository `data/` folder as the primary datastore.

- **Key files to inspect:** `package.json` (scripts), `tsconfig.json` (alias `@/*` -> `src/*`), `src/app/layout.tsx` (global layout), and `src/app/api/bookings/route.ts` (example API pattern).

- **Run & build:** use the npm scripts in `package.json`: `npm run dev`, `npm run build`, `npm run start`, and `npm run lint`.

- **API pattern:** Each API route is a folder with `route.ts` exporting HTTP methods (e.g. `export async function GET/POST/PUT`). Handlers return `NextResponse`. Example: the bookings route at `/api/bookings` reads `data/bookings.json`, validates input, appends/updates entries, and saves the file via `fs/promises` and `path.join(process.cwd(), 'data', ...)`.

- **Data conventions:** The `data/` JSON files are the app's datastore. For example, bookings use:
  - `id` generated with `Date.now().toString()`
  - `status` values: `Pending`, `Confirmed`, `Completed`
  - `createdAt` ISO timestamp

- **Where to add features:** To add a new API, create `src/app/api/<name>/route.ts` following the bookings example. To add pages, add files under `src/app/`—the app router prefers colocated folders (layout, page, nested routes).

- **TypeScript paths & imports:** The project uses `@/` path alias to reference `src/` (see `tsconfig.json`). Prefer importing shared UI from `src/components` via `@/components/...`.

- **UI structure:** Global layout composes `Navbar`, `SupportWidget`, and `Footer` in `src/app/layout.tsx`. Shared components are small and presentational—check `src/components/SupportWidget.tsx` and `src/components/Navbar.tsx` for examples.

- **Concurrency notes (discoverable):** API route handlers directly read and write files in `data/`. This is simple and acceptable for local/demo use but can race under concurrent requests—be conservative when modifying write logic (consider migrating to a DB for concurrent workloads).

- **Linting & formatting:** `npm run lint` runs ESLint (configured with `eslint-config-next`). There are no project tests present in the repository.

- **Examples & quick references:**
  - Bookings API: `src/app/api/bookings/route.ts`
  - Data store example: `data/bookings.json`
  - Global layout: `src/app/layout.tsx`
  - Scripts: `package.json`

- **When making changes as an AI assistant:**
  - Keep edits small and focused (update the API handler and the data file together).
  - Follow the explicit HTTP method signatures in `route.ts` files and return `NextResponse` objects.
  - Preserve the `data/` folder schema (id/status/createdAt) unless you update all callers.
  - Use the `@/` alias for imports to match `tsconfig.json` paths.

If anything here is unclear or you want more examples (e.g., add a new API, migrate `data/` to a DB), tell me which area to expand and I'll iterate.
