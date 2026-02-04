import { Ionicons } from '@expo/vector-icons';
import { Stack } from 'expo-router';
import React from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { AciAlert } from '@/components/pelayanan-publik-component/aci/aci-alert';
import { Image } from '@/components/ui/image';
import { Text } from '@/components/ui/text';

import { Select } from '../../components/ui/select';
import { useEditRiwayatLogic } from './use-edit-riwayat-logic';

export default function EditLaporPage() {
  const logic = useEditRiwayatLogic();

  if (logic.loading && !logic.submitting) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#0066FF" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-[#F8FAFC]">
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: 'Update Laporan',
          headerTitleStyle: { fontWeight: 'bold', color: '#0B2347' },
          headerShadowVisible: false,
          headerStyle: { backgroundColor: '#F8FAFC' },
          headerTintColor: '#0B2347',
        }}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ padding: 24, paddingBottom: 120 }}
        >
          <Text className="mb-6 text-base text-gray-500">
            Perbarui data laporan Anda jika terdapat kesalahan atau update
            terbaru.
          </Text>

          <ReportForm logic={logic} />
        </ScrollView>
      </KeyboardAvoidingView>

      <AciAlert {...logic.alertConfig} onConfirm={logic.hideAlert} />
    </View>
  );
}

function ReportForm({ logic }: { logic: any }) {
  return (
    <View className="gap-y-5">
      <BasicInfoSection logic={logic} />
      <RegionSelectionSection logic={logic} />
      <DetailsSection logic={logic} />
      <SubmitButton
        loading={logic.submitting}
        onPress={logic.handleSubmit}
        label="Simpan Perubahan"
      />
    </View>
  );
}

const BasicInfoSection = ({ logic }: { logic: any }) => {
  const categoryOptions = React.useMemo(
    () =>
      logic.categories.map((cat: any) => ({
        label: cat.nm_kategori || cat.nama_kategori,
        value: cat.id,
      })),
    [logic.categories]
  );

  return (
    <>
      <Select
        label="Kategori"
        options={categoryOptions}
        value={logic.kategoriId || undefined}
        onSelect={(val) => logic.setKategoriId(val as number)}
        placeholder={logic.loadingCategories ? 'Memuat...' : 'Pilih Kategori'}
        disabled={logic.loadingCategories}
      />
    </>
  );
};

const RegionSelectionSection = ({ logic }: { logic: any }) => {
  const kecamatanOptions = React.useMemo(
    () =>
      logic.kecamatans
        ? logic.kecamatans.map((kec: any) => ({
            label:
              kec.nama ||
              kec.nm_kecamatan ||
              kec.nama_kecamatan ||
              kec.name ||
              `Kecamatan ${kec.id}`,
            value: kec.id,
          }))
        : [],
    [logic.kecamatans]
  );

  const kelurahanOptions = React.useMemo(
    () =>
      logic.kelurahans
        ? logic.kelurahans.map((kel: any) => ({
            label:
              kel.nm_kelurahan ||
              kel.nama_kelurahan ||
              kel.nm_desa ||
              kel.nama_desa ||
              kel.nama ||
              kel.name ||
              `Desa/Kel ${kel.id}`,
            value: kel.id,
          }))
        : [],
    [logic.kelurahans]
  );

  return (
    <>
      <Select
        label="Kecamatan"
        options={kecamatanOptions}
        value={logic.kecamatanId || undefined}
        onSelect={(val) => logic.setKecamatanId(val as number)}
        placeholder={logic.loadingKecamatans ? 'Memuat...' : 'Pilih Kecamatan'}
        disabled={logic.loadingKecamatans}
        searchable
      />

      <Select
        label="Kelurahan / Desa"
        options={kelurahanOptions}
        value={logic.kelurahanId || undefined}
        onSelect={(val) => logic.setKelurahanId(val as number)}
        placeholder={
          !logic.kecamatanId
            ? 'Pilih kecamatan terlebih dahulu'
            : logic.loadingKelurahans
              ? 'Memuat...'
              : 'Pilih Kelurahan / Desa'
        }
        disabled={!logic.kecamatanId || logic.loadingKelurahans}
        searchable
      />
    </>
  );
};

const DetailsSection = ({ logic }: { logic: any }) => {
  return (
    <>
      <InputField
        label="Alamat Kejadian"
        placeholder="Masukkan alamat lengkap kejadian..."
        value={logic.alamat}
        onChangeText={logic.setAlamat}
        multiline
        numberOfLines={2}
      />

      <InputField
        label="Deskripsi Detail"
        placeholder="Jelaskan detail masalah..."
        value={logic.deskripsi}
        onChangeText={logic.setDeskripsi}
        multiline
        numberOfLines={4}
      />

      <ImageSection
        image={logic.image}
        latitude={logic.latitude}
        longitude={logic.longitude}
        onPickCapture={logic.handlePickImage}
        onRemove={() => logic.setImage(null)}
        isLoading={logic.loading}
      />
    </>
  );
};

function ImagePreview({ image, latitude, longitude, onRemove }: any) {
  return (
    <View className="items-center justify-center rounded-2xl border-2 border-dashed border-emerald-200 bg-emerald-50 py-6">
      <View className="relative">
        <Image
          source={{ uri: image.uri }}
          className="h-44 w-64 rounded-2xl shadow-md"
          contentFit="cover"
        />
        <TouchableOpacity
          onPress={onRemove}
          className="absolute -right-3 -top-3 rounded-full bg-red-500 p-2 shadow-lg"
        >
          <Ionicons name="close" size={20} color="white" />
        </TouchableOpacity>
      </View>
      {latitude && longitude && (
        <View className="mt-4 flex-row items-center rounded-full bg-white px-3 py-1 shadow-sm">
          <Ionicons name="location" size={16} color="#10B981" />
          <Text className="ml-1 text-xs font-semibold text-emerald-600">
            Lokasi Terkunci: {latitude.toFixed(6)}, {longitude.toFixed(6)}
          </Text>
        </View>
      )}
    </View>
  );
}

function ImagePickerOptions({ onPickCapture, isLoading }: any) {
  return (
    <View className="flex-row gap-4">
      <TouchableOpacity
        onPress={onPickCapture}
        disabled={isLoading}
        className="flex-1 items-center justify-center rounded-2xl border border-gray-100 bg-white py-6 shadow-sm"
      >
        <View className="mb-2 rounded-full bg-blue-50 p-3">
          <Ionicons name="camera" size={28} color="#0066FF" />
        </View>
        <Text className="text-xs font-bold text-gray-700">Ganti Foto</Text>
      </TouchableOpacity>
    </View>
  );
}

function ImageSection({
  image,
  latitude,
  longitude,
  onPickCapture,
  onRemove,
  isLoading,
}: any) {
  return (
    <View>
      <Text className="mb-3 ml-1 text-sm font-bold text-[#0B2347]">
        Foto/Video Kejadian
      </Text>

      {image ? (
        <ImagePreview
          image={image}
          latitude={latitude}
          longitude={longitude}
          onRemove={onRemove}
        />
      ) : (
        <ImagePickerOptions
          onPickCapture={onPickCapture}
          isLoading={isLoading}
        />
      )}

      {!image && (
        <Text className="mt-3 px-1 text-center text-[11px] leading-4 text-gray-400">
          Upload foto baru jika ingin mengganti bukti laporan.
        </Text>
      )}
    </View>
  );
}

function InputField({ label, ...props }: any) {
  return (
    <View>
      <Text className="mb-2 ml-1 text-sm font-bold text-[#0B2347]">
        {label}
      </Text>
      <View className="rounded-2xl border border-gray-100 bg-white px-4 py-3 shadow-sm">
        <TextInput
          className={`font-inter text-base text-gray-800 ${props.multiline ? (props.numberOfLines === 2 ? 'center h-16 text-left' : 'h-32 text-left') : ''}`}
          textAlignVertical={props.multiline ? 'top' : 'center'}
          placeholderTextColor="#9CA3AF"
          blurOnSubmit={false}
          {...props}
        />
      </View>
    </View>
  );
}

function SubmitButton({ loading, onPress, label }: any) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={loading}
      className={`mt-4 items-center justify-center rounded-2xl py-4 shadow-lg ${loading ? 'bg-blue-300' : 'bg-[#0066FF]'}`}
    >
      {loading ? (
        <ActivityIndicator color="white" />
      ) : (
        <Text className="text-lg font-bold text-white">
          {label || 'Kirim Laporan'}
        </Text>
      )}
    </TouchableOpacity>
  );
}
