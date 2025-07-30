export interface PegawaiResponse {
  status: number;
  message: string;
  data: Pegawai[];
  pagination: PegawaiPagination;
}

export interface Pegawai {
  id: string;
  nik: string;
  nama: string;
  nip: string | null;
  nip_lama: string | null;
  photo: string | null;
  tanggal_lahir: string; // Format bisa "DD-MM-YYYY" atau "YYYY-MM-DD"
  tempat_lahir: string;
  alamat: string;
  jenis_kelamin: 'L' | 'P';
  is_active: boolean;

  pangkat_id: string | null;
  nama_pangkat: string | null;

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

  golongan_ruang_id: string | null;
  nama_golongan_ruang: string | null;

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
}

export interface PegawaiPagination {
  total: number;
  page: number;
  limit: number;
  last_page: number;
}
