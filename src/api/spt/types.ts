import type { User } from '../shared/types';

export type SPT = {
  id: number;
  tanggal_spt: string; // Date in string format (e.g., "2025-03-01")
  waktu_spt: string; // Time in string format (e.g., "08:36:00")
  lama_acara: number; // Duration of the event (in hours)
  lokasi_spt: string; // Location of the SPT
  file_spt: string; // File path for the SPT document
  created_at: string; // Timestamp of creation
  updated_at: string; // Timestamp of the last update
  id_user: number; // User ID
  user: User; // Nested User object
};

export type GetAllSPTResponse = {
  id: number;
  tanggal_spt: string;
  waktu_spt: string;
  lama_acara: number;
  lokasi_spt: string;
  file_spt: string;
  user_id: number;
  created_at: string;
  updated_at: string;
  user: User;
};

export interface PostSPTVariables {
  id?: number;
  id_user?: number;
  tanggal_spt: string;
  waktu_spt: string;
  lama_acara: number;
  lokasi_spt: string;
  file_spt?: any;
  name: string;
  mimeType: string;
  opd_id: string | undefined;
}

export type PostSPTResponse = {
  message: string;
  data: SPT;
};

export interface PutSPTVariables extends PostSPTVariables {
  id: number;
}

export type DeleteSPTResponse = {
  message: string; // Pesan sukses atau error dari server
};

export type SPTData = {
  id: number;
  nik: number;
  lokasi_spt: string;
  tanggal_spt: string;
  waktu_spt: string;
  lama_acara: number;
  file_spt: string;
  status: string | null;
  created_at: string;
  updated_at: string;
};

export type PaginationLink = {
  url: string | null;
  label: string;
  active: boolean;
};

export type Pagination = {
  current_page: number;
  data: SPTData[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: PaginationLink[];
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
  url: string | null;
};
