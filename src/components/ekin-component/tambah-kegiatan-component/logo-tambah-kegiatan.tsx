import { Image, View } from '@/components/ui';

export default function LogoTambahKegiatan() {
  return (
    <View className="mt-10 flex-row items-center justify-center gap-2">
      <Image
        source={require('../../../../assets/image/logo_tambah_kegiatan.png')}
        style={{ width: 300, height: 80 }}
        contentFit="contain"
      />
    </View>
  );
}
