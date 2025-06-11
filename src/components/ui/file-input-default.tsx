import * as DocumentPicker from 'expo-document-picker';
import React, { useState } from 'react';
import { Alert, Pressable, Text, View } from 'react-native';

interface FileUploadInputProps {
  label: string;
  placeholder?: string;
  error?: string;
  onChange?: (file: { name: string; uri: string; type: string }) => void;
  value?: { name: string; uri: string; type: string } | null;
}

export const FileUploadInputDefault = ({
  label,
  placeholder = 'Pilih file...',
  error,
  onChange,
  value,
}: FileUploadInputProps) => {
  // local state untuk simpan nama file yang dipilih, fallback ke value dari props kalau ada
  const [selectedFile, setSelectedFile] = useState<string | null>(
    value?.name || null
  );

  const handlePickFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'image/jpeg',
      });

      if (!result.canceled) {
        const file = {
          name: result.assets[0].name,
          uri: result.assets[0].uri,
          type: result.assets[0].mimeType ?? 'application/octet-stream',
        };
        setSelectedFile(file.name);
        if (onChange) onChange(file);
      }
    } catch (err) {
      Alert.alert('Error', 'Failed to pick a file.');
    }
  };

  // Jika props value berubah dari luar, update juga selectedFile
  React.useEffect(() => {
    if (value?.name) setSelectedFile(value.name);
  }, [value]);

  return (
    <View className="mb-4">
      <Text className="text-dark mb-1 text-lg">{label}</Text>
      <Pressable
        onPress={handlePickFile}
        className={`border p-3 ${
          error ? 'border-red-500' : 'border-gray-300'
        } rounded-lg bg-white`}
      >
        <Text className="text-gray-700">{selectedFile || placeholder}</Text>
      </Pressable>
      {error && <Text className="mt-1 text-sm text-red-500">{error}</Text>}
    </View>
  );
};
