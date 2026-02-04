import React from 'react';
import { Text, TextInput, View } from 'react-native';

interface ReportInputFieldProps {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  multiline?: boolean;
  numberOfLines?: number;
  height?: number;
}

export function ReportInputField({
  label,
  placeholder,
  value,
  onChangeText,
  multiline,
  height,
}: ReportInputFieldProps) {
  return (
    <View>
      <Text className="mb-2 ml-1 text-sm font-bold text-[#0B2347]">
        {label}
      </Text>
      <View
        className="rounded-2xl border border-gray-100 bg-white px-4 py-3 shadow-sm"
        style={height ? { height } : undefined}
      >
        <TextInput
          placeholder={placeholder}
          className={`font-inter text-base text-gray-800 ${multiline ? 'text-left' : ''}`}
          style={height ? { height } : undefined}
          value={value}
          onChangeText={onChangeText}
          multiline={multiline}
          textAlignVertical={multiline ? 'top' : 'center'}
        />
      </View>
    </View>
  );
}

export default function Ignored() {
  return null;
}
