import * as Progress from 'react-native-progress';

import { Text, View } from '@/components/ui';

interface Card {
  id: number;
  title: string;
  progress: number;
}

const cards: Card[] = [
  {
    id: 1,
    title: 'Akumulasi Cuti Anda',
    progress: 0.22,
  },
  {
    id: 2,
    title: 'N-2              (2023)',
    progress: 0.06,
  },
  {
    id: 3,
    title: 'N-1              (2024)',
    progress: 0.05,
  },
  {
    id: 4,
    title: 'N                (2025)',
    progress: 0.03,
  },
];

export default function DashboardAjukanCuti() {
  return (
    <View className="items-center rounded-b-3xl bg-[#20A0D8] px-4 pt-1">
      <View className="w-full flex-row py-5">
        {cards.map(({ id, title, progress }) => (
          <View
            key={id}
            className="flex-1 items-center justify-center"
            style={{ paddingHorizontal: 8 }} // jarak antar card
          >
            {/* Lingkaran dengan angka di tengah */}
            <View className="relative">
              <Progress.Circle
                size={60}
                progress={progress}
                color="#006794"
                thickness={8}
                showsText={false}
                borderWidth={0}
                unfilledColor="#FFF"
                strokeCap="round"
              />
              <Text
                className="absolute text-lg font-extrabold text-white"
                style={{
                  top: '50%',
                  left: '50%',
                  transform: [{ translateX: -15 }, { translateY: -10 }],
                }}
              >
                {Math.round(progress * 100)}
              </Text>
            </View>
            {/* Title di bawah */}
            <Text className="mt-2 text-center text-sm font-bold text-white">
              {title}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}
