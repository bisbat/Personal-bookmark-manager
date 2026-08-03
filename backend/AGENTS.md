# Backend (NestJS) Agent Instructions

## 1. Scope and Role
You are an expert Backend Developer specializing in NestJS 10, Prisma 5, and PostgreSQL. Your scope is strictly limited to the `backend/` directory.

## 2. NestJS Architecture Rules
- **Modules & Separation of Concerns:** Every new feature (e.g., Bookmarks, Collections) MUST have its own Module, Controller, and Service.
- **Data Validation (DTOs):** All incoming request payloads (POST, PATCH) MUST be strictly validated using `class-validator` and `class-transformer` inside Data Transfer Object (DTO) classes. Never use `any` for request bodies.
- **Dependency Injection:** Never instantiate services manually. Always rely on NestJS dependency injection.

## 3. Database (Prisma) Rules
- **Prisma Service:** Always inject `PrismaService` into feature services. Do not create global or floating Prisma Client instances.
- **Schema Management:** If you need to update `schema.prisma` (e.g., adding a relation between Collection and Bookmark), DO NOT run the migration automatically. Simply output the required terminal command (`npx prisma migrate dev --name <reason>`) and ask the user to run it.
- **Prisma 7 syntax only:** This project uses Prisma ^7.9.1. Do NOT put `url = env(...)`
  in `schema.prisma` — it belongs in `prisma.config.ts`. Generator provider is
  `"prisma-client"` (not `"prisma-client-js"`), with an explicit `output` path.
  `PrismaService` MUST instantiate `PrismaClient` with a `@prisma/adapter-pg` driver
  adapter — Prisma 7 no longer ships the Rust query engine by default.
  - **PrismaService location:** `src/prisma/prisma.service.ts`, provided globally via
  `PrismaModule` (`@Global()`). Do not create a new PrismaClient instance anywhere else
  in the codebase — always inject `PrismaService`.
  
## 4. Auth0 & Security Implementation (CRITICAL)
- **Route Protection:** All endpoints related to user data MUST be protected using an Auth0 JWT Guard (`@UseGuards(AuthGuard('jwt'))`).
- **User Decorator:** Create and utilize a custom `@CurrentUser()` decorator to extract the authenticated user's ID directly from the validated JWT payload.
- If a DTO includes an `ownerId` or `userId` field from the client, ignore it — always
  use the ID from `@CurrentUser()` instead, even on create/update.
- **Enforce Master Security Rule:** Reaffirming the Master `AGENTS.md`, every Prisma operation (`findMany`, `update`, `delete`) MUST include `userId: user.id` (extracted from the token) in the `where` clause. 
- Ownership violations (user accessing another user's resource) return **404**, not
  403 — a non-owner should not be able to distinguish "doesn't exist" from "exists but
  isn't yours." Apply this consistently across every route; document it in
  `API_DESIGN.md`.

## 5. Testing Requirements
- **Unit Tests:** Focus on testing business logic inside Services. Mock the `PrismaService` to prevent actual database connections during unit tests.
- **E2E Tests:** Ensure Controllers are tested for proper Auth Guard enforcement and IDOR protection.

## 6. Seed Data
`prisma/seed.ts` must create at least 2 distinct users, each with their own
non-overlapping Collections and Bookmarks. This is required fixture data for
IDOR/cross-user tests in section 5 — without it those tests can't be written.