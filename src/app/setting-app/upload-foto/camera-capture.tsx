/* eslint-disable max-lines-per-function */
import '@tensorflow/tfjs-react-native';

import * as tf from '@tensorflow/tfjs';
import { decodeJpeg } from '@tensorflow/tfjs-react-native';
import * as blazeface from '@tensorflow-models/blazeface';
import { Camera, CameraView } from 'expo-camera';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

interface FaceRegisterProps {
  onRegister: (embedding: Float32Array | null, photoUri?: string) => void;
}

interface CapturedPhoto {
  uri: string;
}

const FaceRegisterCPU: React.FC<FaceRegisterProps> = ({ onRegister }) => {
  const [hasPermission, setHasPermission] = useState(false);
  const [tfReady, setTfReady] = useState(false);
  const [modelLoaded, setModelLoaded] = useState(false);
  const [captured, setCaptured] = useState<CapturedPhoto | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);

  const cameraRef = useRef<CameraView | null>(null);
  const blazefaceModel = useRef<blazeface.BlazeFaceModel | null>(null);

  useEffect(() => {
    const init = async () => {
      try {
        const { status } = await Camera.requestCameraPermissionsAsync();
        setHasPermission(status === 'granted');

        await tf.ready();
        await tf.setBackend('cpu');

        blazefaceModel.current = await blazeface.load();
        setModelLoaded(true);
        setTfReady(true);
      } catch (e) {
        console.error('Init error:', e);
        Alert.alert('Error', 'Gagal inisialisasi kamera / TensorFlow');
        onRegister(null);
      }
    };
    init();
  }, []);

  const detectFaceAndCapture = async (uri: string) => {
    if (!blazefaceModel.current) return;

    try {
      const response = await fetch(uri);
      const buffer = await response.arrayBuffer();
      const imageTensor = decodeJpeg(new Uint8Array(buffer));

      const predictions = await blazefaceModel.current.estimateFaces(
        imageTensor,
        false
      );
      imageTensor.dispose();

      if (predictions.length > 0) {
        const topLeft = predictions[0].topLeft as [number, number];
        const bottomRight = predictions[0].bottomRight as [number, number];

        const embedding = new Float32Array([...topLeft, ...bottomRight]);
        onRegister(embedding, uri);
        setCaptured({ uri });

        Alert.alert('Berhasil', 'Foto wajah berhasil diambil!');
      } else {
        Alert.alert('Gagal', 'Tidak ada wajah terdeteksi, coba lagi.');
      }
    } catch (err) {
      console.error('Detection error:', err);
      Alert.alert('Error', 'Gagal memproses foto.');
    }
  };

  const capturePhoto = async () => {
    if (!cameraRef.current || isCapturing) return;
    setIsCapturing(true);
    try {
      const photo = await cameraRef.current.takePictureAsync({
        base64: false,
        quality: 0.7,
      });

      if (!photo?.uri) {
        Alert.alert('Gagal', 'Gagal mengambil foto');
        setIsCapturing(false);
        return;
      }

      await detectFaceAndCapture(photo.uri);
    } catch (err) {
      console.error('Capture error:', err);
      Alert.alert('Error', 'Terjadi kesalahan saat mengambil foto');
      onRegister(null);
    } finally {
      setIsCapturing(false);
    }
  };

  if (!hasPermission) {
    return (
      <View style={styles.center}>
        <Text style={styles.text}>Meminta izin kamera...</Text>
      </View>
    );
  }

  if (!tfReady || !modelLoaded) {
    return (
      <View style={styles.center}>
        <Text style={styles.text}>Loading Camera...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      {!captured ? (
        <CameraView
          ref={cameraRef}
          style={StyleSheet.absoluteFill}
          facing="front"
        />
      ) : (
        <Image source={{ uri: captured.uri }} style={StyleSheet.absoluteFill} />
      )}

      <View style={styles.instructionBox}>
        <Text style={styles.text}>
          {!captured ? '📷 Siap mengambil foto...' : '✅ Foto diambil!'}
        </Text>
        {!captured && (
          <TouchableOpacity
            style={[
              styles.captureButton,
              isCapturing && { backgroundColor: '#999' },
            ]}
            onPress={capturePhoto}
            disabled={isCapturing}
          >
            {isCapturing ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={{ color: 'white', fontWeight: 'bold' }}>
                📸 Ambil Foto
              </Text>
            )}
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  text: { fontSize: 18, color: '#333', textAlign: 'center' },
  instructionBox: {
    position: 'absolute',
    bottom: 60,
    alignSelf: 'center',
    backgroundColor: 'rgba(255,255,255,0.9)',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  captureButton: {
    marginTop: 10,
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 8,
  },
});

export default FaceRegisterCPU;
