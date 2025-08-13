export interface PostKegiatanHarianPejabatVariables {
  nik: string;
  uraian_tugas: string;
  indikator: string;
  id_rhk_pejabat: string;
  waktu_kinerja: string;
  nilai: number;
  tgl_kinerja: string;
  status: number;
  id_satuan: string;
}
export interface KinerjaPejabatResponse {
  status: number;
  message: string;
  data: KinerjaPejabatData;
}

export interface KinerjaPejabatData {
  id: number;
  nik: string;
  uraian_tugas: string;
  id_indikator: number;
  id_rhk_pejabat: number;
  waktu_kinerja: number;
  nilai: number;
  tgl_kinerja: string; // ISO date string (e.g., "2025-07-18T08:00:00")
  status: number;
  created_at: string; // ISO timestamp
  updated_at: string; // ISO timestamp
}
