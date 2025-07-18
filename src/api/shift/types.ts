export interface ShiftAbsen {
  id: number;
  nama_shift_absen: string;
  kode_unit_kerja: string;
  nama_unit_kerja: string;
  created_at: string; // atau pakai Date jika kamu parsing
  updated_at: string;
}

export interface ShiftResponse {
  status: number;
  message: string;
  data: ShiftAbsen[];
}
