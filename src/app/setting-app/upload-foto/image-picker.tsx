import * as ImagePicker from 'expo-image-picker';
import { useCallback } from 'react';

export default function UseImagePicker() {
  return useCallback(
    async (
      setImage: (uri: string | null) => void,
      setName: (name: string | null) => void
    ) => {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.2,
      });

      if (!result.canceled) {
        const { uri: imageUri, fileName = `photo-${Date.now()}.jpg` } =
          result.assets[0];
        setImage(imageUri);
        setName(fileName);
      }
    },
    []
  );
}
