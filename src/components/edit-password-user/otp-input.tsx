import React, { useRef, useState } from 'react';
import { TextInput } from 'react-native';

import { Text, View } from '@/components/ui';

type OtpInputProps = {
  length?: number;
  onChange: (code: string) => void;
};

export function OtpInput({ length = 4, onChange }: OtpInputProps) {
  const [values, setValues] = useState<string[]>(Array(length).fill(''));
  const inputs = useRef<TextInput[]>([]);

  const handleChange = (text: string, index: number) => {
    const newValues = [...values];
    newValues[index] = text.slice(-1); // hanya ambil digit terakhir
    setValues(newValues);

    // pindah ke kotak berikutnya
    if (text && index < length - 1) {
      inputs.current[index + 1]?.focus();
    }

    // kalau hapus, balik ke kotak sebelumnya
    if (!text && index > 0) {
      inputs.current[index - 1]?.focus();
    }

    onChange(newValues.join(''));
  };

  return (
    <View className="flex-row items-center justify-center">
      {Array.from({ length }).map((_, i) => (
        <React.Fragment key={i}>
          <TextInput
            ref={(ref) => {
              if (ref) inputs.current[i] = ref;
            }}
            className="size-12 rounded-lg border border-gray-300 text-center text-xl font-semibold"
            keyboardType="number-pad"
            maxLength={1}
            value={values[i]}
            onChangeText={(text) => handleChange(text, i)}
          />
          {/* kasih strip di antara kotak kecuali setelah terakhir */}
          {i < length - 1 && (
            <Text className="mx-2 text-xl font-bold text-gray-500">-</Text>
          )}
        </React.Fragment>
      ))}
    </View>
  );
}
