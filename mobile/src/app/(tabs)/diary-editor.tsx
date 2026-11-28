import { router } from 'expo-router';
import { useState } from 'react';

import { Button, ChipGroup, ListRow, Screen, SectionLabel, TextBox } from '@/components/wireframe';

export default function DiaryEditorScreen() {
  const [kind, setKind] = useState('Diary Entry');
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [category, setCategory] = useState('');
  const [story, setStory] = useState('');

  return (
    <Screen
      title="Diary / Letter Editor"
      subtitle="Capture your thoughts in your own words."
      back={{ label: 'Back to Diary', href: '/diary' }}>
      <ChipGroup options={['Diary Entry', 'Letter']} value={kind} onChange={setKind} />
      <TextBox label="Title" placeholder="A day worth remembering" value={title} onChangeText={setTitle} />
      <TextBox label="Date" placeholder="Nov 27, 2026" value={date} onChangeText={setDate} />
      <TextBox label="Category" placeholder="Personal" value={category} onChangeText={setCategory} />
      <TextBox
        label="Your story"
        placeholder="Write your thoughts here..."
        value={story}
        onChangeText={setStory}
        multiline
      />
      <SectionLabel>Entry privacy</SectionLabel>
      <ListRow title="Private" subtitle="Only you can view this entry" />
      {/* TODO: save the original entry through the backend (append-only), then pick a writing mode */}
      <Button label="Save draft" variant="secondary" onPress={() => router.back()} />
      <Button label="Continue to Writing Modes" href="/writing-modes" />
    </Screen>
  );
}
