export interface PangkatSimpeg {
  id: number;
  kode_pangkat: string;
  nama_pangkat: string;
  created_at: string; // ISO 8601 date string
  updated_at: string;
}

export interface PaginationPangkatSimpeg {
  total: number;
  page: number;
  limit: number;
  last_page: number;
}

export interface PangkatResponseSimpeg {
  status: number;
  message: string;
  data: PangkatSimpeg[];
  pagination: PaginationPangkatSimpeg;
}
