import { useFocusEffect } from 'expo-router';
import { useCallback } from 'react';
import { Alert, BackHandler } from 'react-native';

export const useBackExit = (
  useCustomAlert = false,
  showAlert?: (config: any) => void
) => {
  useFocusEffect(
    useCallback(() => {
      const backAction = () => {
        if (useCustomAlert && showAlert) {
          showAlert({
            type: 'confirm',
            title: 'Keluar Aplikasi',
            message: 'Apakah Anda yakin ingin keluar?',
            confirmText: 'Ya',
            cancelText: 'Batal',
            onConfirm: () => BackHandler.exitApp(),
          });
        } else {
          Alert.alert('Keluar Aplikasi', 'Apakah Anda yakin ingin keluar?', [
            {
              text: 'Batal',
              onPress: () => null,
              style: 'cancel',
            },
            { text: 'Ya', onPress: () => BackHandler.exitApp() },
          ]);
        }
        return true;
      };

      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        backAction
      );

      return () => backHandler.remove();
    }, [useCustomAlert, showAlert])
  );
};

export default function Ignored() {
  return null;
}
