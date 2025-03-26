type Agama = {
  id_agama: string;
  kode_agama: string;
  nama_agama: string;
};

type Gelar = {
  id_gelar_belakang?: string;
  kode_gelar_belakang?: string;
  nama_gelar_belakang?: string;
  id_gelar_depan?: string;
  kode_gelar_depan?: string;
  nama_gelar_depan?: string;
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
  agama: Agama;
  agama_id: string;
  alamat: string;
  created_at: string;
  created_user: string;
  gelar_belakang?: Gelar;
  gelar_belakang_id?: string;
  gelar_depan?: Gelar;
  gelar_depan_id?: string;
  golongan_ruang: GolonganRuang;
  golongan_ruang_id: string;
  id_pegawai: string;
  is_active: boolean;
  is_online: boolean;
  jabatan: Jabatan;
  jabatan_id: string;
  jenis_kelamin: string;
  jenis_pegawai: JenisPegawai;
  jenis_pegawai_id: string;
  nama: string;
  nik: number;
  nip: number;
  nip_lama: number;
  pangkat: Pangkat;
  pangkat_id: string;
  password: string;
  photo: string;
  shift_absen_id: number;
  status_kawin: StatusKawin;
  status_kawin_id: string;
  status_pegawai: StatusPegawai;
  status_pegawai_id: string;
  struktural_fungsional: StrukturalFungsional;
  struktural_fungsional_id: string;
  tanggal_lahir: string;
  tempat_lahir: string;
  unit_kerja: UnitKerja;
  unit_kerja_id: string;
  updated_at: string;
  updated_user: string;
};

type DataItem = {
  alamat: string;
  created_at: string;
  created_user: string;
  hidup: string;
  id_orang_tua: string;
  nama: string;
  nik: number;
  pegawai: Pegawai;
  status_keluarga: string;
  tempat_lahir: string;
  tgl_lahir: string;
  updated_at: string;
  updated_user: string;
};

export type OrangTuaResponse = {
  status: string;
  data: {
    code: string;
    data: DataItem[];
    message: string;
    status: string;
  };
};
