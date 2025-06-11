import { Link } from 'expo-router';

import { Image, Pressable, View } from '@/components/ui';

export default function MenuBapendaComponent() {
  return (
    <View>
      <View className="mt-2 flex-row items-center justify-between px-4">
        <Link href="/pelayanan-publik/bapenda/info-pbb" asChild>
          <Pressable>
            <Image
              source={require('../../../../assets/image/pelayanan-publik/bapenda/icon-info-pbb.png')}
              className="size-28 rounded-lg"
              transition={1000}
              contentFit="contain"
            />
          </Pressable>
        </Link>

        <Link href="/pelayanan-publik/bapenda/info-pad" asChild>
          <Pressable>
            <Image
              source={require('../../../../assets/image/pelayanan-publik/bapenda/icon-info-pad.png')}
              className="size-28 rounded-lg"
              transition={1000}
              contentFit="contain"
            />
          </Pressable>
        </Link>

        <Link href="/pelayanan-publik/bapenda/bukti-bayar" asChild>
          <Pressable>
            <Image
              source={require('../../../../assets/image/pelayanan-publik/bapenda/icon_bukti_bayar.png')}
              className="size-28 rounded-lg"
              transition={1000}
              contentFit="contain"
            />
          </Pressable>
        </Link>
      </View>
      <View className="mt-5 flex-row items-center justify-between px-4">
        <Link href="/pelayanan-publik/bapenda/e-sppt" asChild>
          <Pressable>
            <Image
              source={require('../../../../assets/image/pelayanan-publik/bapenda/icon-esppt.png')}
              className="size-28 rounded-lg"
              transition={1000}
              contentFit="contain"
            />
          </Pressable>
        </Link>
      </View>
    </View>
  );
}
