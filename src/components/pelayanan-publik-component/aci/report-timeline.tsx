import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { View } from 'react-native';

import { Text } from '@/components/ui/text';

const formatDate = (dateString: string | null) => {
  if (!dateString) return null;
  return new Date(dateString).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const TimelineItem = ({
  title,
  date,
  note,
  isLast,
  status, // 'pending', 'active', 'completed', 'rejected'
}: {
  title: string;
  date: string | null;
  note?: string | null;
  isLast?: boolean;
  status: 'pending' | 'active' | 'completed' | 'rejected';
}) => {
  let iconName: any = 'radio-button-off';
  let color = '#D1D5DB'; // Gray
  let bgColor = 'bg-gray-100';

  if (status === 'completed') {
    iconName = 'checkmark-circle';
    color = '#10B981'; // Green
    bgColor = 'bg-green-100';
  } else if (status === 'active') {
    iconName = 'time';
    color = '#3B82F6'; // Blue
    bgColor = 'bg-blue-100';
  } else if (status === 'rejected') {
    iconName = 'close-circle';
    color = '#EF4444'; // Red
    bgColor = 'bg-red-100';
  }

  return (
    <View className="flex-row">
      <View className="mr-4 items-center">
        <View
          className={`z-10 rounded-full border-2 border-white p-1 ${bgColor}`}
        >
          <Ionicons name={iconName} size={16} color={color} />
        </View>
        {!isLast && <View className="-my-1 w-0.5 flex-1 bg-gray-200" />}
      </View>
      <View className="flex-1 pb-6">
        <Text
          className={`text-sm font-bold ${
            status === 'pending' ? 'text-gray-400' : 'text-[#0B2347]'
          }`}
        >
          {title}
        </Text>
        {date && (
          <Text className="mt-0.5 text-xs text-gray-400">
            {formatDate(date)}
          </Text>
        )}
        {note && (
          <View className="mt-2 rounded-lg bg-gray-50 p-2">
            <Text className="text-xs italic text-gray-600">"{note}"</Text>
          </View>
        )}
      </View>
    </View>
  );
};

const addVerificationStep = (steps: any[], report: any) => {
  if (report.verif_tgl) {
    steps.push({
      title: 'Verifikasi Admin',
      date: report.verif_tgl,
      status: 'completed',
      note: report.verif_keterangan,
    });
  } else if (report.verif_tgl_tolak) {
    steps.push({
      title: 'Verifikasi Ditolak',
      date: report.verif_tgl_tolak,
      status: 'rejected',
      note: report.verif_keterangan_tolak || report.verif_keterangan,
    });
  } else {
    steps.push({
      title: 'Menunggu Verifikasi',
      date: null,
      status: 'active',
      note: null,
    });
  }
};

const addFollowUpSteps = (steps: any[], report: any) => {
  if (report.verif_tgl_tolak) return;

  // Disposition
  if (report.penerima_tgl) {
    steps.push({
      title: 'Disposisi ke Dinas',
      date: report.penerima_tgl,
      status: 'completed',
      note: report.penerima_keterangan,
    });
  } else if (report.verif_tgl) {
    steps.push({
      title: 'Menunggu Disposisi',
      date: null,
      status: 'active',
      note: null,
    });
  }

  // Handling
  if (report.penanganan_tgl) {
    steps.push({
      title: 'Sedang Ditangani',
      date: report.penanganan_tgl,
      status: 'completed',
      note: report.penanganan_keterangan,
    });
  } else if (report.penerima_tgl) {
    steps.push({
      title: 'Menunggu Penanganan',
      date: null,
      status: 'active',
      note: null,
    });
  }

  // Completion
  if (report.selesai_tgl) {
    steps.push({
      title: 'Laporan Selesai',
      date: report.selesai_tgl,
      status: 'completed',
      note: report.selesai_keterangan,
    });
  } else if (report.selesai_tgl_tolak) {
    steps.push({
      title: 'Penyelesaian Ditolak',
      date: report.selesai_tgl_tolak,
      status: 'rejected',
      note: report.selesai_keterangan_tolak,
    });
  } else if (report.penanganan_tgl) {
    steps.push({
      title: 'Proses Penyelesaian',
      date: null,
      status: 'active',
      note: null,
    });
  }
};

const useReportSteps = (report: any) => {
  const steps = [
    {
      title: 'Laporan Dibuat',
      date: report.created_at,
      status: 'completed',
      note: null,
    },
  ];

  addVerificationStep(steps, report);
  addFollowUpSteps(steps, report);

  return steps;
};

export const ReportTimeline = ({ report }: { report: any }) => {
  const steps = useReportSteps(report);

  return (
    <View className="my-6">
      <Text className="mb-4 text-base font-bold text-[#0B2347]">
        Riwayat Proses
      </Text>
      <View className="pl-2">
        {steps.map((step, index) => (
          <TimelineItem
            key={index}
            title={step.title}
            date={step.date}
            note={step.note}
            status={step.status as any}
            isLast={index === steps.length - 1}
          />
        ))}
      </View>
    </View>
  );
};
