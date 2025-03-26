type Hari = {
  created_at: string;
  id: number;
  nama_hari: string;
  updated_at: string;
};

type Shift = {
  created_at: string;
  id: number;
  nama_shift: string;
  opd_id: string;
  updated_at: string;
};

type Jadwal = {
  created_at: string;
  hari: Hari;
  hari_id: number;
  id: number;
  jam_mulai: string;
  jam_selesai: string;
  shift: Shift;
  shift_id: number;
  updated_at: string;
};

export type HariKerjaResponse = {
  status: 'success' | 'error';
  data: {
    data: Jadwal[];
  };
};
