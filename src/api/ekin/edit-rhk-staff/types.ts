export interface PutRhkStaffVariables {
  id: number;
  id_rhk_pejabat: number;
  indikator: string;
  kode_unit_kerja: string;
  uraian: string;
  nilai: number;
  tahun: number;
}

export type PutRhkStaff = {
  id: number;
  id_rhk_pejabat: number;
  indikator: string;
  kode_unit_kerja: string;
  uraian: string;
  nilai: number;
  tahun: number;
  created_at: string;
  updated_at: string;
};

export type PutRhkStaffChild = {
  id: number;
  id_rhk_pejabat: number;
  id_rhk_staff: number;
  nik: string;
  created_at: string;
  updated_at: string;
};

export type PutRhkResponse = {
  status: number;
  message: string;
  data: {
    rhk_staff: PutRhkStaff;
    rhk_staff_child: PutRhkStaffChild;
  };
};
