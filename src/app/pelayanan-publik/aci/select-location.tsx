import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import MapView, { Circle, Marker } from 'react-native-maps';

import { Text } from '@/components/ui/text';

import { emitLocationSelected } from './location-store';

const useJumpToLocation = (
  mapRef: React.RefObject<MapView>,
  setTempLocation: (loc: any) => void
) => {
  return useCallback(
    (lat: number, lng: number) => {
      setTempLocation({ latitude: lat, longitude: lng });
      mapRef.current?.animateToRegion(
        {
          latitude: lat,
          longitude: lng,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        },
        1000
      );
    },
    [mapRef, setTempLocation]
  );
};

const useLocationPickerLogic = (
  params: any,
  mapRef: React.RefObject<MapView>
) => {
  const [tempLocation, setTempLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searching, setSearching] = useState(false);

  const jumpTo = useJumpToLocation(mapRef, setTempLocation);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    try {
      setSearching(true);
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return Alert.alert('Izin Ditolak', '...');
      const results = await Location.geocodeAsync(searchQuery);
      if (results.length > 0) jumpTo(results[0].latitude, results[0].longitude);
      else Alert.alert('Pencarian', 'Lokasi tidak ditemukan');
    } catch (e) {
      Alert.alert('Error', 'Gagal mencari lokasi');
    } finally {
      setSearching(false);
    }
  };

  const getCurrentLocation = useCallback(async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;
      const loc = await Location.getCurrentPositionAsync({});
      jumpTo(loc.coords.latitude, loc.coords.longitude);
    } catch (e) {
      console.error(e);
    }
  }, [jumpTo]);

  useEffect(() => {
    const lat = parseFloat(params.initialLat as string);
    const lng = parseFloat(params.initialLng as string);
    if (!isNaN(lat) && !isNaN(lng)) {
      setTempLocation({ latitude: lat, longitude: lng });
      setTimeout(() => jumpTo(lat, lng), 1000);
    } else {
      getCurrentLocation();
    }
  }, [params.initialLat, params.initialLng, jumpTo, getCurrentLocation]);

  const handleConfirm = () => {
    if (tempLocation) {
      emitLocationSelected(tempLocation.latitude, tempLocation.longitude);
      router.back();
    }
  };

  return {
    tempLocation,
    setTempLocation,
    searchQuery,
    setSearchQuery,
    searching,
    handleSearch,
    getCurrentLocation,
    handleConfirm,
    jumpTo,
  };
};

export default function SelectLocationPage() {
  const params = useLocalSearchParams();
  const mapRef = useRef<MapView>(null);
  const logic = useLocationPickerLogic(params, mapRef);

  const initialRegion = {
    latitude: parseFloat(params.initialLat as string) || 3.5833,
    longitude: parseFloat(params.initialLng as string) || 98.7444,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  return (
    <View className="flex-1 bg-white">
      <Stack.Screen options={{ headerShown: false }} />
      <PickerHeader
        onClose={() => router.back()}
        searchQuery={logic.searchQuery}
        setSearchQuery={logic.setSearchQuery}
        handleSearch={logic.handleSearch}
        searching={logic.searching}
        handleConfirm={logic.handleConfirm}
      />
      <View style={{ flex: 1 }}>
        <MapView
          ref={mapRef}
          style={{ flex: 1 }}
          initialRegion={initialRegion}
          onPress={(e) =>
            logic.jumpTo(
              e.nativeEvent.coordinate.latitude,
              e.nativeEvent.coordinate.longitude
            )
          }
          showsUserLocation
        >
          {logic.tempLocation && (
            <LocationMarker
              location={logic.tempLocation}
              onDragEnd={(e: any) =>
                logic.setTempLocation(e.nativeEvent.coordinate)
              }
            />
          )}
        </MapView>
        {!logic.tempLocation && (
          <View className="absolute inset-0 z-20 items-center justify-center bg-white">
            <ActivityIndicator size="large" color="#0066FF" />
          </View>
        )}
        <TouchableOpacity
          onPress={logic.getCurrentLocation}
          className="absolute right-4 top-4 size-12 items-center justify-center rounded-full bg-white shadow-lg"
        >
          <Ionicons name="locate" size={24} color="#0066FF" />
        </TouchableOpacity>
      </View>
      <ConfirmButton onPress={logic.handleConfirm} />
    </View>
  );
}

const LocationMarker = ({ location, onDragEnd }: any) => (
  <>
    <Marker coordinate={location} draggable onDragEnd={onDragEnd} />
    <Circle
      center={location}
      radius={50}
      fillColor="rgba(255, 0, 0, 0.3)"
      strokeColor="rgba(255, 0, 0, 0.8)"
      strokeWidth={2}
    />
  </>
);

const PickerHeader = ({
  onClose,
  searchQuery,
  setSearchQuery,
  handleSearch,
  searching,
  handleConfirm,
}: any) => (
  <View className="flex-row items-center border-b border-gray-100 px-4 pb-3 pt-12 shadow-sm">
    <TouchableOpacity onPress={onClose} className="p-2">
      <Ionicons name="arrow-back" size={24} color="#1F2937" />
    </TouchableOpacity>
    <View className="mx-2 flex-1 flex-row items-center rounded-xl bg-gray-100 px-3 py-1">
      <TextInput
        className="flex-1 p-2 text-sm text-[#0B2347]"
        placeholder="Cari lokasi atau alamat..."
        value={searchQuery}
        onChangeText={setSearchQuery}
        onSubmitEditing={handleSearch}
        returnKeyType="search"
      />
      {searching ? (
        <ActivityIndicator size="small" color="#0066FF" />
      ) : (
        <TouchableOpacity onPress={handleSearch}>
          <Ionicons name="search" size={20} color="#6B7280" />
        </TouchableOpacity>
      )}
    </View>
    <TouchableOpacity onPress={handleConfirm} className="p-2">
      <Text className="font-bold text-[#0066FF]">Pilih</Text>
    </TouchableOpacity>
  </View>
);

const ConfirmButton = ({ onPress }: any) => (
  <View className="absolute inset-x-6 bottom-10">
    <TouchableOpacity
      className="flex-row items-center justify-center rounded-xl bg-[#0066FF] py-4 shadow-lg shadow-blue-200"
      onPress={onPress}
    >
      <Text className="font-bold text-white">Konfirmasi Lokasi</Text>
    </TouchableOpacity>
  </View>
);
