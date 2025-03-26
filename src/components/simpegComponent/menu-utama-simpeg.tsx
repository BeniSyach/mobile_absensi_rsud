import { type Href } from 'expo-router';
import React from 'react';

import { View } from '@/components/ui';

import { MenuGridItem } from './menu-grid-item';

const menuItems: { href: Href; image: any }[] = [
  {
    href: '/simpeg/lokasi-identitas' as const,
    image: require('../../../assets/image/lokasi_dan_identitas.png'),
  },
  {
    href: '/simpeg/cpns-pns' as const,
    image: require('../../../assets/image/cpns_pns.png'),
  },
  {
    href: '/simpeg/pangkat-golongan',
    image: require('../../../assets/image/pangkat_dan_golongan.png'),
  },
  // {
  //   href: '/simpeg/gaji-berkala',
  //   image: require('../../../assets/image/gaji_berkala.png'),
  // },
  {
    href: '/simpeg/jabatan',
    image: require('../../../assets/image/Jabatan.png'),
  },
  {
    href: '/simpeg/pendidikan',
    image: require('../../../assets/image/Pendidikan.png'),
  },
  {
    href: '/simpeg/orang-tua',
    image: require('../../../assets/image/orang_tua.png'),
  },
  {
    href: '/simpeg/keluarga',
    image: require('../../../assets/image/Keluarga.png'),
  },
  {
    href: '/simpeg/diklat-struktural',
    image: require('../../../assets/image/diklat_struktural.png'),
  },
  {
    href: '/simpeg/diklat-fungsional',
    image: require('../../../assets/image/diklat_fungsional.png'),
  },
  {
    href: '/simpeg/diklat-teknis',
    image: require('../../../assets/image/diklat_teknis.png'),
  },
  // {
  //   href: '/simpeg',
  //   image: require('../../../assets/image/Setelan.png'),
  // },
];

export default function MenuUtamaSimpeg() {
  return (
    <View>
      {[0, 1, 2, 3].map((rowIndex) => (
        <View
          key={rowIndex}
          className="flex-row items-center justify-between py-2"
        >
          {menuItems
            .slice(rowIndex * 3, (rowIndex + 1) * 3)
            .map((item, index) => (
              <MenuGridItem
                key={index}
                href={item.href}
                imageSource={item.image}
              />
            ))}
        </View>
      ))}
    </View>
  );
}
