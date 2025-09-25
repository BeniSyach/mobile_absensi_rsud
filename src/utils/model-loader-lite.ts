// hooks/useFaceModels.ts
import { useTensorflowModel } from 'react-native-fast-tflite';

export const DET_INPUT_SIZE = 128; // BlazeFace
export const EMB_INPUT_SIZE = 112; // MobileFaceNet

export function useFaceModels() {
  const embedModel = useTensorflowModel(
    require('../../assets/model/mobilefacenet.tflite')
  );

  return { embedModel };
}
