import { Button, Card, Notice, Screen } from '@/components/wireframe';

export default function LegacyScreen() {
  return (
    <Screen title="Legacy" subtitle="Your story, protected through time.">
      <Card title="Your legacy space" subtitle="Organize people, permissions, lessons and release." />

      <Card title="Beneficiaries" subtitle="Manage trusted people and their access.">
        <Button label="Add / Edit Beneficiary" variant="secondary" href="/add-beneficiary" />
        <Button label="Beneficiary Access" variant="secondary" href="/beneficiary-access" />
      </Card>

      <Card title="Legacy Policies" subtitle="Choose what can be shared, and when.">
        <Button label="Access Rule Editor" variant="secondary" href="/access-rule" />
        <Button label="APL Validation" variant="secondary" href="/apl-validation" />
      </Card>

      <Card title="Legacy Lessons" subtitle="Save advice, values and stories for the future.">
        <Button label="+ Create a legacy lesson" href="/create-legacy-lesson" />
      </Card>

      <Card title="Release Status" subtitle="Check whether your release conditions are met.">
        <Button label="View release status" variant="secondary" href="/release-status" />
      </Card>

      <Notice>Your memories stay private until access is authorized.</Notice>
    </Screen>
  );
}
