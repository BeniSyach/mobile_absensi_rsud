import React from 'react';
import { Pressable, View } from 'react-native';

import { Text } from '@/components/ui';

type TabType = 'pasar' | 'rata' | 'hariIni';

interface TabSwitchProps {
  selectedTab: TabType;
  setSelectedTab: (tab: TabType) => void;
}

export default function TabSwitch({
  selectedTab,
  setSelectedTab,
}: TabSwitchProps) {
  return (
    <View className="w-fit flex-row self-center rounded-3xl bg-gray-300 p-1">
      <Pressable
        onPress={() => setSelectedTab('hariIni')}
        className={`mx-1 rounded-3xl px-6 py-2 ${
          selectedTab === 'hariIni' ? 'bg-green-800' : ''
        }`}
      >
        <Text
          className={`text-center text-lg font-bold ${
            selectedTab === 'hariIni' ? 'text-white' : 'text-gray-600'
          }`}
        >
          Harga{'\n'}Hari Ini
        </Text>
      </Pressable>

      <Pressable
        onPress={() => setSelectedTab('pasar')}
        className={` mx-1  rounded-3xl px-6 py-2 ${
          selectedTab === 'pasar' ? 'bg-green-800' : ''
        }`}
      >
        <Text
          className={`text-center text-lg font-bold ${
            selectedTab === 'pasar' ? 'text-white' : 'text-gray-600'
          }`}
        >
          Berdasarkan{'\n'}Pasar
        </Text>
      </Pressable>

      <Pressable
        onPress={() => setSelectedTab('rata')}
        className={`mx-1  rounded-3xl px-6 py-2 ${
          selectedTab === 'rata' ? 'bg-green-800' : ''
        }`}
      >
        <Text
          className={` text-center text-lg font-bold ${
            selectedTab === 'rata' ? 'text-white' : 'text-gray-600'
          }`}
        >
          Harga{'\n'}Rata-Rata
        </Text>
      </Pressable>
    </View>
  );
}
