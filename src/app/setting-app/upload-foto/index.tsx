import { Stack, useRouter } from 'expo-router';
import { useState } from 'react';
import { showMessage } from 'react-native-flash-message';
import { SafeAreaView } from 'react-native-safe-area-context';

import { UploadPhoto } from '@/api';
import { Button, Image, showErrorMessage, View } from '@/components/ui';

import UseImagePicker from './image-picker';

export default function UploadFoto() {
  const router = useRouter();
  const [image, setImage] = useState<string | null>(null);
  const [name, setName] = useState<string | null>(null);
  const { mutate, isPending } = UploadPhoto();
  const pickImage = UseImagePicker();

  const handleUploadImage = async () => {
    if (!image) {
      showMessage({
        message: 'No image selected!',
        type: 'danger',
        duration: 7000,
      });
      return;
    }
    try {
      await mutate({
        photo: image,
        name: name || 'photo.jpg',
        mimeType: 'image/jpeg',
      });
      showMessage({
        message: 'Image uploaded successfully!',
        type: 'success',
        duration: 7000,
      });
      router.back();
    } catch (error) {
      showErrorMessage('Upload Failed');
    }
  };
  return (
    <SafeAreaView
      className="flex-1 bg-[#0B3880]"
      edges={['top', 'left', 'right']}
    >
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Stack.Screen
          options={{ title: 'Upload Foto', headerBackTitle: 'upload-foto' }}
        />
        {image && (
          <Image
            source={{ uri: image }}
            style={{ width: 200, height: 200 }}
            transition={1000}
            contentFit="contain"
          />
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
    </SafeAreaView>
  );
}
