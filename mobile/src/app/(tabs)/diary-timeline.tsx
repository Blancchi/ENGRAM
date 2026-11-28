import { useState } from 'react';

import { ChipGroup, MemoryCard, Notice, Screen, TextBox } from '@/components/wireframe';

const FILTERS = ['All', 'Personal', 'Family', 'Reflections'];

export default function DiaryTimelineScreen() {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('All');

  return (
    <Screen
      title="Diary Timeline"
      subtitle="Browse and revisit your saved memories."
      back={{ label: 'Back to Diary', href: '/diary' }}>
      <TextBox placeholder="Search memories and dates..." value={query} onChangeText={setQuery} />
      <ChipGroup options={FILTERS} value={filter} onChange={setFilter} />
      {/* TODO: replace with entries loaded from the backend, filtered by `query` and `filter` */}
      <MemoryCard
        title="A quiet Sunday afternoon"
        meta="Nov 22, 2026 • Personal"
        preview="Spent the afternoon remembering the little moments that made this week meaningful."
        href="/entry-details"
      />
      <MemoryCard
        title="My favorite family tradition"
        meta="Nov 18, 2026 • Family"
        preview="A small tradition that reminds me why being together matters."
        href="/entry-details"
      />
      <MemoryCard
        title="A lesson from today"
        meta="Nov 12, 2026 • Reflections"
        preview="Some difficult moments can still become lessons worth passing on."
        href="/entry-details"
      />
      <Notice>Your memories, organized in one place.</Notice>
    </Screen>
  );
}
