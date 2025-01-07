import { Image, Pressable, Text, View } from '@/components/ui';
import type { UserData } from '@/lib/message-storage';

interface HeaderProps {
  data?: UserData | null;
}

export default function Header({ data }: HeaderProps) {
  return (
    <View className="my-4 flex-row items-center rounded-lg bg-white p-4 shadow">
      <Image
        source={{ uri: data?.photo || 'https://dummyimage.com/80x80' }}
        className="mr-4 size-20 rounded-full"
      />
      <View className="flex-1">
        <Text className="text-lg font-bold">{data?.name}</Text>
        <Text className="font-semibold text-gray-600">{data?.email}</Text>
        <Text className="font-semibold text-gray-600">{data?.nomor_hp}</Text>
      </View>
      <Pressable className="p-2">
        <Image
          source={{ uri: 'https://dummyimage.com/40x40/ff0000/ffffff&text=!' }}
          className="size-10 rounded-full"
        />
      </Pressable>
    </View>
  );
}
