export interface MasterDataPasar {
  id: string;
  nama: string;
  kategori: 'harian' | 'mingguan' | 'bulanan' | string; // bisa diperluas
  alamat: string;
  latitude: number;
  longitude: number;
  kepala_pasar: string;
  nip_kepala_pasar: string;
  user: string;
  wilayah_provinsi: string;
  wilayah_kabupaten: string;
  wilayah_kecamatan: string;
  wilayah_desa: string;
  created_at: string; // ISO timestamp
  updated_at: string; // ISO timestamp
}

export interface MasterDataKomoditas {
  id: string;
  nama: string;
  satuan: string;
  status: string; // Bisa ubah ke boolean jika perlu
  created_at: string; // ISO timestamp
  updated_at: string; // ISO timestamp
}

export interface HargaKomoditiPasarRataRata {
  komoditi_id: string;
  nama_komoditi: string;
  satuan: string;
  harga_rata_rata: string; // jika kamu ingin pakai number, bisa ubah jadi: number
}
