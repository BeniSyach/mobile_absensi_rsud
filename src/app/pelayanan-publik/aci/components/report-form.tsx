import React from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';

import { CategoryPicker } from './category-picker';
import { ImageAttachment } from './image-attachment';
import { LocationField } from './location-field';
import { ReportInputField } from './report-input-field';

interface ReportFormProps {
  logic: any; // Using any for brevity, ideally use a proper type from context or hook
}

export function ReportForm({ logic }: ReportFormProps) {
  return (
    <View className="gap-y-5">
      <ReportInputField
        label="Judul Laporan"
        placeholder="Contoh: Jalan Berlubang Besar"
        value={logic.judul}
        onChangeText={logic.setJudul}
      />

      <CategoryPicker
        categories={logic.categories}
        selectedId={logic.kategoriId}
        onSelect={logic.setKategoriId}
        loading={logic.loadingCategories}
      />

      <LocationField
        location={logic.lokasi}
        onPress={() => logic.setShowMap(true)}
      />

      <ReportInputField
        label="Deskripsi Detail"
        placeholder="Jelaskan detail masalah..."
        value={logic.deskripsi}
        onChangeText={logic.setDeskripsi}
        multiline
        height={128}
      />

      <ImageAttachment
        image={logic.image}
        onPickImage={logic.handlePickImage}
        onRemoveImage={() => logic.setImage(null)}
      />

      <TouchableOpacity
        onPress={logic.handleSubmit}
        disabled={logic.loading}
        className={`mt-4 items-center justify-center rounded-2xl py-4 shadow-lg shadow-blue-200 ${
          logic.loading ? 'bg-blue-300' : 'bg-[#0066FF]'
        }`}
      >
        {logic.loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text className="text-lg font-bold text-white">Kirim Laporan</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

export default function Ignored() {
  return null;
}
