import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useState } from 'react';
import { Controller } from 'react-hook-form';
import { Platform } from 'react-native';
import { Pressable, Text, View } from 'react-native';

interface DateInputProps {
  control: any; // react-hook-form control
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
      <Text className="mb-1 text-lg text-gray-700 dark:text-neutral-200">
        {label}
      </Text>
      <Controller
        control={control}
        name={name}
        defaultValue=""
        render={({ field: { onChange, value } }) => (
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
                value={value ? new Date(value) : new Date()}
                mode="date"
                display={Platform.OS === 'ios' ? 'inline' : 'default'}
                onChange={(_event, date) => {
                  setShow(Platform.OS === 'ios');
                  if (date) {
                    onChange(date.toISOString().split('T')[0]);
                  }
                }}
              />
            )}
          </>
        )}
      />
      {error && <Text className="mt-1 text-sm text-red-500">{error}</Text>}
    </View>
  );
};
