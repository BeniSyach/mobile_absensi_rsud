import React from 'react';
import MapView, { Circle, Marker } from 'react-native-maps';

import { Text, View } from '@/components/ui';

import { UseLocation } from './use-location';

interface MapsProps {
  selectedLatitude: number;
  selectedLongitude: number;
  radius: number;
  onLocationUpdate: (latitude: number, longitude: number) => void;
}

interface MapDisplayProps {
  location: any;
  distance: number | null;
  selectedLatitude: number;
  selectedLongitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
  radius: number;
}

const MapDisplay: React.FC<MapDisplayProps> = ({
  location,
  selectedLatitude,
  selectedLongitude,
  latitudeDelta,
  longitudeDelta,
  radius,
}) => (
  <MapView
    style={{ height: 200, width: '100%' }}
    initialRegion={{
      latitude: location?.coords.latitude || selectedLatitude,
      longitude: location?.coords.longitude || selectedLongitude,
      latitudeDelta,
      longitudeDelta,
    }}
  >
    {/* Lokasi pengguna saat ini */}
    {location && (
      <Marker coordinate={location.coords} title="Anda Berada Disini" />
    )}

    {/* Lokasi yang sudah ditetapkan */}
    <Marker
      coordinate={{ latitude: selectedLatitude, longitude: selectedLongitude }}
      title="Lokasi Terpilih"
    />

    {/* Lingkaran di sekitar lokasi yang sudah ditetapkan */}
    <Circle
      center={{ latitude: selectedLatitude, longitude: selectedLongitude }}
      radius={radius}
      strokeColor="rgba(0, 0, 255, 0.5)"
      fillColor="rgba(0, 0, 255, 0.2)"
    />
  </MapView>
);

const Maps: React.FC<MapsProps> = ({
  selectedLatitude,
  selectedLongitude,
  radius,
  onLocationUpdate,
}) => {
  const { location, errorMsg, distance, latitudeDelta, longitudeDelta } =
    UseLocation(selectedLatitude, selectedLongitude, radius);

  React.useEffect(() => {
    if (location) {
      onLocationUpdate(location.coords.latitude, location.coords.longitude);
    }
  }, [location, onLocationUpdate]);

  if (errorMsg) return <Text>{errorMsg}</Text>;

  return (
    <View className="mb-4">
      <MapDisplay
        location={location}
        distance={distance}
        selectedLatitude={selectedLatitude}
        selectedLongitude={selectedLongitude}
        latitudeDelta={latitudeDelta}
        longitudeDelta={longitudeDelta}
        radius={radius}
      />
      {distance !== null && (
        <Text className="mt-2 text-sm">
          Jarak Anda dengan lokasi Absen: {distance} meter
        </Text>
      )}
    </View>
  );
};

export default Maps;
