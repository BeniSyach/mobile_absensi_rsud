export interface SisaCutiItem {
  id: number;
  nik: string;
  tahun: number | string;
  kode_jenis_cuti: string;

  saldo_awal: number | string;
  saldo_terpakai: number | string;
  saldo_sisa: number | string;
  carry_over: number | string;

  deleted_at: string | null;
  created_at: string; // ISO datetime
  updated_at: string; // ISO datetime
}

export interface SisaCutiResponse {
  status: number;
  message: string;
  data: {
    cuti_id: number;
    level_verifikasi: number;
    keputusan: string;
    status: string;
  };
}

export interface VerifCutiResponse {
  message: string;
  data: SisaCutiItem[];
}

export interface PostCutiSaldoVariables {
  nik: string;
  sisa_cuti_2023: number;
  sisa_cuti_2024: number;
  sisa_cuti_2025: number;
}

export interface ExistsResponse {
  status: number;
  message: string;
  data: {
    exists: boolean;
  };
}

export interface StatistikCutiResponse {
  status: number;
  message: string;
  data: StatistikCutiData;
}

export interface StatistikCutiData {
  nik: string;
  nama_pegawai: string;
  sisa_cuti_n1: number;
  sisa_cuti_n2: number;
  kode_unit_kerja: string;
  nama_unit_kerja: string;

  tahun: number;

  sisa_cuti_total: number;
  sisa_cuti_tahun_ini: number;
  cuti_terpakai_tahun_ini: number;
  pengajuan_pending: number;
}

export interface PengajuanCutiItem {
  id: number;
  nik: string;
  nama_pegawai: string;
  kode_unit_kerja: string;
  kode_jenis_cuti: string;
  nama_jenis_cuti: string;
  lama_cuti: number;
  satuan_cuti: 'hari' | string;
  nip: string;
  tanggal_mulai: string; // YYYY-MM-DD
  tanggal_selesai: string; // YYYY-MM-DD
  tanggal_pengajuan: string; // YYYY-MM-DD
  nama_golongan_ruang: string;
  alasan: string;
  alamat_cuti: string;
  no_hp: string;
  status: number; // 0 = pending, 1 = disetujui, dst (opsional mapping)
  keterangan: string;
  created_at: string; // ISO datetime
  updated_at: string; // ISO datetime
}

export interface PaginationCuti {
  total: number;
  page: number;
  limit: number;
  last_page: number;
}

export interface PengajuanCutiResponse {
  status: number;
  message: string;
  data: PengajuanCutiItem[];
  pagination: PaginationCuti;
}

export interface JenisCutiItem {
  id: number;
  kode: string;
  nama_jenis_cuti: string;
  created_at: string; // ISO date string
  updated_at: string; // ISO date string
}

export interface JenisCutiResponse {
  status: number;
  message: string;
  data: JenisCutiItem[];
  pagination: PaginationCuti;
}

export interface PostCutiData {
  id: number;
  nik: string;
  kode_unit_kerja: string;
  kode_jenis_cuti: string;
  lama_cuti: number;
  satuan_cuti: string; // aman & extensible
  tanggal_mulai: string; // ISO date (YYYY-MM-DD)
  tanggal_selesai: string; // ISO date
  tanggal_pengajuan: string; // ISO date
  alasan: string;
  alamat_cuti: string;
  status: number; // 0 = pending, 1 = diterima, 2 = ditolak (sesuai backend)
}

export interface PostCutiResponse {
  message: string;
  data: PostCutiData;
}

export interface PutVerifCutiPayload {
  id: string | number;
  keputusan: string;
  passphrase_tte?: string;
  alasan?: string;
}

export interface PostCutiPayload {
  nik: string;
  kode_unit_kerja: string;
  kode_jenis_cuti: string;
  lama_cuti: number;
  satuan_cuti: string;
  tanggal_mulai: string; // YYYY-MM-DD
  tanggal_selesai: string; // YYYY-MM-DD
  tanggal_pengajuan: string; // YYYY-MM-DD
  alasan: string;
  alamat_cuti: string;
  status: number; // 0 = pending
  keterangan: string;
  no_hp: string;
  nik_pengganti: string;
  nik_verifikator1: string;
  nik_verifikator2: string;
  nik_verifikator3: string;
  nik_verifikator4: string;
  passphrase_tte: string;
}
export interface PengajuanCutiVerifResponse {
  status: number;
  message: string;
  data: CutiPegawaiVerif[];
  pagination: PaginationVerif;
}
export interface CutiPegawaiVerif {
  id: number;
  nik: string;
  nama_pegawai: string;
  nip: string;
  kode_unit_kerja: string;
  nama_unit_kerja: string;
  nama_jabatan: string;
  nama_golongan_ruang: string;

  kode_jenis_cuti: string;
  nama_jenis_cuti: string;
  lama_cuti: number;
  satuan_cuti: string;

  tanggal_pengajuan: string; // ISO Date
  tanggal_mulai: string; // ISO Date
  tanggal_selesai: string; // ISO Date

  alasan: string;
  alamat_cuti: string;
  keterangan: string;

  no_hp: string | null;
  nik_pengganti: string;
  nama_pengganti: string;

  status: string; // aslinya "0,"

  nik_verifikator1: string;
  nama_verifikator1: string;

  nik_verifikator2: string;
  nama_verifikator2: string;

  nik_verifikator3: string;
  nama_verifikator3: string;

  nik_verifikator4: string;
  nama_verifikator4: string;

  current_verification_level: number;
}

export interface PaginationVerif {
  total: number;
  page: number;
  limit: number;
  last_page: number;
}
