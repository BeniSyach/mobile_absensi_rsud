import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

import { Image } from '@/components/ui/image';

interface SelectedImage {
  uri: string;
  name: string;
  type: string;
}

interface ImageAttachmentProps {
  image: SelectedImage | null;
  onPickImage: () => void;
  onRemoveImage: () => void;
}

export function ImageAttachment({
  image,
  onPickImage,
  onRemoveImage,
}: ImageAttachmentProps) {
  return (
    <View>
      <Text className="mb-2 ml-1 text-sm font-bold text-[#0B2347]">
        Foto Kejadian (Opsional)
      </Text>
      <TouchableOpacity
        onPress={onPickImage}
        className="items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-white py-8"
      >
        {image ? (
          <View className="relative">
            <Image
              source={{ uri: image.uri }}
              className="h-40 w-64 rounded-xl"
              contentFit="cover"
            />
            <TouchableOpacity
              onPress={onRemoveImage}
              className="absolute -right-2 -top-2 rounded-full bg-red-500 p-1"
            >
              <Ionicons name="close" size={16} color="white" />
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <View className="mb-2 rounded-full bg-blue-50 p-3">
              <Ionicons name="camera-outline" size={32} color="#0066FF" />
            </View>
            <Text className="text-sm font-medium text-gray-500">
              Ambil foto atau pilih dari galeri
            </Text>
            <Text className="mt-1 text-xs text-gray-400">
              Format: JPG, PNG (Max 5MB)
            </Text>
          </>
        )}
      </TouchableOpacity>
    </View>
  );
}

export default function Ignored() {
  return null;
}
