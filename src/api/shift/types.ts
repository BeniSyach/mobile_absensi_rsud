type Shift = {
  created_at: string;
  id: number;
  nama_shift: string;
  opd_id: string;
  updated_at: string;
};

export type ShiftResponse = {
  status: 'success' | 'error';
  data: {
    data: {
      data: Shift[];
    };
  };
};
