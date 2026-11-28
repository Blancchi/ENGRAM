import { Button, Card, ListRow, Screen, SectionLabel } from '@/components/wireframe';

export default function HomeScreen() {
  return (
    <Screen title="Welcome back!" subtitle="Your memories, thoughts, and plans in one place.">
      <Card title="My Diary" subtitle="Your story, protected through time.">
        <Button label="+ Write a new memory" href="/diary-editor" />
        <Button label="View all" variant="ghost" href="/diary-timeline" />
      </Card>

      <SectionLabel action={{ label: 'See all', href: '/chat' }}>Recent Conversation</SectionLabel>
      <ListRow title="Talk with ENGRAM" subtitle="Continue exploring your saved memories." href="/chat" />

      <SectionLabel action={{ label: 'See all', href: '/diary' }}>Latest Notes</SectionLabel>
      <ListRow title="Ideas to remember" subtitle="Your latest saved note" meta="Today" href="/entry-details" />

      <SectionLabel>Tasks</SectionLabel>
      <Card title="Review today's plans" subtitle="Stay on track with your daily goals." />
    </Screen>
  );
}
