export interface UpdateStatusKegiatanResponse {
  status: number;
  message: string;
  data: {
    id: number;
    status: number;
  };
}

export type UpdateKegaitanVariables = {
  id: string;
  status: number;
};
