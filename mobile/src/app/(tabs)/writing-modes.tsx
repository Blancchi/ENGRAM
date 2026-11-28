import { useState } from 'react';

import { Button, Notice, Screen, SelectCard } from '@/components/wireframe';

const MODES = [
  { id: 'Verbatim', description: 'Keep your writing exactly as it is.', tag: 'No wording changes' },
  { id: 'Light Fix', description: 'Fix spelling and grammar while keeping your tone and meaning.', tag: 'Gentle corrections only' },
  { id: 'Review', description: 'Get suggestions to improve clarity and flow without changing your story.', tag: 'Suggestions for you to review' },
] as const;

export default function WritingModesScreen() {
  const [mode, setMode] = useState<string>('Verbatim');

  return (
    <Screen
      title="Writing Modes"
      subtitle="Choose how AI can assist your writing."
      back={{ label: 'Back to Editor', href: '/diary-editor' }}>
      {MODES.map((m) => (
        <SelectCard
          key={m.id}
          title={m.id}
          description={m.description}
          tag={m.tag}
          selected={mode === m.id}
          onPress={() => setMode(m.id)}
        />
      ))}
      <Notice title="Your original is always preserved">You can compare and choose what to keep.</Notice>
      <Button label="Continue" href="/entry-details" />
    </Screen>
  );
}
