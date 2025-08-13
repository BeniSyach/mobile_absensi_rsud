export interface PostRhkStaffVariables {
  id_rhk_pejabat: number;
  indikator: string;
  kode_unit_kerja: string;
  uraian: string;
  nilai: number;
  tahun: number;
  nik: string;
  id_satuan: number;
}

export type PostRhkStaff = {
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

export type PostRhkStaffChild = {
  id: number;
  id_rhk_pejabat: number;
  id_rhk_staff: number;
  nik: string;
  created_at: string;
  updated_at: string;
};

export type PostRhkResponse = {
  status: number;
  message: string;
  data: {
    rhk_staff: PostRhkStaff;
    rhk_staff_child: PostRhkStaffChild;
  };
};
