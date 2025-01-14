import React from 'react';
import { ActivityIndicator } from 'react-native';

import { Text, View } from '@/components/ui';

const LoadingComponent = () => {
  return (
    <View className="mb-4 flex items-center justify-center">
      {/* Spinner animasi loading */}
      <ActivityIndicator size="large" color="#0000ff" />
      {/* Teks tambahan */}
      <Text className="mt-2 text-lg font-bold">Loading Lokasi...</Text>
    </View>
  );
};

export default LoadingComponent;
