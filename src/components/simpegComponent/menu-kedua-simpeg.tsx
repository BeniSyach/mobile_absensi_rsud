import { Link } from 'expo-router';
import React from 'react';

import { Image, Pressable, View } from '@/components/ui';

import { Title } from '../title';

export default function MenuKeduaSimpeg() {
  return (
    <View className="mt-3">
      <Title text="Berkas" className="bg-[#0B3880]" />
      <View className="flex-row items-center justify-between">
        <Link href="/simpeg/kegiatan-harian" asChild>
          <Pressable>
            <Image
              source={require('../../../assets/image/kegiatan_harian.png')}
              className="size-36 rounded-lg"
              transition={1000}
              contentFit="contain"
            />
          </Pressable>
        </Link>
        <Link href="/simpeg/berkas-pendukung" asChild>
          <Pressable>
            <Image
              source={require('../../../assets/image/berkas_pendukung.png')}
              className="size-36 rounded-lg"
              transition={1000}
              contentFit="contain"
            />
          </Pressable>
        </Link>
        <Link href="/simpeg/berkas-pak" asChild>
          <Pressable>
            <Image
              source={require('../../../assets/image/berkas_pak.png')}
              className="size-36 rounded-lg"
              transition={1000}
              contentFit="contain"
            />
          </Pressable>
        </Link>
      </View>
    </View>
  );
}
