export interface UnitKerjaSimpeg {
  id: number;
  kode_unit_kerja: string;
  nama_unit_kerja: string;
  longitude: string;
  latitude: string;
  radius: number;
  sub_unit_kerja: string;
  created_at: string; // ISO date
  updated_at: string; // ISO date
}

export interface UnitKerjaPaginationSimpeg {
  total: number;
  page: number;
  limit: number;
  last_page: number;
}

export interface UnitKerjaResponse {
  status: number;
  message: string;
  data: UnitKerjaSimpeg[];
  pagination: UnitKerjaPaginationSimpeg;
}
