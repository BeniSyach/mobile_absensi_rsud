export type IndikatorPejabat = {
  id: number;
  uraian: string;
};

export type RhkPejabat = {
  id: number;
  uraian: string;
  jabatan: string | null;
  unit_kerja: string | null;
  indikator: IndikatorPejabat[];
};

export type RhkPejabatItem = {
  id: number;
  id_rhk_pejabat: number;
  nik: number;
  created_at: string;
  updated_at: string;
  rhk_pejabat: RhkPejabat;
};

export type RhkPejabatResponse = {
  status: number;
  data: RhkPejabatItem[];
  pagination: {
    total: number;
    current_page: number;
    per_page: number;
    last_page: number;
  };
};
