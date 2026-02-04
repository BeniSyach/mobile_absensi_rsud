import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { TouchableOpacity } from 'react-native';

export function KategoriFab() {
  const router = useRouter();

  return (
    <TouchableOpacity
      className="absolute bottom-6 right-6 size-14 items-center justify-center rounded-full bg-[#0066FF] shadow-lg shadow-blue-200"
      onPress={() => router.push('/pelayanan-publik/aci/admin/kategori/create')}
    >
      <Ionicons name="add" size={30} color="white" />
    </TouchableOpacity>
  );
}

export default KategoriFab;
