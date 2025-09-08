/* eslint-disable max-lines-per-function */
import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import {
  Camera,
  useCameraDevice,
  useFrameProcessor,
} from 'react-native-vision-camera';
import {
  type Face,
  type FaceDetectionOptions,
  useFaceDetector,
} from 'react-native-vision-camera-face-detector';
import { useSharedValue, Worklets } from 'react-native-worklets-core';

type Step = 'smile' | 'left' | 'right' | 'done';

export default function CameraCapture({
  onCaptureBatch,
}: {
  onCaptureBatch: (uris: string[]) => void;
}) {
  const [captures, setCaptures] = useState<string[]>([]);
  const [step, setStep] = useState<Step>('smile');
  const lastProcessed = useSharedValue(0);
  const stableCounter = useSharedValue(0);
  const [hasPermission, setHasPermission] = useState(false);

  const [faceBox, setFaceBox] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
    valid: boolean;
  } | null>(null);

  const faceDetectionOptions = useRef<FaceDetectionOptions>({
    landmarkMode: 'none',
    classificationMode: 'all',
    performanceMode: 'fast',
  }).current;

  const device = useCameraDevice('front');
  const camera = useRef<Camera>(null);
  const MIN_FACE_WIDTH = 80; // sebelumnya 100
  const MIN_FACE_HEIGHT = 80; // sebelumnya 100
  const CENTER_TOLERANCE = 0.3; // sebelumnya 0.2
  const REQUIRED_STABLE_FRAMES = 3; // tetap

  const { detectFaces, stopListeners } = useFaceDetector(faceDetectionOptions);

  useEffect(() => {
    const requestPermission = async () => {
      const status = await Camera.requestCameraPermission();
      setHasPermission(status === 'granted');
    };
    requestPermission();
    return () => stopListeners();
  }, []);

  const isFaceValid = (face: Face, frameWidth: number, frameHeight: number) => {
    if (!face.bounds) return false;
    const { width, height, x, y } = face.bounds;
    if (width < MIN_FACE_WIDTH || height < MIN_FACE_HEIGHT) return false;

    const faceCenterX = x + width / 2;
    const faceCenterY = y + height / 2;
    const frameCenterX = frameWidth / 2;
    const frameCenterY = frameHeight / 2;
    const toleranceX = frameWidth * CENTER_TOLERANCE;
    const toleranceY = frameHeight * CENTER_TOLERANCE;

    if (
      Math.abs(faceCenterX - frameCenterX) > toleranceX ||
      Math.abs(faceCenterY - frameCenterY) > toleranceY
    )
      return false;

    return true;
  };

  const handleDetectedFaces = Worklets.createRunOnJS(
    (faces: Face[], frameWidth: number, frameHeight: number) => {
      if (faces.length === 0) {
        stableCounter.value = 0;
        setFaceBox(null);
        return;
      }

      const face = faces[0];
      const valid = isFaceValid(face, frameWidth, frameHeight);

      setFaceBox({
        x: face.bounds?.x ?? 0,
        y: face.bounds?.y ?? 0,
        width: face.bounds?.width ?? 0,
        height: face.bounds?.height ?? 0,
        valid,
      });

      if (!valid) {
        stableCounter.value = 0;
        return;
      }

      stableCounter.value += 1;
      if (stableCounter.value < REQUIRED_STABLE_FRAMES) return;

      // step detection
      if (step === 'smile' && (face.smilingProbability ?? 0) > 0.7) {
        autoCapture('left');
      } else if (
        step === 'left' &&
        face.yawAngle !== undefined &&
        face.yawAngle < -20
      ) {
        autoCapture('right');
      } else if (
        step === 'right' &&
        face.yawAngle !== undefined &&
        face.yawAngle > 20
      ) {
        autoCapture('done');
      }
    }
  );

  const frameProcessor = useFrameProcessor(
    (frame) => {
      'worklet';
      const now = Date.now();
      if (now - lastProcessed.value > 400) {
        lastProcessed.value = now;
        const faces = detectFaces(frame);
        handleDetectedFaces(faces, frame.width, frame.height);
      }
    },
    [handleDetectedFaces]
  );

  const autoCapture = async (nextStep: Step) => {
    if (!camera.current) return;
    const photo = await camera.current.takePhoto({
      flash: 'off',
      enableShutterSound: true,
    });
    const newCaptures = [...captures, photo.path];
    setCaptures(newCaptures);

    if (newCaptures.length === 3 || nextStep === 'done') {
      setStep('done'); // pastikan step = done sebelum callback
      onCaptureBatch(newCaptures); // panggil parent
    } else {
      setStep(nextStep);
    }

    stableCounter.value = 0;
  };

  const getInstruction = () => {
    switch (step) {
      case 'smile':
        return '🙂 Silakan Senyum';
      case 'left':
        return '👉 Hadap Kanan ';
      case 'right':
        return '👈 Hadap Kiri';
      case 'done':
        return '✅ Selesai! Semua foto terkumpul';
    }
  };

  const resetFlow = () => {
    setStep('smile');
    setCaptures([]);
    stableCounter.value = 0;
    setFaceBox(null);
  };

  if (!device) return <Text>No Device</Text>;
  if (!hasPermission)
    return (
      <View style={styles.center}>
        <Text>Meminta izin kamera...</Text>
      </View>
    );

  return (
    <View style={{ flex: 1 }}>
      <Camera
        ref={camera}
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={step !== 'done' && hasPermission && !!device}
        photo={true}
        frameProcessor={frameProcessor}
      />

      {faceBox && (
        <View
          style={{
            position: 'absolute',
            left: faceBox.x,
            top: faceBox.y,
            width: faceBox.width,
            height: faceBox.height,
            borderWidth: 2,
            borderColor: faceBox.valid ? 'lime' : 'red',
            borderRadius: 8,
          }}
        />
      )}

      <View style={styles.instructionBox}>
        <Text style={styles.instructionText}>{getInstruction()}</Text>
        {step !== 'done' && (
          <Text style={{ fontSize: 14, marginTop: 4 }}>
            {captures.length}/3 foto diambil
          </Text>
        )}

        {(step === 'done' || captures.length < 3) && (
          <TouchableOpacity style={styles.resetButton} onPress={resetFlow}>
            <Text style={{ color: 'white', fontWeight: 'bold' }}>
              🔄 Ulangi
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  instructionBox: {
    position: 'absolute',
    bottom: 60,
    alignSelf: 'center',
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  instructionText: { fontSize: 18, fontWeight: 'bold' },
  resetButton: {
    marginTop: 10,
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
});
