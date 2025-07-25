import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useState } from 'react';
import { Controller } from 'react-hook-form';
import { Platform, Pressable, Text, View } from 'react-native';

interface TimeInputProps {
  control: any;
  name: string;
  label: string;
  placeholder: string;
  error?: string;
}

export const TimeInput = ({
  control,
  name,
  label,
  placeholder,
  error,
}: TimeInputProps) => {
  const [show, setShow] = useState(false);

  return (
    <View className="mb-4">
      <Text className="mb-1 text-lg text-gray-700 dark:text-neutral-200">
        {label}
      </Text>
      <Controller
        control={control}
        name={name}
        defaultValue=""
        render={({ field: { onChange, value } }) => {
          let initialDate = new Date();
          if (value) {
            const [hours, minutes] = value.split(':').map(Number);
            initialDate.setHours(hours);
            initialDate.setMinutes(minutes);
          }

          return (
            <>
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
                  value={initialDate}
                  mode="time"
                  display={Platform.OS === 'ios' ? 'inline' : 'default'}
                  onChange={(_event, date) => {
                    setShow(Platform.OS === 'ios');
                    if (date) {
                      const hours = date.getHours().toString().padStart(2, '0');
                      const minutes = date
                        .getMinutes()
                        .toString()
                        .padStart(2, '0');
                      onChange(`${hours}:${minutes}`);
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
