// types.ts
export type LoginVariables = {
  nik: string;
  password: string;
  device_token: string | null;
};
export interface User {
  id: number;
  nik: string;
  nip: string;
  nama: string;
  kode_unit_kerja: string;
  nama_unit_kerja: string;
  photo: string | undefined;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  user: User;
}
