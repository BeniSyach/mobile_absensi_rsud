import { type Href } from 'expo-router';
import React from 'react';

import { View } from '@/components/ui';

import { MenuGridItemPelayananPublik } from './menu-grid';

const menuItems: { href: Href; image: any; disabled?: boolean }[] = [
  {
    href: '/pelayanan-publik/web-deli-serdang' as const,
    image: require('../../../assets/image/pelayanan-publik/icon-ds.png'),
    disabled: false,
  },
  {
    href: '/pelayanan-publik/span-lapor' as const,
    image: require('../../../assets/image/pelayanan-publik/icon-spanlapor.png'),
    disabled: false,
  },
  {
    href: '/pelayanan-publik/smart-city',
    image: require('../../../assets/image/pelayanan-publik/icon-smartcity.png'),
    disabled: false,
  },
  {
    href: '/pelayanan-publik/bapenda',
    image: require('../../../assets/image/pelayanan-publik/icon-e-padi.png'),
    disabled: false,
  },
  {
    href: '/pelayanan-publik/keuangan',
    image: require('../../../assets/image/pelayanan-publik/keuangan_sp2d_icon.png'),
    disabled: false,
  },
  {
    href: '/pelayanan-publik/pihps',
    image: require('../../../assets/image/pelayanan-publik/icon-pihps.png'),
    disabled: false,
  },
  {
    href: '/pelayanan-publik/sada-sada',
    image: require('../../../assets/image/pelayanan-publik/koperasi/logo-sada-sada.png'),
    // image: require('../../../assets/image/pelayanan-publik/icon-opd.png'),
    disabled: false,
  },
  {
    href: '/pelayanan-publik/seri-deli',
    image: require('../../../assets/image/pelayanan-publik/icon-seri-deli.png'),
    disabled: false,
  },
  {
    href: '/pelayanan-publik/jdih',
    image: require('../../../assets/image/pelayanan-publik/icon-jdih-true.png'),
    disabled: false,
  },
  {
    href: '/pelayanan-publik/radio-dsb',
    image: require('../../../assets/image/pelayanan-publik/icon-radiodsb.png'),
    disabled: false,
  },
  {
    href: '/pelayanan-publik/salak-deli',
    image: require('../../../assets/image/pelayanan-publik/icon-spbe.png'),
    disabled: true,
  },

  {
    href: '/pelayanan-publik/salak-deli',
    image: require('../../../assets/image/pelayanan-publik/icon-salak-deli.png'),
    disabled: true,
  },
  {
    href: '/pelayanan-publik/opd',
    image: require('../../../assets/image/pelayanan-publik/icon-opd-true.png'),
    disabled: false,
  },
];

export default function MenuUtamaPelayananPublik() {
  return (
    <View>
      {[0, 1, 2, 3, 4].map((rowIndex) => (
        <View
          key={rowIndex}
          className="flex-row items-center justify-between py-2"
        >
          {menuItems
            .slice(rowIndex * 3, (rowIndex + 1) * 3)
            .map((item, index) => (
              <MenuGridItemPelayananPublik
                key={index}
                href={item.href}
                imageSource={item.image}
                disabled={item.disabled}
              />
            ))}
        </View>
      ))}
    </View>
  );
}
