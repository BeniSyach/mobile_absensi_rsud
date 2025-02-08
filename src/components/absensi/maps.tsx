import React from 'react';
import { ActivityIndicator } from 'react-native';
import type MapView from 'react-native-maps';
import { Circle, Marker } from 'react-native-maps';

import { Text, View } from '@/components/ui';

import { MapContent } from './map-content';
import { UseLocation } from './use-location';

interface MapsProps {
  selectedLatitude: number;
  selectedLongitude: number;
  radius: number;
  onLocationUpdate: (latitude: string, longitude: string) => void;
}

interface MapAnimationProps {
  location: any;
  mapRef: React.RefObject<MapView>;
  hasAnimated: React.RefObject<boolean>;
  isMounted: React.RefObject<boolean>;
  latitudeDelta: number;
  longitudeDelta: number;
}

interface LocationUpdateProps {
  location: any;
  lastLocation: React.RefObject<any>;
  isMounted: React.RefObject<boolean>;
  onLocationUpdate: (latitude: string, longitude: string) => void;
}

const calculateDeltaFromRadius = (
  radius: number
): { latitudeDelta: number; longitudeDelta: number } => {
  const factor = 0.00003;
  const latitudeDelta = radius * factor;
  const longitudeDelta = latitudeDelta;

  return { latitudeDelta, longitudeDelta };
};

const MapMarkers = React.memo(
  ({
    location,
    selectedLatitude,
    selectedLongitude,
    radius,
  }: {
    location: any;
    selectedLatitude: number;
    selectedLongitude: number;
    radius: number;
  }) => {
    if (!location?.coords) return null;

    return (
      <>
        <Marker
          coordinate={{
            latitude: Number(location.coords.latitude),
            longitude: Number(location.coords.longitude),
          }}
          title="Anda Berada Disini"
          pinColor="blue"
        />
        <Marker
          coordinate={{
            latitude: selectedLatitude,
            longitude: selectedLongitude,
          }}
          title="Lokasi Terpilih"
        />
        <Circle
          center={{
            latitude: selectedLatitude,
            longitude: selectedLongitude,
          }}
          radius={radius}
          strokeColor="rgba(0, 0, 255, 0.5)"
          fillColor="rgba(0, 0, 255, 0.1)"
          strokeWidth={2}
        />
      </>
    );
  }
);

const LoadingOverlay = ({ isMapReady }: { isMapReady: boolean }) => (
  <View className="absolute inset-0 items-center justify-center bg-gray-100/50">
    <ActivityIndicator size="large" color="#0000ff" />
    <Text className="mt-2 text-sm text-gray-600">
      {!isMapReady ? 'Memuat peta...' : 'Mendapatkan lokasi...'}
    </Text>
  </View>
);

const useMapAnimation = ({
  location,
  mapRef,
  isMounted,
  latitudeDelta,
  longitudeDelta,
}: MapAnimationProps) => {
  const [hasAnimatedState, setHasAnimatedState] = React.useState(false);

  React.useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    if (location?.coords && !hasAnimatedState && isMounted.current) {
      timeoutId = setTimeout(() => {
        if (mapRef.current && isMounted.current) {
          setHasAnimatedState(true);
          mapRef.current.animateToRegion(
            {
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
              latitudeDelta,
              longitudeDelta,
            },
            500
          );
        }
      }, 1000);
    }
    return () => timeoutId && clearTimeout(timeoutId);
  }, [
    location,
    latitudeDelta,
    longitudeDelta,
    hasAnimatedState,
    isMounted,
    mapRef,
  ]);
};

const useLocationUpdate = ({
  location,
  lastLocation,
  isMounted,
  onLocationUpdate,
}: LocationUpdateProps) => {
  React.useEffect(() => {
    if (
      location?.coords &&
      isMounted.current &&
      JSON.stringify(location) !== JSON.stringify(lastLocation.current)
    ) {
      onLocationUpdate(
        location.coords.latitude.toString(),
        location.coords.longitude.toString()
      );
    }
  }, [location, lastLocation, isMounted, onLocationUpdate]);
};

const Maps = React.memo<MapsProps>(
  ({ selectedLatitude, selectedLongitude, radius, onLocationUpdate }) => {
    const isMounted = React.useRef(true);
    const lastLocation = React.useRef<any>(null);
    const hasAnimated = React.useRef(false);
    const mapRef = React.useRef<MapView>(null);

    const { location, distance } = UseLocation({
      selectedLatitude,
      selectedLongitude,
      radius,
    });

    const { latitudeDelta, longitudeDelta } = React.useMemo(
      () => calculateDeltaFromRadius(Number(radius)),
      [radius]
    );

    useMapAnimation({
      location,
      mapRef,
      hasAnimated,
      isMounted,
      latitudeDelta,
      longitudeDelta,
    });
    useLocationUpdate({ location, lastLocation, isMounted, onLocationUpdate });

    if (!location?.coords) {
      return (
        <View className="mb-4">
          <View className="relative h-[200px] w-full">
            <LoadingOverlay isMapReady={false} />
          </View>
        </View>
      );
    }

    return (
      <MapContent
        location={location}
        mapRef={mapRef}
        latitudeDelta={latitudeDelta}
        longitudeDelta={longitudeDelta}
        selectedLatitude={selectedLatitude}
        selectedLongitude={selectedLongitude}
        radius={radius}
        distance={distance}
      />
    );
  }
);

MapMarkers.displayName = 'MapMarkers';
Maps.displayName = 'Maps';

export default Maps;
