import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { Button, AuthScreen, TextBox } from '@/components/wireframe';
import { WF } from '@/constants/wireframe';

export default function SignupScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  return (
    <AuthScreen>
      <TextBox placeholder="Name" value={name} onChangeText={setName} />
      <TextBox placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
      <TextBox placeholder="Username" value={username} onChangeText={setUsername} autoCapitalize="none" />
      <TextBox placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
      {/* TODO: call the backend register endpoint */}
      <Button label="Create Account" onPress={() => router.replace('/home')} />
      <View style={{ alignItems: 'center', gap: 4, marginTop: 8 }}>
        <Text style={{ color: WF.gray700 }}>Already have account?</Text>
        <Pressable onPress={() => router.replace('/login')}>
          <Text style={{ color: WF.black, fontWeight: '800', textDecorationLine: 'underline' }}>Login</Text>
        </Pressable>
      </View>
    </AuthScreen>
  );
}
