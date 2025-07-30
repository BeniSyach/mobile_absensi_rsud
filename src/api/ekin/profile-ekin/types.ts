export type AtasanProfileEkin = {
  nik: string;
  nama: string;
  jabatan: string;
  pangkat: string;
};

export type DetailPegawaiDataEkin = {
  id: string;
  nik: string;
  nama: string;
  nip: string;
  nip_lama: string | null;
  photo: string;
  tanggal_lahir: string;
  tempat_lahir: string;
  alamat: string;
  jenis_kelamin: string;
  is_active: boolean;
  pangkat_id: string;
  nama_pangkat: string;
  unit_kerja_id: string;
  nama_unit_kerja: string;
  longitude_unit_kerja: string;
  latitude_unit_kerja: string;
  radius_unit_kerja: string;
  agama_id: string;
  nama_agama: string;
  gelar_belakang_id: string | null;
  nama_gelar_belakang: string | null;
  gelar_depan_id: string | null;
  nama_gelar_depan: string | null;
  golongan_ruang_id: string;
  nama_golongan_ruang: string;
  jabatan_id: string;
  nama_jabatan: string;
  jenis_pegawai_id: string;
  nama_jenis_pegawai: string;
  shift_absen_id: number;
  nama_shift_absen: string;
  status_kawin_id: string;
  nama_status_kawin: string;
  status_pegawai_id: string;
  nama_status_pegawai: string;
  struktural_fungsional_id: string;
  nama_struktural_fungsional: string;
  created_at: string;
  updated_at: string;
};

export type DetailPegawaiEkin = {
  status: number;
  message: string;
  data: DetailPegawaiDataEkin;
};

export type UserDataEkin = {
  id: number;
  nik: string;
  nama: string;
  role: number;
  role_label: string;
  unit_kerja: string;
  jabatan: string;
  pangkat: string;
  golongan: string;
  atasan: AtasanProfileEkin;
  detail_pegawai: DetailPegawaiEkin;
};
