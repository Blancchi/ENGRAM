import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { Button, AuthScreen, TextBox } from '@/components/wireframe';
import { WF } from '@/constants/wireframe';

export default function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  return (
    <AuthScreen>
      <TextBox placeholder="Username" value={username} onChangeText={setUsername} autoCapitalize="none" />
      <TextBox placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
      {/* TODO: call the backend login endpoint, store the session token */}
      <Button label="Login" onPress={() => router.replace('/home')} />
      <Button label="Continue with Google" variant="secondary" />
      <View style={{ alignItems: 'center', gap: 4, marginTop: 8 }}>
        <Text style={{ color: WF.gray700 }}>Don&apos;t have account?</Text>
        <Pressable onPress={() => router.push('/signup')}>
          <Text style={{ color: WF.black, fontWeight: '800', textDecorationLine: 'underline' }}>Sign up</Text>
        </Pressable>
      </View>
    </AuthScreen>
  );
}
