# CODEX.md

## Project Overview

Fit Boss is a cross-platform mobile fitness tracker built with Expo + React Native + TypeScript. The app is designed around a single local-first state container that stores user profile data, food logs, workout logs, fitness score entries, leaderboard data, and an offline sync queue.

The current user journey is:

1. App boots through `App.tsx`
2. `AppProvider` hydrates persisted app state from AsyncStorage
3. `AppNavigator` decides whether to show:
   - `LoginScreen` if unauthenticated
   - `OnboardingSurveyScreen` if authenticated but no onboarding/profile exists
   - main bottom-tab application if onboarding is complete
4. User actions write into local state first
5. Unsynced writes are queued in `pendingSync`
6. When connectivity is available, sync services replay queued writes to Supabase
7. Leaderboards are fetched from Supabase RPC functions when authenticated and online

This is an offline-first Expo app with Supabase as the backend system of record.

## Tech Stack

### Frontend
- Expo SDK 52
- React 18
- React Native 0.76.6
- TypeScript with `strict: true`
- React Navigation
  - `@react-navigation/native`
  - `@react-navigation/native-stack`
  - `@react-navigation/bottom-tabs`
- `react-native-gesture-handler`
- `react-native-safe-area-context`
- `@expo/vector-icons`
- `expo-font`
- `expo-build-properties`

### Local Device Services
- `@react-native-async-storage/async-storage` for persisted local app state
- `@react-native-community/netinfo` for network status detection
- `expo-linking` and `expo-web-browser` for auth redirects / deep link handling
- `expo-auth-session` for OAuth redirect URI construction

### Backend / External Services
- Supabase
  - Auth
  - Postgres tables
  - RPC functions for leaderboard aggregation
  - Row Level Security policies
- USDA FoodData Central API
- OpenFoodFacts API

### Build / Delivery
- EAS Build via `eas.json`
- GitHub Actions workflow in `.github/workflows/android-preview.yml`
- Android preview APKs published from CI

## Root Folder Structure

- `App.tsx`
  - App entry point. Wraps providers and renders `AppNavigator`.
- `app.json`
  - Expo app metadata, bundle identifiers, app scheme (`fitboss`), build plugin config.
- `eas.json`
  - EAS preview/production build profiles.
- `package.json`
  - Scripts and dependency manifest.
- `.gitignore`
  - Prevents local/generated files and secrets from being committed.
- `.env.example`
  - Expected public environment variables.
- `README.md`
  - Human-oriented overview and setup notes.
- `supabase/schema.sql`
  - Database schema, RPCs, RLS, and policies.
- `.github/workflows/android-preview.yml`
  - CI workflow for Android preview APK generation.
- `src/`
  - Entire application codebase.
- `dist/`
  - Build artifacts produced by CI/build output.
- `.expo/`
  - Expo local metadata.
- `node_modules/`
  - Installed dependencies, not source.

## `src/` Folder Structure

### `src/components`
Reusable presentational UI building blocks.

- `AppErrorBoundary.tsx`
  - Top-level error boundary for startup/runtime rendering failures.
- `StatCard.tsx`
  - Small metric card used on dashboard-style layouts.
- `ProgressChart.tsx`
  - Lightweight bar chart rendered with plain React Native views.

### `src/context`
Application-wide state ownership.

- `AppContext.tsx`
  - Central architecture file.
  - Owns the entire app state.
  - Handles auth flags, profile save, food/workout/score creation.
  - Persists state to AsyncStorage.
  - Maintains offline sync queue.
  - Computes daily score rollups and streak logic.

### `src/hooks`
Cross-cutting behavior hooks.

- `useOfflineSync.ts`
  - Watches network/auth/sync state.
  - Replays pending writes when online.
  - Fetches leaderboard data when authenticated and connected.

### `src/navigation`
Routing setup.

- `AppNavigator.tsx`
  - Creates stack + bottom-tab navigation.
  - Gates app access by auth/profile onboarding state.
  - Kicks off daily score hydration after authentication.

### `src/screens`
Feature-level screens.

- `LoginScreen.tsx`
  - Current login experience is effectively demo/guest entry.
  - Uses `loginAsGuest()` from context.
  - UI positions the app as a gamified fitness dashboard.
- `OnboardingSurveyScreen.tsx`
  - Collects profile data + onboarding answers.
  - Saves derived profile into context/local storage and sync queue.
- `DashboardScreen.tsx`
  - Shows high-level metrics:
    - calories consumed
    - total score
    - streak
    - BMR
    - estimated body fat
    - recent score chart
- `AddFoodScreen.tsx`
  - Lets the user search nutrition data by food name + grams.
  - Pulls data from USDA first, then OpenFoodFacts fallback.
  - Adds food entries locally and queues sync.
  - Shows the nutrition source used for each recent match.
- `DailyCaloriesScreen.tsx`
  - Displays today's calorie progress toward the computed daily goal.
  - Lists today's food entries.
- `WorkoutModeScreen.tsx`
  - Timer-based workout logging.
  - Saves workout completion locally.
  - Includes playlist deep links for Spotify and YouTube Music.
- `LeaderboardScreen.tsx`
  - Switches between weekly and all-time leaderboard views.
  - Displays leaderboard results fetched from Supabase RPCs.
- `UserProfileScreen.tsx`
  - Edits basic profile stats.
  - Recomputes BMR, daily calorie goal, and body fat preview.
  - Preserves onboarding answers if they already exist.
  - Provides logout action.

### `src/services`
I/O and backend integration layer.

- `supabase.ts`
  - Creates the shared Supabase client using public env vars.
  - Auth config disables URL session detection and persistent auth storage.
- `storage.ts`
  - AsyncStorage load/save helpers for persisted `AppState`.
  - Clears corrupted cached state on load instead of crashing startup.
- `sync.ts`
  - Serializes app models into database column format.
  - Replays pending queue items to Supabase via upserts.
  - Fetches leaderboard data through Supabase RPC.
- `openFoodFacts.ts`
  - Nutrition lookup service.
  - Uses USDA FoodData Central first.
  - Falls back to OpenFoodFacts if USDA returns no usable match.
  - Tags results with the source used.

### `src/theme`
Design tokens.

- `theme/index.ts`
  - Central color palette and spacing constants.
  - Most screens use these values consistently.

### `src/types`
Shared domain model definitions.

- `types/index.ts`
  - Defines `AppState`, `UserProfile`, logs, leaderboard entries, queue actions, onboarding types, and enum-like union types.

### `src/utils`
Pure logic helpers.

- `calculations.ts`
  - BMR, calorie goal, body fat estimate, calorie consumption total, and fitness score calculation.
- `date.ts`
  - Date-key utilities used for daily rollups/streak logic.
- `id.ts`
  - Local ID generation for offline-created entities.

## Major Modules and What They Do

### 1. App Shell
Files:
- `App.tsx`
- `src/components/AppErrorBoundary.tsx`
- `src/navigation/AppNavigator.tsx`

Responsibilities:
- Bootstraps provider hierarchy
- Applies navigation theme
- Keeps startup failures from crashing the whole app
- Routes user between auth, onboarding, and main app

### 2. Global State and Local-First Persistence
Files:
- `src/context/AppContext.tsx`
- `src/services/storage.ts`
- `src/types/index.ts`

Responsibilities:
- Single source of truth for app runtime state
- Local persistence to AsyncStorage
- Session flags (`isAuthenticated`, `sessionEmail`, `sessionUserId`)
- Offline queue management
- Mutations for profile, food, workouts, and score entries

### 3. Sync Engine
Files:
- `src/hooks/useOfflineSync.ts`
- `src/services/sync.ts`
- `src/services/supabase.ts`

Responsibilities:
- Detect online/offline state
- Push local pending writes to Supabase
- Mark synced items indirectly by shrinking the pending queue
- Fetch leaderboard snapshots after auth/network availability

### 4. Fitness Computation Engine
Files:
- `src/utils/calculations.ts`
- `src/utils/date.ts`
- parts of `src/context/AppContext.tsx`

Responsibilities:
- Compute BMR
- Compute daily calorie target
- Estimate body fat
- Compute daily calorie totals
- Award daily fitness score points
- Maintain streak progression logic

### 5. Feature Screens
Files:
- `src/screens/*`

Responsibilities:
- Collect input
- Render metrics
- Call context methods
- Avoid direct backend/database access from UI components

### 6. Backend Schema
Files:
- `supabase/schema.sql`

Responsibilities:
- Defines tables:
  - `users`
  - `food_logs`
  - `workouts`
  - `fitness_scores`
  - `leaderboards`
- Defines leaderboard RPC functions:
  - `get_weekly_leaderboard()`
  - `get_all_time_leaderboard()`
- Enables RLS
- Adds ownership-based policies

## Shared Components, Services, Utilities, and Config

### Shared Components
- `StatCard`
- `ProgressChart`
- `AppErrorBoundary`

These should stay presentational and not accumulate business logic.

### Shared Services
- `supabase.ts` for backend client creation
- `storage.ts` for local persistence
- `sync.ts` for syncing and leaderboard fetching
- `openFoodFacts.ts` for third-party nutrition lookup

### Shared Utilities
- `calculations.ts`
- `date.ts`
- `id.ts`

These are pure helpers and should remain framework-light.

### Shared Configuration
- `app.json`
- `eas.json`
- `.gitignore`
- `.env.example`
- `tsconfig.json`
- `.github/workflows/android-preview.yml`

## Authentication Flow

## Intended/Auth-Capable Flow
`AppContext.tsx` contains a `loginWithGoogle()` implementation that:
1. Generates redirect URI with `makeRedirectUri({ scheme: 'fitboss', path: 'auth/callback' })`
2. Calls `supabase.auth.signInWithOAuth({ provider: 'google' })`
3. Opens auth session in browser
4. Extracts `access_token` and `refresh_token` from callback URL
5. Calls `supabase.auth.setSession(...)`
6. Marks the app authenticated and stores session user metadata in memory

## Current Active UX Flow
The current `LoginScreen.tsx` only exposes guest/demo login via `loginAsGuest()`.
That means:
- Google OAuth support exists in context/service logic
- The actual screen currently enters through guest mode only
- Guest login sets:
  - `isAuthenticated = true`
  - fake session email
  - generated local user ID if needed

## Logout Flow
`logout()` only clears local auth/session flags in app state.
It does not currently call `supabase.auth.signOut()`.

## Data Flow

### Local Write Flow
1. User interacts with a screen
2. Screen calls a context action such as:
   - `saveProfile`
   - `addFoodLog`
   - `addWorkout`
   - `addScoreEntry`
3. Context creates a local entity with generated ID if needed
4. Context updates in-memory state immediately
5. Context appends a `PendingSyncItem` to `pendingSync`
6. Entire app state is persisted to AsyncStorage

### Sync Flow
1. `NetInfo` updates `state.isOnline`
2. `useOfflineSync()` detects online state and pending queue
3. `syncPendingItems()` serializes each queued item
4. Each item is upserted into the matching Supabase table
5. Failed items remain in queue
6. Successful items disappear from queue
7. `replacePendingSync()` recomputes `synced` flags based on remaining queue contents

### Leaderboard Flow
1. User must be authenticated and online
2. `useOfflineSync()` calls `fetchLeaderboards()`
3. Supabase RPCs return weekly/all-time aggregates
4. Results are mapped into frontend `LeaderboardEntry` objects
5. Context stores them in `weeklyLeaderboard` and `allTimeLeaderboard`

### Daily Score / Streak Flow
1. After auth, `AppNavigator` calls `hydrateDailyScore()`
2. Context checks whether today's rollup score already exists
3. It computes:
   - total calories consumed today
   - whether a workout was completed today
   - whether streak should increment
   - whether yesterday was missed
4. It updates the profile and queues a profile sync
5. It creates a new score entry with reason `daily_rollup`

## Database Interactions

The app interacts with Supabase in two ways.

### Table Upserts
Via `src/services/sync.ts`:
- `users`
- `food_logs`
- `workouts`
- `fitness_scores`

Frontend camelCase models are serialized into snake_case database columns before upload.

### RPC Reads
Via `fetchLeaderboards()`:
- `get_weekly_leaderboard`
- `get_all_time_leaderboard`

### Schema Notes
- IDs are UUIDs in the database schema
- Local app may create non-UUID string IDs in guest/offline mode via `generateId()`
- RLS policies are ownership-based using `auth.uid()`
- `leaderboards` table exists, but current app leaderboard reads come from RPC aggregation over `fitness_scores`, not from direct reads of precomputed `leaderboards` rows
- `users` and `food_logs` now include extra onboarding/nutrition-source fields at the serialization/schema boundary

## Coding Conventions Observed In This Repo

- TypeScript is strict
- Functional React components are the default
- One exported component/function per file is common
- Business logic is concentrated in:
  - context
  - services
  - utils
- Screens mostly orchestrate UI + context calls
- Styling uses `StyleSheet.create`
- Theme values come from `src/theme`
- App-wide domain types live in `src/types`
- Naming conventions:
  - frontend fields use camelCase
  - Supabase/Postgres columns use snake_case
- Dates are stored as ISO strings in app state
- Derived values are computed in code rather than duplicated across many places

## Rules Future AI Agents Should Follow When Editing Code

1. Do not bypass `AppContext` for normal state mutations.
2. Do not make screens talk directly to Supabase unless the architecture is intentionally being changed.
3. Keep UI components presentational; put business rules in `context`, `services`, or `utils`.
4. Reuse existing domain types from `src/types` instead of redefining shapes inline.
5. Preserve camelCase in frontend models and snake_case only at the serialization/database boundary.
6. When adding new persisted state, update both:
   - `AppState` type
   - AsyncStorage hydration/persistence expectations
7. When adding a new syncable entity, update:
   - type definitions
   - queue action type
   - serializer logic
   - sync uploader logic
   - any screen/context mutation paths
8. Keep navigation gating consistent with auth/onboarding requirements.
9. Reuse `colors` and `spacing` from `src/theme`.
10. Avoid adding heavyweight dependencies for features already handled by simple native views/utilities.

## Guidelines To Avoid Breaking Architecture

- Treat `AppContext` as the central application state boundary.
- Treat `services/*` as the I/O boundary.
- Treat `utils/*` as pure computation helpers.
- Do not duplicate calculation logic across screens.
- Do not store derived metrics in multiple places unless required.
- Do not mix local UI draft state with persisted global app state unnecessarily.
- Preserve the offline-first model:
  - local update first
  - queue sync second
- Be careful when changing profile or score logic because dashboard, onboarding, and streak behavior are coupled through shared state.
- Be careful when changing database field names because `sync.ts` performs manual serialization.
- Keep auth redirect scheme and path aligned between:
  - `app.json`
  - auth redirect generation
  - Supabase provider config

## Instructions To Minimize Unnecessary File Edits

- Prefer editing the smallest number of files possible.
- If a feature is isolated to one screen, avoid touching shared context unless required.
- If changing visuals only, stay inside screen/component/theme files.
- If changing computation only, prefer `src/utils`.
- If changing persistence or backend behavior, prefer `src/services` and `src/context`.
- Do not rename folders or move files unless there is a strong architectural reason.
- Do not reformat unrelated files.
- Do not change CI, build config, or schema unless the task explicitly requires it.
- Preserve current public environment variable names:
  - `EXPO_PUBLIC_SUPABASE_URL`
  - `EXPO_PUBLIC_SUPABASE_ANON_KEY`
  - `EXPO_PUBLIC_USDA_API_KEY`

## Important Current Observations

- The repository currently has existing uncommitted changes; avoid overwriting unrelated work.
- The login screen currently exposes guest/demo mode, even though Google OAuth logic exists in context.
- Supabase auth session persistence is disabled in the shared client config.
- Leaderboards are fetched from RPC functions, not from direct table queries.
- The architecture is optimized for mobile simplicity over deep layering or Redux-style state management.
