export interface SatuanResponse {
  success: boolean;
  message: string;
  data: Satuan[];
  pagination: PaginationSatuan;
}

export interface Satuan {
  id: number;
  satuan: string;
  created_at: string;
  updated_at: string | null;
}

export interface PaginationSatuan {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}
