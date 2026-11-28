import { Text } from 'react-native';

import { Avatar, Button, Card, Screen, SectionLabel } from '@/components/wireframe';

export default function BeneficiaryAccessScreen() {
  return (
    <Screen
      title="Beneficiary Access"
      subtitle="Review permissions before sharing any memory."
      back={{ label: 'Back to Legacy', href: '/legacy' }}>
      <Card>
        <Avatar size={48} />
        <Text style={{ fontSize: 18, fontWeight: '800' }}>Maria S.</Text>
        <Text style={{ color: '#555555' }}>Daughter • Invited beneficiary</Text>
      </Card>

      <Card title="Access status" subtitle="Waiting for release" />

      <SectionLabel>Authorized scopes</SectionLabel>
      <Card title="Family memories" subtitle="Summary only • May 1, 2040 or later">
        <Text style={{ fontWeight: '700' }}>NOT YET RELEASED</Text>
      </Card>
      <Card title="Letter to my daughter" subtitle="Original text • May 1, 2040 or later">
        <Text style={{ fontWeight: '700' }}>NOT YET RELEASED</Text>
      </Card>
      <Card title="Business memories" subtitle="Explicitly denied • No content is revealed" />

      <Button label="Review access policy" href="/access-rule" />
    </Screen>
  );
}
