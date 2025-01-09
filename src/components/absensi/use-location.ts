import * as Location from 'expo-location';
import { getDistance } from 'geolib';
import { useEffect, useState } from 'react';
import { Alert } from 'react-native'; // Import Alert untuk menampilkan notifikasi

export const UseLocation = (
  selectedLatitude: number,
  selectedLongitude: number,
  radius: number
) => {
  const [location, setLocation] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [distance, setDistance] = useState<number | null>(null);
  const [latitudeDelta, setLatitudeDelta] = useState(0.0922);
  const [longitudeDelta, setLongitudeDelta] = useState(0.0421);

  useEffect(() => {
    const handleLocationUpdate = (loc: Location.LocationObject) => {
      if (!loc.coords) return;
      setLocation(loc);
      const distanceToSelected = getDistance(
        { latitude: loc.coords.latitude, longitude: loc.coords.longitude },
        { latitude: selectedLatitude, longitude: selectedLongitude }
      );
      setDistance(distanceToSelected);

      if (distanceToSelected > radius) {
        Alert.alert(
          'Peringatan',
          'Jarak anda melebihi titik lokasi yang sudah ditentukan',
          [{ text: 'OK' }],
          { cancelable: false }
        );
      }

      const zoomFactor = Math.max(0.005, 0.0922 * (distanceToSelected / 1000));
      setLatitudeDelta(zoomFactor);
      setLongitudeDelta(zoomFactor);
    };

    const getLocation = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setErrorMsg('Permission untuk mengakses lokasi ditolak');
          return;
        }

        const subscription = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.High,
            timeInterval: 1000,
            distanceInterval: 1,
          },
          handleLocationUpdate
        );

        return () => subscription.remove();
      } catch (error) {
        console.error('Error while fetching location:', error);
        setErrorMsg('Terjadi kesalahan saat mendapatkan lokasi');
      }
    };

    getLocation();
  }, [selectedLatitude, selectedLongitude, radius]);

  return { location, errorMsg, distance, latitudeDelta, longitudeDelta };
};
