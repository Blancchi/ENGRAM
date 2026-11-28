import { Button, Card, Notice, Screen, SectionLabel } from '@/components/wireframe';
import { Text } from 'react-native';

export default function EntryDetailsScreen() {
  return (
    <Screen
      title="Entry Details"
      subtitle="A memory you chose to keep."
      back={{ label: 'Back to Diary Timeline', href: '/diary-timeline' }}>
      <SectionLabel>Personal · November 22, 2026</SectionLabel>
      <Text style={{ fontSize: 24, fontWeight: '800' }}>A quiet Sunday afternoon</Text>
      <Card subtitle="Original entry">
        <Text style={{ fontSize: 15, lineHeight: 22 }}>
          Today I spent the afternoon remembering the little moments that made this week meaningful.
        </Text>
      </Card>
      <Notice title="Original preserved">AI-assisted edits never overwrite your words.</Notice>
      <SectionLabel>Entry actions</SectionLabel>
      <Button label="Edit" variant="secondary" href="/diary-editor" />
      <Button label="Share" variant="secondary" />
      <Button label="Delete" variant="ghost" />
    </Screen>
  );
}
