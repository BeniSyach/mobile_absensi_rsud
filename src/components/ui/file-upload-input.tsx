import * as DocumentPicker from 'expo-document-picker';
import React, { useState } from 'react';
import { Controller } from 'react-hook-form';
import { Alert, Pressable, Text, View } from 'react-native';

interface FileUploadInputProps {
  control: any; // react-hook-form control
  name: string;
  label: string;
  placeholder: string;
  error?: string;
}

export const FileUploadInput = ({
  control,
  name,
  label,
  placeholder,
  error,
}: FileUploadInputProps) => {
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  const handlePickFile = async (onChange: (value: any) => void) => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/pdf',
      });

      if (!result.canceled) {
        const file = {
          name: result.assets[0].name,
          uri: result.assets[0].uri,
          type: result.assets[0].mimeType, // MIME type
        };
        setSelectedFile(file.name);
        onChange(file);
      }
    } catch (err) {
      Alert.alert('Error', 'Failed to pick a file.');
    }
  };

  return (
    <View className="mb-4">
      <Text className="text-grey-100 dark:text-neutral-10 mb-1 text-lg">
        {label}
      </Text>
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange } }) => (
          <Pressable
            onPress={() => handlePickFile(onChange)}
            className={`border p-3 ${
              error ? 'border-red-500' : 'border-gray-300'
            } rounded-lg bg-white`}
          >
            <Text className="text-gray-700">{selectedFile || placeholder}</Text>
          </Pressable>
        )}
      />
      {error && <Text className="mt-1 text-sm text-red-500">{error}</Text>}
    </View>
  );
};
