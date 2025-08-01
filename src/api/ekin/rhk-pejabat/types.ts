export interface IndikatorRHKPejabat {
  id: number;
  uraian: string;
}

export interface RhkPejabatRHKPejabat {
  id: number;
  uraian: string;
  jabatan: string | null;
  unit_kerja: string | null;
  indikator: string;
}

export interface DataItemRHKPejabat {
  id: number;
  id_rhk_pejabat: number;
  nik: number;
  created_at: string;
  updated_at: string;
  rhk_pejabat: RhkPejabatRHKPejabat;
}

export interface PaginationRHKPejabat {
  total: number;
  current_page: number;
  per_page: number;
  last_page: number;
}

export interface RhkResponseRHKPejabat {
  status: number;
  data: DataItemRHKPejabat[];
  pagination: PaginationRHKPejabat;
}

// post
export interface RhkPejabatPost {
  id: number;
  kode_jabatan: string;
  kode_pangkat: string;
  kode_unit_kerja: string;
  uraian: string;
  created_at: string;
  updated_at: string;
}

export interface RhkPejabatChildPost {
  id: number;
  id_rhk_pejabat: number;
  nik: string;
  created_at: string;
  updated_at: string;
}

export interface SaveRHKResponsePost {
  status: number;
  message: string;
  data: {
    rhk_pejabat: RhkPejabatPost;
    rhk_pejabat_child: RhkPejabatChildPost;
  };
}

export interface CreateRHKPejabatPayload {
  kode_jabatan: string;
  kode_pangkat: string;
  kode_unit_kerja: string;
  uraian: string;
  nik: string;
  indikator: string;
}

export interface UpdateRHKPejabatPayload {
  kode_jabatan: string;
  kode_pangkat: string;
  kode_unit_kerja: string;
  uraian: string;
  id: number;
  indikator: string;
}
