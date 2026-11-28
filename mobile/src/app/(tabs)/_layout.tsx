import { Tabs } from 'expo-router';

import { TabIcon } from '@/components/wireframe';
import { WF } from '@/constants/wireframe';

/**
 * Five visible tabs (Home, Legacy, AI Chat, Diary, Settings).
 * Every other screen lives in this folder too but is hidden from the tab bar
 * (href: null), so the bottom bar stays visible on detail screens like the design.
 */
const HIDDEN_SCREENS = [
  'profile',
  'edit-profile',
  'security-privacy',
  'add-beneficiary',
  'beneficiary-access',
  'access-rule',
  'apl-validation',
  'create-legacy-lesson',
  'release-status',
  'diary-editor',
  'writing-modes',
  'diary-timeline',
  'entry-details',
  'authorized-source',
] as const;

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: WF.black,
        tabBarInactiveTintColor: WF.gray500,
        tabBarStyle: { backgroundColor: WF.white, borderTopColor: WF.gray300, borderTopWidth: 1.5 },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
      }}>
      <Tabs.Screen name="home" options={{ title: 'Home', tabBarIcon: ({ focused }) => <TabIcon focused={focused} /> }} />
      <Tabs.Screen name="legacy" options={{ title: 'Legacy', tabBarIcon: ({ focused }) => <TabIcon focused={focused} /> }} />
      <Tabs.Screen name="chat" options={{ title: 'AI Chat', tabBarIcon: ({ focused }) => <TabIcon focused={focused} /> }} />
      <Tabs.Screen name="diary" options={{ title: 'Diary', tabBarIcon: ({ focused }) => <TabIcon focused={focused} /> }} />
      <Tabs.Screen name="settings" options={{ title: 'Settings', tabBarIcon: ({ focused }) => <TabIcon focused={focused} /> }} />
      {HIDDEN_SCREENS.map((name) => (
        <Tabs.Screen key={name} name={name} options={{ href: null }} />
      ))}
    </Tabs>
  );
}
