export interface ShiftWaktu {
  id: number;
  hari_id: number;
  nama_hari: string;
  shift_id: number;
  nama_shift: string;
  jam_mulai: string; // format ISO string: "1970-01-01T08:15:00.000Z"
  jam_selesai: string; // format ISO string: "1970-01-01T16:00:00.000Z"
  created_at: string; // ISO datetime
  updated_at: string; // ISO datetime
}

export interface ShiftWaktuResponse {
  status: number;
  message: string;
  data: ShiftWaktu[];
}
