export interface DivisiResponse {
  id: number;
  nama_divisi: string;
  id_atasan: number | null;
  id_jabatan: number | null;
  created_at: string | null;
  updated_at: string | null;
  atasan: string | null;
}
