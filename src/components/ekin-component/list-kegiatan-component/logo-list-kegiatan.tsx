import { Image, View } from '@/components/ui';

export default function LogoListKegiatan() {
  return (
    <View className="mt-8 flex-row items-center justify-center gap-2">
      <Image
        source={require('../../../../assets/image/logo_list_kegiatan.png')}
        style={{ width: 300, height: 80 }}
        contentFit="contain"
      />
    </View>
  );
}
