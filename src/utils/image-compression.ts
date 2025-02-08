// import * as ImageManipulator from 'expo-image-manipulator';
// import { Alert } from 'react-native';

// const getFileSize = async (uri: string) => {
//   try {
//     const response = await fetch(uri);
//     const blob = await response.blob();
//     return blob.size;
//   } catch (error) {
//     console.error('Error getting file size:', error);
//     return 0;
//   }
// };

// export const compressImage = async (uri: string): Promise<string | null> => {
//   const maxFileSize = 2 * 1024 * 1024;
//   const dimensions = [1920, 1280, 800];
//   const qualities = [0.7, 0.5, 0.3];

//   for (const maxDimension of dimensions) {
//     for (const quality of qualities) {
//       try {
//         const compressedImage = await ImageManipulator.manipulateAsync(
//           uri,
//           [{ resize: { width: maxDimension, height: maxDimension } }],
//           { compress: quality, format: ImageManipulator.SaveFormat.JPEG }
//         );

//         const fileSize = await getFileSize(compressedImage.uri);
//         if (fileSize <= maxFileSize) return compressedImage.uri;
//       } catch (error) {
//         console.error('Compression attempt failed:', error);
//       }
//     }
//   }

//   Alert.alert('Error', 'Cannot compress image to required size');
//   return null;
// };
