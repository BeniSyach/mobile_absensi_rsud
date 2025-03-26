import { Link } from 'expo-router';

import { Image, Pressable, ScrollView, View } from '@/components/ui';

const menuItems = [
  {
    href: '/ekin/tambah-kegiatan',
    image: require('../../../assets/image/tambah_kegiatan.png'),
  },
  {
    href: '/ekin/list-kegiatan',
    image: require('../../../assets/image/list_kegiatan.png'),
  },
  {
    href: '/ekin/export-tpp',
    image: require('../../../assets/image/export_tpp.png'),
  },
  {
    href: '/ekin/skp-ja',
    image: require('../../../assets/image/skp_ja.png'),
  },
  {
    href: '/ekin/skp-jajf',
    image: require('../../../assets/image/skp_jajf.png'),
  },
  {
    href: '/ekin/beri-nilai-bawahan',
    image: require('../../../assets/image/beri_nilai_bawahan.png'),
  },
];

export default function MenuUtama() {
  return (
    <View className="m-2 rounded-lg bg-gray-100  shadow-md">
      <View className="rounded-lg bg-white px-2 py-4">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="flex-row"
        >
          {menuItems.map((item, index) => (
            <Link key={index} href={item.href as any} asChild>
              <Pressable className={index < menuItems.length - 1 ? 'mr-4' : ''}>
                <Image
                  source={item.image}
                  className="size-36 rounded-lg"
                  transition={1000}
                  contentFit="contain"
                />
              </Pressable>
            </Link>
          ))}
        </ScrollView>
      </View>
    </View>
  );
}
