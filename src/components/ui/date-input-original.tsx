import 'dayjs/locale/id'; // gunakan bahasa Indonesia

import DateTimePicker from '@react-native-community/datetimepicker';
import dayjs from 'dayjs';
import { CalendarDays } from 'lucide-react-native';
import React, { useState } from 'react';
import { Platform, Pressable, Text, View } from 'react-native';
dayjs.locale('id');

interface DateInputProps {
  label: string;
  placeholder: string;
  value?: string; // format: 'DD MMMM YYYY'
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

  const handleDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShow(false); // Android: picker selalu ditutup setelah pilih/cancel
    }

    if (event.type === 'set' && selectedDate) {
      // Format dd MMMM YYYY → contoh: 02 September 2025
      const formatted = dayjs(selectedDate).format('DD MMMM YYYY');
      onChange(formatted);
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
          value={value ? dayjs(value, 'DD MMMM YYYY').toDate() : new Date()}
          mode="date"
          display={Platform.OS === 'ios' ? 'inline' : 'default'}
          onChange={handleDateChange}
        />
      )}

      {error && <Text className="mt-1 text-sm text-red-500">{error}</Text>}
    </View>
  );
};
