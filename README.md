# ExpertBook — Real-Time Expert Session Booking System

A full-stack web application for booking 1-on-1 sessions with domain experts. Features real-time slot updates via Socket.io, race-condition-safe booking with MongoDB atomic operations, and a clean Tailwind CSS UI.

---

## Tech Stack

- **Frontend**: React (Vite), React Router, Axios, Socket.io-client, Tailwind CSS v4
- **Backend**: Node.js, Express, MongoDB (Mongoose), Socket.io
- **Language**: Plain JavaScript (no TypeScript)

---

## Project Structure

```
/server
  /models         → Expert.js, Booking.js
  /routes         → experts.js, bookings.js
  /controllers    → expertController.js, bookingController.js
  /middleware     → errorHandler.js, validate.js
  /socket         → socketManager.js
  server.js
  seed.js
  .env

/client
  /src
    /pages        → ExpertList, ExpertDetail, BookingForm, MyBookings
    /components   → ExpertCard, SlotPicker, BookingStatus, Loader, ErrorState, Navbar
    /hooks        → useExperts.js, useBookings.js, useSocket.js
    /api          → experts.js, bookings.js
    /context      → SocketContext.jsx
    App.jsx
    main.jsx
  .env
```

---

## Setup & Running

### Prerequisites
- Node.js 18+
- MongoDB running locally on port 27017

### Backend

```bash
cd server
npm install
node seed.js       # Populate 12 experts with slots
node server.js     # Start server on http://localhost:5000
```

For development with auto-reload:
```bash
npm run dev        # Uses nodemon
```

### Frontend

```bash
cd client
npm install
npm run dev        # Start Vite dev server on http://localhost:5173
```

---

## Environment Variables

### `/server/.env`
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/expert_booking
CLIENT_URL=http://localhost:5173
```

### `/client/.env`
```
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

---

## API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/experts` | List experts (pagination, search, category filter) |
| GET | `/api/experts/:id` | Get expert with all slots |
| POST | `/api/bookings` | Create booking (atomic, race-condition safe) |
| PATCH | `/api/bookings/:id/status` | Update booking status |
| GET | `/api/bookings?email=` | Get bookings by email |

### Query params for GET /api/experts
- `page` (default: 1)
- `limit` (default: 6)
- `category` — one of: Tech, Business, Health, Finance, Legal, Design
- `search` — name search (case-insensitive)

---

## Features

- **Expert List** — paginated grid with search (debounced 400ms) and category filter
- **Expert Detail** — slots grouped by date, real-time updates via Socket.io
- **Booking Form** — client + server validation, 409 handling for double-booking
- **My Bookings** — search by email, colored status badges, inline status updates
- **Race Condition Prevention** — MongoDB `findOneAndUpdate` with `arrayFilters` ensures atomic slot locking
- **Real-time** — Socket.io rooms per expert; slot instantly disabled across all connected clients when booked

---

## Deliverables Checklist

- [x] Expert list loads with pagination, search, and filter
- [x] Expert detail shows slots grouped by date
- [x] Booking form validates and submits
- [x] 409 returned on double-booking attempt
- [x] Socket.io updates slot in real-time on expert detail page
- [x] My Bookings shows results by email with colored status badges
- [x] Seed script populates 12 experts with slots
- [x] .env files used for all config — no hardcoded URLs
- [x] Folder structure matches spec exactly
