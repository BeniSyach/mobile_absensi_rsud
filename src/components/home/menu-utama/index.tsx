import { Link } from 'expo-router';
import React from 'react';
import { Pressable, View } from 'react-native';

import { Image } from '@/components/ui';

export default function MenuUtama() {
  return (
    <View>
      <View className="flex-row items-center justify-between py-2">
        <Link href="/absensi/menu-absensi" asChild>
          <Pressable>
            <Image
              source={require('../../../../assets/image/logo_absensi.png')}
              className="size-52 rounded-lg"
              transition={1000}
              contentFit="contain"
            />
          </Pressable>
        </Link>
        {/* <Link href="/simpeg" asChild>
          <Pressable>
            <Image
              source={require('../../../../assets/image/logo_pegawai.png')}
              className="size-52 rounded-lg"
              transition={1000}
              contentFit="contain"
            />
          </Pressable>
        </Link> */}

        <Link href="/ekin" asChild>
          <Pressable>
            <Image
              source={require('../../../../assets/image/logo_ekin.png')}
              className="size-52 rounded-lg"
              transition={1000}
              contentFit="contain"
            />
          </Pressable>
        </Link>
      </View>
      <View className="flex-row items-center justify-between">
        <Link href="/simpeg" asChild>
          <Pressable>
            <Image
              source={require('../../../../assets/image/logo_pegawai.png')}
              className="size-52 rounded-lg"
              transition={1000}
              contentFit="contain"
            />
          </Pressable>
        </Link>
        {/* <Link href="/cuti" asChild> */}
        <Pressable>
          <Image
            source={require('../../../../assets/image/icon_cuti.png')}
            className="size-52 rounded-lg"
            transition={1000}
            contentFit="contain"
          />
        </Pressable>
        {/* </Link> */}
      </View>
    </View>
  );
}
