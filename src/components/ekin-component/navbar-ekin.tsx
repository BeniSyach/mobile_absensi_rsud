/* eslint-disable max-lines-per-function */
import { useRouter } from 'expo-router';
import {
  ImageBackground,
  Pressable,
  useWindowDimensions,
  View,
} from 'react-native';

import { type UserPegawai } from '@/api';
import { Image, Text } from '@/components/ui';

interface NavbarEkinProps {
  data: UserPegawai | null;
}

export default function NavbarEkin({ data }: NavbarEkinProps) {
  const router = useRouter();
  const { width, height } = useWindowDimensions();

  if (!data) return null;

  // responsive ukuran logo (maks 300px)
  const logoWidth = Math.min(width * 0.5, 300);
  const logoHeight = logoWidth * 0.32;

  // responsive height background
  const bgHeight = height * 0.18; // 18% dari tinggi layar

  // responsive font size
  const nameFontSize = Math.min(width * 0.05, 22); // max 22px
  const instansiFontSize = Math.min(width * 0.04, 16);

  return (
    <ImageBackground
      source={require('../../../assets/image/header_background_ekin.png')}
      resizeMode="cover"
      style={{ width, height: bgHeight }}
    >
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: width > 600 ? 24 : 16,
          paddingTop: 8,
        }}
      >
        {/* Logo */}
        <Image
          source={require('../../../assets/image/icon_ekin.png')}
          style={{ width: logoWidth, height: logoHeight }}
          contentFit="contain"
        />

        {/* Icon kanan */}
        <View className="flex-row items-center gap-3">
          <Image
            source={require('../../../assets/image/notifications.png')}
            style={{ width: 28, height: 28 }}
            contentFit="contain"
          />
          <Pressable onPress={() => router.back()}>
            <Image
              source={require('../../../assets/image/exit.png')}
              style={{ width: 22, height: 22 }}
              contentFit="contain"
            />
          </Pressable>
        </View>
      </View>

      {/* Text bawah */}
      <View
        style={{ paddingHorizontal: width > 600 ? 24 : 16, paddingBottom: 12 }}
      >
        <Text
          className="font-bold text-white"
          style={{ fontSize: nameFontSize, marginTop: 10 }}
        >
          Hallo, {data.nama}
        </Text>
        <Text
          className="font-bold text-white"
          style={{ fontSize: instansiFontSize }}
        >
          Instansi : {data.nama_unit_kerja}
        </Text>
      </View>
    </ImageBackground>
  );
}
