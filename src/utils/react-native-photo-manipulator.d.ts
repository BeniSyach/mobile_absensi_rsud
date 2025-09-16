declare module 'react-native-photo-manipulator' {
  export interface CropRegion {
    x: number;
    y: number;
    width: number;
    height: number;
    targetWidth?: number;
    targetHeight?: number;
  }

  const PhotoManipulator: {
    crop(uri: string, cropRegion: CropRegion): Promise<string>;
    // tambahkan method lain jika dibutuhkan
  };

  export default PhotoManipulator;
}
