export interface LastAbsenStatus {
  absen_masuk_id: number;
  status: number;
}

export interface LastAbsenStatusResponse {
  status: string;
  data: {
    data: {
      lastAbsenStatus: LastAbsenStatus;
    };
  };
}
