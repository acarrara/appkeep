# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development
```bash
# Start the backend Express server (runs on port 3000)
npm start

# Start the Angular dev server (runs on port 4200, proxies /api and /auth to port 3000)
npm run serve

# Build for production (output to dist/appkeep/browser/)
npm run build

# Serve the production build with the Express server
npm run serve:prod
```

### Testing
```bash
# Run unit tests with vitest (watch mode)
npm test

# Run tests once with coverage
npm run test:coverage

# Run a single spec file
npx vitest run src/app/sumAppKeeps.spec.ts
```

### Linting
```bash
npm run lint
```

### Setup (required before first run)
The `preserve` and `prebuild` scripts automatically run `node scripts/credentials.js`, which reads `.env` and generates `src/credentials.json` and `src/vapid.json`. Create a `.env` file with:
- `clientID` — Google OAuth client ID
- `DB_URI` — MongoDB connection string
- `VAPID_PUBLIC_KEY` / `VAPID_PRIVATE_KEY` — Web push keys

## Architecture

### Two-layer application
- **Frontend**: Angular 20 SPA (`src/`) — standalone components, zoneless change detection
- **Backend**: Express.js API (`scripts/server.js`, `scripts/api/`) — serves the REST API and in production also serves the built Angular app

During development, `proxy.conf.json` proxies `/api` and `/auth` from the Angular dev server to the Express backend on port 3000.

### Custom Redux state management (`src/redux/`)
The app uses a hand-rolled Redux pattern (not NgRx):
- `StoreService` — holds the single observable state stream, dispatches actions
- `Reducer<State, Payload>` — pure function `(action, oldState) => newState`
- `Epic<PayloadIn, PayloadOut>` — RxJS observable pipeline `(actions$) => Observable<Action>` (similar to redux-observable)
- `Action<Payload>` — `{ type: string, payload? }`

The store is bootstrapped in `src/main.ts` by calling `store.setup()` with all reducers and epics.

### Generic REST layer (`src/app/RestEpic.ts`, `src/app/RestReducer.ts`)
`RestEpic` and `RestReducer` are generic classes that, given a resource name (e.g. `"appkeep"`), auto-generate CRUD epics and reducers by convention:
- Actions follow the pattern `LOAD_<NAME>S`, `ADD_<NAME>`, `EDIT_<NAME>`, `DELETE_<NAME>` (and `_SUCCESS` variants)
- Epics call `/api/<name>s` REST endpoints
- Reducers update the corresponding `<name>s` array in `AppKeepState`

`ArrayableFunctions` is a base class used by `AppEpics` and `AppReducers` that reflects all instance methods into an array, so they can be spread into the store setup.

### Application state (`src/app/models/AppKeepState.ts`)
Central state shape: `appKeeps`, `monthlyAppKeeps`, `options`, `categories`, `statistics`, `monthStatistics`, `yearStatistics`, `categoryStatistics`, `user`, `users`.

### Backend (`scripts/api/`)
- `manifest.js` — entry point: connects to MongoDB and mounts all route modules
- Route modules: `appkeeps.js`, `categories.js`, `options.js`, `users.js`, `monthlyAppkeeps.js`, `statistics.js`, `notifications.js`, `auth.js`
- `auth.js` — validates Google ID tokens and issues JWT; authorization is whitelist-based (user email must exist in MongoDB)
- `utils/auth-middleware.js` — verifies JWT on every request
- `schemas/` — Mongoose schemas

### Authentication flow
Google One Tap → Angular sends ID token to `POST /auth` → backend verifies with Google OAuth2Client → issues JWT → Angular stores and sends as `Authorization` header via `AuthInterceptor`.

### PWA
Angular Service Worker is enabled in production. Push notifications are handled via Web Push (VAPID keys in `.env`).
