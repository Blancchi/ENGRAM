import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppHeader, Button, ListRow, SectionLabel, TextBox } from '@/components/wireframe';
import { WF, WFRadius, WFSpace } from '@/constants/wireframe';

type Message = { id: number; role: 'user' | 'assistant'; text: string };

const SUGGESTIONS = ['What were my goals this year?', 'What lessons did I save?'];

export default function ChatScreen() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 0,
      role: 'assistant',
      text: 'I can help you explore memories saved in your diary. I will use only entries you are authorized to access and show their sources.',
    },
  ]);

  const send = () => {
    const text = input.trim();
    if (!text) return;
    // TODO: send `text` to the backend AI Memory Assistant; show the access-checked answer + dated sources
    setMessages((m) => [
      ...m,
      { id: m.length, role: 'user', text },
      { id: m.length + 1, role: 'assistant', text: 'Answer placeholder. The backend is not connected yet.' },
    ]);
    setInput('');
  };

  const answered = messages.length > 1;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <AppHeader />
          <Text style={styles.title}>AI Chat</Text>
          <Text style={styles.subtitle}>Talk with your personal memory companion.</Text>

          {messages.map((m) => (
            <View key={m.id} style={[styles.bubble, m.role === 'user' ? styles.user : styles.assistant]}>
              {m.role === 'assistant' ? <Text style={styles.who}>ENGRAM</Text> : null}
              <Text style={[styles.msg, m.role === 'user' && styles.msgUser]}>{m.text}</Text>
              {m.role === 'assistant' && m.id > 0 ? <Text style={styles.tag}>Access-checked answer</Text> : null}
            </View>
          ))}

          {answered ? (
            <>
              <SectionLabel>Authorized sources</SectionLabel>
              <ListRow
                title="My favorite family tradition"
                subtitle="Nov 18, 2026 · Diary entry"
                href="/authorized-source"
              />
            </>
          ) : (
            <>
              <SectionLabel>Try asking</SectionLabel>
              {SUGGESTIONS.map((q) => (
                <Pressable key={q} onPress={() => setInput(q)} style={styles.suggestion}>
                  <Text style={styles.suggestionText}>{q}</Text>
                </Pressable>
              ))}
            </>
          )}
        </ScrollView>

        <View style={styles.composer}>
          <View style={styles.flex}>
            <TextBox placeholder="Ask ENGRAM about your memories..." value={input} onChangeText={setInput} onSubmitEditing={send} />
          </View>
          <Button label="Send" onPress={send} style={styles.sendBtn} />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  safe: { flex: 1, backgroundColor: WF.white },
  content: { padding: WFSpace.md, gap: WFSpace.md },
  title: { fontSize: 30, fontWeight: '800', color: WF.black },
  subtitle: { fontSize: 15, color: WF.gray700, marginTop: -WFSpace.sm },
  bubble: { borderWidth: 1.5, borderRadius: WFRadius.lg, padding: WFSpace.md, gap: 6, maxWidth: '88%' },
  user: { alignSelf: 'flex-end', backgroundColor: WF.black, borderColor: WF.black },
  assistant: { alignSelf: 'flex-start', backgroundColor: WF.gray100, borderColor: WF.gray300 },
  who: { fontSize: 12, fontWeight: '800', letterSpacing: 1, color: WF.gray700 },
  msg: { fontSize: 15, lineHeight: 22, color: WF.gray900 },
  msgUser: { color: WF.white },
  tag: { fontSize: 12, fontWeight: '700', color: WF.gray700 },
  suggestion: { borderWidth: 1.5, borderColor: WF.gray300, borderRadius: WFRadius.md, padding: WFSpace.md },
  suggestionText: { color: WF.gray700 },
  composer: { flexDirection: 'row', alignItems: 'center', gap: WFSpace.sm, padding: WFSpace.md, borderTopWidth: 1.5, borderTopColor: WF.gray300, backgroundColor: WF.white },
  sendBtn: { paddingHorizontal: WFSpace.md },
});
