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

export type PutPegawaiVariables = Partial<{
  nama: string;
  nip: string;
  nip_lama: string | null;
  photo: string;
  tanggal_lahir: string;
  tempat_lahir: string;
  alamat: string;
  jenis_kelamin: 'L' | 'P';
  is_active: boolean;
  pangkat_id: string;
  agama_id: string;
  gelar_belakang_id: string | null;
  gelar_depan_id: string | null;
  golongan_ruang_id: string;
  jabatan_id: string;
  jenis_pegawai_id: string;
  shift_absen_id: number;
  status_kawin_id: string;
  status_pegawai_id: string;
  struktural_fungsional_id: string;
  eselon_id: string | null;
  nik: string;
  atasan_id: string;
}>;

export type PutPegawaiResponse = {
  status: number;
  message: string;
  data: {
    id_pegawai: string;
    nik: string;
    password: string;
    nip: string;
    nip_lama: string;
    gelar_depan_id: string;
    gelar_depan: {
      id_gelar_depan: string;
      kode_gelar_depan: string;
      nama_gelar_depan: string;
    };
    nama: string;
    gelar_belakang_id: string;
    gelar_belakang: {
      id_gelar_belakang: string;
      kode_gelar_belakang: string;
      nama_gelar_belakang: string;
    };
    alamat: string;
    tempat_lahir: string;
    tanggal_lahir: string; // format: DD-MM-YYYY
    jenis_kelamin: 'L' | 'P';
    agama_id: string;
    agama: {
      id_agama: string;
      kode_agama: string;
      nama_agama: string;
    };
    status_kawin_id: string;
    status_kawin: {
      id_status_kawin: string;
      kode_status_kawin: string;
      nama_status_kawin: string;
    };
    jenis_pegawai_id: string;
    jenis_pegawai: {
      id_jenis_pegawai: string;
      kode_jenis_pegawai: string;
      nama_jenis_pegawai: string;
    };
    photo: string;
    status_pegawai_id: string;
    status_pegawai: {
      id_status_pegawai: string;
      kode_status_pegawai: string;
      nama_status_pegawai: string;
    };
    unit_kerja_id: string;
    unit_kerja: {
      id_unit_kerja: string;
      kode_unit_kerja: string;
      nama_unit_kerja: string;
      longitude: string;
      latitude: string;
      sub_unit_kerja: string;
      radius: number;
    };
    jabatan_id: string;
    jabatan: {
      id_jabatan: string;
      kode_jabatan: string;
      nama_jabatan: string;
    };
    pangkat_id: string;
    pangkat: {
      id_pangkat: string;
      kode_pangkat: string;
      nama_pangkat: string;
    };
    golongan_ruang_id: string;
    golongan_ruang: {
      id_golongan_ruang: string;
      kode_golongan_ruang: string;
      nama_golongan_ruang: string;
    };
    struktural_fungsional_id: string;
    struktural_fungsional: {
      id_struktural_fungsional: string;
      kode_struktural_fungsional: string;
      nama_struktural_fungsional: string;
    };
    shift_absen_id: number;
    is_active: boolean;
    device_token: string;
    created_at: string; // ISO datetime
    updated_at: string; // ISO datetime
    created_user: string;
    updated_user: string;
  };
};
