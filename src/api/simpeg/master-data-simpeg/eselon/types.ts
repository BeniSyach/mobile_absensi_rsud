export type Eselon = {
  id: string;
  kode_eselon: string;
  nama_eselon: string;
  created_at: string; // ISO date string
  updated_at: string; // ISO date string
};

export type Pagination = {
  total: number;
  page: number;
  limit: number;
  last_page: number;
};

export type GetEselonResponse = {
  status: number;
  message: string;
  data: Eselon[];
  pagination: Pagination;
};
