/* eslint-disable react/no-unstable-nested-components */
import { Redirect, SplashScreen, Tabs } from 'expo-router';
import React, { useCallback, useEffect } from 'react';

import { Feed as FeedIcon, UserIcon } from '@/components/ui/icons';
import { useAuth } from '@/lib';

export default function TabLayout() {
  const status = useAuth.use.status();
  // const [isFirstTime] = useIsFirstTime();
  const hideSplash = useCallback(async () => {
    await SplashScreen.hideAsync();
  }, []);
  useEffect(() => {
    if (status !== 'idle') {
      setTimeout(() => {
        hideSplash();
      }, 1000);
    }
  }, [hideSplash, status]);

  // if (isFirstTime && status !== 'signOut') {
  //   return <Redirect href="/onboarding" />;
  // }
  if (status === 'signOut') {
    return <Redirect href="/onboarding" />;
  }
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          position: 'absolute',
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          height: 70,
          paddingBottom: 10,
          paddingTop: 5,
          borderTopWidth: 0,
          elevation: 12, // Android shadow makin tinggi
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -4 }, // makin tinggi shadow ke atas
          shadowOpacity: 0.25, // lebih gelap
          shadowRadius: 12, // lebih blur
        },
        tabBarActiveTintColor: '#0B3880',
        tabBarInactiveTintColor: '#888888',
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <FeedIcon color={color} />,
          headerShown: false,
          tabBarButtonTestID: 'feed-tab',
        }}
      />

      <Tabs.Screen
        name="settings"
        options={{
          title: 'Profile',
          headerShown: false,
          tabBarIcon: ({ color }) => <UserIcon color={color} />,
          tabBarButtonTestID: 'settings-tab',
        }}
      />
    </Tabs>
  );
}
