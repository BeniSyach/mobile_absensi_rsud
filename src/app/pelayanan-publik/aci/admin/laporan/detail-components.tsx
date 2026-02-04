import { Ionicons } from '@expo/vector-icons';
import { Stack } from 'expo-router';
import React from 'react';
import {
  ActivityIndicator,
  Linking,
  Platform,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native';

import { ReportTimeline } from '@/components/pelayanan-publik-component/aci/report-timeline';
import { Image } from '@/components/ui/image';
import { Text } from '@/components/ui/text';

import { getReportImageSource } from '../../aci-service';
import { UpdateStatusModal } from './update-status-modal';

const ReporterItem = ({ report }: { report: any }) => {
  const name =
    report.user?.name ||
    report.user?.nama ||
    report.nama_pelapor ||
    report.user_name ||
    'Anonim';

  const phone = report.user?.no_wa;

  const handleWhatsApp = () => {
    if (phone) {
      let formattedPhone = phone;
      if (formattedPhone.startsWith('0')) {
        formattedPhone = '62' + formattedPhone.slice(1);
      }
      Linking.openURL(`https://wa.me/${formattedPhone}`);
    }
  };

  return (
    <View className="mb-6 flex-row">
      <View className="mr-4 size-10 items-center justify-center rounded-xl bg-blue-50">
        <Ionicons name="person-outline" size={20} color="#0066FF" />
      </View>
      <View className="flex-1">
        <Text className="mb-1 text-xs font-medium text-gray-400">Pelapor</Text>
        <View className="flex-row items-center">
          <Text
            className="shrink text-base font-semibold text-[#0B2347]"
            numberOfLines={1}
          >
            {name}
          </Text>
          {phone && (
            <TouchableOpacity
              onPress={handleWhatsApp}
              className="ml-2 flex-row items-center rounded-full bg-green-50 px-2 py-1"
            >
              <Ionicons name="logo-whatsapp" size={14} color="#16A34A" />
              <Text className="ml-1 text-xs font-medium text-green-700">
                {phone}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

export const StatusBadge = ({ status }: { status?: string | number }) => {
  const getStatusConfig = (s: string | number = '0') => {
    const safeStatus = (s === null || s === undefined ? '0' : s)
      .toString()
      .toLowerCase();

    if (safeStatus === '0' || safeStatus === 'pending') {
      return {
        bg: 'bg-yellow-50',
        text: 'text-yellow-600',
        label: 'Pengajuan',
      };
    }
    if (safeStatus === '1') {
      return { bg: 'bg-blue-50', text: 'text-blue-600', label: 'Diterima' };
    }
    if (safeStatus === '2') {
      return {
        bg: 'bg-indigo-50',
        text: 'text-indigo-600',
        label: 'Diverifikasi',
      };
    }
    if (safeStatus === '3' || safeStatus === 'diproses') {
      return {
        bg: 'bg-purple-50',
        text: 'text-purple-600',
        label: 'Ditangani',
      };
    }
    if (safeStatus === '4' || safeStatus === 'selesai') {
      return { bg: 'bg-green-50', text: 'text-green-600', label: 'Selesai' };
    }
    if (safeStatus === '5' || safeStatus === 'ditolak') {
      return { bg: 'bg-red-50', text: 'text-red-600', label: 'Ditolak' };
    }

    return {
      bg: 'bg-gray-50',
      text: 'text-gray-600',
      label: safeStatus || 'N/A',
    };
  };

  const config = getStatusConfig(status || 'pending');
  return (
    <View className={`rounded-full px-4 py-1.5 ${config.bg}`}>
      <Text className={`text-xs font-bold ${config.text}`}>
        {config.label.toUpperCase()}
      </Text>
    </View>
  );
};

export const InfoItem = ({
  label,
  value,
  icon,
  onPress,
}: {
  label: string;
  value: string;
  icon: any;
  onPress?: () => void;
}) => (
  <TouchableOpacity
    className="mb-6 flex-row"
    onPress={onPress}
    disabled={!onPress}
    activeOpacity={0.7}
  >
    <View className="mr-4 size-10 items-center justify-center rounded-xl bg-blue-50">
      <Ionicons name={icon} size={20} color="#0066FF" />
    </View>
    <View className="flex-1">
      <Text className="mb-1 text-xs font-medium text-gray-400">{label}</Text>
      <Text
        className={`text-base font-semibold ${onPress ? 'text-[#0066FF] underline' : 'text-[#0B2347]'}`}
      >
        {value}
      </Text>
    </View>
  </TouchableOpacity>
);

export const DetailHeader = ({ report }: { report: any }) => {
  let status = report.status ?? report.status_laporan;

  if (report.selesai_tgl && !report.selesai_tgl_tolak) {
    status = 'selesai';
  } else if (report.selesai_tgl_tolak || report.verif_tgl_tolak) {
    status = 'ditolak';
  }

  return (
    <View className="mb-6 flex-row items-center justify-between">
      <View className="flex-1 pr-4">
        <Text className="text-xl font-bold text-[#0B2347]">
          {report.kategori?.nm_kategori ||
            report.kategori?.nama_kategori ||
            'Kategori'}
        </Text>
      </View>
      <StatusBadge status={status} />
    </View>
  );
};

const LocationItem = ({
  regionNames,
  report,
}: {
  regionNames: any;
  report: any;
}) => {
  if (
    !regionNames.kecamatan &&
    !report.kecamatan_id &&
    !regionNames.kelurahan &&
    !report.kelurahan_id
  ) {
    return null;
  }

  const kec = regionNames.kecamatan || '-';
  const kel = regionNames.kelurahan || '-';

  return (
    <InfoItem
      label="Kecamatan"
      value={`${kec}${kel ? `, ${kel}` : ''}`}
      icon="map-outline"
    />
  );
};

const openMapNavigation = (
  lat: string | number,
  lng: string | number,
  label: string
) => {
  const scheme = Platform.select({
    ios: 'maps:0,0?q=',
    android: 'geo:0,0?q=',
  });
  const latLng = `${lat},${lng}`;
  const url = Platform.select({
    ios: `${scheme}${label}@${latLng}`,
    android: `${scheme}${latLng}(${label})`,
  });

  if (url) {
    Linking.canOpenURL(url).then((supported) => {
      if (supported) {
        Linking.openURL(url);
      } else {
        // Fallback to Google Maps Web URL
        Linking.openURL(
          `https://www.google.com/maps/search/?api=1&query=${latLng}`
        );
      }
    });
  }
};

export const DetailInfoList = ({
  report,
  regionNames,
}: {
  report: any;
  regionNames: { kecamatan: string; kelurahan: string };
}) => {
  const handleOpenMap = () => {
    if (report.latitude && report.longitude) {
      openMapNavigation(
        report.latitude,
        report.longitude,
        report.alamat || report.judul || 'Lokasi Laporan'
      );
    }
  };

  return (
    <>
      <View className="mb-8 rounded-2xl bg-gray-50 p-4">
        <Text className="mb-2 text-xs font-bold uppercase tracking-widest text-gray-400">
          Deskripsi Laporan
        </Text>
        <Text className="text-base leading-6 text-gray-700">
          {report.deskripsi || 'Tidak ada deskripsi'}
        </Text>
      </View>
      <InfoItem
        label="Alamat Kejadian"
        value={report.alamat || report.lokasi || 'Lokasi tidak tersedia'}
        icon="location-outline"
        onPress={
          report.latitude && report.longitude ? handleOpenMap : undefined
        }
      />
      <LocationItem regionNames={regionNames} report={report} />
      <ReporterItem report={report} />
      <InfoItem
        label="Tanggal Laporan"
        value={
          report.created_at
            ? new Date(report.created_at).toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })
            : '-'
        }
        icon="calendar-outline"
      />
      {report.catatan_admin && (
        <View className="mt-2 rounded-2xl border border-red-100 bg-red-50 p-4">
          <Text className="mb-2 text-xs font-bold uppercase tracking-widest text-red-400">
            Catatan Admin
          </Text>
          <Text className="text-base leading-6 text-red-700">
            {report.catatan_admin}
          </Text>
        </View>
      )}
    </>
  );
};

export const LoadingView = () => (
  <View className="flex-1 items-center justify-center bg-white">
    <ActivityIndicator size="large" color="#0066FF" />
  </View>
);

export const NotFoundView = ({ onBack }: { onBack: () => void }) => (
  <View className="flex-1 items-center justify-center bg-white p-6">
    <Ionicons name="alert-circle-outline" size={64} color="#EF4444" />
    <Text className="mt-4 text-lg font-bold text-[#0B2347]">
      Laporan Tidak Ditemukan
    </Text>
    <TouchableOpacity
      onPress={onBack}
      className="mt-6 rounded-full bg-[#0066FF] px-8 py-3"
    >
      <Text className="font-bold text-white">Kembali</Text>
    </TouchableOpacity>
  </View>
);

export const UpdateStatusSection = ({
  onPress,
  status,
}: {
  onPress: () => void;
  status: any;
}) => {
  const getLabel = () => {
    const s = String(status || '0');
    if (s === '0') return 'Disposisi Laporan';
    return 'Update Status Laporan';
  };

  return (
    <View className="mt-8 border-t border-gray-100 pt-6">
      <TouchableOpacity
        onPress={onPress}
        className="flex-row items-center justify-center rounded-2xl bg-[#0066FF] py-4 shadow-lg shadow-blue-200"
      >
        <Ionicons
          name={status === '0' ? 'send' : 'create'}
          size={20}
          color="white"
        />
        <Text className="ml-2 px-1 text-base font-bold text-white">
          {getLabel()}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export const AdminLaporanContent = ({
  report,
  user,
  regionNames,
  updateModalVisible,
  setUpdateModalVisible,
  handleUpdateSuccess,
}: {
  report: any;
  user: any;
  regionNames: { kecamatan: string; kelurahan: string };
  updateModalVisible: boolean;
  setUpdateModalVisible: (visible: boolean) => void;
  handleUpdateSuccess: () => void;
}) => {
  return (
    <View className="flex-1 bg-[#F8FAFC]">
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: 'Detail Laporan',
          headerTitleStyle: { fontWeight: 'bold', color: '#0B2347' },
          headerShadowVisible: false,
          headerStyle: { backgroundColor: '#F8FAFC' },
          headerTintColor: '#0B2347',
        }}
      />
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {(() => {
          const imgSource = getReportImageSource(report);
          return imgSource ? (
            <Image
              source={imgSource}
              className="h-64 w-full"
              contentFit="cover"
            />
          ) : (
            <View className="h-64 w-full items-center justify-center bg-gray-100">
              <Ionicons name="image-outline" size={64} color="#D1D5DB" />
            </View>
          );
        })()}
        <View className="-mt-6 flex-1 rounded-t-[32px] bg-white p-6 shadow-xl">
          <DetailHeader report={report} />
          <DetailInfoList report={report} regionNames={regionNames} />
          <ReportTimeline report={report} />

          <UpdateStatusSection
            status={report.status_laporan}
            onPress={() => setUpdateModalVisible(true)}
          />
        </View>
      </ScrollView>

      <UpdateStatusModal
        visible={updateModalVisible}
        onClose={() => setUpdateModalVisible(false)}
        onSuccess={handleUpdateSuccess}
        report={report}
        user={user}
      />
    </View>
  );
};

export default function Ignored() {
  return null;
}
