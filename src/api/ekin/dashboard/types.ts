export type StatusCount = {
  pending: number;
  setuju: number;
  tolak: number;
};

export type RekapStatusResponse = {
  harian: StatusCount;
  bulanan: StatusCount;
  tahunan: {
    [bulanTahun: string]: StatusCount; // e.g., "2025-07"
  };
};
