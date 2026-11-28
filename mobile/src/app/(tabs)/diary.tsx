import { Button, Card, ListRow, MemoryCard, Notice, Screen, SectionLabel } from '@/components/wireframe';

export default function DiaryScreen() {
  return (
    <Screen title="Diary" subtitle="Your stories, thoughts, and memories.">
      <Button label="+ Write a diary or letter" href="/diary-editor" />

      <SectionLabel>Your diary</SectionLabel>
      <Card>
        <ListRow title="Diary Timeline" subtitle="Browse all memories" href="/diary-timeline" />
        <ListRow title="Entry Details" subtitle="Review a saved entry" href="/entry-details" />
      </Card>

      <SectionLabel action={{ label: 'View all', href: '/diary-timeline' }}>Recent memories</SectionLabel>
      <MemoryCard
        title="A quiet Sunday afternoon"
        meta="Nov 22, 2026 • Personal"
        preview="Spent the afternoon remembering the little moments that made this week meaningful."
        href="/entry-details"
      />
      <MemoryCard
        title="My favorite family tradition"
        meta="Nov 18, 2026 • Family"
        preview="Today I wrote about an old tradition and why I want my family to remember it."
        href="/entry-details"
      />

      <Card title="Writing Modes" subtitle="Choose how ENGRAM helps with your writing">
        <Button label="Verbatim · Light Fix · Review" variant="secondary" href="/writing-modes" />
      </Card>

      <Notice>Your original words are always preserved.</Notice>
    </Screen>
  );
}
