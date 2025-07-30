export type UnitKerjaRhkStaff = {
  id: number;
  kode_unit_kerja: string;
  nama_unit_kerja: string;
  longitude: string;
  latitude: string;
  radius: number;
  sub_unit_kerja: string | null;
  created_at: string;
  updated_at: string;
};

export type IndikatorRhkStaff = {
  id: number;
  id_unit_kerja: number;
  uraian: string;
  created_at: string;
  updated_at: string;
};

export type RhkPejabatByRhkStaff = {
  id: number;
  id_jabatan: number;
  id_unit_kerja: number;
  uraian: string;
  created_at: string;
  updated_at: string;
  id_pangkat: number;
};

export type RhkStaff = {
  id: number;
  id_unit_kerja: number;
  unit_kerja: UnitKerjaRhkStaff;
  indikator: IndikatorRhkStaff;
  id_rhk_pejabat: number;
  rhk_pejabat: RhkPejabatByRhkStaff;
  uraian: string;
  nilai: number;
  tahun: string;
};

export type RhkStaffResponse = {
  status: number;
  message: string;
  data: RhkStaff[];
  pagination: {
    page: number;
    last_page: number;
    limit: number;
    total: number;
  };
};
