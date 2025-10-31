import { NativeModules } from 'react-native';
const { DeveloperMode } = NativeModules;

export async function checkDeveloperMode() {
  try {
    const isEnabled = await DeveloperMode.isDeveloperModeEnabled();
    console.log('Developer mode aktif?', isEnabled);
    return isEnabled;
  } catch (error) {
    console.error('Gagal memeriksa developer mode:', error);
    return false;
  }
}
