// Tipe untuk TAGIHAN
export interface Tagihan {
  THN_PAJAK_SPPT: string;
  J_TEMPO: string;
  STATUS: string;
  POKOK: string;
  DENDA: number;
  TOTAL: number;
}

// Tipe untuk respon API
export interface ResponPbb {
  RC: string;
  PESAN: string;
  NOP: string;
  NAMA: string;
  ALAMAT_WP: string;
  ALAMAT_OP: string;
  LUAS_BUMI: string;
  LUAS_BANGUNAN: string;
  TAGIHAN: Tagihan[];
}

export type ResponseDataPad = {
  RC: string;
  PESAN: string;
  data: WajibPajak[];
};

export type WajibPajak = {
  NPWPD: string;
  NAMA_WP: string;
  KECAMATAN: string;
  KELURAHAN: string;
  ALAMAT: string;
  JENIS: string;
  GOLONGAN: string;
  TGL_DAFTAR: string;
  NO_PENGUKUHAN: string;
  STATUS: string;
  TAGIHAN: Tagihan[] | null;
};

export type TagihanPad = {
  MASA_PAJAK: string;
  CARA_PENETAPAN: 'Self Assesment' | 'Official Assesment';
  TGL_KETETAPAN: string;
  OMSET: string; // bisa juga pakai number jika yakin selalu numeric
  JLH_PAJAK: string;
  J_TEMPO: string;
  TGL_SETOR: string;
  JLH_SETOR: string | null;
  STATUS_BAYAR: 'BELUM DIBAYAR' | 'TERBAYAR';
};
