import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
  ActivityIndicator,
  ScrollView,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { Text } from '@/components/ui/text';

interface ModalHeaderProps {
  title: string;
  onClose: () => void;
}

export const ModalHeader = ({ title, onClose }: ModalHeaderProps) => (
  <View className="flex-row items-center justify-between border-b border-gray-100 p-6">
    <Text className="text-xl font-bold text-[#0B2347]">{title}</Text>
    <TouchableOpacity onPress={onClose}>
      <Ionicons name="close" size={24} color="#9CA3AF" />
    </TouchableOpacity>
  </View>
);

interface ModalFooterProps {
  loading: boolean;
  disabled: boolean;
  onPress: () => void;
  label: string;
}

export const ModalFooter = ({
  loading,
  disabled,
  onPress,
  label,
}: ModalFooterProps) => (
  <View className="border-t border-gray-100 bg-white p-6 pb-12">
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      className={`items-center justify-center rounded-2xl py-4 shadow-sm ${
        disabled ? 'bg-gray-300' : 'bg-[#0066FF]'
      }`}
    >
      {loading ? (
        <ActivityIndicator color="white" />
      ) : (
        <Text className="text-lg font-bold text-white">{label}</Text>
      )}
    </TouchableOpacity>
  </View>
);

export const statusOptions = [
  { id: 1, label: 'Terima', color: 'bg-blue-500' },
  { id: 2, label: 'Verifikasi', color: 'bg-indigo-500' },
  { id: 3, label: 'Penanganan', color: 'bg-purple-500' },
  { id: 4, label: 'Selesai', color: 'bg-green-500' },
  { id: 5, label: 'Tolak', color: 'bg-red-500' },
];

export const rejectStages = [
  { id: 'penerima', label: 'Tahap Penerimaan' },
  { id: 'verif', label: 'Tahap Verifikasi' },
  { id: 'penanganan', label: 'Tahap Penanganan' },
  { id: 'selesai', label: 'Tahap Penyelesaian' },
];

export const StatusStepper = ({ currentStatus }: { currentStatus: number }) => {
  const steps = [
    { id: 0, label: 'Pengajuan' },
    { id: 1, label: 'Terima' },
    { id: 2, label: 'Verifikasi' },
    { id: 3, label: 'Penanganan' },
    { id: 4, label: 'Selesai' },
  ];

  return (
    <View className="mb-6">
      <View className="flex-row items-center justify-between">
        {steps.map((step, index) => {
          const isCompleted = currentStatus >= step.id;
          const isCurrent = currentStatus === step.id;
          const isNext = currentStatus + 1 === step.id;

          return (
            <View key={step.id} className="flex-1 items-center">
              <View className="w-full flex-row items-center">
                <View
                  className={`z-10 size-8 items-center justify-center rounded-full border-2 ${
                    isCompleted || isNext
                      ? 'border-blue-500 bg-blue-500'
                      : 'border-gray-200 bg-white'
                  }`}
                >
                  {isCompleted || isNext ? (
                    <Ionicons
                      name={
                        isContext(step.id, currentStatus)
                          ? 'radio-button-on'
                          : 'checkmark'
                      }
                      size={16}
                      color="white"
                    />
                  ) : (
                    <Text className="text-xs text-gray-400">{step.id + 1}</Text>
                  )}
                </View>
                {index < steps.length - 1 && (
                  <View
                    className={`h-[2px] flex-1 ${
                      currentStatus > step.id ? 'bg-blue-500' : 'bg-gray-200'
                    }`}
                  />
                )}
              </View>
              <Text
                className={`mt-1 text-[10px] font-medium ${
                  isCurrent ? 'text-blue-600' : 'text-gray-400'
                }`}
                numberOfLines={1}
              >
                {step.label}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
};

function isContext(stepId: number, currentId: number) {
  return stepId === currentId + 1;
}

interface StatusSelectionProps {
  selectedStatus: number | null;
  currentStatus: number;
  onSelect: (id: number) => void;
}

const NextStatusCard = ({
  status,
  selectedStatus,
  onSelect,
}: {
  status: any;
  selectedStatus: number | null;
  onSelect: (id: number) => void;
}) => (
  <TouchableOpacity
    onPress={() => onSelect(status.id)}
    className={`flex-row items-center justify-between rounded-xl border p-4 ${
      selectedStatus === status.id
        ? 'border-blue-500 bg-blue-50'
        : 'border-gray-200 bg-white'
    }`}
  >
    <View className="flex-row items-center">
      <View
        className={`size-10 items-center justify-center rounded-full ${
          selectedStatus === status.id ? 'bg-blue-100' : 'bg-gray-100'
        }`}
      >
        <Ionicons
          name="arrow-forward"
          size={20}
          color={selectedStatus === status.id ? '#3B82F6' : '#6B7280'}
        />
      </View>
      <View className="ml-3">
        <Text className="font-bold text-gray-800">
          Lanjutkan ke {status.label}
        </Text>
        <Text className="text-xs text-gray-500">
          Proses ke tahap selanjutnya
        </Text>
      </View>
    </View>
    {selectedStatus === status.id && (
      <Ionicons name="checkmark-circle" size={24} color="#3B82F6" />
    )}
  </TouchableOpacity>
);

const RejectStatusCard = ({
  selectedStatus,
  onSelect,
}: {
  selectedStatus: number | null;
  onSelect: (id: number) => void;
}) => (
  <TouchableOpacity
    onPress={() => onSelect(5)}
    className={`flex-row items-center justify-between rounded-xl border p-4 ${
      selectedStatus === 5
        ? 'border-red-500 bg-red-50'
        : 'border-gray-200 bg-white'
    }`}
  >
    <View className="flex-row items-center">
      <View
        className={`size-10 items-center justify-center rounded-full ${
          selectedStatus === 5 ? 'bg-red-100' : 'bg-gray-100'
        }`}
      >
        <Ionicons
          name="close"
          size={20}
          color={selectedStatus === 5 ? '#EF4444' : '#6B7280'}
        />
      </View>
      <View className="ml-3">
        <Text
          className={`font-bold ${selectedStatus === 5 ? 'text-red-700' : 'text-gray-800'}`}
        >
          Tolak Laporan
        </Text>
        <Text className="text-xs text-gray-500">
          Batalkan proses laporan ini
        </Text>
      </View>
    </View>
    {selectedStatus === 5 && (
      <Ionicons name="checkmark-circle" size={24} color="#EF4444" />
    )}
  </TouchableOpacity>
);

const checkRoleAccess = (user: any, currentStatus: number) => {
  if (!user || !user.roles) return false;
  const roles = user.roles.map((r: any) => r.name.toLowerCase());

  if (currentStatus === 0)
    return roles.includes('superadmin') || roles.includes('admin');
  if (currentStatus === 1) return roles.includes('upt');
  if (currentStatus === 2 || currentStatus === 3) return roles.includes('sda');

  return false;
};

export const StatusSelection = ({
  selectedStatus,
  currentStatus,
  onSelect,
  user,
}: StatusSelectionProps & { user: any }) => {
  const nextStep = statusOptions.find((s) => s.id === currentStatus + 1);
  const canReject = currentStatus < 4;
  const hasAccess = checkRoleAccess(user, currentStatus);

  if (currentStatus >= 4) {
    return (
      <View className="mb-4 rounded-xl bg-green-50 p-4">
        <Text className="text-center font-bold text-green-700">
          Laporan Selesai
        </Text>
      </View>
    );
  }

  if (!hasAccess) {
    return (
      <View className="mb-4 rounded-xl bg-orange-50 p-4">
        <Text className="text-center text-sm font-medium text-orange-700">
          Hanya role yang berwenang yang dapat melanjutkan status ini.
        </Text>
      </View>
    );
  }

  return (
    <View className="gap-3">
      {nextStep && (
        <NextStatusCard
          status={nextStep}
          selectedStatus={selectedStatus}
          onSelect={onSelect}
        />
      )}

      {canReject && (
        <RejectStatusCard selectedStatus={selectedStatus} onSelect={onSelect} />
      )}
    </View>
  );
};

interface RejectStageSelectionProps {
  visible: boolean;
  rejectStage: string;
  onSelect: (id: string) => void;
}

export const RejectStageSelection = ({
  visible,
  rejectStage,
  onSelect,
}: RejectStageSelectionProps) => {
  if (!visible) return null;
  return (
    <View className="mt-4">
      <Text className="mb-2 text-sm font-bold text-gray-600">
        Ditolak pada Tahap:
      </Text>
      <View className="flex-row flex-wrap gap-2">
        {rejectStages.map((stage) => (
          <TouchableOpacity
            key={stage.id}
            onPress={() => onSelect(stage.id)}
            className={`rounded-xl border px-3 py-2 ${
              rejectStage === stage.id
                ? 'border-red-500 bg-red-50'
                : 'border-gray-200 bg-white'
            }`}
          >
            <Text
              className={`text-xs ${
                rejectStage === stage.id
                  ? 'font-bold text-red-500'
                  : 'text-gray-500'
              }`}
            >
              {stage.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

interface ReasonInputProps {
  selectedStatus: number | null;
  message: string;
  onChangeText: (text: string) => void;
  onFocus?: () => void;
}

export const ReasonInput = ({
  selectedStatus,
  message,
  onChangeText,
  onFocus,
}: ReasonInputProps) => {
  if (selectedStatus === null) return null;
  return (
    <View className="mt-6">
      <Text className="mb-2 text-sm font-bold text-[#0B2347]">
        {selectedStatus === 5 ? 'Alasan Penolakan' : 'Keterangan / Catatan'}
      </Text>
      <View className="rounded-2xl border border-gray-200 bg-gray-50 p-3">
        <TextInput
          multiline
          numberOfLines={4}
          placeholder="Tulis keterangan di sini..."
          className="h-24 text-base text-gray-800"
          textAlignVertical="top"
          value={message}
          onChangeText={onChangeText}
          onFocus={onFocus}
        />
      </View>
    </View>
  );
};

interface FileUploadProps {
  visible: boolean;
  file: any;
  onPick: () => void;
  onClear: () => void;
}

export const FileUpload = ({
  visible,
  file,
  onPick,
  onClear,
  label,
}: FileUploadProps & { label?: string }) => {
  if (!visible) return null;
  return (
    <View className="mt-4">
      <Text className="mb-2 text-sm font-bold text-[#0B2347]">
        {label || 'File Verifikasi (Wajib)'}
      </Text>
      <TouchableOpacity
        onPress={onPick}
        className="flex-row items-center rounded-xl border border-dashed border-gray-300 bg-gray-50 p-4"
      >
        <Ionicons name={file ? 'image' : 'camera'} size={24} color="#0066FF" />
        <View className="ml-3 flex-1">
          <Text className="font-semibold text-gray-700">
            {file ? file.name : 'Ambil Foto'}
          </Text>
          {!file && (
            <Text className="text-xs text-gray-400">
              Ambil foto bukti penanganan
            </Text>
          )}
        </View>
        {file && (
          <TouchableOpacity onPress={onClear}>
            <Ionicons name="close-circle" size={20} color="#EF4444" />
          </TouchableOpacity>
        )}
      </TouchableOpacity>
    </View>
  );
};

export const UptSelector = ({ upts, selectedId, onSelect, visible }: any) => {
  if (!visible) return null;
  return (
    <View className="mt-4">
      <Text className="mb-2 text-sm font-bold text-[#0B2347]">Pilih UPT</Text>
      <View className="flex-row flex-wrap gap-2">
        {upts.map((upt: any) => (
          <TouchableOpacity
            key={upt.id}
            onPress={() => onSelect(upt.id)}
            className={`rounded-xl border px-3 py-2 ${
              selectedId === upt.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 bg-white'
            }`}
          >
            <Text
              className={`text-xs ${
                selectedId === upt.id
                  ? 'font-bold text-blue-500'
                  : 'text-gray-500'
              }`}
            >
              {upt.nama_upt}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

interface UpdateStatusFormProps {
  selectedStatus: number | null;
  currentStatus: number;
  setSelectedStatus: (status: number) => void;
  rejectStage: string;
  setRejectStage: (stage: string) => void;
  message: string;
  setMessage: (message: string) => void;
  file: any;
  handlePickDocument: () => void;
  setFile: (file: any) => void;
}

const FinalFields = ({
  selectedStatus,
  upts,
  selectedUptId,
  setSelectedUptId,
  rejectStage,
  setRejectStage,
  file,
  handlePickDocument,
  setFile,
}: any) => {
  return (
    <>
      <UptSelector
        visible={selectedStatus === 1}
        upts={upts}
        selectedId={selectedUptId}
        onSelect={setSelectedUptId}
      />

      <RejectStageSelection
        visible={selectedStatus === 5}
        rejectStage={rejectStage}
        onSelect={setRejectStage}
      />

      <FileUpload
        visible={selectedStatus === 2 || selectedStatus === 4}
        file={file}
        onPick={handlePickDocument}
        onClear={() => setFile(null)}
        label={
          selectedStatus === 4
            ? 'Foto Penyelesaian (Wajib)'
            : 'File Verifikasi (Wajib)'
        }
      />
    </>
  );
};

const useAutoScrollToEnd = (
  scrollViewRef: React.RefObject<ScrollView>,
  deps: any[]
) => {
  React.useEffect(() => {
    // Scroll only if needed or keep it empty to debug jumping
    /*
    if (deps[0] !== null) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 300);
    }
    */
  }, [deps, scrollViewRef]);
};

const StatusOptionsFields = ({
  currentStatus,
  selectedStatus,
  setSelectedStatus,
  user,
}: any) => {
  return (
    <>
      <StatusStepper currentStatus={currentStatus} />
      <Text className="mb-3 text-sm font-bold text-gray-600">
        Opsi Tindakan
      </Text>
      <StatusSelection
        selectedStatus={selectedStatus}
        currentStatus={currentStatus}
        onSelect={setSelectedStatus}
        user={user}
      />
    </>
  );
};

const FormBody = ({
  selectedStatus,
  upts,
  selectedUptId,
  setSelectedUptId,
  rejectStage,
  setRejectStage,
  file,
  handlePickDocument,
  setFile,
  message,
  setMessage,
  onFocus,
}: any) => {
  return (
    <>
      <FinalFields
        selectedStatus={selectedStatus}
        upts={upts}
        selectedUptId={selectedUptId}
        setSelectedUptId={setSelectedUptId}
        rejectStage={rejectStage}
        setRejectStage={setRejectStage}
        file={file}
        handlePickDocument={handlePickDocument}
        setFile={setFile}
      />
      <ReasonInput
        selectedStatus={selectedStatus}
        message={message}
        onChangeText={setMessage}
        onFocus={onFocus}
      />
    </>
  );
};

export const UpdateStatusForm = ({
  selectedStatus,
  currentStatus,
  setSelectedStatus,
  rejectStage,
  setRejectStage,
  message,
  setMessage,
  file,
  handlePickDocument,
  setFile,
  user,
  upts,
  selectedUptId,
  setSelectedUptId,
}: UpdateStatusFormProps & {
  user: any;
  upts: any[];
  selectedUptId: number | null;
  setSelectedUptId: (id: number) => void;
}) => {
  const scrollViewRef = React.useRef<ScrollView>(null);
  useAutoScrollToEnd(scrollViewRef, [
    selectedStatus,
    file,
    selectedUptId,
    rejectStage,
  ]);

  return (
    <ScrollView
      ref={scrollViewRef}
      className="flex-1 px-6 pt-0"
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={{ paddingBottom: 200 }}
      showsVerticalScrollIndicator={false}
    >
      <StatusOptionsFields
        currentStatus={currentStatus}
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
        user={user}
      />
      <FormBody
        selectedStatus={selectedStatus}
        upts={upts}
        selectedUptId={selectedUptId}
        setSelectedUptId={setSelectedUptId}
        rejectStage={rejectStage}
        setRejectStage={setRejectStage}
        file={file}
        handlePickDocument={handlePickDocument}
        setFile={setFile}
        message={message}
        setMessage={setMessage}
        onFocus={() => {
          setTimeout(
            () => scrollViewRef.current?.scrollTo({ y: 350, animated: true }),
            100
          );
        }}
      />
    </ScrollView>
  );
};

export default function Ignored() {
  return null;
}
