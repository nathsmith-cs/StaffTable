# StaffTable

**Work in progress — personal project by [Nate Smith](https://github.com/nathsmith-cs).**

A restaurant staff-scheduling application built to explore full-stack development with React, Express, and MongoDB. The project is unfinished; it is not presented as production-ready.

## Current code

- React frontend with welcome, login, and dashboard views.
- Express backend with authentication and shift routes.
- Mongoose models and database connections for restaurant locations.
- JWT-based authentication and bcrypt password hashing dependencies.

## Stack

JavaScript · React · Express · MongoDB/Mongoose · JSON Web Tokens

## Local development

Prerequisites: Node.js 18 or newer, npm, and a development MongoDB database. These steps reflect the checked-in scripts; end-to-end setup still needs validation.

### Backend

Create `backend/.env` with your own development values:

```dotenv
MONGODB_URI=mongodb://127.0.0.1:27017/stafftable-dev
JWT_SECRET=replace-with-a-long-random-development-secret
FRONTEND_URL=http://localhost:3000
PORT=5001
```

The default MongoDB URI is used when a location-specific URI is absent. Optional overrides are `MONGODB_URI_BECKER`, `MONGODB_URI_TEMPE`, `MONGODB_URI_DOWNTOWN`, and `MONGODB_URI_NORTH_SCOTTSDALE`.

```bash
cd backend
npm install
npm run dev
```

### Frontend

In another terminal:

```bash
cd frontend
npm install
npm start
```

The development frontend uses `http://localhost:5001` for the API by default. Set `REACT_APP_API_URL` to override it. The backend exposes `/api/health`, `/api/auth`, and `/api/shifts`.

## Repository layout

- `frontend/src/` — React views and API configuration.
- `backend/routes/` — authentication and shift endpoints.
- `backend/config/` — database connection management.
- `backend/models/` — data models.

## Next steps

- Finish and verify the scheduling workflow.
- Test authentication and location-specific access.
- Add screenshots and a reproducible demo.
- Add meaningful tests for core flows.
