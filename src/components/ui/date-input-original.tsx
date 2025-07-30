import DateTimePicker from '@react-native-community/datetimepicker';
import { CalendarDays } from 'lucide-react-native'; // pastikan sudah install dan import
import React, { useState } from 'react';
import { Platform, Pressable, Text, View } from 'react-native';

interface DateInputProps {
  label: string;
  placeholder: string;
  value?: string; // ISO format: 'YYYY-MM-DD'
  onChange: (date: string) => void;
  error?: string;
}

export const DateInputOriginal = ({
  label,
  placeholder,
  value,
  onChange,
  error,
}: DateInputProps) => {
  const [show, setShow] = useState(false);

  const handleDateChange = (_event: any, selectedDate?: Date) => {
    setShow(Platform.OS === 'ios'); // iOS tetap tampil, Android langsung hilang
    if (selectedDate) {
      const isoDate = selectedDate.toISOString().split('T')[0];
      onChange(isoDate);
    }
  };

  return (
    <View className="mb-4">
      <Text className="mb-1 mt-2 text-lg text-black">{label}</Text>

      <Pressable
        onPress={() => setShow(true)}
        className={`flex-row items-center gap-2 rounded-lg border p-3 ${
          error ? 'border-red-500' : 'border-gray-300'
        } bg-white`}
      >
        <CalendarDays size={20} color="black" strokeWidth={2.5} />
        <Text className={`text-base ${value ? 'text-black' : 'text-gray-500'}`}>
          {value || placeholder}
        </Text>
      </Pressable>

      {show && (
        <DateTimePicker
          value={value ? new Date(value) : new Date()}
          mode="date"
          display={Platform.OS === 'ios' ? 'inline' : 'default'}
          onChange={handleDateChange}
        />
      )}

      {error && <Text className="mt-1 text-sm text-red-500">{error}</Text>}
    </View>
  );
};
