// tipe untuk rhk_staff.indikator
export type IndikatorRHKStaffChild = {
  indikator: string; // dari rhk_staff.indikator (bukan objek)
};

// tipe rhk_staff
export type RhkStaffChild = {
  id: number;
  id_unit_kerja: string;
  indikator: string; // string, bukan objek indikator
  id_rhk_pejabat: number;
  uraian: string;
  nilai: number;
  tahun: string;
  created_at: string;
  updated_at: string;
};

// user
export type RhkUserStaffChild = {
  id: number;
  nik: string;
  id_atasan: number;
  nm_atasan: string;
  nm_pangkat: string;
  kode_unit_kerja: string;
  no_wa: string | null;
  created_at: string;
  updated_at: string;
  role: number;
  nama: string;
};

// item utama per data
export interface RhkStaffChildItem {
  id: string;
  id_rhk_pejabat: string;
  id_rhk_staff: string;
  indikator: string;
  kode_unit_kerja: string;
  nama_pegawai: string;
  nama_unit_kerja: string;
  nik: string;
  nilai: number;
  tahun: string;
  uraian: string;
  created_at: string; // ISO date string
  updated_at: string; // ISO date string
}

export interface PaginationRHKStaffChild {
  last_page: number;
  limit: number;
  page: number;
  total: number;
}

// full response
export interface RhkStaffChildResponse {
  data: RhkStaffChildItem[];
  message: string;
  pagination: PaginationRHKStaffChild;
  status: number;
}
