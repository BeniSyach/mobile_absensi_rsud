export interface RekapKegiatanHarianResponse {
  status: number;
  message: string;
  data: BawahanRekapNilaiBawahan[];
}

export interface BawahanRekapNilaiBawahan {
  nik: string;
  nip: string;
  nama: string;
  pangkat: string;
  jabatan: string;
  jumlah_kegiatan: number;
  rekap: RekapStatusNilaiBawahan;
  kegiatan: KegiatanlistNilaiBawahan[];
}

export interface RekapStatusNilaiBawahan {
  pending: number;
  disetujui: number;
  ditolak: number;
}

export interface KegiatanlistNilaiBawahan {
  id: number;
  uraian_tugas: string;
  tgl_kinerja: string; // ISO date string
  waktu_kinerja: number;
  nilai: number;
  id_satuan: number;
  nama_satuan: string;
  status: number;
  created_at: string; // ISO timestamp
  updated_at: string; // ISO timestamp
}
