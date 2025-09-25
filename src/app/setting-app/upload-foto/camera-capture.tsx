/* eslint-disable max-lines-per-function */
import { Camera, CameraView } from 'expo-camera';
import * as FaceDetector from 'expo-face-detector';
import * as FileSystem from 'expo-file-system';
import * as ImageManipulator from 'expo-image-manipulator';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useTensorflowModel } from 'react-native-fast-tflite';

import {
  imageUriToSpoofTensor,
  imageUriToTensor,
} from '@/utils/face-utils-lite';

type FaceRegisterProps = {
  onRegister: (embedding: Float32Array, photoUri: string) => void;
};

// UI Box constants
const UI_BOX_WIDTH = 320;
const UI_BOX_HEIGHT = 400;
const EMBED_INPUT_SIZE = 112; // MobileFaceNet input size

const SPOOF_INPUT_SIZE = 256;
const SPOOF_THRESHOLD = 0.2;

export default function FaceRegisterExpoCameraView({
  onRegister,
}: FaceRegisterProps) {
  const cameraRef = useRef<CameraView>(null);
  const [hasPermission, setHasPermission] = useState(false);
  const [status, setStatus] = useState('Memeriksa Izin Kamera...');
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);

  const spoofModel = useTensorflowModel(
    require('../../../../assets/model/FaceAntiSpoofing.tflite')
  );
  // Only load MobileFaceNet for embedding generation
  const embedModel = useTensorflowModel(
    require('../../../../assets/model/mobilefacenet.tflite')
  );

  // Request camera permission
  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
      if (status !== 'granted') {
        Alert.alert('Kamera Tidak Di Izinkan', 'Izin Kamera Dibutuhkan');
        setStatus('❌ Izin Kamera Ditolak');
      }
    })();
  }, []);

  // Update status when embedding model loads
  useEffect(() => {
    if (
      embedModel.state === 'loaded' &&
      spoofModel.state === 'loaded' &&
      hasPermission
    ) {
      setStatus('✅ Face Recognition Siap - Posisikan Wajah Dalam Box Hijau');
    } else if (
      embedModel.state === 'loading' &&
      spoofModel.state === 'loading'
    ) {
      setStatus('🔄 Memuat Face Recognition Model...');
    } else if (embedModel.state === 'error' && spoofModel.state === 'error') {
      setStatus('❌ Error Memuat Face Recognition Model');
    }
  }, [embedModel.state, spoofModel.state, hasPermission]);

  const showAlert = (title: string, message?: string) => {
    try {
      Alert.alert(title, message);
    } catch (error) {
      console.error('Alert error:', error);
      console.log(`Alert: ${title}${message ? ` - ${message}` : ''}`);
    }
  };

  async function runSpoofCheck(uri: string): Promise<'Real' | 'Spoof'> {
    if (!spoofModel.model || spoofModel.state !== 'loaded') {
      console.warn('⚠️ Spoof model not loaded');
      return 'Real'; // fallback biar app tetap jalan
    }

    try {
      // 🔹 Normalisasi gambar jadi Float32Array
      const input = await imageUriToSpoofTensor(uri, SPOOF_INPUT_SIZE);

      // ✅ Validasi ukuran input
      const expectedSize = SPOOF_INPUT_SIZE * SPOOF_INPUT_SIZE * 3;
      if (input.length !== expectedSize) {
        console.error(
          `❌ Input size mismatch. Expected: ${expectedSize}, Got: ${input.length}`
        );
        return 'Real';
      }

      // 🔹 Bentuk input sesuai model: [1, 256, 256, 3]
      const reshaped = new Float32Array(1 * expectedSize);
      reshaped.set(input);

      console.log('🔍 Input tensor shape:', [
        1,
        SPOOF_INPUT_SIZE,
        SPOOF_INPUT_SIZE,
        3,
      ]);
      console.log(
        '🔍 Input sample values:',
        Array.from(input.slice(0, 5)).map((x) => x.toFixed(4))
      );

      // 🔹 Jalankan model
      const outputs = spoofModel.model.runSync([reshaped]);

      if (!outputs || outputs.length === 0) {
        console.error('❌ Spoof model returned empty output:', outputs);
        return 'Real';
      }

      console.log('🔍 Raw spoof outputs info:', {
        numOutputs: outputs.length,
        outputShapes: outputs.map((out) =>
          Array.isArray(out) ? out.length : typeof out
        ),
        outputSamples: outputs.map((out) =>
          Array.isArray(out)
            ? Array.from((out as Float32Array).slice(0, 3)).map((x) =>
                x.toFixed(4)
              )
            : out
        ),
      });

      let spoofScore = 0;

      if (outputs.length >= 2) {
        // 🔹 Case: model punya 2 output → [classification_pred, leaf_node_mask]
        const clssPred = Float32Array.from(outputs[0] as Float32Array);
        const leafNodeMask = Float32Array.from(outputs[1] as Float32Array);

        if (clssPred.length !== leafNodeMask.length) {
          console.warn(
            '⚠️ Output length mismatch:',
            clssPred.length,
            'vs',
            leafNodeMask.length
          );
          // Fallback ke output pertama saja
          spoofScore = clssPred.length > 0 ? clssPred[0] : 0;
        } else {
          // ✅ Weighted sum approach (typical untuk ensemble models)
          let weightedSum = 0;
          let totalWeight = 0;

          for (let i = 0; i < clssPred.length; i++) {
            const pred = clssPred[i];
            const weight = leafNodeMask[i];

            if (!isNaN(pred) && !isNaN(weight) && weight > 0) {
              weightedSum += pred * weight;
              totalWeight += weight;
            }
          }

          spoofScore =
            totalWeight > 0 ? weightedSum / totalWeight : clssPred[0] || 0;
        }

        console.log('📊 Multi-output spoof score calculation:', {
          classificationLength: clssPred.length,
          maskLength: leafNodeMask.length,
          finalScore: spoofScore.toFixed(4),
        });
      } else {
        // 🔹 Case: model cuma punya 1 output
        const output = Float32Array.from(outputs[0] as Float32Array);

        if (output.length === 1) {
          // Single value prediction (common case)
          spoofScore = output[0];
        } else if (output.length === 2) {
          // Binary classification [real_prob, spoof_prob]
          spoofScore = output[1]; // spoof probability
        } else if (output.length > 2) {
          // Multi-class atau feature vector - ambil yang pertama
          console.warn(
            '⚠️ Unexpected output length:',
            output.length,
            'using first value'
          );
          spoofScore = output[0];
        } else {
          console.error('❌ Empty output array');
          return 'Real';
        }

        console.log('📊 Single-output spoof score:', {
          outputLength: output.length,
          rawOutput: Array.from(
            output.slice(0, Math.min(5, output.length))
          ).map((x) => x.toFixed(4)),
          selectedScore: spoofScore.toFixed(4),
        });
      }

      console.log(
        `📊 Final spoof score: ${spoofScore.toFixed(4)} (threshold: ${SPOOF_THRESHOLD})`
      );

      // ✅ Handle edge cases
      if (isNaN(spoofScore)) {
        console.error('❌ Spoof score is NaN, defaulting to Real');
        return 'Real';
      }

      const result = spoofScore > SPOOF_THRESHOLD ? 'Spoof' : 'Real';
      console.log(`🎯 Spoof detection result: ${result}`);

      return result;
    } catch (err) {
      console.error('❌ runSpoofCheck error:', err);
      return 'Real'; // fallback aman
    }
  }

  const captureAndRegister = async () => {
    console.log('take foto');
    if (!cameraRef.current || !isCameraReady) {
      showAlert('Kamera Belum Siap', 'Silahkan tunggu sebentar dan coba lagi');
      return;
    }

    if (!embedModel.model || embedModel.state !== 'loaded') {
      showAlert('Face Recognition Belum Siap', 'Model embedding belum dimuat');
      return;
    }

    try {
      setIsCapturing(true);
      setStatus('📸 Mengambil Foto...');

      const photo = await cameraRef.current.takePictureAsync({
        skipProcessing: true,
        quality: 1,
      });

      if (!photo?.uri) {
        showAlert('Error Foto', 'Gagal mengambil foto');
        setStatus('❌ Gagal Mengambil Foto');
        return;
      }

      // 🔍 Deteksi wajah pakai expo-face-detector
      const detection = await FaceDetector.detectFacesAsync(photo.uri, {
        mode: FaceDetector.FaceDetectorMode.accurate,
      });

      if (!detection.faces.length) {
        Alert.alert('Tidak Ada Wajah', 'Pastikan wajah ada dalam kamera');
        return;
      }

      // Validasi multiple faces
      if (detection.faces.length > 1) {
        Alert.alert(
          'Terlalu Banyak Wajah',
          'Pastikan hanya ada satu wajah dalam frame'
        );
        return;
      }

      const face = detection.faces[0];
      const box = face.bounds;
      const photoUri: string = photo.uri;

      // Crop sesuai bounding box
      const cropped = await ImageManipulator.manipulateAsync(
        photo.uri,
        [
          {
            crop: {
              originX: Math.max(0, box.origin.x),
              originY: Math.max(0, box.origin.y),
              width: box.size.width,
              height: box.size.height,
            },
          },
        ],
        { compress: 1, format: ImageManipulator.SaveFormat.JPEG }
      );

      const spoofResult = await runSpoofCheck(photo.uri);
      if (spoofResult === 'Spoof') {
        showAlert('⚠️ Deteksi Foto/Video', 'Silahkan gunakan wajah asli');
        setStatus('❌ Wajah Terdeteksi Palsu / Foto');
        setIsCapturing(false);
        return;
      }

      // Resize foto final untuk simpan (gunakan cropped image, bukan full photo)
      const compressImage = await ImageManipulator.manipulateAsync(
        photo.uri, // ✅ Gunakan hasil crop
        [{ resize: { width: 600 } }],
        { compress: 0.5, format: ImageManipulator.SaveFormat.JPEG }
      );

      setStatus('🤖 Membuat Struktur Wajah...');

      // Generate embedding
      const tensor = await imageUriToTensor(
        cropped.uri,
        EMBED_INPUT_SIZE,
        'neg_one_pos_one'
      );

      let embedding: Float32Array | null = null;
      try {
        const embeddingOutput = embedModel.model.runSync([tensor]);
        if (!embeddingOutput || !embeddingOutput[0]) {
          throw new Error('Gagal generate embedding');
        }
        embedding = embeddingOutput[0] as Float32Array;

        console.log('🧠 Embedding generated:', {
          length: embedding.length,
          sample: Array.from(embedding.slice(0, 5)).map((x) => x.toFixed(4)),
        });
      } catch (err) {
        console.error('Embedding generation failed:', err);
        showAlert(
          'Gagal Membuat Face Embedding',
          'Gagal memproses wajah. Silahkan coba lagi.'
        );
        setStatus('❌ Gagal Membuat Face Embedding');
        setIsCapturing(false); // ✅ Reset state di catch
        return; // ✅ Exit early
      }

      // Hanya sampai sini jika berhasil
      setStatus('✅ Wajah Berhasil Didaftarkan dengan Embedding!');

      // Callback hasil
      onRegister(embedding ?? new Float32Array(), compressImage.uri);

      // Cleanup temporary files
      try {
        await FileSystem.deleteAsync(photoUri, { idempotent: true });
        await FileSystem.deleteAsync(cropped.uri, { idempotent: true }); // ✅ Cleanup cropped juga
      } catch (cleanupError) {
        console.error('Failed to cleanup temp files:', cleanupError);
      }
    } catch (error) {
      console.error('Capture and register error:', error);
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      showAlert('Error Registrasi', `Terjadi kesalahan: ${errorMessage}`);
      setStatus('❌ Registrasi Gagal');
    } finally {
      setIsCapturing(false); // ✅ Selalu reset state
    }
  };

  const isReady = hasPermission && embedModel.state === 'loaded';

  if (!isReady) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#000',
        }}
      >
        <ActivityIndicator size="large" color="#00ff00" />
        <Text
          style={{
            marginTop: 16,
            textAlign: 'center',
            fontSize: 16,
            color: 'white',
            paddingHorizontal: 20,
          }}
        >
          {status}
        </Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#000' }}>
      <CameraView
        style={{ flex: 1 }}
        facing="front"
        ref={cameraRef}
        onCameraReady={() => setIsCameraReady(true)}
      />

      {/* Main UI Box - Green Oval */}
      <View
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: UI_BOX_WIDTH,
          height: UI_BOX_HEIGHT,
          marginLeft: -UI_BOX_WIDTH / 2,
          marginTop: -UI_BOX_HEIGHT / 2,
          borderWidth: 3,
          borderColor: '#00ff00',
          borderRadius: 150,
          backgroundColor: 'transparent',
        }}
      />

      {/* Capture Button */}
      <TouchableOpacity
        onPress={captureAndRegister}
        disabled={isCapturing}
        style={{
          position: 'absolute',
          bottom: 40,
          alignSelf: 'center',
          backgroundColor: isCapturing ? '#ffaa00' : '#00ff00',
          padding: 20,
          borderRadius: 50,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 4,
          elevation: 8,
        }}
        activeOpacity={0.7}
      >
        {isCapturing ? (
          <Text style={{ fontSize: 18 }}>⏳</Text>
        ) : (
          <Text style={{ fontSize: 28 }}>📸</Text>
        )}
      </TouchableOpacity>

      {/* Status Bar */}
      <View
        style={{
          position: 'absolute',
          top: 60,
          left: 20,
          right: 20,
          backgroundColor: 'rgba(0,0,0,0.8)',
          padding: 12,
          borderRadius: 12,
          alignItems: 'center',
        }}
      >
        <Text
          style={{
            color: 'white',
            fontSize: 14,
            textAlign: 'center',
            fontWeight: '500',
          }}
        >
          {status}
        </Text>
      </View>

      {/* Instructions */}
      <View
        style={{
          position: 'absolute',
          bottom: 120,
          left: 20,
          right: 20,
          alignItems: 'center',
        }}
      >
        <Text
          style={{
            color: 'white',
            backgroundColor: 'rgba(0,0,0,0.6)',
            padding: 8,
            borderRadius: 6,
            textAlign: 'center',
            fontSize: 16,
            fontWeight: '500',
          }}
        >
          Posisikan Wajah Dalam Box Hijau
        </Text>
        <Text
          style={{
            color: '#cccccc',
            backgroundColor: 'rgba(0,0,0,0.6)',
            padding: 6,
            borderRadius: 4,
            textAlign: 'center',
            fontSize: 12,
            marginTop: 4,
          }}
        >
          Hadapkan wajah lurus ke kamera
        </Text>
      </View>
    </View>
  );
}
