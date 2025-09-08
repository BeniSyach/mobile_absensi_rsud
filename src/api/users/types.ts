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

type Opd = {
  id: number;
  place_name: string;
  division_name: string;
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
  opd: Opd;
  shift_id: string;
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
  no_wa: string; // nomor-wa
};

// type Pegawai = {
//   id_pegawai: string;
//   nik: number;
//   password: string;
//   nip: number;
//   nip_lama: number;
//   gelar_depan_id: string;
//   gelar_depan: {
//     id_gelar_depan: string;
//     kode_gelar_depan: string;
//     nama_gelar_depan: string;
//   };
//   nama: string;
//   gelar_belakang_id: string;
//   gelar_belakang: {
//     id_gelar_belakang: string;
//     kode_gelar_belakang: string;
//     nama_gelar_belakang: string;
//   };
//   alamat: string;
//   tempat_lahir: string;
//   tanggal_lahir: string;
//   jenis_kelamin: string;
//   agama_id: string;
//   agama: {
//     id_agama: string;
//     kode_agama: string;
//     nama_agama: string;
//   };
//   status_kawin_id: string;
//   status_kawin: {
//     id_status_kawin: string;
//     kode_status_kawin: string;
//     nama_status_kawin: string;
//   };
//   jenis_pegawai_id: string;
//   jenis_pegawai: {
//     id_jenis_pegawai: string;
//     kode_jenis_pegawai: string;
//     nama_jenis_pegawai: string;
//   };
//   photo: string;
//   status_pegawai_id: string;
//   status_pegawai: {
//     id_status_pegawai: string;
//     kode_status_pegawai: string;
//     nama_status_pegawai: string;
//   };
//   unit_kerja_id: string;
//   unit_kerja: {
//     id_unit_kerja: string;
//     kode_unit_kerja: string;
//     nama_unit_kerja: string;
//     radius: number;
//     latitude: string;
//     longitude: string;
//   };
//   jabatan_id: string;
//   jabatan: {
//     id_jabatan: string;
//     kode_jabatan: string;
//     nama_jabatan: string;
//   };
//   pangkat_id: string;
//   pangkat: {
//     id_pangkat: string;
//     kode_pangkat: string;
//     nama_pangkat: string;
//   };
//   golongan_ruang_id: string;
//   golongan_ruang: {
//     id_golongan_ruang: string;
//     kode_golongan_ruang: string;
//     nama_golongan_ruang: string;
//   };
//   struktural_fungsional_id: string;
//   struktural_fungsional: {
//     id_struktural_fungsional: string;
//     kode_struktural_fungsional: string;
//     nama_struktural_fungsional: string;
//   };
//   shift_absen_id: string;
//   is_active: boolean;
//   is_online: boolean;
//   created_at: string;
//   updated_at: string;
//   created_user: string;
//   updated_user: string;
// };

// export type ApiResponse = {
//   status: string;
//   data: Pegawai;
// };

export interface EmployeeData {
  id: string;
  nik: string;
  nama: string;
  nip: string;
  nip_lama: string | null;
  photo: string;
  tanggal_lahir: string; // format: "DD-MM-YYYY"
  tempat_lahir: string;
  alamat: string;
  jenis_kelamin: 'L' | 'P';
  is_active: boolean;
  pangkat_id: string;
  nama_pangkat: string;
  unit_kerja_id: string;
  nama_unit_kerja: string;
  longitude_unit_kerja: string;
  latitude_unit_kerja: string;
  radius_unit_kerja: string;
  agama_id: string;
  nama_agama: string;
  gelar_belakang_id: string | null;
  nama_gelar_belakang: string | null;
  gelar_depan_id: string | null;
  nama_gelar_depan: string | null;
  golongan_ruang_id: string;
  nama_golongan_ruang: string;
  jabatan_id: string;
  nama_jabatan: string;
  jenis_pegawai_id: string;
  nama_jenis_pegawai: string;
  shift_absen_id: string;
  nama_shift_absen: string;
  status_kawin_id: string;
  nama_status_kawin: string;
  status_pegawai_id: string;
  nama_status_pegawai: string;
  struktural_fungsional_id: string;
  nama_struktural_fungsional: string;
  eselon_id: string;
  nama_eselon: string;
  created_at: string; // ISO 8601
  updated_at: string; // ISO 8601
}

export interface ApiResponse {
  status: number;
  message: string;
  data: EmployeeData;
}
