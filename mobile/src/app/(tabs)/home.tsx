import { Card, Screen } from '@/components/wireframe';

export default function HomeScreen() {
  return (
    <Screen title="Welcome back!" subtitle="This is your owner home.">
      <Card title="No memories yet" subtitle="New diary entries and plans will appear here." />
    </Screen>
  );
}
