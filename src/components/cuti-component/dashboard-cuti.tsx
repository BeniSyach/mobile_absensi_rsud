/* eslint-disable max-lines-per-function */
import { Link } from 'expo-router';
import React from 'react';
import { Pressable, View } from 'react-native';
import * as Progress from 'react-native-progress';

import type { StatistikCutiResponse } from '@/api/cuti';
import { Image, Text } from '@/components/ui';

const gifAssets = {
  'akumulasi_sisa_cuti.gif': require('../../../assets/gif/akumulasi_sisa_cuti.gif'),
  'sisa_cuti.gif': require('../../../assets/gif/sisa_cuti.gif'),
  'cuti_yg_digunakan.gif': require('../../../assets/gif/cuti_yg_digunakan.gif'),
  'pengajuan_cuti.gif': require('../../../assets/gif/pengajuan_cuti.gif'),
} as const;

type GifKey = keyof typeof gifAssets;

interface Card {
  id: number;
  icon: GifKey;
  title: string;
  value: number; // angka asli (2, 5, 12, dst)
  max: number; // batas (12)
  link: string;
  clickable: boolean;
}

interface Props {
  data?: StatistikCutiResponse;
}

export const DashboardCuti = ({ data }: Props) => {
  const statistik = data?.data;

  // fallback supaya tidak NaN
  const totalCuti = statistik?.sisa_cuti_total ?? 0;
  const sisaTahunIni = statistik?.sisa_cuti_total ?? 0;
  const terpakaiTahunIni = statistik?.cuti_terpakai_tahun_ini ?? 0;
  const pengajuanPending = statistik?.pengajuan_pending ?? 0;

  const cards: Card[] = [
    {
      id: 1,
      icon: 'akumulasi_sisa_cuti.gif',
      title: 'Akumulasi Sisa Cuti Tahunan Anda',
      value: totalCuti,
      max: 12,
      link: '/cuti/akumulasi',
      clickable: false,
    },
    {
      id: 2,
      icon: 'sisa_cuti.gif',
      title: 'Sisa Cuti Anda',
      value: sisaTahunIni,
      max: 12,
      link: '/cuti/sisa',
      clickable: false,
    },
    {
      id: 3,
      icon: 'cuti_yg_digunakan.gif',
      title: 'Cuti Yang Digunakan',
      value: terpakaiTahunIni,
      max: 12,
      link: '/cuti/digunakan',
      clickable: false,
    },
    {
      id: 4,
      icon: 'pengajuan_cuti.gif',
      title: 'Pengajuan Cuti Staff',
      value: pengajuanPending,
      max: 100, // bebas, karena hanya indikator
      link: '/cuti/pengajuan',
      clickable: true,
    },
  ];

  return (
    <View className="px-6 py-2">
      <Text className="mb-1 text-lg font-bold text-black">Papan Pandu :</Text>

      {cards.map(({ id, icon, title, value, max, link, clickable }) => {
        const progress = max > 0 ? Math.min(value / max, 1) : 0;
        const displayValue = value;

        const CardContent = (
          <View className="mb-3 w-full rounded-2xl border border-gray-300 bg-white p-2 shadow-lg">
            <View className="flex-row items-start justify-between">
              {/* Kiri */}
              <View className="flex-1">
                <Image
                  source={gifAssets[icon]}
                  className="size-20 rounded-lg"
                  transition={1000}
                  contentFit="contain"
                />
                <Text className="text-xl font-extrabold text-black">
                  {title}
                </Text>
              </View>

              {/* Kanan */}
              <View className="mx-4 my-1 items-center justify-center">
                <Progress.Circle
                  size={80}
                  progress={progress}
                  color="#20A0D8"
                  thickness={12}
                  borderWidth={0}
                  unfilledColor="#E5E7EB"
                  strokeCap="round"
                />

                <Text className="absolute text-3xl font-extrabold text-[#20A0D8]">
                  {displayValue}
                </Text>
              </View>
            </View>
          </View>
        );

        if (clickable) {
          return (
            <Link key={id} href={link as any} asChild>
              <Pressable>{CardContent}</Pressable>
            </Link>
          );
        }

        return <View key={id}>{CardContent}</View>;
      })}
    </View>
  );
};
