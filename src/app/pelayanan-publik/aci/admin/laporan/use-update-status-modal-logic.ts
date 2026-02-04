import * as ImagePicker from 'expo-image-picker';
import { useEffect, useState } from 'react';
import { Alert } from 'react-native';

import { getItem } from '@/lib/storage';

import { getAciUpts } from '../../aci-service';
import {
  type AciUpdateLaporanStatusPayload,
  updateAciLaporanStatus,
} from '../../aci-service-update-status';
import { compressImageIfNeeded } from '../../utils/image-utils';

interface UseUpdateStatusLogicProps {
  reportId: string | number;
  user: any;
  currentStatus: number;
  visible: boolean;
  onSuccess: () => void;
  onClose: () => void;
  showAlert: (config: any) => void;
}

const validateUpdateForm = (params: {
  selectedStatus: number | null;
  message: string;
  selectedUptId: number | null;
  file: any;
  showAlert: (config: any) => void;
}) => {
  const { selectedStatus, message, selectedUptId, file, showAlert } = params;
  if (!message.trim()) {
    showAlert({
      type: 'error',
      title: 'Input Tidak Lengkap',
      message: 'Keterangan/Catatan wajib diisi',
    });
    return false;
  }

  if (selectedStatus === 1 && !selectedUptId) {
    showAlert({
      type: 'error',
      title: 'Input Tidak Lengkap',
      message: 'Silakan pilih UPT terlebih dahulu',
    });
    return false;
  }

  if ((selectedStatus === 2 || selectedStatus === 4) && !file) {
    showAlert({
      type: 'error',
      title: 'Input Tidak Lengkap',
      message: 'Foto bukti wajib dilampirkan',
    });
    return false;
  }

  return true;
};

export const useUpdateStatusLogic = (props: UseUpdateStatusLogicProps) => {
  const {
    reportId,
    user,
    currentStatus,
    visible,
    onSuccess,
    onClose,
    showAlert,
  } = props;
  const state = useStatusState(visible, currentStatus);
  const { selectedStatus, setLoading, file, setFile } = state;

  const handlePickDocument = async () => {
    const pickedFile = await pickImageFromCameraHelper();
    if (pickedFile) setFile(pickedFile);
  };

  const handleSubmit = async () => {
    if (selectedStatus === null) return;

    const isValid = validateUpdateForm({
      selectedStatus,
      message: state.message,
      selectedUptId: state.selectedUptId,
      file,
      showAlert,
    });

    if (!isValid) return;

    setLoading(true);
    await processStatusUpdate({
      reportId,
      selectedStatus,
      message: state.message,
      rejectStage: state.rejectStage,
      file,
      user,
      selectedUptId: state.selectedUptId,
      onSuccess,
      onClose,
      showAlert,
    })
      .catch((error) => {
        console.error('Update status failed', error);
        showAlert({
          type: 'error',
          title: 'Gagal',
          message: 'Gagal mengupdate status laporan',
        });
      })
      .finally(() => setLoading(false));
  };

  return { ...state, handlePickDocument, handleSubmit };
};

const useStatusState = (visible: boolean, currentStatus: number) => {
  const [selectedStatus, setSelectedStatus] = useState<number | null>(null);
  const [message, setMessage] = useState('');
  const [rejectStage, setRejectStage] = useState('verif');
  const [file, setFile] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [upts, setUpts] = useState<any[]>([]);
  const [selectedUptId, setSelectedUptId] = useState<number | null>(null);

  useResetStatusForm({
    visible,
    currentStatus,
    setSelectedStatus,
    setMessage,
    setRejectStage,
    setFile,
    setSelectedUptId,
    setUpts,
  });

  return {
    selectedStatus,
    setSelectedStatus,
    message,
    setMessage,
    rejectStage,
    setRejectStage,
    file,
    setFile,
    loading,
    setLoading,
    upts,
    setUpts,
    selectedUptId,
    setSelectedUptId,
  };
};

const processStatusUpdate = async (params: any) => {
  const {
    reportId,
    selectedStatus,
    message,
    rejectStage,
    file,
    user,
    selectedUptId,
    onSuccess,
    onClose,
  } = params;

  await submitStatusUpdate({
    reportId,
    selectedStatus,
    message,
    rejectStage,
    file,
    user,
    uptId: selectedUptId,
  });

  onSuccess();
  onClose();
};

const useResetStatusForm = (params: any) => {
  const {
    visible,
    currentStatus,
    setSelectedStatus,
    setMessage,
    setRejectStage,
    setFile,
    setSelectedUptId,
    setUpts,
  } = params;

  useEffect(() => {
    if (visible) {
      setSelectedStatus(null);
      setMessage('');
      setRejectStage('verif');
      setFile(null);
      setSelectedUptId(null);
      if (currentStatus === 0) {
        const token = getItem<string>('aci_token');
        if (token) {
          getAciUpts(token, { per_page: 100 })
            .then((res) => setUpts(res.data || []))
            .catch(console.error);
        }
      }
    }
  }, [
    visible,
    currentStatus,
    setSelectedStatus,
    setMessage,
    setRejectStage,
    setFile,
    setSelectedUptId,
    setUpts,
  ]);
};

const submitStatusUpdate = async (params: any) => {
  const { reportId, selectedStatus, message, rejectStage, file, user, uptId } =
    params;
  const token = getItem<string>('aci_token');
  if (!token) throw new Error('No token found');

  const payload = buildUpdateStatusPayload({
    status: selectedStatus,
    message,
    rejectStage,
    file,
    user,
    uptId,
  });
  await updateAciLaporanStatus(token, reportId, payload);
};

const pickImageFromCameraHelper = async () => {
  try {
    const perm = await ImagePicker.requestCameraPermissionsAsync();
    if (perm.status !== 'granted') {
      Alert.alert(
        'Izin Ditolak',
        'Aplikasi membutuhkan izin kamera untuk mengambil foto.'
      );
      return null;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });

    if (result.canceled) return null;
    const asset = result.assets[0];

    const { uri, fileSize } = await compressImageIfNeeded(asset);

    return {
      uri,
      name: asset.fileName || 'camera-capture.jpg',
      type: asset.mimeType || 'image/jpeg',
      fileSize,
    };
  } catch (err) {
    console.log('Pick image error', err);
    return null;
  }
};

interface BuildPayloadParams {
  status: number;
  message: string;
  rejectStage: string;
  file: any;
  user: any;
  uptId?: number | null;
}

const buildUpdateStatusPayload = ({
  status,
  message,
  rejectStage,
  file,
  _user,
  uptId,
}: BuildPayloadParams & { _user?: any }): AciUpdateLaporanStatusPayload => {
  const payload: AciUpdateLaporanStatusPayload = {
    status_laporan: status,
  };

  if (status === 1) {
    payload.penerima_keterangan = message;
    if (uptId) payload.upt_id = uptId;
  } else if (status === 2) {
    payload.verif_keterangan = message;
    if (file) payload.verif_file = file;
  } else if (status === 3) {
    payload.penanganan_keterangan = message;
  } else if (status === 4) {
    payload.selesai_keterangan = message;
    if (file) payload.selesai_file = file;
  } else if (status === 5) {
    if (rejectStage === 'penerima') payload.penerima_keterangan_tolak = message;
    if (rejectStage === 'verif') payload.verif_keterangan_tolak = message;
    if (rejectStage === 'penanganan')
      payload.penanganan_keterangan_tolak = message;
    if (rejectStage === 'selesai') payload.selesai_keterangan_tolak = message;
  }

  return payload;
};

export default function Ignored() {
  return null;
}
