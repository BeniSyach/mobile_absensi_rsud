import { GetDivisi, GetGender, GetStatus } from '@/api';

export const useFormOptions = () => {
  const { data: divisiData, isLoading: divisiLoading } = GetDivisi();
  const { data: genderData, isLoading: genderLoading } = GetGender();
  const { data: statusData, isLoading: statusLoading } = GetStatus();

  const divisiOptions =
    divisiData?.map((item) => ({
      value: item.id,
      label: item.nama_divisi,
    })) || [];

  const genderOptions =
    genderData?.map((item) => ({
      value: item.id,
      label: item.nama_gender,
    })) || [];

  const statusOptions =
    statusData?.map((item) => ({
      value: item.id,
      label: item.nama_status,
    })) || [];

  return {
    divisiOptions,
    genderOptions,
    statusOptions,
    divisiPlaceholder: divisiLoading ? 'Memuat Divisi...' : 'Pilih Divisi',
    genderPlaceholder: genderLoading
      ? 'Memuat Jenis Kelamin...'
      : 'Pilih Jenis Kelamin',
    statusPlaceholder: statusLoading
      ? 'Memuat Status Kepegawaian...'
      : 'Pilih Status Kepegawaian',
  };
};
