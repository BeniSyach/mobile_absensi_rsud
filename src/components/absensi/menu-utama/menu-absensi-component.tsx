/* eslint-disable max-lines-per-function */
import { FlashList } from '@shopify/flash-list';
import { type Href, useRouter } from 'expo-router';
import {
  BookOpen,
  ClipboardList,
  FileUp,
  List,
  Users,
} from 'lucide-react-native';
import React, { useState } from 'react';
import { Dimensions, Text, TouchableOpacity, View } from 'react-native';

const { width } = Dimensions.get('window');

type MenuItem = {
  id: string;
  icon: React.ReactNode;
  label: string;
  href: Href;
};

const menuItems: MenuItem[] = [
  { id: '1', icon: <List />, label: 'Daftar Absensi', href: '/list-absensi' },
  { id: '2', icon: <FileUp />, label: 'Upload SPT', href: '/spt' },
  { id: '3', icon: <ClipboardList />, label: 'Daftar SPT', href: '/list-spt' },
  { id: '4', icon: <Users />, label: 'List Cuti Bawahan', href: '/list-cuti' },
  { id: '5', icon: <BookOpen />, label: 'Panduan', href: '/panduan-absensi' },
];

export default function MenuAbsensiComponent() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const router = useRouter();

  const ITEM_PER_PAGE = 4;
  const itemWidth = width / ITEM_PER_PAGE;
  const iconSize = itemWidth * 0.45;
  const circleSize = itemWidth * 0.55;

  // jumlah halaman penuh
  const totalPages = Math.ceil(menuItems.length / ITEM_PER_PAGE);
  const pageWidth = ITEM_PER_PAGE * itemWidth;

  return (
    <View className="mt-4 px-4">
      <View className="rounded-2xl border border-gray-200 bg-white p-5 shadow-md">
        <FlashList
          data={menuItems}
          horizontal
          showsHorizontalScrollIndicator={false}
          estimatedItemSize={menuItems.length}
          keyExtractor={(item) => item.id}
          snapToInterval={pageWidth}
          decelerationRate="fast"
          onMomentumScrollEnd={(e) => {
            const offsetX = e.nativeEvent.contentOffset.x;
            const pageIndex = Math.round(offsetX / pageWidth);
            setCurrentIndex(pageIndex);
          }}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={{ width: itemWidth }}
              className="items-center justify-center"
              onPress={() => router.push(item.href)}
            >
              <View
                style={{
                  width: circleSize,
                  height: circleSize,
                }}
                className="mb-2 items-center justify-center rounded-full"
              >
                <View
                  className="items-center justify-center rounded-full"
                  style={{
                    backgroundColor: '#BCE3F3',
                    width: circleSize,
                    height: circleSize,
                  }}
                >
                  {React.cloneElement(item.icon as React.ReactElement, {
                    size: iconSize,
                    color: '#20A0D8',
                  })}
                </View>
              </View>
              <Text className="text-dark text-center text-xs font-medium">
                {item.label}
              </Text>
            </TouchableOpacity>
          )}
        />

        {/* Indikator halaman */}
        <View className="mt-4 flex-row justify-center space-x-2">
          {Array.from({ length: totalPages }).map((_, i) => (
            <View
              key={i}
              className={`size-2 rounded-full ${
                i === currentIndex ? 'bg-blue-500' : 'bg-gray-300'
              }`}
            />
          ))}
        </View>
      </View>
    </View>
  );
}
