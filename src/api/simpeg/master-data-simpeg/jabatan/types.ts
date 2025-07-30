export interface JabatanSimpeg {
  id: number;
  kode_jabatan: string;
  nama_jabatan: string;
  created_at: string;
  updated_at: string;
}

export interface PaginationJabatanSimpeg {
  total: number;
  page: number;
  limit: number;
  last_page: number;
}

export interface JabatanResponseSimpeg {
  status: number;
  message: string;
  data: JabatanSimpeg[];
  pagination: PaginationJabatanSimpeg;
}
