import { Env } from '@env';
import { Stack } from 'expo-router';

import { Item } from '@/components/settings/item';
import { ItemsContainer } from '@/components/settings/items-container';
import { ThemeItem } from '@/components/settings/theme-item';
import { FocusAwareStatusBar, ScrollView } from '@/components/ui';

export default function SettingsApp() {
  return (
    <>
      <Stack.Screen
        options={{
          title: 'Setting App',
          headerBackTitle: 'setting-app',
        }}
      />
      <FocusAwareStatusBar />
      <ScrollView>
        <ItemsContainer title="settings.generale">
          {/* <LanguageItem /> */}
          <ThemeItem />
        </ItemsContainer>

        <ItemsContainer title="settings.about">
          <Item text="settings.app_name" value={Env.NAME} />
          <Item text="settings.version" value={Env.VERSION} />
        </ItemsContainer>
      </ScrollView>
    </>
  );
}
