import { Image, View } from '@/components/ui';

export default function LogoSKPJA() {
  return (
    <View className="flex-row items-center justify-center gap-2">
      <Image
        source={require('../../../../assets/image/logo_skp_ja.png')}
        style={{ width: 220, height: 70 }}
        contentFit="contain"
      />
    </View>
  );
}
