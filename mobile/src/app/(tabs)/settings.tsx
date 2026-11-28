import { router } from 'expo-router';
import { useState } from 'react';

import { Button, Card, ListRow, Screen, SheetModal } from '@/components/wireframe';

export default function SettingsScreen() {
  const [language, setLanguage] = useState('English');
  const [languageOpen, setLanguageOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);

  return (
    <Screen title="Settings" subtitle="Customize your experience.">
      <Card>
        <ListRow title="Your Name" subtitle="name@example.com" href="/profile" />
      </Card>

      <Card>
        <ListRow title="Language" subtitle={language} onPress={() => setLanguageOpen(true)} />
        <ListRow title="AI Writing Modes" subtitle="Enhance your writing without losing your voice." href="/writing-modes" />
        <ListRow title="AI Memory Assistant" subtitle="Answers only from memories you may access." href="/security-privacy" />
        <ListRow title="Security & Privacy" subtitle="Keep your memories safe." href="/security-privacy" />
        <ListRow title="About ENGRAM" subtitle="App version 1.0.0" onPress={() => setAboutOpen(true)} />
      </Card>

      {/* TODO: clear the session token before leaving */}
      <Button label="Log out" variant="secondary" onPress={() => router.replace('/login')} />

      <SheetModal visible={languageOpen} title="Language" onClose={() => setLanguageOpen(false)}>
        {['English', 'Filipino'].map((l) => (
          <ListRow
            key={l}
            title={l}
            meta={l === language ? 'Selected' : undefined}
            onPress={() => {
              setLanguage(l);
              setLanguageOpen(false);
            }}
          />
        ))}
      </SheetModal>

      <SheetModal visible={aboutOpen} title="About E.N.G.R.A.M" onClose={() => setAboutOpen(false)}>
        <Card title="ENGRAM · AI Diary" subtitle="Your personal AI diary, designed to help you organize your thoughts." />
        <ListRow title="AI DIARY" subtitle="Write, reflect, and keep track." />
        <ListRow title="AI Companion" subtitle="Get motivation and support." />
        <ListRow title="Keep Your Memory Safe" subtitle="Your data stays private and secure." />
      </SheetModal>
    </Screen>
  );
}
