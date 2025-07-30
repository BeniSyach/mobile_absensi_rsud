export interface GolonganRuangSimpeg {
  id: number;
  kode_golongan_ruang: string;
  nama_golongan_ruang: string;
  created_at: string;
  updated_at: string;
}

export interface PaginationGolonganRuangSimpeg {
  total: number;
  page: number;
  limit: number;
  last_page: number;
}

export interface GolonganRuangResponse {
  status: number;
  message: string;
  data: GolonganRuangSimpeg[];
  pagination: PaginationGolonganRuangSimpeg;
}
