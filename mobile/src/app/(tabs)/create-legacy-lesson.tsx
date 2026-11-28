import { router } from 'expo-router';
import { useState } from 'react';

import { Button, ChipGroup, ListRow, Notice, Screen, SectionLabel, TextBox } from '@/components/wireframe';

export default function CreateLegacyLessonScreen() {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Life advice');
  const [lesson, setLesson] = useState('');

  return (
    <Screen
      title="Create Legacy Lesson"
      subtitle="Pass your wisdom, values, and stories forward."
      back={{ label: 'Back to Legacy', href: '/legacy' }}>
      <TextBox label="Lesson title" placeholder="A lesson worth passing on" value={title} onChangeText={setTitle} />
      <SectionLabel>Category</SectionLabel>
      <ChipGroup options={['Life advice', 'Values', 'Traditions']} value={category} onChange={setCategory} />
      <TextBox
        label="Your lesson"
        placeholder="Write a story, advice, or value you want future generations to remember..."
        value={lesson}
        onChangeText={setLesson}
        multiline
      />
      <SectionLabel>Who can view this?</SectionLabel>
      <ListRow title="Private • Only you" />
      <Notice title="Original lesson preserved">You can edit or share it later through a policy.</Notice>
      <Button label="Save legacy lesson" onPress={() => router.back()} />
    </Screen>
  );
}
