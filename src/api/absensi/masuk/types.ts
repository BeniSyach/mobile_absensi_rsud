import type { User } from '../../shared/types';

export type AbsenMasukVariables = {
  user_id: number;
  shift_id: number;
  waktu_kerja_id: number;
  longitude: string;
  latitude: string;
  photo: {
    uri: string;
    type: string;
    name: string;
  };
  mimeType: string;
  name: string;
  kode_unit_kerja: string;
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

// export type AbsenPulang = {
//   id: number;
//   absen_masuk_id: number;
//   user_id: number;
//   waktu_pulang: string;
//   shift_id: number;
//   waktu_kerja_id: number;
//   longitude: string;
//   latitude: string;
//   selish: string;
//   photo: string;
//   tpp_out: string;
//   keterangan: string;
//   created_at: string;
//   updated_at: string;
// };

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

type AbsenPulangDetail = {
  absen_masuk_id: number;
  created_at: string;
  id: number;
  keterangan: string;
  latitude: string;
  longitude: string;
  nik: number;
  photo: string;
  selish: string;
  shift_id: number;
  tpp_out: string;
  updated_at: string;
  waktu_kerja_id: number;
  waktu_pulang: string;
};

export type AbsensiData = {
  absen_pulang: AbsenPulangDetail[];
  created_at: string;
  id: number;
  keterangan: string;
  latitude: string;
  longitude: string;
  nik: number;
  photo: string;
  selish: string;
  shift_id: number;
  tpp_in: string;
  updated_at: string;
  waktu_kerja_id: number;
  waktu_masuk: string;
};

// type PaginationLink = {
//   active: boolean;
//   label: string;
//   url: string | null;
// };

// export type Pagination = {
//   current_page: number;
//   data: AbsensiData[];
//   first_page_url: string;
//   from: number;
//   last_page: number;
//   last_page_url: string;
//   links: PaginationLink[];
//   next_page_url: string | null;
//   path: string;
//   per_page: number;
//   prev_page_url: string | null;
//   to: number;
//   total: number;
// };

export interface AbsenPulang {
  id: string;
  absen_masuk_id: string;
  nik: string;
  nama_pegawai: string;
  shift_id: number;
  nama_shift: string;
  waktu_kerja_id: number;
  kode_unit_kerja: string;
  nama_unit_kerja: string;
  waktu_pulang: string; // format datetime string
  longitude: string;
  latitude: string;
  selisih: string; // format HH:mm:ss
  photo: string;
  tpp_out: string;
  keterangan: string;
  created_at: string;
  updated_at: string;
}

export interface AbsenMasuk {
  id: string;
  nik: string;
  nama_pegawai: string;
  shift_id: number;
  nama_shift: string;
  waktu_kerja_id: number;
  nama_hari_waktu_kerja: string;
  jam_mulai_waktu_kerja: string;
  jam_selesai_waktu_kerja: string;
  kode_unit_kerja: string;
  nama_unit_kerja: string;
  waktu_masuk: string; // format datetime string
  longitude: string;
  latitude: string;
  selisih: string; // format HH:mm:ss
  photo: string;
  tpp_in: string;
  keterangan: string;
  created_at: string;
  updated_at: string;
  absen_pulang: AbsenPulang[];
}

export interface PaginationAbsenMasuk {
  total: number;
  page: number;
  limit: number;
  last_page: number;
}

export interface AbsenResponse {
  status: number;
  message: string;
  data: AbsenMasuk[];
  pagination: PaginationAbsenMasuk;
}
