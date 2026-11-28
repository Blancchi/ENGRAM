import { Text } from 'react-native';

import { Card, InfoRow, Notice, Screen, SectionLabel } from '@/components/wireframe';

export default function AuthorizedSourceScreen() {
  return (
    <Screen
      title="Authorized Source"
      subtitle="View the diary entry used for an AI answer."
      back={{ label: 'Back to AI Chat', href: '/chat' }}>
      <SectionLabel>Authorized source</SectionLabel>
      <Text style={{ fontSize: 24, fontWeight: '800' }}>My favorite family tradition</Text>
      <Text style={{ color: '#555555' }}>November 18, 2026 · Family</Text>
      <Card subtitle="Original diary entry">
        <Text style={{ fontSize: 15, lineHeight: 22 }}>
          Today I wrote about an old tradition and why I want my family to remember it.
        </Text>
      </Card>
      <SectionLabel>Access information</SectionLabel>
      <Card>
        <InfoRow label="Source type" value="Diary entry" />
        <InfoRow label="Permission" value="Summary access" />
        <InfoRow label="Access status" value="Authorized" />
      </Card>
      <Notice>Only content allowed by the owner&apos;s access rules is shown.</Notice>
    </Screen>
  );
}
