import { Image, View } from '@/components/ui';

export default function LogoTambahKegiatan() {
  return (
    <View className="flex-row items-center justify-center gap-2">
      <Image
        source={require('../../../../assets/image/logo_tambah_kegiatan.png')}
        style={{ width: 240, height: 80 }}
        contentFit="contain"
      />
    </View>
  );
}
