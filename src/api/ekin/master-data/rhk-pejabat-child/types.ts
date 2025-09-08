export interface RhkPejabatResponse {
  status: number;
  data: RhkPejabatDataItem[];
  pagination: RhkPejabatPagination;
}

export interface RhkPejabatDataItem {
  id: number;
  id_rhk_pejabat: number;
  nik: number;
  created_at: string;
  updated_at: string;
  rhk_pejabat: RhkPejabatData;
}

export interface RhkPejabatData {
  id: number;
  uraian: string;
  indikator: string;
  kode_jabatan: string;
  jabatan: JabatanRhkPejabat;
  kode_unit_kerja: string;
  unit_kerja: UnitKerja;
}

export interface JabatanRhkPejabat {
  id: string;
  kode_jabatan: string;
  nama_jabatan: string;
  created_at: string;
  updated_at: string;
}

export interface UnitKerja {
  id: string;
  kode_unit_kerja: string;
  nama_unit_kerja: string;
  longitude: string;
  latitude: string;
  radius: number;
  sub_unit_kerja: string;
  nama_sub_unit_kerja: string;
  created_at: string;
  updated_at: string;
}

export interface RhkPejabatPagination {
  total: number;
  current_page: number;
  per_page: number;
  last_page: number;
}
