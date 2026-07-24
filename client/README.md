# Internship Applicant Management Dashboard

A frontend admin dashboard built for the INFNOVA Technologies Frontend Internship
practical challenge. Lets an administrator log in, browse and filter internship
applicants, view full applicant details, update application status, leave internal
notes, and see summary statistics — all against the provided REST API.

**Live app:** [DEPLOYED_URL](https://applicant-managment-system.vercel.app/dashboard)
**Repository:** [GITHUB_URL](https://github.com/smile679/applicant_managment_system.git)

---

## Setup instructions

1. Clone the repo and install dependencies:
   ```bash
   git clone https://github.com/smile679/applicant_managment_system.git
   cd client
   npm install
   ```
2. Create a `.env` file in the project root with:
   ```
   VITE_INFNOVA_URL=https://infnova-intern.vercel.app/api
   ```
3. Run the dev server:
   ```bash
   npm run dev
   ```
4. Log in with the credentials provided in the challenge brief:
   - Email: `admin@infnova.tech`
   - Password: `InternChallenge2026!`

Build for production with `npm run build`; preview the build with `npm run preview`.

---

## Technologies used

| Tool | Why |
|---|---|
| **React + Vite** | Fast dev server and build tooling, no need for Next.js's SSR/routing since this is a client-only admin tool behind auth. |
| **React Router (v7)** | Client-side routing, protected route layout, and `useParams`/`useNavigate` for the applicant detail page. |
| **Axios** | Central `axiosInstance` with request/response interceptors — attaches the bearer token to every request automatically and globally handles 401 (expired session) in one place, instead of repeating auth logic per API call. |
| **React Context (`AuthContext`)** | Chosen over Redux Toolkit. Auth (token/user) is the only truly global state in this app; Context is enough without the extra setup and learning overhead a full state-management library would add, given the project's scope and timeline. |
| **shadcn/ui + Tailwind CSS v4** | Accessible, unstyled component primitives (Select, Table, Card, Dialog, etc.) styled with Tailwind utility classes — fast to compose a consistent UI without hand-rolling accessibility behavior for things like dropdowns. |
| **shadcn Charts (Recharts under the hood)** | Dashboard summary visualizations (donut chart for status breakdown, bar chart for track breakdown), styled to match the rest of the UI via shadcn's chart theming layer. |
| **Sonner** | Toast notifications for success/error feedback across login, logout, status updates, and note saves. |
| **react-icons** | Icon set used throughout (nav, header, form fields, status indicators). |

**Not used:** TypeScript. The project started in JavaScript, and given the fixed
deadline, converting mid-project was judged higher-risk than shipping a complete,
well-tested JS app. `allowJs` tooling was evaluated early on to allow incremental
adoption, but ultimately descoped to protect delivery time.

---

## Architecture

- **`src/api/`** — one file per resource (`auth.js`, `applicants.js`, `dashboard.js`),
  each exporting small, single-purpose functions that call a shared `axiosInstance`.
  Status updates and notes updates are deliberately separate functions
  (`updateApplicantStatus`, `updateApplicantNote`), mirroring the API's own two
  distinct `PATCH` endpoints rather than combining them into one general-purpose
  "update applicant" call.
- **`src/lib/axiosInstance.js`** — a configured Axios instance with:
  - a **request interceptor** that reads the token from `sessionStorage` and attaches
    `Authorization: Bearer <token>` to every outgoing request
  - a **response interceptor** that catches any `401`, clears stored auth, and
    redirects to `/auth/login?expired=true` — the single mechanism behind the
    app's expired-session handling, regardless of which request triggered it
- **`src/context/AuthContext.jsx`** — owns `token`/`user` state, initialized lazily
  from `sessionStorage` so a page refresh doesn't log the user out. Exposes
  `login`, `logout`, and `isAuthenticated` via a `useAuth()` hook.
- **`src/components/ProtectedRoute.jsx`** — a layout route guard; redirects to
  `/auth/login` if `isAuthenticated` is false, otherwise renders the nested routes
  via `<Outlet />`.
- **`src/components/hooks/useDebounce.js`** — generic debounce hook (default
  500ms), used on the search and country filter inputs so typing doesn't fire an
  API request per keystroke.
- **`src/pages/dashboard/`** — `Dashboard.jsx` (summary stats + charts),
  `Applicants.jsx` (filterable/sortable/paginated table), `ApplicantDetail.jsx`
  (full record, status updater, notes editor).
- **`src/components/dashboard/`** — `Layout.jsx` and `Sidebar.jsx`: a collapsible
  desktop sidebar (icon-only when collapsed) that becomes an off-canvas mobile
  drawer below the `lg` breakpoint, plus the shared `Header.jsx`.

**Session storage over local storage:** the access token is stored in
`sessionStorage`, not `localStorage`. Given the token's 1-hour expiry and that this
is an internal admin tool, there's no benefit to persisting a token across browser
restarts — doing so would just mean a stale/expired token sitting around, causing
an immediate forced logout on next open rather than a clean login screen.

**List vs. detail API shape:** the `/applicants` list endpoint returns a trimmed
summary (no `experienceLevel`, `notes`, `skills`, etc.), while `/applicants/{id}`
returns the full record. The UI respects this — the applicant table only displays
fields the list endpoint actually provides (Experience Level is filterable but not
shown as a column, since the API never returns it per-row), and richer fields like
skills, links, motivation, and notes are only shown on the detail page.

---

## Assumptions made

- The `status` field only accepts `pending`, `shortlisted`, `accepted`, `rejected`
  (confirmed via the API's validation error message and docs).
- `track` accepts `frontend`, `backend`, `ui/ux`, `data analytics`, `mobile`;
  `experienceLevel` accepts `beginner`, `intermediate`, `advanced` — taken directly
  from the interactive docs rather than guessed.
- Query parameters for unset filters are omitted entirely (rather than sent as
  empty strings), since the API returns a 400 for empty-string enum values like
  `status=""`.
- A failed logout API call (e.g. network issue, already-expired token) still clears
  local auth state and redirects to login — the user's intent to log out is honored
  locally regardless of whether the server-side call succeeds, since the token will
  expire on its own within the hour either way.
- The dashboard's "pending" stat is treated as the most actionable number for an
  admin and is called out in a highlighted banner; this is a UI judgment call, not
  something the API specifies.

---

## What I'd improve with more time

- **TypeScript** — type the API response shapes (several of which I confirmed by
  hand against the live docs) to catch shape mismatches at compile time instead of
  runtime.
- **Optimistic UI for status updates** in the applicant table itself (currently only
  the detail page updates status; doing it inline from the list would save a click).
- **URL-synced filters** — currently filter/sort/page state resets on refresh;
  syncing it to the URL query string would make filtered views shareable and
  survive a reload, consistent with the reasoning behind using routed pages instead
  of a modal for the detail view.
- **Automated tests** — at minimum, tests around the axios interceptors (token
  attachment, 401 handling) and the debounce hook, since those are the pieces most
  likely to silently regress.
- **Light/dark theme toggle** — evaluated during development (`next-themes` was
  installed early on) but descoped to prioritize completing all required
  functionality within the deadline.
- **Retry/backoff on transient network errors**, distinct from the explicit
  `simulateError` demo path.