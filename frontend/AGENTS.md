# Frontend (React/Vite) Agent Instructions

## 1. Scope and Role
You are an expert Frontend Developer specializing in React 18, Vite, TypeScript, and Material-UI (MUI). Your scope is strictly limited to the `frontend/` directory.

## 2. Architecture and File Structure
- **Component Organization:** Strict separation of concerns. Place full-page views in `src/pages/`, reusable UI elements in `src/components/`, API calls in `src/services/`, and custom hooks in `src/hooks/`.
- **Styling (MUI Strict):** ALWAYS use Material-UI (`@mui/material`) for components, layouts, and styling. Use the `sx` prop for custom inline styling. DO NOT create or import raw `.css` files (like `App.css`) unless explicitly instructed.
- **Entry Point:** The application relies on `main.tsx` wrapped with MUI's `<ThemeProvider>` and `<CssBaseline />`.

## 3. Auth0 Integration (CRITICAL)
- **Library:** Strictly use `@auth0/auth0-react`.
- **The "No-Form" Rule:** NEVER create local email/password login forms. Authentication MUST exclusively use Auth0's Universal Login via the `loginWithRedirect()` method.
- **API Token Injection:** For any API calls to the backend, you MUST retrieve the JWT access token using `getAccessTokenSilently()` and attach it to the `Authorization: Bearer <token>` header.
- **Audience required:** `getAccessTokenSilently()` MUST be called with
  `authorizationParams: { audience: 'https://bbl-candidate-test-api' }` (matching
  `Auth0Provider`'s config) — without it, Auth0 returns an opaque token instead of a
  JWT, and the backend guard will reject it.
- **Port & Callback:** Auth0's registered Callback URL is `http://localhost:3000/callback`
  — set Vite's dev server to run on port 3000 (`vite.config.ts` → `server.port: 3000`),
  and create a `/callback` route/component that handles Auth0's redirect (`Auth0Provider`
  needs this to complete the code exchange).
- **Post-callback redirect:** After Auth0Provider processes the callback, use
`onRedirectCallback` (with `useNavigate` from `react-router`) to leave `/callback` and
navigate to `appState.returnTo` (falling back to `/`). Never leave the user sitting on
a URL containing `?code=...&state=...` — the code is single-use and a refresh will break.

## 4. Routing & Protected Routes
- **Router:** Use `react-router` (NOT `react-router-dom` — that package was removed in v8). Import route-matching APIs from `react-router`; import `RouterProvider` from `react-router/dom` specifically.
- **Guards:** Implement route protection. If a user is not authenticated, redirect them to the `/login` page. If an authenticated user visits `/login`, redirect them to the main dashboard (`/`).

## 5. Security & Environment Variables
- **Env Variables:** Since this is a Vite project, all environment variables MUST be prefixed with `VITE_` and accessed via `import.meta.env`.
- **No Hardcoding:** NEVER hardcode API endpoints or Auth0 credentials in the source files. Always reference the environment variables.

## 6. Testing Requirements
- **Framework:** Write component tests using Vitest and React Testing Library.
- **Mocking:** ALWAYS mock the `useAuth0` hook during tests to prevent actual network calls to the identity provider.