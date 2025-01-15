type Divisi = {
  id: number;
  nama_divisi: string;
  id_atasan?: number;
  id_jabatan?: number;
};

type LevelAkses = {
  id: number;
  nama_level: string;
};

type Gender = {
  id: number;
  nama_gender: string;
};

type StatusPegawai = {
  id: number;
  nama_status: string;
};

export type GetAllUsersResponse = {
  id: number;
  name: string;
  email: string;
  email_verified_at: string | null;
  nik: string;
  id_divisi: number;
  id_level_akses: number;
  id_gender: number;
  id_status: number;
  created_at: string;
  updated_at: string;
  divisi: Divisi;
  level_akses: LevelAkses;
  gender: Gender;
  status_pegawai: StatusPegawai;
}[];

export type GetUserDetailResponse = {
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
  created_at: string;
  updated_at: string;
  lastAbsenStatus: {
    absen_masuk_id: number;
    status: number;
  };
  photo: string | null;
  divisi: Divisi;
  level_akses: LevelAkses;
  gender: Gender;
  status_pegawai: StatusPegawai;
};

export type UpdatePasswordResponse = {
  message: string;
};

export type UploadPhotoResponse = {
  message: string;
  photo_url: string;
};

export type EditUserResponse = {
  message: string;
  user: {
    id: number;
    name: string;
    email: string;
    email_verified_at: string | null;
    nik: string;
    id_divisi: string; // Assuming it's a string based on your response
    id_level_akses: string; // Assuming it's a string based on your response
    id_gender: string; // Assuming it's a string based on your response
    id_status: string; // Assuming it's a string based on your response
    created_at: string;
    updated_at: string;
    photo: string | null; // photo can be null
  };
};

export interface EditUserVariables {
  id: number;
  name?: string;
  email?: string;
  nik: string;
  id_divisi: string; // Assuming it's a string based on your previous data
  // id_level_akses: string; // Assuming it's a string based on your previous data
  id_gender: string; // Assuming it's a string based on your previous data
  id_status: string; // Assuming it's a string based on your previous data
}

export type UploadPhotoVariables = {
  photo: string; // Foto yang akan di-upload
  name: string;
  mimeType: string;
};

export type ResetPasswordResponse = {
  message: string; // Pesan respons, misalnya "Password berhasil direset"
};

export type ResetPasswordVariables = {
  old_password: string; // Password lama
  new_password: string; // Password baru
  new_password_confirmation: string; // Konfirmasi password baru
};
