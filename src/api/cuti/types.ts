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
  kode_unit_kerja: string;
  kode_jenis_cuti: string;

  lama_cuti: number;
  satuan_cuti: 'hari' | string;

  tanggal_mulai: string; // YYYY-MM-DD
  tanggal_selesai: string; // YYYY-MM-DD
  tanggal_pengajuan: string; // YYYY-MM-DD

  alasan: string;
  alamat_cuti: string;

  status: number; // 0 = pending, 1 = disetujui, dst (opsional mapping)

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
}
