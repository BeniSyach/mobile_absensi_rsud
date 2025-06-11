import { type Href, Link } from 'expo-router';
import React from 'react';

import { Image, Pressable } from '@/components/ui';

type MenuGridItemProps = {
  href: Href;
  imageSource: any;
  disabled?: boolean;
};

export function MenuGridItemPelayananPublik({
  href,
  imageSource,
  disabled,
}: MenuGridItemProps) {
  if (disabled) {
    return (
      <Image
        source={imageSource}
        className="size-36 rounded-lg"
        contentFit="contain"
        transition={1000}
      />
    );
  }
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
