/* eslint-disable react/react-in-jsx-scope */

import { useFocusEffect } from 'expo-router';
import React from 'react';

import { GetUser } from '@/api';
import ProfileCard from '@/components/profile/profile';
import { ActionButtons } from '@/components/settings/action-buttons';
import { Item } from '@/components/settings/item';
import { ItemsContainer } from '@/components/settings/items-container';
import { FocusAwareStatusBar, ScrollView, Text, View } from '@/components/ui';
import { useAuth } from '@/lib';
import { getMessage } from '@/lib/message-storage';

export default function Settings() {
  const storedMessage = getMessage();
  const signOut = useAuth.use.signOut();
  const {
    data: user,
    isLoading,
    isError,
    refetch,
  } = GetUser({
    variables: storedMessage?.id,
    enabled: !!storedMessage?.id,
  });

  useFocusEffect(
    React.useCallback(() => {
      if (storedMessage?.id) {
        refetch(); // Memanggil ulang refetch setiap kali halaman fokus
      }
    }, [storedMessage?.id, refetch]) // Pastikan hanya dipanggil jika id berubah
  );

  if (isLoading) return <Text>Loading...</Text>;
  if (isError || !user) return <Text>Error loading user data</Text>;

  return (
    <>
      <FocusAwareStatusBar />
      <ScrollView className="flex-1">
        <View className="flex-1 px-4 pt-10">
          <Text className="my-5 text-center text-xl font-bold">Profile</Text>
          <ProfileCard user={user} />
          <ActionButtons />
          <View className="my-3">
            <ItemsContainer>
              <Item text="settings.logout" onPress={signOut} />
            </ItemsContainer>
          </View>
        </View>
      </ScrollView>
    </>
  );
}
