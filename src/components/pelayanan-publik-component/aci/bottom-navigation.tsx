import { Ionicons } from '@expo/vector-icons';
import { usePathname, useRouter } from 'expo-router';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

const TabItem = ({
  iconName,
  label,
  isActive,
  onPress,
}: {
  iconName: keyof typeof Ionicons.glyphMap;
  label: string;
  isActive: boolean;
  onPress: () => void;
}) => (
  <TouchableOpacity className="items-center px-2" onPress={onPress}>
    <Ionicons
      name={isActive ? (iconName as any) : `${iconName}-outline`}
      size={28}
      color={isActive ? '#0066FF' : '#9CA3AF'}
    />
    <Text
      className={`mt-1 text-[10px] font-bold ${
        isActive ? 'text-[#0066FF]' : 'text-gray-400'
      }`}
    >
      {label}
    </Text>
  </TouchableOpacity>
);

export const AciBottomNavigation = () => {
  const router = useRouter();
  const pathname = usePathname();

  const getActiveTab = () => {
    if (pathname.includes('/profile')) return 'Profil';
    if (pathname.includes('/dashboard')) return 'Beranda';
    if (pathname.includes('/lapor')) return 'Lapor';
    if (pathname.includes('/riwayat')) return 'Riwayat';
    return 'Beranda';
  };

  const activeTab = getActiveTab();

  const handleNavigation = (tab: string) => {
    if (tab === activeTab) return;

    switch (tab) {
      case 'Beranda':
        router.replace('/pelayanan-publik/aci/dashboard');
        break;
      case 'Lapor':
        router.replace('/pelayanan-publik/aci/lapor');
        break;
      case 'Riwayat':
        router.replace('/pelayanan-publik/aci/riwayat');
        break;
      case 'Profil':
        router.replace('/pelayanan-publik/aci/profile');
        break;
      default:
        break;
    }
  };

  return (
    <View className="absolute inset-x-0 bottom-0 flex-row items-center justify-between rounded-t-[30px] border-t border-gray-50 bg-white px-8 pb-6 pt-5 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
      <TabItem
        iconName="home"
        label="Beranda"
        isActive={activeTab === 'Beranda'}
        onPress={() => handleNavigation('Beranda')}
      />
      <TabItem
        iconName="megaphone"
        label="Lapor"
        isActive={activeTab === 'Lapor'}
        onPress={() => handleNavigation('Lapor')}
      />
      <TabItem
        iconName="document-text"
        label="Riwayat"
        isActive={activeTab === 'Riwayat'}
        onPress={() => handleNavigation('Riwayat')}
      />
      <TabItem
        iconName="person"
        label="Profil"
        isActive={activeTab === 'Profil'}
        onPress={() => handleNavigation('Profil')}
      />
    </View>
  );
};
