/* eslint-disable max-lines-per-function */
import * as jpeg from 'jpeg-js';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useTensorflowModel } from 'react-native-fast-tflite';
import RNFS from 'react-native-fs';
import ImageResizer from 'react-native-image-resizer';
import { Camera, useCameraDevice } from 'react-native-vision-camera';

import { anchors } from '@/utils/blazeface-anchors';

type FaceRegisterProps = {
  onRegister: (embedding: Float32Array, photoUri: string) => void;
};

const DET_INPUT_SIZE = 128;
const EMBED_INPUT_SIZE = 112;

export default function FaceRegisterMobileFaceNet({
  onRegister,
}: FaceRegisterProps) {
  const cameraRef = useRef<Camera>(null);
  const device = useCameraDevice('front');

  const detModel = useTensorflowModel(
    require('../../../../assets/model/blazeface.tflite')
  );
  const embedModel = useTensorflowModel(
    require('../../../../assets/model/mobilefacenet.tflite')
  );

  const [status, setStatus] = useState('Loading models...');

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

  // Convert image URI ke Float32Array
  const imageUriToTensor = async (
    uri: string,
    targetSize: number,
    normalize: 'zero_one' | 'neg_one_pos_one' = 'zero_one'
  ): Promise<Float32Array> => {
    const resized = await ImageResizer.createResizedImage(
      uri,
      targetSize,
      targetSize,
      'JPEG',
      100
    );
    const base64 = await RNFS.readFile(resized.uri, 'base64');
    const buffer = Buffer.from(base64, 'base64');
    const { data, width, height } = jpeg.decode(buffer, { useTArray: true });

    const tensor = new Float32Array(width * height * 3);
    let ti = 0;
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i],
        g = data[i + 1],
        b = data[i + 2];
      tensor[ti++] = normalize === 'neg_one_pos_one' ? r / 127.5 - 1 : r / 255;
      tensor[ti++] = normalize === 'neg_one_pos_one' ? g / 127.5 - 1 : g / 255;
      tensor[ti++] = normalize === 'neg_one_pos_one' ? b / 127.5 - 1 : b / 255;
    }
    return tensor;
  };

  const sigmoid = (x: number) => 1 / (1 + Math.exp(-x));

  // Deteksi wajah
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
    if (!detections || detections.length === 0) return [];

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

  // Ambil foto & generate embedding
  const captureAndRegister = async () => {
    if (!cameraRef.current) return;
    if (!detModel.model || detModel.state !== 'loaded') {
      Alert.alert('Face detection model is not ready');
      return;
    }
    if (!embedModel.model || embedModel.state !== 'loaded') {
      Alert.alert('Face embedding model is not ready');
      return;
    }

    try {
      setStatus('📸 Taking photo...');
      const photo = await cameraRef.current.takePhoto();
      const photoUri = 'file://' + photo.path;

      setStatus('🔎 Detecting faces...');
      const faces = await detectFaces(photoUri);
      if (faces.length === 0) {
        Alert.alert('No face detected');
        setStatus('❌ No face');
        return;
      }

      setStatus('✂️ Cropping & resizing face...');
      const cropped = await ImageResizer.createResizedImage(
        photoUri,
        EMBED_INPUT_SIZE,
        EMBED_INPUT_SIZE,
        'JPEG',
        100
      );

      setStatus('🤖 Generating embedding...');
      const tensor = await imageUriToTensor(
        cropped.uri,
        EMBED_INPUT_SIZE,
        'neg_one_pos_one'
      );

      let embedding: Float32Array | null = null;
      try {
        const embeddingOutput = embedModel.model.runSync([tensor]);
        if (!embeddingOutput || !embeddingOutput[0])
          throw new Error('Invalid output');
        embedding = embeddingOutput[0] as Float32Array;
      } catch (err) {
        console.error('Embedding generation failed', err);
        Alert.alert('Error', 'Failed to generate embedding');
        setStatus('❌ Error embedding');
        return;
      }

      setStatus('✅ Success');
      onRegister(embedding, cropped.uri);
    } catch (err) {
      console.error(err);
      Alert.alert('Error', String(err));
      setStatus('❌ Error');
    }
  };

  const isModelsReady =
    detModel.state === 'loaded' && embedModel.state === 'loaded';

  if (!device || !isModelsReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
        <Text>{status}</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <Camera
        ref={cameraRef}
        style={{ flex: 1 }}
        device={device}
        isActive
        photo
      />

      <TouchableOpacity
        onPress={captureAndRegister}
        style={{
          position: 'absolute',
          bottom: 40,
          alignSelf: 'center',
          backgroundColor: 'white',
          padding: 16,
          borderRadius: 50,
        }}
      >
        <Text>📸</Text>
      </TouchableOpacity>

      <Text
        style={{
          position: 'absolute',
          top: 50,
          alignSelf: 'center',
          backgroundColor: 'rgba(0,0,0,0.6)',
          color: 'white',
          padding: 6,
          borderRadius: 8,
        }}
      >
        {status}
      </Text>
    </View>
  );
}
