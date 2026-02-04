import { aciClient } from './aci-service';

export interface AciUpdateLaporanStatusPayload {
  status_laporan: number;
  upt_id?: number | string;
  penerima_keterangan?: string;
  penerima_keterangan_tolak?: string;
  verif_keterangan?: string;
  verif_keterangan_tolak?: string;
  verif_file?: any; // File
  penanganan_keterangan?: string;
  penanganan_keterangan_tolak?: string;
  selesai_keterangan?: string;
  selesai_keterangan_tolak?: string;
  selesai_file?: any; // File
}

const createFormData = (data: AciUpdateLaporanStatusPayload): FormData => {
  const formData = new FormData();
  formData.append('status_laporan', data.status_laporan.toString());

  const optionalFields: (keyof AciUpdateLaporanStatusPayload)[] = [
    'penerima_keterangan',
    'penerima_keterangan_tolak',
    'verif_keterangan',
    'verif_keterangan_tolak',
    'penanganan_keterangan',
    'penanganan_keterangan_tolak',
    'selesai_keterangan',
    'selesai_keterangan_tolak',
  ];

  optionalFields.forEach((field) => {
    const value = data[field];
    if (value && typeof value === 'string') {
      formData.append(field, value);
    }
  });

  if (data.upt_id) {
    formData.append('upt_id', data.upt_id.toString());
  }

  if (data.verif_file) {
    formData.append('verif_file', data.verif_file);
  }

  if (data.selesai_file) {
    formData.append('selesai_file', data.selesai_file);
  }

  return formData;
};

export const updateAciLaporanStatus = async (
  token: string,
  id: string | number,
  data: AciUpdateLaporanStatusPayload
): Promise<any> => {
  try {
    const formData = createFormData(data);

    const response = await aciClient.post(
      `/api/laporan/update-status/${id}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    return response.data;
  } catch (error: any) {
    console.error('Update Laporan Status error:', error.message);
    const message =
      error.response?.data?.message ||
      error.message ||
      'Update status laporan failed';
    throw new Error(message);
  }
};

export default function Ignored() {
  return null;
}
