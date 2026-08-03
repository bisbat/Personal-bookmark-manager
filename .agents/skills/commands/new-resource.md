# /new-resource — scaffold a new owned resource end-to-end

**When to invoke:** whenever adding a new user-owned resource to the backend (e.g. if you
decide to add tags, or a `CollectionShare` table). Don't use it for anything
that isn't owned per-user data.

**Why this exists:** the single most repeated mistake an agent makes on this project is
generating a CRUD resource that forgets the `ownerId` filter on one of the five routes
(get one, list, update, patch, delete), or ships without the cross-user denial test. This
command bakes the checklist into the prompt so it isn't re-derived from scratch — and
re-explained by hand — every time.

**Prompt template:**

```
Add a new resource `<ResourceName>` to the backend, owned by the authenticated user,
following backend/AGENTS.md conventions exactly. Specifically:

1. Add the Prisma model with an indexed ownerId field, migration included.
2. Add a NestJS module/controller/service with routes: get one, list (with filtering),
   create, update (PUT), patch (PATCH), delete.
3. Every service method must filter by the authenticated userId at the Prisma query
   level — never fetch-then-filter.
4. Ignore any client-supplied ownerId/userId in the request body.
5. Add e2e tests: happy path, cross-user denial (403/404 per API_DESIGN.md), and
   unauthenticated (401), for every route.
6. Update API_DESIGN.md with the new endpoints, matching the existing format.

Show me the diff before running migrations against the dev database.
```
