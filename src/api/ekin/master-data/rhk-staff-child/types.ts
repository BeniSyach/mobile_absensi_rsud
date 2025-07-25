export type RhkStaffUnitKerja = {
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

export type RhkStaffJabatan = {
  id: number;
  kode_jabatan: string;
  nama_jabatan: string;
  created_at: string;
  updated_at: string;
};

export type RhkStaffUser = {
  nik: string;
  name: string;
  id_unit_kerja: number;
  unit_kerja: RhkStaffUnitKerja;
  id_atasan: number | null;
  jabatan: RhkStaffJabatan | null;
};

export type RhkStaffItem = {
  id: number;
  id_rhk_staff: number;
  nik: string;
  name: string;
  user: RhkStaffUser;
  rhk_staff: {
    id: number | null;
    id_unit_kerja: number | null;
    unit_kerja: RhkStaffUnitKerja | null;
    id_jabatan: number | null;
    jabatan: RhkStaffJabatan | null;
    uraian: string | null;
  };
  rhk_pejabat: {
    id: number | null;
    id_unit_kerja: number | null;
    unit_kerja: RhkStaffUnitKerja | null;
    id_jabatan: number | null;
    jabatan: RhkStaffJabatan | null;
    uraian: string | null;
  };
};

export type RhkStaffChildResponse = {
  status: number;
  message: string;
  data: RhkStaffItem[];
  pagination: {
    page: number;
    last_page: number;
    limit: number;
    total: number;
  };
};
