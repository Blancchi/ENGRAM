import { useState } from 'react';

import { Card, ChipGroup, ListRow, Notice, Screen, SectionLabel, ToggleRow } from '@/components/wireframe';

export default function SecurityPrivacyScreen() {
  const [appLock, setAppLock] = useState(true);
  const [autoLock, setAutoLock] = useState('1 min');

  return (
    <Screen
      title="Security & Privacy"
      subtitle="Keep your memories safe."
      back={{ label: 'Back to Settings', href: '/settings' }}>
      <Card title="Your account is protected" subtitle="Review your security settings anytime." />

      <SectionLabel>App security</SectionLabel>
      <Card>
        <ToggleRow title="App Lock" subtitle="Require your PIN to open ENGRAM" value={appLock} onChange={setAppLock} />
        <ListRow title="Auto-lock" subtitle={`Lock after ${autoLock} of inactivity`} />
        <ChipGroup options={['1 min', '5 min', '15 min']} value={autoLock} onChange={setAutoLock} />
      </Card>

      <SectionLabel>Privacy & data</SectionLabel>
      <Card>
        <ListRow title="Secure Storage" subtitle="Your saved memories stay private" meta="Protected" />
        <ListRow title="AI Memory Access" subtitle="Manage what ENGRAM can reference" onPress={() => undefined} />
        <ListRow title="Privacy Policy" subtitle="Learn how your information is handled" onPress={() => undefined} />
      </Card>
      <Card>
        <ListRow title="Your Data" subtitle="Request a copy or manage your data" onPress={() => undefined} />
      </Card>

      <Notice>Your memories belong to you.</Notice>
    </Screen>
  );
}
