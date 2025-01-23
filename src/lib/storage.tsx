import { useEffect } from 'react';
import DeviceInfo from 'react-native-device-info';
import { MMKV } from 'react-native-mmkv';

export const storage = new MMKV();

export function getItem<T>(key: string): T {
  const value = storage.getString(key);
  return value ? JSON.parse(value) || null : null;
}

export async function setItem<T>(key: string, value: T) {
  storage.set(key, JSON.stringify(value));
}

export async function removeItem(key: string) {
  storage.delete(key);
}
const getPersistentDeviceId = async () => {
  let deviceId = getItem('deviceId');

  if (!deviceId) {
    deviceId = await DeviceInfo.getUniqueId();
    await setItem('deviceId', deviceId);
  }

  console.log('Device Persistent ID:', deviceId);
  return deviceId;
};

// Komponen utama, bisa diberi nama sesuai kebutuhan
const MainApp = () => {
  useEffect(() => {
    getPersistentDeviceId();
  }, []);

  return null;
};

export default MainApp;
