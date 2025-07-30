// Tipe untuk unit_kerja
export type UnitKerjaIndikator = {
  id: number;
  kode_unit_kerja: string;
  nama_unit_kerja: string;
  longitude: string;
  latitude: string;
  radius: number;
  sub_unit_kerja: any; // bisa diganti dengan tipe yang sesuai jika diketahui
  created_at: string;
  updated_at: string;
};

// Tipe untuk masing-masing data indikator
export type Indikator = {
  id: number;
  uraian: string;
  kode_unit_kerja: number;
  unit_kerja: UnitKerjaIndikator;
};

// Tipe untuk pagination
type Pagination = {
  page: number;
  last_page: number;
  limit: number;
  total: number;
};

// Tipe untuk keseluruhan response
export type IndikatorResponse = {
  status: number;
  message: string;
  data: Indikator[];
  pagination: Pagination;
};
