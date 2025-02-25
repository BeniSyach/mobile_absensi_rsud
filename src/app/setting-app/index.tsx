import { Env } from '@env';
import { Stack } from 'expo-router';
import { useColorScheme } from 'nativewind';

import { Item } from '@/components/settings/item';
import { ItemsContainer } from '@/components/settings/items-container';
import { LanguageItem } from '@/components/settings/language-item';
import { ThemeItem } from '@/components/settings/theme-item';
import { colors, FocusAwareStatusBar, ScrollView } from '@/components/ui';

import {
  Github,
  Rate,
  Share,
  Support,
  Website,
} from '../../components/ui/icons';

export default function SettingsApp() {
  const { colorScheme } = useColorScheme();
  const iconColor =
    colorScheme === 'dark' ? colors.neutral[400] : colors.neutral[500];
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
          <LanguageItem />
          <ThemeItem />
        </ItemsContainer>

        <ItemsContainer title="settings.about">
          <Item text="settings.app_name" value={Env.NAME} />
          <Item text="settings.version" value={Env.VERSION} />
        </ItemsContainer>

        <ItemsContainer title="settings.support_us">
          <Item
            text="settings.share"
            icon={<Share color={iconColor} />}
            onPress={() => {}}
          />
          <Item
            text="settings.rate"
            icon={<Rate color={iconColor} />}
            onPress={() => {}}
          />
          <Item
            text="settings.support"
            icon={<Support color={iconColor} />}
            onPress={() => {}}
          />
        </ItemsContainer>

        <ItemsContainer title="settings.links">
          <Item text="settings.privacy" onPress={() => {}} />
          <Item text="settings.terms" onPress={() => {}} />
          <Item
            text="settings.github"
            icon={<Github color={iconColor} />}
            onPress={() => {}}
          />
          <Item
            text="settings.website"
            icon={<Website color={iconColor} />}
            onPress={() => {}}
          />
        </ItemsContainer>
      </ScrollView>
    </>
  );
}
