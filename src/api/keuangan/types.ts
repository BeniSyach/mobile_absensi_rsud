// types.ts

export interface BerkasSPM {
  nm_skpd: string; // Nama SKPD
  no_spm: string; // Nomor SPM
  tgl_spm: string; // Tanggal SPM (format: YYYY-MM-DD)
  tgl_antar_berkas: string; // Tanggal antar berkas (format: YYYY-MM-DD)
  jam_antar_berkas: string; // Jam antar berkas (format: HH:mm:ss)
  pengantar_berkas: string; // Nama pengantar
  nm_penerima: string; // Nama penerima (perusahaan)
  jumlah_dana: string; // Jumlah dana (dalam string karena pakai format Indonesia)
  uraian_spm: string; // Uraian SPM
  no_sp2d: string; // Nomor SP2D
  tgl_sp2d: string; // Tanggal SP2D (format: YYYY-MM-DD)
  status: string; // Status proses
}

// Jika datanya array:
export interface ResponseSPM {
  data: BerkasSPM[];
}
