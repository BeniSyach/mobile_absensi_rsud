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
    <View className="my-2">
      {/* Card */}
      <View className="rounded-2xl border border-gray-200 bg-white p-4 shadow-md">
        {/* Map */}
        <View className="mb-3 overflow-hidden rounded-xl">
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
        </View>

        {/* Informasi jarak */}
        {distance !== null && (
          <Text className="text-base text-gray-700">
            Jarak terdekat Anda dengan lokasi Absen: {Math.round(distance)}{' '}
            meter
          </Text>
        )}
      </View>
    </View>
  )
);

MapContent.displayName = 'MapContent';
