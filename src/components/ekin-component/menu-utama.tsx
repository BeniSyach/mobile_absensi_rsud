import { Link } from 'expo-router';

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
  if (!data) {
    return null;
  }
  const isSekda = data.nama_eselon === 'II.a' || data.nama_eselon === 'II/a';
  const isKadis = data.nama_eselon === 'II.b' || data.nama_eselon === 'II/b';

  console.log('data eselon', data.nama_eselon);

  const filteredMenu = menuItems.filter((item) => {
    if (isSekda || isKadis) {
      // Atasan → sembunyikan versi bawahan
      const hideForAtasan = [
        '/ekin/rencana-hasil-kerja',
        '/ekin/export-tpp',
        '/ekin/tambah-kegiatan',
        '/ekin/list-kegiatan', // versi bawahan
      ];
      return !hideForAtasan.includes(item.href);
    } else {
      // Bawahan → sembunyikan versi atasan
      const hideForBawahan = [
        '/ekin/rencana-hasil-kerja-atasan',
        '/ekin/export-tpp-atasan',
        '/ekin/tambah-kegiatan-pejabat',
        '/ekin/list-kegiatan-pejabat', // versi atasan
      ];
      return !hideForBawahan.includes(item.href);
    }
  });

  return (
    // <View className="m-2 rounded-lg bg-gray-100  shadow-md">
    <View className="rounded-lg bg-transparent px-2 py-4">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="flex-row"
      >
        <View className="flex-row px-4 py-2">
          {filteredMenu.map((item, index) => (
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
