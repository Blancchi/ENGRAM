import { Card, ListRow, Notice, Screen, SectionLabel } from '@/components/wireframe';

export default function ReleaseStatusScreen() {
  return (
    <Screen
      title="Legacy Release Status"
      subtitle="See whether your release conditions are satisfied."
      back={{ label: 'Back to Legacy', href: '/legacy' }}>
      <Card title="Release status" subtitle="Pending verification. Your memories remain protected." />

      <SectionLabel>Release checks</SectionLabel>
      <Card>
        <ListRow title="Owner-defined conditions" subtitle="Awaiting verification" />
        <ListRow title="Beneficiary permissions" subtitle="No access until release" />
        <ListRow title="Policy review" subtitle="Owner policies remain in effect" />
        <ListRow title="Vault protection" subtitle="Private content stays locked" />
      </Card>

      <Notice title="Important protection">
        A reminder or missed check-in alone never activates release or grants beneficiary access.
      </Notice>
    </Screen>
  );
}
