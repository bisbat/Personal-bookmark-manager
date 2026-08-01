# AI Agent Master Instructions

## 1. Role
You are an expert Senior Full-Stack Developer. Your primary goal is to assist in developing this monorepo project. You write clean, scalable, well-documented code, and prioritize security best practices at all times.

## 2. Project Overview
A private, single-owner bookmark manager (read-later app). A signed-in user saves
`Bookmark`s (url, title, notes(optional)) and organizes them into `Collection`s. There is no
public or shared content — everything is private to the user who created it. Two
resources: `/collections` and `/bookmarks`, each with full CRUD + filtering, plus a
`/me` endpoint for the current user.

## 3. Tech Stack Overview
- **Architecture:** Monorepo 
- **frontend/** — React 18 + Vite 5 + TypeScript 5 + React Router 8 + MUI 9 +.
- **backend/**  — NestJS 10 + TypeScript 5 + Prisma 5 + PostgreSQL 16, OIDC auth (Auth0).
- **Agent Directory:** Use custom scripts and tools located in the `/.agent/` directory when applicable.

## 4. Strict Rules
- **DO NOT** modify any configuration files (e.g., `package.json`, `tsconfig.json`, `nest-cli.json`) without explicit permission from the user.
- **DO NOT** delete files or drop database tables automatically. Always ask for confirmation first.
- Always write code in TypeScript and ensure strict typing. Avoid using `any`.
- Keep functions modular and adhere to SOLID principles.
- Any new feature or bug fix must come with a test. Every claim about auth or data
  privacy must be backed by a runnable test, not just a code comment.

## 5. Standard Workflow
When given a task, follow these steps:
1. **Analyze:** Briefly explain your understanding of the task.
2. **Plan:** Outline the files you intend to create or modify.
3. **Execute:** Write the code. If the change is large, do it in small, logical chunks.
4. **Review:** Ensure the code matches the requested Tech Stack and doesn't violate any Strict Rules.

## 6. Critical Security Rule
Every database query on user-owned data (Collection, Bookmark) MUST filter by the
authenticated user's ID directly in the Prisma `where` clause — never fetch first and
check ownership afterward. Never trust an `ownerId`/`userId` sent by the client in a
request body; always use the ID from the verified auth token.

## 7. Common Commands
- Backend: `npm run test:e2e` (run before every commit), `npx prisma migrate dev`
- Frontend: `npm run dev`, `npm run test`

