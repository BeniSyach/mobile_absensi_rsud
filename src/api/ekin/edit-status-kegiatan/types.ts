export interface UpdateStatusKegiatanHarianResponse {
  status: number;
  message: string;
  data: {
    id: number;
    status: number;
  };
}

export interface putStatusKegiatanVariable {
  id: string;
}
