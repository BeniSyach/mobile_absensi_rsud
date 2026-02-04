/* eslint-disable max-lines-per-function */
import 'dayjs/locale/id';

import DateTimePicker from '@react-native-community/datetimepicker';
import dayjs from 'dayjs';
import { Calendar } from 'lucide-react-native';
import React, { useState } from 'react';
import { Controller } from 'react-hook-form';
import { Platform, Pressable, Text, View } from 'react-native';

interface DateInputProps {
  control: any;
  name: string;
  label?: string;
  placeholder: string;
  error?: string;
  disabled?: boolean;
}

export const DateInput = ({
  control,
  name,
  label,
  placeholder,
  error,
  disabled = false,
}: DateInputProps) => {
  const [show, setShow] = useState(false);

  return (
    <View className="mb-4">
      {label && (
        <Text
          className={`mb-1 text-lg ${
            disabled ? 'text-gray-400' : 'text-gray-700'
          }`}
        >
          {label}
        </Text>
      )}

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
                disabled={disabled}
                onPress={() => {
                  if (!disabled) setShow(true);
                }}
                className={`flex-row items-center justify-between rounded-lg border px-2 py-3
                  ${
                    disabled
                      ? 'border-gray-200 bg-gray-100'
                      : 'border-gray-300 bg-white'
                  }
                  ${error && !disabled ? 'border-red-500' : ''}
                `}
              >
                <Text
                  className={`${disabled ? 'text-gray-400' : 'text-gray-700'}`}
                >
                  {formattedValue || placeholder}
                </Text>

                <Calendar size={20} color={disabled ? '#9ca3af' : '#6b7280'} />
              </Pressable>

              {show && !disabled && (
                <DateTimePicker
                  value={value ? new Date(value) : new Date()}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'inline' : 'default'}
                  onChange={(event, date) => {
                    if (event.type === 'dismissed') {
                      setShow(false);
                      return;
                    }

                    setShow(Platform.OS === 'ios');
                    if (date) {
                      onChange(date.toISOString().split('T')[0]);
                    }
                  }}
                />
              )}
            </>
          );
        }}
      />

      {error && !disabled && (
        <Text className="mt-1 text-sm text-red-500">{error}</Text>
      )}
    </View>
  );
};
