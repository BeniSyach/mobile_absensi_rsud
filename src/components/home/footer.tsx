import { Image, Text, View } from '@/components/ui';

export default function Footer() {
  return (
    <View className="flex-row items-center justify-center">
      {/* Logo */}
      <Image
        source={require('../../../assets/logorsud.png')}
        className="size-14"
        transition={1000}
        contentFit="contain"
      />

      {/* Teks Footer */}
      <View className="ml-2">
        <Text className="text-md font-bold text-gray-700 dark:text-black">
          Powered By
        </Text>
        <Text className="text-md font-bold text-gray-700 dark:text-black">
          Tim IT Deli Serdang Sehat
        </Text>
      </View>
    </View>
  );
}
