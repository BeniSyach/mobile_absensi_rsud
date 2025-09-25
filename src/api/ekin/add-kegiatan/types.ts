export interface PostKegiatanHarianVariables {
  nik: string;
  uraian_tugas: string;
  indikator: string;
  id_rhkstaff: number;
  waktu_kinerja: string;
  nilai: number;
  tgl_kinerja: string;
  status: number;
  id_satuan: number;
}
export interface KinerjaResponse {
  status: number;
  message: string;
  data: KinerjaData;
}

export interface KinerjaData {
  id: number;
  nik: string;
  uraian_tugas: string;
  id_indikator: number;
  id_rhkstaff: number;
  waktu_kinerja: number;
  nilai: number;
  tgl_kinerja: string; // ISO date string (e.g., "2025-07-18T08:00:00")
  status: number;
  created_at: string; // ISO timestamp
  updated_at: string; // ISO timestamp
}
