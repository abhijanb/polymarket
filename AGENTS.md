# AGENTS.md

Project-wide notes for agent sessions.

## Backend (`backend/`)

- Runtime: Bun (`bun run index.ts`).
- Typecheck: from `backend/`, run `npx tsc --noEmit` (TypeScript is available as a transitive dependency; the repo has no dedicated `typecheck` npm script).
- No ESLint is configured.

### Redis
- Client is initialized in `src/redis/redis.ts` and connects at module load using `REDIS_URL` (default `redis://localhost:6379`).
- Order cache helpers live in `src/redis/redis.service.ts`.
