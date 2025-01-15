import { useFocusEffect } from 'expo-router';
import React, { useEffect, useState } from 'react';
import MapView, { Circle, Marker } from 'react-native-maps';

import { Text, View } from '@/components/ui';

import LoadingComponent from '../ui/loading';
import { UseLocation } from './use-location';

interface MapsProps {
  selectedLatitude: number;
  selectedLongitude: number;
  radius: number;
  onLocationUpdate: (latitude: string, longitude: string) => void;
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

const calculateDeltaFromRadius = (
  radius: number
): { latitudeDelta: number; longitudeDelta: number } => {
  // Perhitungan delta berdasarkan radius, semakin kecil radius semakin kecil delta
  const factor = 0.00003; // Faktor yang digunakan untuk menghitung delta dari radius
  const latitudeDelta = radius * factor;
  const longitudeDelta = latitudeDelta; // Menjaga proporsi dengan latitudeDelta

  return { latitudeDelta, longitudeDelta };
};

const MapDisplay: React.FC<MapDisplayProps> = ({
  location,
  selectedLatitude,
  selectedLongitude,
  latitudeDelta,
  longitudeDelta,
  radius,
}) => {
  // Pastikan initialRegion diberi nilai valid
  const [region, setRegion] = useState({
    latitude: location?.coords.latitude || selectedLatitude,
    longitude: location?.coords.longitude || selectedLongitude,
    latitudeDelta,
    longitudeDelta,
  });

  useFocusEffect(
    React.useCallback(() => {
      if (location) {
        setRegion({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta,
          longitudeDelta,
        });
      }
    }, [location, latitudeDelta, longitudeDelta]) // Pastikan hanya dipanggil jika id berubah
  );

  return (
    <MapView
      style={{ height: 200, width: '100%' }}
      region={region} // Inisialisasi dengan lokasi yang tersedia atau default
      showsUserLocation={true} // Menampilkan lokasi pengguna jika ada
      followsUserLocation={true} // Memperbarui lokasi pengguna secara dinamis
    >
      {/* Lokasi pengguna saat ini */}
      {location && (
        <Marker coordinate={location.coords} title="Anda Berada Disini" />
      )}

      {/* Lokasi yang sudah ditetapkan */}
      <Marker
        coordinate={{
          latitude: selectedLatitude,
          longitude: selectedLongitude,
        }}
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
};

const Maps: React.FC<MapsProps> = ({
  selectedLatitude,
  selectedLongitude,
  radius,
  onLocationUpdate,
}) => {
  const { location, distance } = UseLocation(
    selectedLatitude,
    selectedLongitude,
    radius
  );

  useEffect(() => {
    if (location) {
      onLocationUpdate(location.coords.latitude, location.coords.longitude);
    }
  }, [location, onLocationUpdate]);

  if (!location) {
    return <LoadingComponent />;
  }
  const {
    latitudeDelta: calculatedLatitudeDelta,
    longitudeDelta: calculatedLongitudeDelta,
  } = calculateDeltaFromRadius(radius);

  return (
    <View className="mb-4">
      <MapDisplay
        location={location}
        distance={distance}
        selectedLatitude={selectedLatitude}
        selectedLongitude={selectedLongitude}
        latitudeDelta={calculatedLatitudeDelta}
        longitudeDelta={calculatedLongitudeDelta}
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
