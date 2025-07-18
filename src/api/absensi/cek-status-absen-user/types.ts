export interface LastAbsenStatus {
  status: number;
  absen_masuk_id: number;
  status_message: string;
}

export interface LastAbsenStatusResponse {
  lastAbsenStatus: LastAbsenStatus;
}
