import { Image, View } from '@/components/ui';

export default function LogoHasilKerja() {
  return (
    <View className="mt-8 flex-row items-center justify-center gap-2">
      <Image
        source={require('../../../../assets/image/icon_rencana_hasil_kerja.png')}
        style={{ width: 300, height: 80 }}
        contentFit="contain"
      />
    </View>
  );
}
