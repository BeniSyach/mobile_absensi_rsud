import { Image, View } from '@/components/ui';

export default function LogoAddRHK() {
  return (
    <View className="mt-8 flex-row items-center justify-center gap-2">
      <Image
        source={require('../../../../../assets/image/tambah_rhk.png')}
        style={{ width: 300, height: 80 }}
        contentFit="contain"
      />
    </View>
  );
}
