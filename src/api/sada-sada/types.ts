export type UMKMResponse = {
  status: number;
  messages: string;
  data: {
    nomorIndukKependudukan: string;
    namaLengkap: string;
    alamatPribadi: string;
    nomorTelepon: string;
    email: string;
    usaha: Usaha[];
  };
};

export type Usaha = {
  idUsaha: string;
  umkmUsaha: string;
  namaUsaha: string;
  kategoriUsaha: string;
  jenisUsaha: string;
  alamatUsaha: string;
  kodeDesaUsaha: string;
  kodeKecamatanUsaha: string;
  deskripsiUsaha: string;
  omset: number | null;
  laba: number | null;
  modalUsaha: number | null;
  asset: number | null;
  tenagaKerja: number | null;
  tahunBerdiri: number | null;
  statusPKH: string | null;
  sumberData: string | null;
  tahunPendataan: number | null;
  map: string | null;
  pirt_bpom: string;
  halal: string;
  hki: string;
  fotoProduk: string | null;
  berkasPIRT_BPOM: string | null;
  berkasHalal: string | null;
  berkasHKI: string | null;
  berkasMinyak: string | null;
  idMasterJenisUsaha: string;
  idDesa: string;
  kodeDesa: string;
  namaDesa: string;
  kodeKecamatan: string;
  idKecamatan: string;
  namaKecamatan: string;
};

// Desa
export interface Desa {
  idDesa: string;
  kodeDesa: string;
  namaDesa: string;
  kodeKecamatan: string;
}

// Kecamatan
export interface Kecamatan {
  idKecamatan: string;
  kodeKecamatan: string;
  namaKecamatan: string;
}

// Jenis Usaha
export interface JenisUsaha {
  idMasterJenisUsaha: string;
  jenisUsaha: string;
}

// Kategori Usaha
export interface KategoriUsaha {
  idKategoriUsaha: string;
  namaKategori: string;
}

// Response Utama
export interface MasterDataUmkmResponse {
  status: number;
  messages: string;
  data: {
    desa: Desa[];
    kecamatan: Kecamatan[];
    jenisUsaha: JenisUsaha[];
    kategoriUsaha: KategoriUsaha[];
  };
}
