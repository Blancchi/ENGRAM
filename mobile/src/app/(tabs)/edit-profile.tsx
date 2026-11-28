import { router } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

import { Avatar, Button, Card, Notice, Screen, TextBox } from '@/components/wireframe';

export default function EditProfileScreen() {
  const [fullName, setFullName] = useState('');

  return (
    <Screen
      title="Edit Profile"
      subtitle="Update your profile information."
      back={{ label: 'Back to Profile', href: '/profile' }}>
      <Card title="Profile Picture" subtitle="Choose a photo that represents you">
        <View style={{ alignItems: 'center', gap: 12 }}>
          <Avatar size={96} />
          <Button label="Change profile picture" variant="ghost" />
        </View>
      </Card>
      <TextBox label="Full name" placeholder="Enter full name" value={fullName} onChangeText={setFullName} />
      <TextBox label="Email address" value="name@example.com" editable={false} />
      <Notice>Your email address cannot be changed here. Status: Verified</Notice>
      {/* TODO: PATCH the profile on the backend */}
      <Button label="Save Changes" onPress={() => router.back()} />
      <Button label="Cancel" variant="secondary" onPress={() => router.back()} />
    </Screen>
  );
}
