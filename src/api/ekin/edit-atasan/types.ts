export type UpdateAtasanVariables = {
  nik_user: string;
  nik_atasan: string;
};

export type UpdateAtasanResponse = {
  message: string;
  data: {
    id_user: number;
    nik_user: string;
  };
};
