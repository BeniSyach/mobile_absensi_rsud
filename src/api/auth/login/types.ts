// types.ts
export type LoginVariables = {
  nik: number;
  password: string;
  device_token: string | null;
};

type Agama = {
  id_agama: string;
  kode_agama: string;
  nama_agama: string;
};

type Gelar = {
  id_gelar: string;
  kode_gelar: string;
  nama_gelar: string;
};

type GolonganRuang = {
  id_golongan_ruang: string;
  kode_golongan_ruang: string;
  nama_golongan_ruang: string;
};

type Jabatan = {
  id_jabatan: string;
  kode_jabatan: string;
  nama_jabatan: string;
};

type JenisPegawai = {
  id_jenis_pegawai: string;
  kode_jenis_pegawai: string;
  nama_jenis_pegawai: string;
};

type Pangkat = {
  id_pangkat: string;
  kode_pangkat: string;
  nama_pangkat: string;
};

type StatusKawin = {
  id_status_kawin: string;
  kode_status_kawin: string;
  nama_status_kawin: string;
};

type StatusPegawai = {
  id_status_pegawai: string;
  kode_status_pegawai: string;
  nama_status_pegawai: string;
};

type StrukturalFungsional = {
  id_struktural_fungsional: string;
  kode_struktural_fungsional: string;
  nama_struktural_fungsional: string;
};

type UnitKerja = {
  id_unit_kerja: string;
  kode_unit_kerja: string;
  latitude: string;
  longitude: string;
  nama_unit_kerja: string;
};

type Pegawai = {
  id_pegawai: string;
  nama: string;
  nik: number;
  nip: number;
  nip_lama: number;
  jenis_kelamin: string;
  alamat: string;
  tanggal_lahir: string;
  tempat_lahir: string;
  agama: Agama;
  agama_id: string;
  gelar_depan: Gelar;
  gelar_depan_id: string;
  gelar_belakang: Gelar;
  gelar_belakang_id: string;
  golongan_ruang: GolonganRuang;
  golongan_ruang_id: string;
  jabatan: Jabatan;
  jabatan_id: string;
  jenis_pegawai: JenisPegawai;
  jenis_pegawai_id: string;
  pangkat: Pangkat;
  pangkat_id: string;
  status_kawin: StatusKawin;
  status_kawin_id: string;
  status_pegawai: StatusPegawai;
  status_pegawai_id: string;
  struktural_fungsional: StrukturalFungsional;
  struktural_fungsional_id: string;
  unit_kerja: UnitKerja;
  unit_kerja_id: string;
  is_active: boolean;
  is_online: boolean;
  shift_absen_id: number;
  created_at: string;
  updated_at: string;
  created_user: string;
  updated_user: string;
  password: string;
  photo: string;
};

type Tokens = {
  access_token: string;
  refresh_token: string;
};

export type LoginResponse = {
  status: string;
  data: {
    data_pegawai: {
      code: string;
      data: Pegawai;
      message: string;
      status: string;
    };
    tokens: Tokens;
  };
};
