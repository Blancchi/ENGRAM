import { Redirect } from 'expo-router';

// Skeleton has no auth state yet, so the app always starts at the login screen.
export default function Index() {
  return <Redirect href="/login" />;
}
