import { useState } from 'react';

import { Button, ChipGroup, Notice, Screen, SectionLabel, TextBox } from '@/components/wireframe';

const RELATIONSHIPS = ['Spouse', 'Child', 'Sibling', 'Friend', 'Other'];

export default function AddBeneficiaryScreen() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [relationship, setRelationship] = useState('');
  const [message, setMessage] = useState('');

  return (
    <Screen
      title="Add / Edit Beneficiary"
      subtitle="Manage the people connected to your legacy."
      back={{ label: 'Back to Legacy', href: '/legacy' }}>
      <TextBox label="Full name" placeholder="Enter full name" value={fullName} onChangeText={setFullName} />
      <TextBox
        label="Email address"
        placeholder="name@example.com"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <SectionLabel>Relationship</SectionLabel>
      <ChipGroup options={RELATIONSHIPS} value={relationship} onChange={setRelationship} />
      <TextBox
        label="Invitation message (optional)"
        placeholder="Add a short personal message..."
        value={message}
        onChangeText={setMessage}
        multiline
      />
      <Notice title="Privacy first">Access is denied until a policy explicitly allows it.</Notice>
      {/* TODO: create the beneficiary and send the invitation through the backend */}
      <Button label="Send invitation" onPress={() => undefined} />
    </Screen>
  );
}
