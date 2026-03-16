# Fit Boss

Fit Boss is a cross-platform fitness tracker starter built with Expo React Native and Supabase. It includes Google sign-in, nutrition tracking with OpenFoodFacts, body metrics, workout timing, a capped fitness score system, leaderboard views, workout playlist launch shortcuts, and offline-first sync.

## Download APK

[![Download Latest APK](https://img.shields.io/badge/Download-Latest%20APK-1B8A5A?style=for-the-badge&logo=android&logoColor=white)](https://github.com/RakeshM1402/FitBoss/releases/latest)

Download the newest Android build from the latest GitHub release:
[https://github.com/RakeshM1402/FitBoss/releases/latest](https://github.com/RakeshM1402/FitBoss/releases/latest)

## Project structure

```text
.
|-- App.tsx
|-- app.json
|-- package.json
|-- supabase/
|   `-- schema.sql
`-- src/
    |-- components/
    |-- context/
    |-- hooks/
    |-- navigation/
    |-- screens/
    |-- services/
    |-- theme/
    |-- types/
    `-- utils/
```

## Architecture

- Expo React Native provides a single Android and iOS codebase.
- `AppContext` owns app state, local persistence, queueing, profile logic, and score generation.
- AsyncStorage stores food logs, workouts, scores, profile data, and pending sync items for offline use.
- NetInfo detects connectivity and triggers queued sync replay to Supabase.
- Supabase stores users, food logs, workouts, and fitness scores, and exposes RPC functions for weekly and all-time leaderboards.
- OpenFoodFacts is called on demand to fetch per-100g nutrition values and scale them by grams.

## Feature mapping

- Authentication: Google OAuth through Supabase Auth.
- Nutrition tracking: `src/services/openFoodFacts.ts` and `src/screens/AddFoodScreen.tsx`.
- Body metrics: BMR, daily calories, and body fat estimate in `src/utils/calculations.ts`.
- Workout tracking: timer and workout logging in `src/screens/WorkoutModeScreen.tsx`.
- Fitness score system: generated in `src/context/AppContext.tsx` with the requested point rules and daily cap.
- Leaderboards: weekly and all-time tabs in `src/screens/LeaderboardScreen.tsx`.
- Music integration: opens Spotify and YouTube Music playlists via deep links.
- Offline mode: local-first writes, `synced: false` markers, and queue replay via `src/hooks/useOfflineSync.ts`.

## Running locally

1. Install dependencies.

```bash
npm install
```

2. Copy `.env.example` to `.env` and add your Supabase credentials.

3. In Supabase:

- Create a project.
- Enable Google in Authentication > Providers.
- Add `fitboss://` as an allowed redirect URL.
- Run [`supabase/schema.sql`](/C:/Users/Rakesh%20M/Desktop/Fit%20Boss/supabase/schema.sql).

4. Start Expo.

```bash
npm run start
```

5. Launch on iOS or Android through Expo Go or a simulator.

## Notes

- Food lookup requires internet, but saved entries remain available offline.
- Sync retries automatically the next time network connectivity is restored.
- This starter keeps charts dependency-light by rendering native view bars instead of using a chart package.
