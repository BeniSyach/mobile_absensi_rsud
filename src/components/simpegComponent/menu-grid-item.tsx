import { type Href, Link } from 'expo-router';
import React from 'react';
import { Pressable } from 'react-native';

import { Image } from '@/components/ui';

type MenuGridItemProps = {
  href: Href;
  imageSource: any;
};

export function MenuGridItem({ href, imageSource }: MenuGridItemProps) {
  return (
    <Link href={href} asChild>
      <Pressable>
        <Image
          source={imageSource}
          className="size-36 rounded-lg"
          transition={1000}
          contentFit="contain"
        />
      </Pressable>
    </Link>
  );
}
