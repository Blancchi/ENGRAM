import { router } from 'expo-router';
import { useState } from 'react';

import { Button, ChipGroup, Notice, Screen, SectionLabel, TextBox } from '@/components/wireframe';

export default function AccessRuleScreen() {
  const [beneficiary, setBeneficiary] = useState('');
  const [scope, setScope] = useState('');
  const [level, setLevel] = useState('Summary');
  const [release, setRelease] = useState('');

  return (
    <Screen
      title="New Access Rule"
      subtitle="Set exactly what a beneficiary may access."
      back={{ label: 'Back to Legacy', href: '/legacy' }}>
      <TextBox label="Beneficiary" placeholder="Maria S. • Daughter" value={beneficiary} onChangeText={setBeneficiary} />
      <TextBox label="Entry scope" placeholder="Tagged: Family" value={scope} onChangeText={setScope} />
      <SectionLabel>Permission level</SectionLabel>
      <ChipGroup options={['Existence', 'Summary', 'Full content']} value={level} onChange={setLevel} />
      <TextBox label="Release condition" placeholder="On or after May 1, 2040" value={release} onChangeText={setRelease} />
      <Notice title="Deny by default">Unknown or conflicting rules never grant access.</Notice>
      <Notice title="Deny rules take priority">Access starts only after verified release.</Notice>
      {/* TODO: build the APL rule from these fields and save it through the backend */}
      <Button label="Save access rule" onPress={() => router.back()} />
      <Button label="Cancel" variant="secondary" onPress={() => router.back()} />
    </Screen>
  );
}
