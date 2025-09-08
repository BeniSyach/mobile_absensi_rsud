/* eslint-disable max-lines-per-function */
import { Link } from 'expo-router';
import { useState } from 'react';

import { type UserPegawai } from '@/api';
import { Image, Pressable, ScrollView, Text, View } from '@/components/ui';

interface MenuUtamaProps {
  data: UserPegawai | null;
}

const menuItems = [
  {
    href: '/ekin/tambah-kegiatan',
    image: require('../../../assets/image/tambah_kegiatan.png'),
    title: 'Tambah Kegiatan',
  },
  {
    href: '/ekin/tambah-kegiatan-pejabat',
    image: require('../../../assets/image/tambah_kegiatan.png'),
    title: 'Tambah Kegiatan',
  },
  {
    href: '/ekin/list-kegiatan',
    image: require('../../../assets/image/list_kegiatan.png'),
    title: 'List Kegiatan',
  },
  {
    href: '/ekin/list-kegiatan-pejabat',
    image: require('../../../assets/image/list_kegiatan.png'),
    title: 'List Kegiatan',
  },
  {
    href: '/ekin/export-tpp',
    image: require('../../../assets/image/export_tpp.png'),
    title: 'Export TPP',
  },
  {
    href: '/ekin/export-tpp-atasan',
    image: require('../../../assets/image/export_tpp.png'),
    title: 'Export TPP Atasan',
  },
  {
    href: '/ekin/beri-nilai-bawahan',
    image: require('../../../assets/image/beri_nilai_bawahan.png'),
    title: 'Beri Nilai Bawahan',
  },
  {
    href: '/ekin/rencana-hasil-kerja',
    image: require('../../../assets/image/rencana_hasil_kerja.png'),
    title: 'Rencana Hasil Kinerja',
  },
  {
    href: '/ekin/rencana-hasil-kerja-atasan',
    image: require('../../../assets/image/rencana_hasil_kerja.png'),
    title: 'Rencana Hasil Kinerja',
  },
  {
    href: '/ekin/pegawai-ekin',
    image: require('../../../assets/image/icon_pegawai_ekin.png'),
    title: 'Data Pegawai',
  },
];

export default function MenuUtama({ data }: MenuUtamaProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [pageCount, setPageCount] = useState(1);

  if (!data) {
    return null;
  }
  const isSekda = data.nama_eselon === 'II.a' || data.nama_eselon === 'II/a';
  const isKadis = data.nama_eselon === 'II.b' || data.nama_eselon === 'II/b';

  const filteredMenu = menuItems.filter((item) => {
    if (isSekda || isKadis) {
      const hideForAtasan = [
        '/ekin/rencana-hasil-kerja',
        '/ekin/export-tpp',
        '/ekin/tambah-kegiatan',
        '/ekin/list-kegiatan',
      ];
      return !hideForAtasan.includes(item.href);
    } else {
      const hideForBawahan = [
        '/ekin/rencana-hasil-kerja-atasan',
        '/ekin/export-tpp-atasan',
        '/ekin/tambah-kegiatan-pejabat',
        '/ekin/list-kegiatan-pejabat',
      ];
      return !hideForBawahan.includes(item.href);
    }
  });

  return (
    <View className="rounded-lg bg-transparent px-2 py-4">
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={(e) => {
          const { contentOffset, layoutMeasurement, contentSize } =
            e.nativeEvent;

          // hitung halaman aktif
          const index = Math.round(contentOffset.x / layoutMeasurement.width);
          setActiveIndex(index);

          // hitung jumlah halaman total
          const pages = Math.ceil(contentSize.width / layoutMeasurement.width);
          setPageCount(pages);
        }}
        scrollEventThrottle={16}
      >
        <View className="flex-row px-4 py-2">
          {filteredMenu.map((item, index) => (
            <Link key={index} href={item.href as any} asChild>
              <Pressable
                className={`items-center rounded-xl bg-transparent p-2 ${
                  index < filteredMenu.length - 1 ? 'mr-4' : ''
                }`}
              >
                <Image
                  source={item.image}
                  className="size-28 rounded-lg"
                  contentFit="contain"
                />
                <Text className="mt-2 text-center text-sm font-extrabold text-[#287BDC]">
                  {item.title}
                </Text>
              </Pressable>
            </Link>
          ))}
        </View>
      </ScrollView>

      {/* indikator di bawah */}
      <View className="mt-2 flex-row justify-center">
        {Array.from({ length: pageCount }).map((_, i) => (
          <View
            key={i}
            className={`mx-1 size-2 rounded-full ${
              i === activeIndex ? 'bg-[#287BDC]' : 'bg-gray-300'
            }`}
          />
        ))}
      </View>
    </View>
  );
}
