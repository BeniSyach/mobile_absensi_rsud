import type { User } from '../../shared/types';

export type AbsenMasukVariables = {
  user_id: number;
  shift_id: number;
  waktu_kerja_id: number;
  longitude: string;
  latitude: string;
  photo: string;
  mimeType: string;
  name: string;
};

export type AbsenMasukResponse = {
  message: string;
  data: {
    user_id: number;
    shift_id: number;
    waktu_kerja_id: number;
    longitude: number;
    latitude: number;
    photo: string;
    tpp_in: string;
    keterangan: string;
    waktu_masuk: string;
    selish: string;
    updated_at: string;
    created_at: string;
    id: number;
  };
  selisih_waktu: string;
};

export type GetAllAbsenMasukResponse = {
  id: number;
  user_id: number;
  waktu_masuk: string;
  shift_id: number;
  waktu_kerja_id: number;
  longitude: string;
  latitude: string;
  selish: string;
  photo: string;
  tpp_in: string;
  keterangan: string;
  created_at: string;
  updated_at: string;
  user: {
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
    refresh_token: string | null;
  };
}[];

export type GetAllAbsenMasukVariables = {
  user_id?: number; // Optional filter by user_id
};

export type AbsenPulang = {
  id: number;
  absen_masuk_id: number;
  user_id: number;
  waktu_pulang: string;
  shift_id: number;
  waktu_kerja_id: number;
  longitude: string;
  latitude: string;
  selish: string;
  photo: string;
  tpp_out: string;
  keterangan: string;
  created_at: string;
  updated_at: string;
};

export type AbsenMasukDanPulangByUserResponse = {
  id: number;
  user_id: number;
  waktu_masuk: string;
  shift_id: number;
  waktu_kerja_id: number;
  longitude: string;
  latitude: string;
  selish: string;
  photo: string;
  tpp_in: string;
  keterangan: string;
  created_at: string;
  updated_at: string;
  user: User;
  absen_pulang: AbsenPulang[];
};
