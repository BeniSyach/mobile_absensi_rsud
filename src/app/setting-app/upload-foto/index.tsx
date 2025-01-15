import { Stack, useRouter } from 'expo-router';
import { useState } from 'react';
import { Image } from 'react-native';
import { showMessage } from 'react-native-flash-message';

import { UploadPhoto } from '@/api';
import { Button, showErrorMessage, View } from '@/components/ui';

import { useImagePicker } from './image-picker';

export default function UploadFoto() {
  const router = useRouter();
  const [image, setImage] = useState<string | null>(null);
  const [name, setName] = useState<string | null>(null);
  const { mutate, isPending } = UploadPhoto();
  const pickImage = useImagePicker();

  const handleUploadImage = async () => {
    if (!image) {
      showMessage({ message: 'No image selected!', type: 'danger' });
      return;
    }
    try {
      await mutate({
        photo: image,
        name: name || 'photo.jpg',
        mimeType: 'image/jpeg',
      });
      showMessage({ message: 'Image uploaded successfully!', type: 'success' });
      router.back();
    } catch (error) {
      showErrorMessage('Upload Failed');
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Stack.Screen
        options={{ title: 'Upload Foto', headerBackTitle: 'upload-foto' }}
      />
      {image && (
        <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />
      )}
      <Button
        label="Pick an Image"
        onPress={() => pickImage(setImage, setName)}
      />
      <Button
        label="Upload Image"
        onPress={handleUploadImage}
        disabled={isPending}
      />
    </View>
  );
}
