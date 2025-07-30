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
export type RhkStaffChildItem = {
  id: number;
  id_rhk_pejabat: number;
  id_rhk_staff: number;
  nik: string;
  created_at: string;
  updated_at: string;
  user?: RhkUserStaffChild; // optional karena di JSON ada yang tidak ada `user`
  rhk_staff: RhkStaffChild;
};

// full response
export type RhkStaffChildResponse = {
  status: number;
  message: string;
  data: RhkStaffChildItem[];
  pagination: {
    current_page: number;
    per_page: number;
    total: number;
  };
};
