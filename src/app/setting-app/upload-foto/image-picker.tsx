import * as ImagePicker from 'expo-image-picker';
import { useCallback } from 'react';
import { Alert } from 'react-native';

export default function useImagePicker() {
  return useCallback(
    async (
      setImage: (uri: string | null) => void,
      setName: (name: string | null) => void
    ) => {
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (permissionResult.granted === false) {
        Alert.alert(
          'Permission Required',
          'You need to grant permission to access the gallery.'
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        const imageUri = result.assets[0].uri;
        const imageName = result.assets[0].fileName ?? 'photo.jpg';
        setImage(imageUri);
        setName(imageName);
      }
    },
    []
  );
}
