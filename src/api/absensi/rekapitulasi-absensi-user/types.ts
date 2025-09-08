// Tipe data untuk objek "data" di response
export interface AbsenBulanIniData {
  total_absen_masuk: number;
  total_absen_pulang: number;
  total_durasi_kerja: string; // format "HH:MM:SS"
  persentase_durasi: number; // persentase 0-100
}

// Tipe data untuk response API
export interface AbsenBulanIniResponse {
  success: boolean;
  bulan: string; // contoh: "August 2025"
  data: AbsenBulanIniData;
}
