import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface LocationFieldProps {
  location: string | null;
  onPress: () => void;
}

export function LocationField({ location, onPress }: LocationFieldProps) {
  return (
    <View>
      <Text className="mb-2 ml-1 text-sm font-bold text-[#0B2347]">
        Lokasi Kejadian
      </Text>
      <TouchableOpacity
        onPress={onPress}
        className="flex-row items-center rounded-2xl border border-gray-100 bg-white px-4 py-3 shadow-sm"
      >
        <Ionicons name="location-outline" size={20} color="#0066FF" />
        <Text
          className={`ml-2 flex-1 font-inter text-base ${location ? 'text-gray-800' : 'text-gray-400'}`}
        >
          {location || 'Pilih lokasi di peta'}
        </Text>
        <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
      </TouchableOpacity>
    </View>
  );
}

export default function Ignored() {
  return null;
}
