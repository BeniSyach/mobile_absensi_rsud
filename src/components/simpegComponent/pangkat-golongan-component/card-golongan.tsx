import { Text, View } from '@/components/ui';

export default function CardGolongan() {
  return (
    <View className="mx-5 flex flex-col space-y-2 rounded-xl bg-white p-4 shadow">
      <Text className="mb-4 mt-2 text-2xl font-bold text-[#0B3880]">
        Pangkat Golongan Terakhir
      </Text>

      <View className="my-4"></View>
    </View>
  );
}
