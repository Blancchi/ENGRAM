# ENGRAM Mobile

The mobile app uses React Native, Expo, TypeScript, and Expo Router.

## Setup

From the repository root:

```bash
cd mobile
npm install
npm start
```

You can then open the app in Expo Go, an Android emulator, or a web browser.

## Starting routes

- `/login` is the sign-in and role-entry page.
- `/home` is the empty owner home placeholder.
- `/asker` is the registered-asker placeholder.
- Owner features are available from the bottom tab navigation in `src/app/(tabs)`.

No authentication or backend calls are implemented in this starting UI step.

## Validation

```bash
npx tsc --noEmit
npx expo lint
```
