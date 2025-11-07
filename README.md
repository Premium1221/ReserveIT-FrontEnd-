# Reservit Frontend

Reservit is a full-featured reservation platform that lets diners discover restaurants, place bookings, and lets restaurant teams orchestrate dining-room operations in real time. This repository contains the Vite + React frontend that talks to the Reservit backend (`http://localhost:8080`) through REST and WebSocket APIs.

> **Need the backend?** Point the HTTP origin in `src/config/axiosConfig.jsx` and the WebSocket origin in `src/config/websocketConfig.jsx` at your backend instance before running the UI outside of localhost.

## Highlights

- **Role-aware UX** – Customers, staff, managers, and admins each get tailored routes guarded by `ProtectedRoute` + `AuthContext`.
- **Modern reservation flow** – Customers browse featured restaurants, check availability, and submit bookings without leaving the home page.
- **Real-time table board** – Managers/staff drag & drop tables on an interactive map (`react-dnd` + `react-konva`) while WebSocket pushes keep layouts and notifications in sync across devices.
- **Operational dashboards** – Admin and restaurant dashboards expose reservation queues, staff assignments, KPIs, and quick actions built on top of reusable components.
- **Offline-friendly auth** – JWT access tokens are cached in `sessionStorage` with automatic refresh and logout handling.
- **Testing-ready stack** – Jest + Testing Library for components/hooks and Cypress for end-to-end booking flows, all wired through npm scripts.

## Tech Stack

| Area              | Stack                                                                 |
|-------------------|-----------------------------------------------------------------------|
| Core framework    | React 18, Vite 5, React Router 6                                      |
| State & context   | Custom `AuthContext`, hooks, and `react-dnd` for layout interactions  |
| Styling & UI      | CSS modules + `lucide-react`, `react-toastify`, `react-slick`         |
| Data layer        | Axios with interceptors, `date-fns`, WebSocket (SockJS + STOMP)       |
| Testing           | Jest, React Testing Library, MSW, Cypress                             |
| Tooling           | ESLint 9, Vite plugin node polyfills, Dockerfile for container build  |

## Getting Started

### 1. Prerequisites

- Node.js **18.0+** (Vite 5 requires Node 18; use `nvm`/`fnm` to switch if needed)
- npm **9+**
- A running Reservit backend (defaults to `http://localhost:8080`)

### 2. Install dependencies

```bash
npm install
```

### 3. Run the development server

```bash
npm run dev
```

The app starts on `http://localhost:5200` (change the port in the `dev` script if required). The dev server proxies API calls directly to the backend URL configured in `src/config/axiosConfig.jsx`.

### 4. Connect to your backend

- REST base URL: update `baseURL` in `src/config/axiosConfig.jsx`.
- WebSocket URL: update the SockJS origin in `src/config/websocketConfig.jsx`.
- JWTs: the backend must expose `/api/auth/login`, `/api/auth/register`, `/api/auth/refresh`, and `/api/auth/logout` for the current auth flow to work.

### 5. Production build

```bash
npm run build
npm run preview   # optional: serve the dist folder locally
```

The optimized assets land in `dist/` and can be hosted on any static host (Netlify, Vercel, nginx, etc.). A Dockerfile is included for container deployments.

## Available Scripts

| Command                | Description                                                                                  |
|------------------------|----------------------------------------------------------------------------------------------|
| `npm run dev`          | Start Vite dev server on port 5200 with hot module replacement.                              |
| `npm run start`        | Alias of `npm run dev`.                                                                      |
| `npm run build`        | Generate production bundle in `dist/`.                                                       |
| `npm run preview`      | Serve the production build locally.                                                          |
| `npm run lint`         | Run ESLint with React, hooks, accessibility, and Cypress plugins.                            |
| `npm run test`         | Execute Jest tests once in JSDOM.                                                            |
| `npm run test:watch`   | Watch mode for component/unit tests.                                                         |
| `npm run test:coverage`| Collect coverage (thresholds defined in `package.json`).                                     |
| `npm run cypress:open` | Launch Cypress GUI against the local dev server/back-end.                                    |
| `npm run cypress:run`  | Headless Cypress run (Chrome by default).                                                    |
| `npm run test:e2e`     | Convenience alias for a headless Cypress run.                                                |

## Project Structure

```
src/
  components/          # Header, ReservationModal, grids, drag/drop widgets, etc.
  pages/               # Route-level pages (Home, Login/Register, dashboards, table mgmt)
  context/             # AuthContext with login/register/logout helpers
  config/              # Axios + WebSocket configuration
  hooks/               # Custom hooks shared across pages
  assets/              # Static assets consumed by components
  App.jsx              # Router + providers (Auth, DnD) + global layout
cypress/              # Cypress specs, fixtures, support commands
public/               # Static files served as-is (icons, fallback images)
Dockerfile            # Build/run instructions for containerized deployments
vite.config.js        # Vite configuration (React plugin, polyfills)
```

## Key Concepts

- **Authentication flow** – `AuthContext` handles login/register, stores JWT access tokens in `sessionStorage`, and refreshes tokens using `/api/auth/refresh`. `ProtectedRoute` gates dashboards, redirecting users based on roles (`ADMIN`, `MANAGER`, `STAFF`, `CUSTOMER`).
- **Reservation discovery** – `HomePage` fetches `/api/companies`, renders featured/popular lists via `RestaurantGrid`, and opens `ReservationModal` for quick bookings. Toast notifications confirm success/failure.
- **Table management** – `TableManagementPage` mixes `react-dnd` + `react-konva` inside `InteractiveMap` for drag/drop positioning. Updates persist through `api.put('/tables/:id')` and propagate live via STOMP subscriptions (`/topic/tables/{companyId}`).
- **Dashboards** – Admin, manager, staff, and customer pages consume the same Axios instance so interceptors can attach JWTs and retry after refreshes.
- **Real-time updates** – `connectWebSocket` establishes SockJS/STOMP sessions with heartbeat + retry logic. Notifications feed both visual updates and toast alerts.

## Testing & Quality

- **Unit/integration** – Use `npm run test` (Jest + Testing Library). Shared utilities live under `src/__tests__` with setup in `src/__tests__/testSetup.js`.
- **Mocking** – `msw` intercepts network calls when needed; assets and CSS are mapped through `identity-obj-proxy`.
- **End-to-end** – Cypress specs live in `cypress/e2e`. Ensure the backend and `npm run dev` are running before executing `npm run cypress:open` or `npm run cypress:run`.
- **Linting** – `npm run lint` enforces React, hooks, JSX a11y, and Cypress rules with `--max-warnings 0`.

## Troubleshooting

- **401 loops** – Confirm the backend issues refresh tokens at `/api/auth/refresh`. Without it, the Axios interceptor forces a logout.
- **WebSocket failures** – Update the WS endpoint inside `src/config/websocketConfig.jsx` if your backend host/port differs.
- **Drag/drop glitches** – The interactive map depends on `DndProvider` + `HTML5Backend`; ensure components using drag/drop live under `App.jsx`.
- **Cypress cannot log in** – Seed users on the backend with roles (`ADMIN`, `MANAGER`, `STAFF`, `CUSTOMER`) so guarded routes resolve correctly.

## Next Steps

- Connect this frontend to the Reservit backend repository or API gateway.
- Add CI (GitHub Actions/GitLab CI) that runs `npm run lint`, `npm run test`, and `npm run test:e2e`.
- Customize branding by updating assets under `src/assets` and `public/`.

Happy building!
