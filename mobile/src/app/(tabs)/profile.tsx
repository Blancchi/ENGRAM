import { Text, View } from 'react-native';

import { Avatar, Button, Card, InfoRow, Screen, SectionLabel } from '@/components/wireframe';

export default function ProfileScreen() {
  return (
    <Screen title="Profile" subtitle="Customize your experience." back={{ label: 'Back to Settings', href: '/settings' }}>
      <Card>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
          <Avatar />
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 18, fontWeight: '800' }}>Your Name</Text>
            <Text style={{ color: '#555555' }}>name@example.com</Text>
          </View>
        </View>
        <Button label="Edit Profile" variant="secondary" href="/edit-profile" />
      </Card>

      <SectionLabel>Account information</SectionLabel>
      <Card>
        <InfoRow label="Email Address" value="Verified" />
        <InfoRow label="Member Since" value="November 2026" />
        <InfoRow label="Account Status" value="Active" />
      </Card>
    </Screen>
  );
}
