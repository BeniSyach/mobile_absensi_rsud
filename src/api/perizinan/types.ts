export interface Permohonan {
  pendaftaran_id: string;
  n_pemohon: string;
  n_perizinan: string;
  n_sts_permohonan: string;
}

export interface ApiDataPerizinan {
  permohonan: Permohonan[];
}

export interface ApiResponse {
  status: number;
  messages: string;
  data: ApiDataPerizinan;
}
