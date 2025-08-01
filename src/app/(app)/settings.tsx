/* eslint-disable react/react-in-jsx-scope */

import React from 'react';
import { StatusBar } from 'react-native';

import { useGetUser } from '@/api/users/get-users';
import ProfileCard from '@/components/profile/profile';
import { ActionButtons } from '@/components/settings/action-buttons';
import { Item } from '@/components/settings/item';
import { ItemsContainer } from '@/components/settings/items-container';
import { SafeAreaView, ScrollView, Text, View } from '@/components/ui';
import { useAuth } from '@/lib';
import { getMessage } from '@/lib';

export default function Settings() {
  const storedMessage = getMessage();
  const signOut = useAuth.use.signOut();
  const {
    data: user,
    isLoading,
    isError,
  } = useGetUser(storedMessage?.nik ?? '');

  if (isLoading) return <Text>Loading...</Text>;
  if (isError || !user) return <Text>Error loading user data</Text>;

  return (
    <SafeAreaView className="flex-1 bg-[#0B3880]">
      <StatusBar backgroundColor="#0B3880" barStyle="dark-content" />

      <ScrollView className="flex-1">
        <View className="flex-1 px-4">
          <ProfileCard user={user} />
          <ActionButtons />
          <View className="my-3">
            <ItemsContainer>
              <Item text="settings.logout" onPress={signOut} />
            </ItemsContainer>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
