import React from 'react';
import MapView from 'react-native-maps';

import { Text, View } from '@/components/ui';

import { MapMarkers } from './map-markers';

interface MapContentProps {
  location: any;
  mapRef: React.RefObject<MapView>;
  latitudeDelta: number;
  longitudeDelta: number;
  selectedLatitude: number;
  selectedLongitude: number;
  radius: number;
  distance: number | null;
}

export const MapContent = React.memo<MapContentProps>(
  ({
    location,
    mapRef,
    latitudeDelta,
    longitudeDelta,
    selectedLatitude,
    selectedLongitude,
    radius,
    distance,
  }) => (
    <View className="mb-4">
      <MapView
        ref={mapRef}
        style={{ height: 200, width: '100%' }}
        initialRegion={{
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta,
          longitudeDelta,
        }}
        showsUserLocation={true}
        followsUserLocation={true}
        scrollEnabled={false}
        rotateEnabled={false}
        zoomEnabled={false}
        loadingEnabled={true}
        loadingIndicatorColor="#0000ff"
      >
        <MapMarkers
          location={location}
          selectedLatitude={selectedLatitude}
          selectedLongitude={selectedLongitude}
          radius={radius}
        />
      </MapView>
      {distance !== null && (
        <Text className="mt-2 text-sm">
          Jarak terdekat Anda dengan lokasi Absen: {Math.round(distance)} meter
        </Text>
      )}
    </View>
  )
);

MapContent.displayName = 'MapContent';
