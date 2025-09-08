import 'dayjs/locale/id'; // untuk bahasa Indonesia

import DateTimePicker from '@react-native-community/datetimepicker';
import dayjs from 'dayjs';
import { Calendar } from 'lucide-react-native';
import React, { useState } from 'react';
import { Controller } from 'react-hook-form';
import { Platform, Pressable, Text, View } from 'react-native';

interface DateInputProps {
  control: any;
  name: string;
  label: string;
  placeholder: string;
  error?: string;
}

export const DateInput = ({
  control,
  name,
  label,
  placeholder,
  error,
}: DateInputProps) => {
  const [show, setShow] = useState(false);

  return (
    <View className="mb-4">
      <Text className="mb-1 text-lg text-gray-700">{label}</Text>
      <Controller
        control={control}
        name={name}
        defaultValue=""
        render={({ field: { onChange, value } }) => {
          const formattedValue = value
            ? dayjs(value).locale('id').format('DD MMMM YYYY')
            : '';

          return (
            <>
              <Pressable
                onPress={() => setShow(true)}
                className={`flex-row items-center justify-between rounded-lg border bg-white px-2 py-3 ${
                  error ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <Text className="text-gray-700">
                  {formattedValue || placeholder}
                </Text>
                <Calendar size={20} color="#6b7280" />
              </Pressable>

              {show && (
                <DateTimePicker
                  value={value ? new Date(value) : new Date()}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'inline' : 'default'}
                  onChange={(event, date) => {
                    // kalau user cancel/dismiss
                    if (event.type === 'dismissed') {
                      setShow(false);
                      return;
                    }

                    setShow(Platform.OS === 'ios');
                    if (date) {
                      // tetap simpan format ISO (YYYY-MM-DD) ke form
                      onChange(date.toISOString().split('T')[0]);
                    }
                  }}
                />
              )}
            </>
          );
        }}
      />
      {error && <Text className="mt-1 text-sm text-red-500">{error}</Text>}
    </View>
  );
};
