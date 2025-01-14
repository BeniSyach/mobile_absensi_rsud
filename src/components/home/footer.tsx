import { Image, Text, View } from '@/components/ui';

export default function Footer() {
  return (
    <View className="mt-4 items-center justify-center py-4">
      {/* Logo */}
      <Image
        source={require('../../../assets/logorsud.png')}
        className="mb-2 size-10"
      />

      {/* Teks Footer */}
      <Text className="text-center text-sm font-bold text-gray-700">
        Powered by Tim SIMRS RSUD HAT
      </Text>
    </View>
  );
}
