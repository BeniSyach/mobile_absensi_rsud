/* eslint-disable max-lines-per-function */

import * as React from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { Platform, StyleSheet } from 'react-native';
import { runOnJS } from 'react-native-reanimated';
import {
  Camera,
  runAsync,
  useCameraDevice,
  useFrameProcessor,
} from 'react-native-vision-camera';
import {
  type Face,
  type FaceDetectionOptions,
  useFaceDetector,
} from 'react-native-vision-camera-face-detector';
import { Worklets } from 'react-native-worklets-core';

import { type ApiResponse } from '@/api';
import { type LastAbsenStatus } from '@/api/absensi/cek-status-absen-user';
import Maps from '@/components/absensi/maps';
import {
  ActivityIndicator,
  Button,
  Image,
  type OptionType,
  ScrollView,
  Select,
  Text,
  View,
} from '@/components/ui';

import { type FormType } from './absensi-types';
import { useAbsensiForm } from './use-absensi-form';

export type AbsensiFormProps = {
  isPending: boolean;
  onSubmit: SubmitHandler<FormType>;
  user: ApiResponse;
  userStatus: LastAbsenStatus | undefined;
};

const tipe_absensi: OptionType[] = [
  { value: '0', label: 'Masuk' },
  { value: '1', label: 'Pulang' },
];

interface FormFieldsProps {
  tipe_absensi_value: string | number | undefined;
  shift_value: string | number | undefined;
  hari_kerja_value: string | number | undefined;
  tipe_shift: OptionType[];
  tipe_hari_kerja: OptionType[];
  onTipeAbsensiSelect: (value: string | number) => void;
  onShiftSelect: (value: string | number) => void;
  onHariKerjaSelect: (value: string | number) => void;
  onImageSelect: (photo: { uri: string; base64: string }) => void;
  image: { uri: string } | null;
  errors: any;
  isTipeAbsensiDisabled: boolean;
  showCamera: boolean;
  setShowCamera: (show: boolean) => void;
}

const ACTIONS = [
  { label: 'Kedipkan mata', key: 'blink' },
  { label: 'Tersenyum', key: 'smile' },
  { label: 'Buka mata lebar-lebar', key: 'open_eyes' },
];

interface CameraSectionProps {
  showCamera: boolean;
  handleTakePhoto: (photo: {
    uri: string;
    base64: string;
  }) => Promise<void> | void;
  initialAction?: 'blink' | 'smile' | 'open_eyes';
  overlayColor?: string;
}

export default function CameraSection({
  showCamera,
  handleTakePhoto,
  initialAction,
  overlayColor = 'rgba(0,0,0,0.6)',
}: CameraSectionProps) {
  const device = useCameraDevice('front');
  const cameraRef = React.useRef<Camera>(null);

  const [permission, setPermission] = React.useState(false);
  const [currentAction, setCurrentAction] = React.useState(() => {
    if (initialAction)
      return ACTIONS.find((a) => a.key === initialAction) || ACTIONS[0];
    return ACTIONS[Math.floor(Math.random() * ACTIONS.length)];
  });

  const [faceData, setFaceData] = React.useState({
    leftEyeOpen: true,
    rightEyeOpen: true,
    smiling: false,
    gazeDirection: 'Depan',
  });
  console.log('data', faceData);

  const [countdown, setCountdown] = React.useState<number | null>(null);
  const lastActionTime = React.useRef(0);

  // Hook face detector di level atas komponen
  const faceDetectionOptions: FaceDetectionOptions = {
    performanceMode: 'fast',
    landmarkMode: 'all',
    classificationMode: 'all',
  };
  const { detectFaces, stopListeners } = useFaceDetector(faceDetectionOptions);

  // Hentikan listener saat unmount
  React.useEffect(() => {
    return () => {
      if (Platform.OS === 'android') stopListeners();
    };
  }, []);

  // Request permission kamera
  React.useEffect(() => {
    (async () => {
      const status: string = await Camera.requestCameraPermission();
      setPermission(status === 'granted');
    })();
  }, []);

  const startCountdownAndCapture = React.useCallback(() => {
    setCountdown(3);
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev && prev > 1) return prev - 1;
        clearInterval(interval);
        takePhoto();
        return null;
      });
    }, 1000);
  }, []);

  const checkFaceAction = React.useCallback(
    (leftClosed: boolean, rightClosed: boolean, smiling: boolean) => {
      switch (currentAction.key) {
        case 'blink':
          return leftClosed || rightClosed;
        case 'smile':
          return smiling;
        case 'open_eyes':
          return !leftClosed && !rightClosed;
        default:
          return false;
      }
    },
    [currentAction]
  );

  const handleDetectedFaces = Worklets.createRunOnJS((faces: Face[]) => {
    if (faces.length === 0) return;
    const face = faces[0];

    const leftEyeOpen = (face.leftEyeOpenProbability ?? 1) > 0.5;
    const rightEyeOpen = (face.rightEyeOpenProbability ?? 1) > 0.5;
    const smiling = (face.smilingProbability ?? 0) > 0.7;

    let gaze = 'Depan';
    if (face.yawAngle != null) {
      if (face.yawAngle > 10) gaze = 'Kanan';
      else if (face.yawAngle < -10) gaze = 'Kiri';
    }

    runOnJS(setFaceData)({
      leftEyeOpen,
      rightEyeOpen,
      smiling,
      gazeDirection: gaze,
    });

    const leftClosed = !leftEyeOpen;
    const rightClosed = !rightEyeOpen;
    const now = Date.now();

    if (now - lastActionTime.current > 3000) {
      if (checkFaceAction(leftClosed, rightClosed, smiling)) {
        lastActionTime.current = now;
        runOnJS(startCountdownAndCapture)();
      }
    }
  });

  const frameProcessor = useFrameProcessor(
    (frame) => {
      'worklet';
      runAsync(frame, () => {
        'worklet';
        const faces = detectFaces(frame);
        handleDetectedFaces(faces);
      });
    },
    [handleDetectedFaces]
  );

  const takePhoto = async () => {
    if (!cameraRef.current) return;
    const photo = await cameraRef.current.takePhoto();
    await handleTakePhoto({ uri: `file://${photo.path}`, base64: '' });
    setCurrentAction(ACTIONS[Math.floor(Math.random() * ACTIONS.length)]);
  };

  if (!showCamera) return null;
  if (!device)
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  if (!permission)
    return (
      <View style={styles.center}>
        <Text>Izin kamera belum diberikan</Text>
        <Button
          label="Minta Akses Kamera"
          onPress={async () => {
            const result = await Camera.requestCameraPermission();
            if (result === 'granted') {
              // ✅ gunakan 'granted', bukan 'authorized'
              setPermission(true);
            }
          }}
        />
      </View>
    );

  return (
    <View style={{ flex: 1, height: 300 }}>
      <Camera
        ref={cameraRef}
        style={{ flex: 1, borderWidth: 2, borderColor: 'red' }}
        device={device}
        isActive
        photo
        frameProcessor={frameProcessor}
      />

      <View
        style={{
          position: 'absolute',
          top: 20,
          alignSelf: 'center',
          backgroundColor: overlayColor,
          padding: 10,
          borderRadius: 8,
        }}
      >
        <Text style={{ color: 'white', fontSize: 16 }}>
          {currentAction.label}
        </Text>
      </View>

      {/* <View style={styles.statusContainer}>
        <Text style={styles.statusText}>
          👁 Kiri: {faceData.leftEyeOpen ? 'Terbuka' : 'Tertutup'}
        </Text>
        <Text style={styles.statusText}>
          👁 Kanan: {faceData.rightEyeOpen ? 'Terbuka' : 'Tertutup'}
        </Text>
        <Text style={styles.statusText}>
          😀 Senyum: {faceData.smiling ? 'Ya' : 'Tidak'}
        </Text>
        <Text style={styles.statusText}>
          👀 Pandangan: {faceData.gazeDirection}
        </Text>
      </View> */}

      {countdown !== null && (
        <View style={styles.countdown}>
          <Text style={styles.countdownText}>{countdown}</Text>
        </View>
      )}
    </View>
  );
}

CameraSection.displayName = 'CameraSection';

// ImagePreview component
const ImagePreview = React.memo<{
  image: { uri: string } | null;
  showCamera: boolean;
  errors: any;
}>(({ image, showCamera, errors }) => {
  const [hasError, setHasError] = React.useState(false);

  if (!image || showCamera) {
    return errors.photo ? (
      <View className="mb-2">
        <Text className="text-red-500">{errors.photo?.message}</Text>
      </View>
    ) : null;
  }

  return (
    <View className="mt-2 items-center">
      {!hasError && (
        <Image
          source={{ uri: image.uri }}
          className="h-44 w-full"
          style={{ width: 300, height: 300 }}
          resizeMode="cover"
          onError={(error) => {
            console.log('Image error:', error);
            setHasError(true);
          }}
        />
      )}
      {hasError && <Text className="text-red-500">Gagal memuat gambar</Text>}
    </View>
  );
});

ImagePreview.displayName = 'ImagePreview';

const SelectFields = React.memo<{
  tipe_absensi_value: string | number | undefined;
  shift_value: string | number | undefined;
  hari_kerja_value: string | number | undefined;
  shiftOptions: OptionType[];
  hariKerjaOptions: OptionType[];
  onTipeAbsensiSelect: (value: string | number) => void;
  onShiftSelect: (value: string | number) => void;
  onHariKerjaSelect: (value: string | number) => void;
  errors: any;
}>(
  ({
    tipe_absensi_value,
    shift_value,
    hari_kerja_value,
    shiftOptions,
    hariKerjaOptions,
    onTipeAbsensiSelect,
    onShiftSelect,
    onHariKerjaSelect,
    errors,
  }) => (
    <>
      <Select
        label="Tipe Absensi"
        options={tipe_absensi}
        value={tipe_absensi_value}
        onSelect={onTipeAbsensiSelect}
        placeholder="Pilih Tipe Absensi"
        error={errors.tipe_absensi?.message}
        disabled={true}
      />
      <Select
        label="Tipe Shift"
        options={shiftOptions}
        value={shift_value}
        onSelect={onShiftSelect}
        placeholder="Pilih Tipe Shift"
        error={errors.shift_id?.message}
        disabled={true}
      />
      <Select
        label="Shift/Hari Kerja"
        options={hariKerjaOptions}
        value={hari_kerja_value}
        onSelect={onHariKerjaSelect}
        placeholder="Pilih Hari Kerja"
        error={errors.waktu_kerja_id?.message}
      />
    </>
  )
);
SelectFields.displayName = 'SelectFields';

const FormFields = React.memo<FormFieldsProps>(
  ({
    tipe_absensi_value,
    shift_value,
    hari_kerja_value,
    tipe_shift,
    tipe_hari_kerja,
    onTipeAbsensiSelect,
    onShiftSelect,
    onHariKerjaSelect,
    image,
    errors,
    showCamera,
    setShowCamera,
    onImageSelect,
  }) => {
    const handleTakePhoto = async (photo: { uri: string; base64?: string }) => {
      onImageSelect({
        uri: photo.uri,
        base64: photo.base64 ?? '', // selalu kirim string
      });
      setShowCamera(false);
    };

    return (
      <>
        <SelectFields
          tipe_absensi_value={tipe_absensi_value}
          shift_value={shift_value}
          hari_kerja_value={hari_kerja_value}
          shiftOptions={tipe_shift}
          hariKerjaOptions={tipe_hari_kerja}
          onTipeAbsensiSelect={onTipeAbsensiSelect}
          onShiftSelect={onShiftSelect}
          onHariKerjaSelect={onHariKerjaSelect}
          errors={errors}
        />
        <Button
          label={showCamera ? 'Tutup Kamera' : 'Ambil Foto Absensi'}
          onPress={() => setShowCamera(!showCamera)}
        />
        <CameraSection
          showCamera={showCamera}
          handleTakePhoto={handleTakePhoto}
          initialAction="smile" // bisa: "smile", "blink", "open_eyes"
          overlayColor="rgba(0,0,0,0.6)"
        />
        <ImagePreview image={image} showCamera={showCamera} errors={errors} />
      </>
    );
  }
);
FormFields.displayName = 'FormFields';

const FormContainer = React.memo<{
  children: React.ReactNode;
  onSubmit: () => void;
  isPending: boolean;
}>(({ children, onSubmit, isPending }) => (
  <ScrollView className="mb-4 flex-1 p-2">
    <View className="rounded-lg border border-gray-200 bg-white p-4 shadow-md dark:border-gray-600 dark:bg-gray-800">
      {children}
      <Button
        label="Absen"
        loading={isPending}
        onPress={onSubmit}
        size="lg"
        className="mb-20"
        testID="add-post-button"
      />
    </View>
  </ScrollView>
));
FormContainer.displayName = 'FormContainer';

export const AbsensiForm = React.memo<AbsensiFormProps>(
  ({ isPending, onSubmit, user, userStatus }) => {
    const { handleSubmit, handleLocationUpdate, formFieldProps } =
      useAbsensiForm(user, userStatus);
    return (
      <FormContainer onSubmit={handleSubmit(onSubmit)} isPending={isPending}>
        <Maps
          selectedLatitude={parseFloat(user.data.latitude_unit_kerja)}
          selectedLongitude={parseFloat(user.data.longitude_unit_kerja)}
          radius={Number(user?.data?.radius_unit_kerja ?? 0)}
          onLocationUpdate={handleLocationUpdate}
        />
        <FormFields {...formFieldProps} />
      </FormContainer>
    );
  }
);

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    position: 'absolute',
    top: 20,
    alignSelf: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 10,
    borderRadius: 8,
  },
  overlayText: {
    color: 'white',
    fontSize: 16,
  },
  statusContainer: {
    position: 'absolute',
    bottom: 80,
    left: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 8,
    borderRadius: 8,
  },
  statusText: {
    color: 'white',
    fontSize: 14,
  },
  countdown: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -20 }, { translateY: -20 }],
  },
  countdownText: {
    color: 'white',
    fontSize: 40,
  },
});
