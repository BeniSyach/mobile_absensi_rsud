import * as ImageManipulator from 'expo-image-manipulator';
import * as ImagePicker from 'expo-image-picker';
import React from 'react';
import type { UseFormSetValue } from 'react-hook-form';

import type { FormType } from './absensi-form';

export const UseImagePicker = (setValue: UseFormSetValue<FormType>) => {
  const [image, setImage] = React.useState<string | null>(null);
  const [mimeType, setMimeType] = React.useState<string | null>(null);
  const [name, setName] = React.useState<string | null>(null);

  const getFileSize = async (uri: string) => {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      return blob.size;
    } catch (error) {
      console.error('Error getting file size:', error);
      return 0;
    }
  };

  const takePhoto = async () => {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
      cameraType: ImagePicker.CameraType.front,
    });

    if (!result.canceled) {
      const imageUri = result.assets[0].uri;
      const imageMimeType = result.assets[0].type ?? null;
      const imageName = result.assets[0].fileName ?? 'photo.jpg';

      let compressedImageUri = imageUri;
      let compressedImageSize = 0;

      // Try different compression qualities until the file size is below 2 MB
      for (let quality = 0.9; quality >= 0.1; quality -= 0.1) {
        const compressedImage = await ImageManipulator.manipulateAsync(
          imageUri,
          [],
          { compress: quality, format: ImageManipulator.SaveFormat.JPEG } // Compress and save as JPEG
        );

        // Get the file size of the compressed image
        compressedImageSize = await getFileSize(compressedImage.uri);

        if (compressedImageSize < 2 * 1024 * 1024) {
          // Check if the size is below 2 MB
          compressedImageUri = compressedImage.uri;
          break;
        }
      }

      setImage(imageUri ?? null);
      setMimeType(imageMimeType);

      setName(imageName);
      setValue('photo', compressedImageUri);
    }
  };

  return { image, mimeType, name, takePhoto };
};
