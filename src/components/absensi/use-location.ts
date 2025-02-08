import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import { getDistance } from 'geolib';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Alert } from 'react-native';
import { MMKV } from 'react-native-mmkv';

interface LocationHookParams {
  selectedLatitude: number;
  selectedLongitude: number;
  radius: number;
}

const ALERT_MESSAGES = {
  PERMISSION_DENIED: 'Izin lokasi ditolak',
  LOCATION_ERROR: 'Gagal mendapatkan lokasi',
  MOCKED_LOCATION: 'Lokasi yang digunakan palsu',
  RADIUS_EXCEEDED: (radius: number) => `Jarak melebihi radius ${radius} meter`,
};

const STORAGE_KEY = 'LAST_KNOWN_LOCATION';
const MAX_RETRIES = 3;
const RETRY_DELAY = 2000;
const LOCATION_TIMEOUT = 15000;

const storage = new MMKV({
  id: 'location-storage',
  encryptionKey: 'location-key',
});

const getStoredLocation = () => {
  try {
    const storedLocation = storage.getString(STORAGE_KEY);
    return storedLocation ? JSON.parse(storedLocation) : null;
  } catch (error) {
    console.error('Error reading stored location:', error);
    return null;
  }
};

const storeLocation = (location: Location.LocationObject) => {
  try {
    storage.set(STORAGE_KEY, JSON.stringify(location));
  } catch (error) {
    console.error('Error storing location:', error);
  }
};

const getCurrentLocationWithRetry = async (
  retryCount = 0
): Promise<Location.LocationObject | null> => {
  try {
    const locationPromise = Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High,
    });

    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Location timeout')), LOCATION_TIMEOUT);
    });

    const location = (await Promise.race([
      locationPromise,
      timeoutPromise,
    ])) as Location.LocationObject;
    return location;
  } catch (error) {
    if (retryCount < MAX_RETRIES) {
      console.log(
        `Retrying location fetch. Attempt ${retryCount + 1}/${MAX_RETRIES}`
      );
      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
      return getCurrentLocationWithRetry(retryCount + 1);
    }
    throw error;
  }
};

const requestLocationPermission = async (
  router: ReturnType<typeof useRouter>
) => {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Peringatan',
        ALERT_MESSAGES.PERMISSION_DENIED,
        [{ text: 'OK', onPress: () => router.back() }],
        { cancelable: false }
      );
      return false;
    }
    return true;
  } catch (error) {
    console.error('Location permission error:', error);
    return false;
  }
};

const handleDistanceAndZoom = ({
  loc,
  selectedLatitude,
  selectedLongitude,
  radius,
  router,
}: {
  loc: Location.LocationObject;
  selectedLatitude: number;
  selectedLongitude: number;
  radius: number;
  router: ReturnType<typeof useRouter>;
}) => {
  const currentDistance = getDistance(
    {
      latitude: loc.coords.latitude,
      longitude: loc.coords.longitude,
    },
    {
      latitude: selectedLatitude,
      longitude: selectedLongitude,
    }
  );

  if (currentDistance > radius) {
    Alert.alert(
      'Peringatan',
      ALERT_MESSAGES.RADIUS_EXCEEDED(radius),
      [{ text: 'OK', onPress: () => router.back() }],
      { cancelable: false }
    );
  }

  return { currentDistance };
};

const validateAndProcessLocation = async (
  currentLocation: Location.LocationObject,
  params: {
    selectedLatitude: number;
    selectedLongitude: number;
    radius: number;
    router: ReturnType<typeof useRouter>;
    setLocation: (loc: Location.LocationObject | null) => void;
    setDistance: (dist: number | null) => void;
  }
) => {
  const {
    selectedLatitude,
    selectedLongitude,
    radius,
    router,
    setLocation,
    setDistance,
  } = params;

  if (currentLocation.mocked) {
    Alert.alert(
      'Peringatan',
      ALERT_MESSAGES.MOCKED_LOCATION,
      [{ text: 'OK', onPress: () => router.back() }],
      { cancelable: false }
    );
    return;
  }

  setLocation(currentLocation);
  storeLocation(currentLocation);

  const { currentDistance } = handleDistanceAndZoom({
    loc: currentLocation,
    selectedLatitude,
    selectedLongitude,
    radius,
    router,
  });
  setDistance(currentDistance);
};

const useLocationInit = (
  isMounted: React.RefObject<boolean>,
  params: {
    selectedLatitude: number;
    selectedLongitude: number;
    radius: number;
    router: ReturnType<typeof useRouter>;
    setLocation: (loc: Location.LocationObject | null) => void;
    setDistance: (dist: number | null) => void;
    getCurrentLocation: () => Promise<void>;
  }
) => {
  const {
    selectedLatitude,
    selectedLongitude,
    radius,
    router,
    setLocation,
    setDistance,
    getCurrentLocation,
  } = params;

  useEffect(() => {
    const initLocation = async () => {
      if (!isMounted.current) return;

      const storedLocation = getStoredLocation();
      if (storedLocation && isMounted.current) {
        setLocation(storedLocation);
        const { currentDistance } = handleDistanceAndZoom({
          loc: storedLocation,
          selectedLatitude,
          selectedLongitude,
          radius,
          router,
        });
        if (isMounted.current) {
          setDistance(currentDistance);
        }
      }
      await getCurrentLocation();
    };

    initLocation();
  }, [
    getCurrentLocation,
    selectedLatitude,
    selectedLongitude,
    radius,
    router,
    setLocation,
    setDistance,
    isMounted,
  ]);
};

const handleLocationError = (
  error: unknown,
  isMounted: React.RefObject<boolean>,
  router: ReturnType<typeof useRouter>
) => {
  console.error('Error getting location:', error);
  if (isMounted.current) {
    Alert.alert(
      'Peringatan',
      ALERT_MESSAGES.LOCATION_ERROR,
      [{ text: 'OK', onPress: () => router.back() }],
      { cancelable: false }
    );
  }
};

export const UseLocation = ({
  selectedLatitude,
  selectedLongitude,
  radius,
}: LocationHookParams) => {
  const router = useRouter();
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null
  );
  const [distance, setDistance] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isMounted = useRef(true);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  const getCurrentLocation = useCallback(async () => {
    if (!isMounted.current) return;

    try {
      setIsLoading(true);
      const permissionGranted = await requestLocationPermission(router);
      if (!permissionGranted || !isMounted.current) return;

      const currentLocation = await getCurrentLocationWithRetry();
      if (!currentLocation || !isMounted.current) return;

      await validateAndProcessLocation(currentLocation, {
        selectedLatitude,
        selectedLongitude,
        radius,
        router,
        setLocation: (loc) => {
          if (isMounted.current) setLocation(loc);
        },
        setDistance: (dist) => {
          if (isMounted.current) setDistance(dist);
        },
      });
    } catch (error) {
      handleLocationError(error, isMounted, router);
    } finally {
      if (isMounted.current) {
        setIsLoading(false);
      }
    }
  }, [selectedLatitude, selectedLongitude, radius, router]);

  useLocationInit(isMounted, {
    selectedLatitude,
    selectedLongitude,
    radius,
    router,
    setLocation,
    setDistance,
    getCurrentLocation,
  });

  return { location, distance, isLoading, getCurrentLocation };
};
