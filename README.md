# Hotel Reservation System

Oracle/PLSQL-backed hotel reservation system (one property). Core booking rules, overlap prevention, audit trail, and checkout logic live in the database; Node/Express exposes a thin API and React provides the front-desk UI.

## Structure

- `db/` — Oracle DDL/scripts (tables, sequences, indexes, triggers, etc.)
- `api/` — Express API draft wired to planned `pkg_hotel` procedures/functions
- `frontend/` — React (Vite) front-desk UI

## Current status

UI and API scaffolding are in place. **Database is not connected yet** and no DB actions are performed. API routes return `501 Not Implemented` with the expected PL/SQL call/payload until the Oracle pool and package/procedures are ready.

## Running locally

### API
```bash
cd api
cp .env.example .env   # DB_DISABLED=true by default
npm install
npm run dev            # http://localhost:4000
```

### Frontend
```bash
cd frontend
npm install
npm run dev            # http://localhost:5173 (proxies /api to :4000)
```

## Planned API ↔ PL/SQL mapping

| Endpoint | Method | PL/SQL target |
|---|---|---|
| `/api/availability` | GET | `pkg_hotel.get_available_rooms(...)` |
| `/api/bookings` | POST | `pkg_hotel.book_reservation(...)` |
| `/api/bookings/:id` | DELETE | cancel procedure (TBD) |
| `/api/guests` | GET | guest lookup query |
| `/api/guests/:id` | GET | guest profile + `fn_reservation_total` |
| `/api/checkout` | POST | `pkg_hotel.process_checkouts(...)` |
| `/api/audit` | GET | `audit_log` read |

To enable DB: set `DB_DISABLED=false` and provide `DB_*` credentials in `api/.env`, then implement the TODO blocks in `api/routes/*` and `api/db.js` as needed.
