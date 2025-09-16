/* eslint-disable max-lines-per-function */
import { Camera, CameraView } from 'expo-camera';
import * as FileSystem from 'expo-file-system';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useTensorflowModel } from 'react-native-fast-tflite';

import { anchors } from '@/utils/blazeface-anchors';
import { imageUriToTensor } from '@/utils/face-utils-lite';

type FaceRegisterProps = {
  onRegister: (embedding: Float32Array, photoUri: string) => void;
};

const DET_INPUT_SIZE = 128;
const EMBED_INPUT_SIZE = 112;

export default function FaceRegisterExpoCameraView({
  onRegister,
}: FaceRegisterProps) {
  const cameraRef = useRef<CameraView>(null);
  const [hasPermission, setHasPermission] = useState(false);
  const [status, setStatus] = useState('Checking camera permission...');

  const detModel = useTensorflowModel(
    require('../../../../assets/model/blazeface.tflite')
  );
  const embedModel = useTensorflowModel(
    require('../../../../assets/model/mobilefacenet.tflite')
  );

  // Request camera permission
  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
      if (status !== 'granted') {
        Alert.alert(
          'Permission Denied',
          'Camera permission is required to use this feature.'
        );
      }
    })();
  }, []);

  // Update status when models load
  useEffect(() => {
    if (detModel.state === 'loaded' && embedModel.state === 'loaded') {
      setStatus('Models loaded, ready to capture');
    } else if (detModel.state === 'loading' || embedModel.state === 'loading') {
      setStatus('Loading models...');
    } else if (detModel.state === 'error' || embedModel.state === 'error') {
      setStatus('Error loading models');
    }
  }, [detModel.state, embedModel.state]);

  const sigmoid = (x: number) => 1 / (1 + Math.exp(-x));

  const detectFaces = async (photoUri: string) => {
    if (!detModel.model || detModel.state !== 'loaded') return [];
    const pixels = await imageUriToTensor(photoUri, DET_INPUT_SIZE, 'zero_one');

    let outputs;
    try {
      outputs = detModel.model.runSync([pixels]);
    } catch (err) {
      console.error('Face detection failed', err);
      return [];
    }

    if (!outputs || !outputs[0]) return [];
    const detections = outputs[0] as Float32Array;
    const results: any[] = [];
    const stride = 16;

    for (let i = 0; i < detections.length; i += stride) {
      const score = sigmoid(detections[i + 15]);
      if (score < 0.8) continue;
      const anchor = anchors[Math.floor(i / stride)];
      if (!anchor) continue;
      results.push({
        score,
        box: {
          x: detections[i] + anchor[0],
          y: detections[i + 1] + anchor[1],
          w: detections[i + 2],
          h: detections[i + 3],
        },
      });
    }

    return results.sort((a, b) => b.score - a.score);
  };

  const showAlert = (title: string, message?: string) => {
    try {
      if (message) {
        Alert.alert(title, message);
      } else {
        Alert.alert(title);
      }
    } catch (error) {
      console.error('Alert error:', error);
      console.log(`Alert: ${title}${message ? ` - ${message}` : ''}`);
    }
  };

  const captureAndRegister = async () => {
    if (!cameraRef.current) {
      showAlert(
        'Camera Not Ready',
        'Camera is not initialized yet. Please wait a moment and try again.'
      );
      return;
    }

    if (!detModel.model || detModel.state !== 'loaded') {
      showAlert('Model Not Ready', 'Face detection model is not ready');
      return;
    }

    if (!embedModel.model || embedModel.state !== 'loaded') {
      showAlert('Model Not Ready', 'Face embedding model is not ready');
      return;
    }

    try {
      setStatus('📸 Taking photo...');
      const photo = await cameraRef.current.takePictureAsync({
        skipProcessing: true,
      });

      if (!photo?.uri) {
        showAlert('Photo Error', 'Failed to take photo');
        setStatus('❌ Error taking photo');
        return;
      }

      // sekarang TypeScript tahu photoUri pasti string
      const photoUri: string = photo.uri;

      setStatus('🔎 Detecting faces...');
      const faces = await detectFaces(photoUri);

      if (faces.length === 0) {
        showAlert(
          'No Face Detected',
          'Please position your face clearly in the camera view and try again.'
        );
        setStatus('❌ No face detected');
        return;
      }

      // const faceBox = faces[0].box;

      // setStatus('✂️ Cropping & resizing face...');

      // const scaleX = photo.width / DET_INPUT_SIZE;
      // const scaleY = photo.height / DET_INPUT_SIZE;

      // const cropX = Math.max(faceBox.x * scaleX, 0);
      // const cropY = Math.max(faceBox.y * scaleY, 0);
      // const cropW = Math.min(faceBox.w * scaleX, photo.width - cropX);
      // const cropH = Math.min(faceBox.h * scaleY, photo.height - cropY);

      // const manipResult = await ImageManipulator.manipulateAsync(
      //   photoUri,
      //   [
      //     {
      //       crop: {
      //         originX: cropX,
      //         originY: cropY,
      //         width: cropW,
      //         height: cropH,
      //       },
      //     },
      //     { resize: { width: EMBED_INPUT_SIZE, height: EMBED_INPUT_SIZE } },
      //   ],
      //   { compress: 1, format: ImageManipulator.SaveFormat.JPEG }
      // );

      // const croppedUri = manipResult.uri;

      setStatus('🤖 Generating embedding...');
      const tensor = await imageUriToTensor(
        photoUri,
        EMBED_INPUT_SIZE,
        'neg_one_pos_one'
      );

      let embedding: Float32Array | null = null;
      try {
        const embeddingOutput = embedModel.model.runSync([tensor]);
        if (!embeddingOutput || !embeddingOutput[0]) {
          throw new Error('Invalid embedding output');
        }
        embedding = embeddingOutput[0] as Float32Array;
      } catch (err) {
        console.error('Embedding generation failed', err);
        showAlert(
          'Embedding Error',
          'Failed to generate face embedding. Please try again.'
        );
        setStatus('❌ Error generating embedding');
        return;
      }

      setStatus('✅ Face registered successfully!');
      onRegister(embedding, photoUri);

      // Cleanup temporary file
      try {
        await FileSystem.deleteAsync(photoUri, { idempotent: true });
      } catch (cleanupError) {
        console.error('Failed to cleanup temp file:', cleanupError);
      }
    } catch (err) {
      console.error('Capture and register error:', err);
      const errorMessage = err instanceof Error ? err.message : String(err);
      showAlert('Registration Error', `An error occurred: ${errorMessage}`);
      setStatus('❌ Registration failed');
    }
  };

  const isReady =
    hasPermission &&
    detModel.state === 'loaded' &&
    embedModel.state === 'loaded';

  if (!isReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0066cc" />
        <Text style={{ marginTop: 16, textAlign: 'center', fontSize: 16 }}>
          {status}
        </Text>
        {!hasPermission && (
          <Text style={{ marginTop: 8, textAlign: 'center', color: 'red' }}>
            Camera permission is required
          </Text>
        )}
        {(detModel.state === 'error' || embedModel.state === 'error') && (
          <Text style={{ marginTop: 8, textAlign: 'center', color: 'red' }}>
            Failed to load AI models. Please check model files.
          </Text>
        )}
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <CameraView style={{ flex: 1 }} facing="front" ref={cameraRef} />

      <TouchableOpacity
        onPress={captureAndRegister}
        style={{
          position: 'absolute',
          bottom: 40,
          alignSelf: 'center',
          backgroundColor: 'white',
          padding: 20,
          borderRadius: 50,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 5,
        }}
        activeOpacity={0.7}
      >
        <Text style={{ fontSize: 24 }}>📸</Text>
      </TouchableOpacity>

      <View
        style={{
          position: 'absolute',
          top: 60,
          left: 20,
          right: 20,
          backgroundColor: 'rgba(0,0,0,0.7)',
          padding: 12,
          borderRadius: 8,
          alignItems: 'center',
        }}
      >
        <Text style={{ color: 'white', fontSize: 16, textAlign: 'center' }}>
          {status}
        </Text>
      </View>

      {/* Face detection guide overlay */}
      <View
        style={{
          position: 'absolute',
          top: '30%',
          left: '20%',
          right: '20%',
          bottom: '40%',
          borderWidth: 2,
          borderColor: 'rgba(255,255,255,0.8)',
          borderRadius: 8,
          backgroundColor: 'transparent',
        }}
      />

      <Text
        style={{
          position: 'absolute',
          bottom: 120,
          alignSelf: 'center',
          color: 'white',
          backgroundColor: 'rgba(0,0,0,0.6)',
          padding: 8,
          borderRadius: 6,
          textAlign: 'center',
        }}
      >
        Position your face in the frame
      </Text>
    </View>
  );
}
