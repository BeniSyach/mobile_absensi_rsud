import { Image, Text, View } from '@/components/ui';

export default function Footer() {
  return (
    <View className="mt-4 items-center justify-center py-4">
      {/* Logo */}
      <Image
        source={{ uri: 'https://dummyimage.com/100x40/000/fff&text=Logo' }}
        className="mb-2 h-10 w-24"
      />

      {/* Teks Footer */}
      <Text className="text-center text-sm text-gray-700">
        Powered by Tim SIMRS RSUD HAT
      </Text>
    </View>
  );
}
