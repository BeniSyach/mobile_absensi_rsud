import * as ImagePicker from 'expo-image-picker';
import { useCallback } from 'react';
import { Alert } from 'react-native';

export default function UseImagePicker() {
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
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.2,
      });

      if (!result.canceled) {
        const { uri: imageUri, fileName = `photo-${Date.now()}.jpg` } =
          result.assets[0];
        console.log('compressedUri', imageUri);
        setImage(imageUri);
        setName(fileName);
      }
    },
    []
  );
}
