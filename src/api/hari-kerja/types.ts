interface Hari {
  id: number;
  nama_hari: string;
  created_at: string;
  updated_at: string;
}

interface Shift {
  id: number;
  nama_shift: string;
  created_at: string;
  updated_at: string;
}

interface WaktuKerja {
  id: number;
  hari_id: number;
  shift_id: number;
  jam_mulai: string;
  jam_selesai: string;
  created_at: string;
  updated_at: string;
  hari: Hari;
  shift: Shift;
}

export type WaktuKerjaResponse = WaktuKerja[];
