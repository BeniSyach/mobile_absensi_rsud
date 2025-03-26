import React from 'react';

import { Image, Text, View } from '@/components/ui';

interface headerProps {
  sourceImage: string;
  judul: string;
}

export default function HeaderSimpeg({ sourceImage, judul }: headerProps) {
  return (
    <View className="flex-columns items-center justify-center rounded-lg">
      <Image
        source={sourceImage}
        style={{ width: 400, height: 100 }}
        contentFit="contain"
      />
      <Text className="mb-5 text-xl font-bold text-[#0B3880]">{judul}</Text>
    </View>
  );
}
