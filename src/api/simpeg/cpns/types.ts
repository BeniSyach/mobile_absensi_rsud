type Agama = {
  id_agama: string;
  kode_agama: string;
  nama_agama: string;
};

type Gelar = {
  id_gelar_depan?: string;
  kode_gelar_depan?: string;
  nama_gelar_depan?: string;
  id_gelar_belakang?: string;
  kode_gelar_belakang?: string;
  nama_gelar_belakang?: string;
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
  nama_unit_kerja: string;
  latitude: string;
  longitude: string;
};

type Pegawai = {
  id_pegawai: string;
  nik: number;
  nip: number;
  nip_lama: number;
  nama: string;
  tempat_lahir: string;
  tanggal_lahir: string;
  jenis_kelamin: string;
  alamat: string;
  photo: string;
  password: string;
  shift_absen_id: number;
  is_active: boolean;
  is_online: boolean;
  agama_id: string;
  agama: Agama;
  gelar_depan_id: string;
  gelar_depan: Gelar;
  gelar_belakang_id: string;
  gelar_belakang: Gelar;
  golongan_ruang_id: string;
  golongan_ruang: GolonganRuang;
  jabatan_id: string;
  jabatan: Jabatan;
  jenis_pegawai_id: string;
  jenis_pegawai: JenisPegawai;
  pangkat_id: string;
  pangkat: Pangkat;
  status_kawin_id: string;
  status_kawin: StatusKawin;
  status_pegawai_id: string;
  status_pegawai: StatusPegawai;
  struktural_fungsional_id: string;
  struktural_fungsional: StrukturalFungsional;
  unit_kerja_id: string;
  unit_kerja: UnitKerja;
  created_at: string;
  created_user: string;
  updated_at: string;
  updated_user: string;
};

type CPNSData = {
  golongan_ruang: string;
  id_cpns: string;
  nik: number;
  nomor_sk_cpns: string;
  pegawai: Pegawai;
  tgl_sk_cpns: string;
  tmt_cpns: string;
};

type APIData = {
  code: string;
  data: CPNSData;
  message: string;
  status: string;
};

export type CpnsResponse = {
  status: string;
  data: APIData;
};
