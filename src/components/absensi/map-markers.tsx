import React from 'react';
import { Circle, Marker } from 'react-native-maps';

interface MapMarkersProps {
  location: any;
  selectedLatitude: number;
  selectedLongitude: number;
  radius: number;
}

export const MapMarkers = React.memo<MapMarkersProps>(
  ({ location, selectedLatitude, selectedLongitude, radius }) => {
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

MapMarkers.displayName = 'MapMarkers';
