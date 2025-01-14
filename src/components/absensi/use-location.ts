import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import { getDistance } from 'geolib';
import { useCallback, useEffect, useState } from 'react';
import { Alert } from 'react-native'; // Import Alert untuk menampilkan notifikasi

const getLocationWithPermission = async (
  handleLocationUpdate: (loc: Location.LocationObject) => void,
  router: ReturnType<typeof useRouter>
) => {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Peringatan',
        'Permission untuk mengakses lokasi ditolak',
        [{ text: 'OK', onPress: () => router.back() }],
        { cancelable: false }
      );
    }

    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High,
    });
    handleLocationUpdate(location);
  } catch (error) {
    console.error('Error while fetching location:', error);
    Alert.alert(
      'Peringatan',
      'Terjadi kesalahan saat mendapatkan lokasi',
      [{ text: 'OK', onPress: () => router.back() }],
      { cancelable: false }
    );
  }
};

export const UseLocation = (
  selectedLatitude: number,
  selectedLongitude: number,
  radius: number
) => {
  const router = useRouter();
  const [location, setLocation] = useState<any>(null);
  const [distance, setDistance] = useState<number | null>(null);
  const [latitudeDelta, setLatitudeDelta] = useState(3.557262);
  const [longitudeDelta, setLongitudeDelta] = useState(98.8652879);
  const [isLocationReady, setIsLocationReady] = useState(false);

  const handleLocationUpdate = useCallback(
    (loc: Location.LocationObject) => {
      if (!loc.coords) return;
      setLocation(loc);
      const distanceToSelected = getDistance(
        { latitude: loc.coords.latitude, longitude: loc.coords.longitude },
        { latitude: selectedLatitude, longitude: selectedLongitude }
      );
      setDistance(distanceToSelected);

      const zoomFactor = Math.max(0.005, 0.0922 * (distanceToSelected / 50));
      setLatitudeDelta(zoomFactor);
      setLongitudeDelta(zoomFactor);

      setIsLocationReady(true);

      if (distanceToSelected > radius && isLocationReady) {
        Alert.alert(
          'Peringatan',
          'Jarak anda melebihi titik lokasi yang sudah ditentukan',
          [{ text: 'OK', onPress: () => router.back() }],
          { cancelable: false }
        );
      }
    },
    [selectedLatitude, selectedLongitude, radius, router, isLocationReady]
  );

  useEffect(() => {
    getLocationWithPermission(handleLocationUpdate, router);
  }, [
    selectedLatitude,
    selectedLongitude,
    radius,
    router,
    isLocationReady,
    handleLocationUpdate,
  ]);

  return { location, distance, latitudeDelta, longitudeDelta };
};
