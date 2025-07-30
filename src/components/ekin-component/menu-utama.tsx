import { Link } from 'expo-router';

import { Image, Pressable, ScrollView, Text, View } from '@/components/ui';

const menuItems = [
  {
    href: '/ekin/tambah-kegiatan',
    image: require('../../../assets/image/tambah_kegiatan.png'),
    title: 'Tambah Kegiatan',
  },
  {
    href: '/ekin/list-kegiatan',
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
    title: 'Rencana Hasil Kinerja Atasan',
  },
  {
    href: '/ekin/pegawai-ekin',
    image: require('../../../assets/image/icon_pegawai_ekin.png'),
    title: 'Data Pegawai',
  },
];

export default function MenuUtama() {
  return (
    // <View className="m-2 rounded-lg bg-gray-100  shadow-md">
    <View className="rounded-lg bg-transparent px-2 py-4">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="flex-row"
      >
        <View className="flex-row px-4 py-2">
          {menuItems.map((item, index) => (
            <Link key={index} href={item.href as any} asChild>
              <Pressable
                className={`items-center rounded-xl bg-transparent p-2  ${index < menuItems.length - 1 ? 'mr-4' : ''}`}
              >
                <Image
                  source={item.image}
                  className="size-28 rounded-lg"
                  contentFit="contain"
                />
                <Text
                  className="mt-2 text-center text-sm font-extrabold text-[#287BDC]"
                  style={{ flexWrap: 'wrap' }}
                >
                  {item.title}
                </Text>
              </Pressable>
            </Link>
          ))}
        </View>
      </ScrollView>
    </View>
    // </View>
  );
}
