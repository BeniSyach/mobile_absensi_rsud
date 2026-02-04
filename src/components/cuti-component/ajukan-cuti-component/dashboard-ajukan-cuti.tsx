/* eslint-disable max-lines-per-function */
import * as Progress from 'react-native-progress';

import { type StatistikCutiResponse } from '@/api/cuti';
import { Text, View } from '@/components/ui';

interface Card {
  id: number;
  title: string;
  value: number; // angka asli
  max: number; // batas (misal 12)
}

interface Props {
  data?: StatistikCutiResponse;
}

const MAX_CUTI = 12;

export default function DashboardAjukanCuti({ data }: Props) {
  const statistik = data?.data;

  const cards: Card[] = [
    {
      id: 1,
      title: 'Akumulasi Cuti Anda',
      value: statistik?.sisa_cuti_total ?? 0,
      max: MAX_CUTI,
    },
    {
      id: 2,
      title: 'N-2 (2023)',
      value: statistik?.sisa_cuti_n2 ?? 0,
      max: MAX_CUTI,
    },
    {
      id: 3,
      title: 'N-1 (2024)',
      value: statistik?.sisa_cuti_n1 ?? 0,
      max: MAX_CUTI,
    },
    {
      id: 4,
      title: `N (${statistik?.tahun ?? ''})`,
      value: statistik?.sisa_cuti_tahun_ini ?? 0,
      max: MAX_CUTI,
    },
  ];
  return (
    <View className="items-center rounded-b-3xl bg-[#20A0D8] px-4 pt-1">
      <View className="w-full flex-row py-5">
        {cards.map(({ id, title, value, max }) => {
          const progress = max > 0 ? Math.min(value / max, 1) : 0;

          return (
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
                  {value}
                </Text>
              </View>
              {/* Title di bawah */}
              <Text className="mt-2 text-center text-sm font-bold text-white">
                {title}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}
