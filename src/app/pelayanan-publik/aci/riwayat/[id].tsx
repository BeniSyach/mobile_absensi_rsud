import { Ionicons } from '@expo/vector-icons';
import { Stack } from 'expo-router';
import React from 'react';
import {
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native';

import { AciAlert } from '@/components/pelayanan-publik-component/aci/aci-alert';
import { ReportTimeline } from '@/components/pelayanan-publik-component/aci/report-timeline';
import { Image } from '@/components/ui/image';
import { Text } from '@/components/ui/text';

import { getReportImageSource } from '../aci-service';
import { useRiwayatDetailLogic } from '../use-riwayat-detail-logic';

const StatusBadge = ({ status }: { status?: string | number }) => {
  const getStatusConfig = (s: string | number = '0') => {
    const safeStatus = (s === null || s === undefined ? '0' : s)
      .toString()
      .toLowerCase();

    // 0: Pengajuan (Draft/Submission)
    if (safeStatus === '0' || safeStatus === 'pending') {
      return {
        bg: 'bg-yellow-50',
        text: 'text-yellow-600',
        label: 'Pengajuan',
      };
    }
    // 1: Diterima (Received/Accepted)
    if (safeStatus === '1') {
      return { bg: 'bg-blue-50', text: 'text-blue-600', label: 'Diterima' };
    }
    // 2: Diverifikasi (Verified)
    if (safeStatus === '2') {
      return {
        bg: 'bg-indigo-50',
        text: 'text-indigo-600',
        label: 'Diverifikasi',
      };
    }
    // 3: Penanganan (Handling/In Progress)
    if (safeStatus === '3' || safeStatus === 'diproses') {
      return {
        bg: 'bg-purple-50',
        text: 'text-purple-600',
        label: 'Ditangani',
      };
    }
    // 4: Selesai (Completed)
    if (safeStatus === '4' || safeStatus === 'selesai') {
      return { bg: 'bg-green-50', text: 'text-green-600', label: 'Selesai' };
    }
    // 5: Ditolak (Rejected)
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

const InfoItem = ({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: any;
}) => (
  <View className="mb-6 flex-row">
    <View className="mr-4 size-10 items-center justify-center rounded-xl bg-blue-50">
      <Ionicons name={icon} size={20} color="#0066FF" />
    </View>
    <View className="flex-1">
      <Text className="mb-1 text-xs font-medium text-gray-400">{label}</Text>
      <Text className="text-base font-semibold text-[#0B2347]">{value}</Text>
    </View>
  </View>
);

const DetailHeader = ({ report }: { report: any }) => {
  // Determine effective status in case status_laporan is stale
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

const DeleteReportButton = ({
  onDelete,
  deleting,
}: {
  onDelete: () => void;
  deleting: boolean;
  isDeletable: boolean;
}) => {
  return (
    <TouchableOpacity
      onPress={onDelete}
      disabled={deleting}
      className={`flex-1 flex-row items-center justify-center rounded-xl py-4 ${
        deleting ? 'bg-red-300' : 'bg-red-50'
      }`}
    >
      {deleting ? (
        <ActivityIndicator size="small" color="#EF4444" />
      ) : (
        <>
          <Ionicons name="trash-outline" size={20} color="#EF4444" />
          <Text className="ml-2 font-bold text-red-500">Hapus</Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const UpdateReportButton = ({ onPress }: { onPress: () => void }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="flex-1 flex-row items-center justify-center rounded-xl bg-blue-50 py-4"
    >
      <Ionicons name="create-outline" size={20} color="#0066FF" />
      <Text className="ml-2 font-bold text-blue-600">Update</Text>
    </TouchableOpacity>
  );
};

const DetailInfoList = ({
  report,
  regionNames,
}: {
  report: any;
  regionNames: { kecamatan: string; kelurahan: string };
}) => (
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
    />
    {(regionNames.kecamatan || report.kecamatan_id) && (
      <InfoItem
        label="Kecamatan"
        value={`${regionNames.kecamatan || '-'}${
          regionNames.kelurahan ? `, ${regionNames.kelurahan}` : ''
        }`}
        icon="map-outline"
      />
    )}
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

const ReportActionButtons = ({
  report,
  onDelete,
  deleting,
  router,
}: {
  report: any;
  onDelete: () => void;
  deleting: boolean;
  router: any;
}) => {
  const s = String(report.status ?? report.status_laporan ?? '0');
  const status =
    report.selesai_tgl && !report.selesai_tgl_tolak
      ? '4'
      : report.selesai_tgl_tolak || report.verif_tgl_tolak
        ? '5'
        : s;

  // Show both buttons ONLY for 'Pengajuan' (0) or 'Ditolak' (5)
  const isActionable =
    status === '0' ||
    status === 'pending' ||
    status === '5' ||
    status === 'ditolak';

  if (!isActionable) return null;

  return (
    <View className="mt-8 flex-row gap-3 border-t border-gray-100 pt-8">
      <UpdateReportButton
        onPress={() =>
          router.push(`/pelayanan-publik/aci/riwayat/edit/${report.id}`)
        }
      />
      <DeleteReportButton onDelete={onDelete} deleting={deleting} isDeletable />
    </View>
  );
};

// Removed PengajuanActionButtons as it is now redundant with the unified ReportActionButtons

const DetailContent = ({
  report,
  regionNames,
  onDelete,
  deleting,
  router,
}: {
  report: any;
  regionNames: { kecamatan: string; kelurahan: string };
  onDelete: () => void;
  deleting: boolean;
  router: any;
}) => {
  return (
    <>
      <DetailHeader report={report} />
      <DetailInfoList report={report} regionNames={regionNames} />
      <ReportTimeline report={report} />
      <ReportActionButtons
        report={report}
        onDelete={onDelete}
        deleting={deleting}
        router={router}
      />
    </>
  );
};

export default function RiwayatDetail() {
  const logic = useRiwayatDetailLogic();
  if (logic.loading)
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#0066FF" />
      </View>
    );
  if (!logic.report)
    return (
      <View className="flex-1 items-center justify-center bg-white p-6">
        <Ionicons name="alert-circle-outline" size={64} color="#EF4444" />
        <Text className="mt-4 text-lg font-bold text-[#0B2347]">
          Laporan Tidak Ditemukan
        </Text>
        <Text className="mt-2 text-center text-gray-500">
          Maaf, data laporan tidak dapat ditemukan.
        </Text>
        <TouchableOpacity
          onPress={() => logic.router.back()}
          className="mt-6 rounded-full bg-[#0066FF] px-8 py-3"
        >
          <Text className="font-bold text-white">Kembali</Text>
        </TouchableOpacity>
      </View>
    );
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
          const imgSource = getReportImageSource(logic.report);
          console.log('Detail Generated Image Source:', imgSource);
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
          <DetailContent
            report={logic.report}
            regionNames={logic.regionNames}
            onDelete={logic.handleDelete}
            deleting={logic.deleting}
            router={logic.router}
          />
        </View>
      </ScrollView>
      <AciAlert {...logic.alertConfig} />
    </View>
  );
}
