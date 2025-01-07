// types.ts
export type LoginVariables = {
  email: string;
  password: string;
};

export type LoginResponse = {
  token: string;
  message: {
    id: number;
    name: string;
    email: string;
    email_verified_at: string | null;
    nik: string;
    nomor_hp: string;
    alamat: string;
    id_divisi: number;
    id_level_akses: number;
    id_gender: number;
    id_status: number;
    photo: string | null;
    created_at: string;
    updated_at: string;
    refresh_token: string;
  };
};
