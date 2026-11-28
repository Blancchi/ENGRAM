import { useState } from 'react';

import { Button, Card, InfoRow, Notice, Screen, SectionLabel, TextBox } from '@/components/wireframe';

export default function AplValidationScreen() {
  const [rule, setRule] = useState('');
  const [result, setResult] = useState('Not validated yet');

  return (
    <Screen
      title="APL Validation"
      subtitle="Review policy rules for errors and conflicts."
      back={{ label: 'Back to Legacy', href: '/legacy' }}>
      <TextBox
        label="APL rule"
        placeholder="Paste or write an APL rule here..."
        value={rule}
        onChangeText={setRule}
        multiline
        autoCapitalize="none"
        autoCorrect={false}
      />
      {/* TODO: send `rule` to the backend APL parser; show real syntax errors with line numbers */}
      <Button label="Validate" onPress={() => setResult('Ready to review')} />

      <Card title="Validation result" subtitle={result} />

      <SectionLabel>Checks</SectionLabel>
      <Card>
        <InfoRow label="Syntax structure" value="—" />
        <InfoRow label="Rule completeness" value="—" />
        <InfoRow label="Permission conflicts" value="—" />
        <InfoRow label="Release condition" value="—" />
      </Card>

      <Notice title="Validation does not grant access.">Backend authorization remains required.</Notice>
    </Screen>
  );
}
