import * as React from 'react';

import { Text, View } from '@/components/ui';

type Props = {
  text: string;
  className?: string;
};
export const Title = ({ text, className }: Props) => {
  return (
    <View className="flex-row items-center justify-center px-4 py-2">
      <View className={`h-[2px] flex-1 ${className}`} />
      <Text className="dark:text-dark mx-2 text-xl font-bold tracking-tight">
        {text}
      </Text>
      <View className={`h-[2px] flex-1 ${className}`} />
    </View>
  );
};
export const TitleSecondary = ({ text, className }: Props) => {
  return (
    <View className="flex-row items-center justify-start py-2">
      <Text className="dark:text-dark mx-2 text-xl font-bold tracking-tight">
        {text}
      </Text>
      <View className={`h-px flex-1 ${className}`} />
    </View>
  );
};
