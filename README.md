# LankaTrails Provider Dashboard

[![CI](https://github.com/LankaTrails/lankatrails-provider-dashboard/actions/workflows/ci.yml/badge.svg)](https://github.com/LankaTrails/lankatrails-provider-dashboard/actions/workflows/ci.yml)

The web app for service providers on [LankaTrails](https://github.com/LankaTrails/lankatrails-backend),
a travel platform for Sri Lanka. Hotels, guides, transport operators, activity hosts and restaurants
use it to publish their services, manage bookings, get paid and talk to tourists.

## Features

- **Registration and verification:** sign up with business details and documents, upload licences
  for each service type, and request admin approval.
- **Services:** create and edit accommodation, tour guide, transport, activity and food & beverage
  listings with images, locations (Google Maps picker), pricing and policies.
- **Bookings:** per-service booking lists with status, plus reviews from tourists.
- **Payments:** Stripe Connect Express onboarding so payouts reach the provider's account.
- **Messages:** real-time chat with tourists over STOMP.
- **Insights:** dashboard and analytics for bookings and revenue.
- **Profile:** business profile, contact person, password change and account deactivation.

## Tech stack

React 18 · TypeScript · Vite · Tailwind CSS · Radix UI · Redux Toolkit · React Router · Axios ·
STOMP over SockJS · Recharts · Google Maps JavaScript API

## Run it

The dashboard runs as part of the LankaTrails Docker Compose stack, defined in the backend repo.
Clone this repo next to `lankatrails-backend`, then follow the
[backend README](https://github.com/LankaTrails/lankatrails-backend#run-the-whole-system-with-docker):

```bash
cp .env.example .env                                   # in this repo
cd ../lankatrails-backend
docker compose -f docker-compose.dev.yml up --build -d
```

Open http://localhost:5174. Code changes reload instantly (Vite HMR); dependencies are installed
inside the container.

Without Docker, use Node 24 and run `npm ci && npm run dev`, with the backend reachable at
`VITE_API_BASE_URL`.

### Demo account

After loading the backend's demo data (`./docker/seed/load-seed.sh`), sign in as
`olanka@lankatrails.dev` (Olanka Travels, 18 services) with the `DEMO_USER_PASSWORD` from the
backend's `.env`.

## Environment variables

Copy `.env.example` to `.env`. Vite exposes `VITE_*` variables to the browser, so only use keys
that are safe to publish, and restrict them.

| Variable | Purpose |
|---|---|
| `VITE_API_BASE_URL` | Backend REST API, e.g. `http://localhost:8080/api` |
| `VITE_BASE_URL` | Backend origin for uploaded images and documents |
| `VITE_WS_BASE_URL` | Chat endpoint; defaults to `VITE_BASE_URL` + `/ws` |
| `VITE_GOOGLE_MAPS_API_KEY` | Google Maps JavaScript API for the location picker (restrict by HTTP referrer) |
| `VITE_GOOGLE_MAPS_ID` | Map ID for styled maps |

## Scripts

```bash
npm run dev         # dev server on port 5174
npm run typecheck   # tsc against tsconfig.app.json
npm run lint        # eslint
npm run build       # type check and production build to dist/
```

In Docker, run them with
`docker compose -f docker-compose.dev.yml exec provider-dashboard npm run <script>` from
`lankatrails-backend`. GitHub Actions runs the type check, lint and build on every push and pull
request.

## Project layout

```
src/
  pages/        routes: auth, provider area, per-service pages
  components/   shared UI and forms
  services/     API clients per backend area
  store/        Redux store and slices
  hooks/        auth, WebSocket chat and other hooks
  api/          Axios instance with token refresh
```

## Screenshots

<!-- Screenshots and GIFs of the dashboard go here. -->

_Coming soon._

## License

[MIT](LICENSE)
