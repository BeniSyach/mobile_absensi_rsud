import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useState } from 'react';
import { Platform, Pressable, Text, View } from 'react-native';

interface YearPickerProps {
  label: string;
  placeholder: string;
  value?: string; // e.g., '2024'
  onChange: (year: string) => void;
  error?: string;
}

export const YearPicker = ({
  label,
  placeholder,
  value,
  onChange,
  error,
}: YearPickerProps) => {
  const [show, setShow] = useState(false);

  const handleDateChange = (_event: any, selectedDate?: Date) => {
    setShow(Platform.OS === 'ios'); // Untuk Android, langsung tutup
    if (selectedDate) {
      const selectedYear = selectedDate.getFullYear().toString();
      onChange(selectedYear);
    }
  };

  return (
    <View className="mb-4">
      <Text className="mb-1 text-lg text-black">{label}</Text>
      <Pressable
        onPress={() => setShow(true)}
        className={`border p-3 ${
          error ? 'border-red-500' : 'border-gray-300'
        } rounded-lg bg-white`}
      >
        <Text className="text-gray-700">{value || placeholder}</Text>
      </Pressable>
      {show && (
        <DateTimePicker
          value={value ? new Date(`${value}-01-01`) : new Date()}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleDateChange}
        />
      )}
      {error && <Text className="mt-1 text-sm text-red-500">{error}</Text>}
    </View>
  );
};
