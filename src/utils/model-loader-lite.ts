import { useTensorflowModel } from 'react-native-fast-tflite';

export const DET_INPUT_SIZE = 128; // BlazeFace
export const EMB_INPUT_SIZE = 112; // MobileFaceNet

export function useFaceModels() {
  const detectionModel = useTensorflowModel(
    require('../assets/models/blazeface.tflite')
  );
  const embedModel = useTensorflowModel(
    require('../assets/models/mobilefacenet.tflite')
  );

  return {
    detectionModel,
    embedModel,
    isReady: detectionModel.state === 'loaded' && embedModel.state === 'loaded',
  };
}
