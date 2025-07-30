import DateTimePicker from '@react-native-community/datetimepicker';
import { Clock } from 'lucide-react-native'; // ⏰ pastikan lucide-react-native sudah terinstall
import React, { useState } from 'react';
import { Platform, Pressable, Text, View } from 'react-native';

interface TimeInputOriProps {
  label: string;
  placeholder: string;
  value: string;
  onChange: (time: string) => void;
  error?: string;
}

export const TimeInputOri = ({
  label,
  placeholder,
  value,
  onChange,
  error,
}: TimeInputOriProps) => {
  const [show, setShow] = useState(false);

  const getInitialDate = () => {
    const date = new Date();
    if (value) {
      const [hours, minutes] = value.split(':').map(Number);
      date.setHours(hours);
      date.setMinutes(minutes);
    }
    return date;
  };

  return (
    <View className="mb-4">
      <Text className="mb-1 mt-2 text-lg text-gray-700 dark:text-neutral-200">
        {label}
      </Text>

      <Pressable
        onPress={() => setShow(true)}
        className={`flex-row items-center gap-2 rounded-lg border p-3 ${
          error ? 'border-red-500' : 'border-gray-300'
        } bg-white`}
      >
        <Clock size={20} color="black" strokeWidth={2.5} />
        <Text className={`text-base ${value ? 'text-black' : 'text-gray-500'}`}>
          {value || placeholder}
        </Text>
      </Pressable>

      {show && (
        <DateTimePicker
          value={getInitialDate()}
          mode="time"
          display={Platform.OS === 'ios' ? 'inline' : 'default'}
          onChange={(_event, selectedDate) => {
            setShow(Platform.OS === 'ios');
            if (selectedDate) {
              const hours = selectedDate.getHours().toString().padStart(2, '0');
              const minutes = selectedDate
                .getMinutes()
                .toString()
                .padStart(2, '0');
              onChange(`${hours}:${minutes}`);
            }
          }}
        />
      )}

      {error && <Text className="mt-1 text-sm text-red-500">{error}</Text>}
    </View>
  );
};
