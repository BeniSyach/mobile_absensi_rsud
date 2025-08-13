export interface KegiatanHarianResponseByNIK {
  status: number;
  message: string;
  data: KegiatanHarianbynik[];
  pagination: PaginationKegiatanHarianByNIK;
}

export interface KegiatanHarianbynik {
  id: number;
  nik: number;
  uraian_tugas: string;
  id_indikator?: number; // karena tidak muncul di response
  id_rhkstaff: number;
  id_satuan: number;
  waktu_kinerja: number;
  nilai: number;
  tgl_kinerja: string; // format "YYYY-MM-DD"
  status: 0 | 1 | 2;
  created_at: string;
  updated_at: string;
  indikator: IndikatorKeigatanHarianByNIK | null;
  rhk_staff: RhkStaffKegiatanHarianByNik | null;
  atasan: AtasanKegiatanHarianByNIK;
  satuan: SatuanKegiatanHarianByNIK;
}

export interface IndikatorKeigatanHarianByNIK {
  id: number;
  kode_unit_kerja: string;
  uraian: string;
  created_at: string;
  updated_at: string;
}

export interface RhkStaffKegiatanHarianByNik {
  id: number;
  id_rhk_pejabat: number;
  id_indikator: number;
  indikator: string;
  kode_unit_kerja: string;
  uraian: string;
  nilai: number;
  tahun: string;
  created_at: string;
  updated_at: string;
  rhk_pejabat: RhkPejabatKegiatanHarianByNIK;
}

export interface RhkPejabatKegiatanHarianByNIK {
  id: number;
  kode_jabatan: string;
  kode_unit_kerja: string;
  uraian: string;
  created_at: string;
  updated_at: string;
  kode_pangkat: string;
}

export interface AtasanKegiatanHarianByNIK {
  nama: string;
  nip: string;
  pangkat: string;
  jabatan: string;
}

export interface SatuanKegiatanHarianByNIK {
  id: number;
  satuan: string;
  created_at: string;
  updated_at: string | null;
}

export interface PaginationKegiatanHarianByNIK {
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
}

export interface RHKPejabat {
  id: number;
  kode_jabatan: string;
  kode_unit_kerja: string;
  indikator: string;
  uraian: string;
  created_at: string; // ISO timestamp
  updated_at: string; // ISO timestamp
  kode_pangkat: string;
  nilai: number;
  tahun: string;
  id_satuan: number;
}

export interface KegiatanHarianPejabat {
  id: number;
  nik: number;
  nip: string;
  nama: string;
  pangkat: string;
  jabatan: string;
  uraian_tugas: string;
  id_rhk_pejabat: number;
  rhk_pejabat: RHKPejabat;
  id_satuan: number;
  nama_satuan: string;
  waktu_kinerja: number;
  nilai: number;
  tgl_kinerja: string; // format YYYY-MM-DD
  status: 0 | 1 | 2;
  created_at: string; // ISO timestamp
  updated_at: string; // ISO timestamp
  nik_atasan: number;
  nip_atasan: string;
  nama_atasan: string;
  pangkat_atasan: string;
  jabatan_atasan: string;
}

export interface PaginationKegiatanHarianPejabat {
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
}

export interface ApiResponseKegiatanHarianPejabat {
  status: number;
  message: string;
  data: KegiatanHarianPejabat[];
  pagination: PaginationKegiatanHarianPejabat;
}
