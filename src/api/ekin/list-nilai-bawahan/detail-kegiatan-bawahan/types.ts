export interface DetailKegiatanResponse {
  status: number;
  message: string;
  data: DetailKegiatan[];
  pagination: PaginationDetailKegiatan;
}

export interface DetailKegiatan {
  id: number;
  nik: number;
  tgl_kinerja: string; // ISO Date string
  uraian_tugas: string;
  id_rhkstaff: number;
  rhk_staff: RHKStaffDetailKegiatan;
  waktu_kinerja: number;
  nilai: number;
  id_satuan: number;
  satuan: SatuanDetailKegiatan;
  status: number;
}

export interface RHKStaffDetailKegiatan {
  id: number;
  id_rhk_pejabat: number;
  indikator: string;
  kode_unit_kerja: string;
  uraian: string;
  nilai: number;
  tahun: string;
  created_at: string; // ISO timestamp
  updated_at: string; // ISO timestamp
  rhk_pejabat: RHKPejabatDetailKegiatan;
}

export interface RHKPejabatDetailKegiatan {
  id: number;
  kode_jabatan: string;
  kode_unit_kerja: string;
  uraian: string;
  created_at: string; // ISO timestamp
  updated_at: string; // ISO timestamp
  kode_pangkat: string;
}

export interface SatuanDetailKegiatan {
  id: number;
  satuan: string;
  created_at: string; // ISO timestamp
  updated_at: string | null;
}

export interface PaginationDetailKegiatan {
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
}
