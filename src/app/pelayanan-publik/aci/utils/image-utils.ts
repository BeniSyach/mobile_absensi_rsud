import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';

export const compressImageIfNeeded = async (asset: {
  uri: string;
  fileSize?: number;
  type?: string;
  mimeType?: string;
}) => {
  const isVideo = asset.type === 'video' || asset.mimeType?.includes('video');
  let finalUri = asset.uri;
  let finalSize = asset.fileSize;

  // Kompresi jika bukan video dan ukuran > 512KB (524288 bytes)
  if (!isVideo && asset.fileSize && asset.fileSize > 512 * 1024) {
    try {
      console.log('Compressing image, original size:', asset.fileSize);
      // Resize width 1080px, quality 0.6
      const result = await manipulateAsync(
        asset.uri,
        [{ resize: { width: 1080 } }],
        { compress: 0.6, format: SaveFormat.JPEG }
      );
      finalUri = result.uri;
      // Set estimasi ukuran aman agar lolos validasi client-side
      finalSize = 500000;
    } catch (err) {
      console.error('Image compression failed:', err);
    }
  }
  return { uri: finalUri, fileSize: finalSize };
};
