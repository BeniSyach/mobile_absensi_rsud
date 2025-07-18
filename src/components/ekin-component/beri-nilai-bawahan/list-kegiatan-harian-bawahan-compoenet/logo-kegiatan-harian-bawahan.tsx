import { Image, View } from '@/components/ui';

export default function LogoKegiatanHarianBawahan() {
  return (
    <View className="mt-8 flex-row items-center justify-center gap-2">
      <Image
        source={require('../../../../../assets/image/list_kegiatan_harian_bawahan.png')}
        style={{ width: 300, height: 80 }}
        contentFit="contain"
      />
    </View>
  );
}
