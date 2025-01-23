import { storage } from './storage'; // Import MMKV storage yang sudah Anda buat

const MESSAGE_KEY = 'message'; // Kunci untuk menyimpan pesan

export interface UserData {
  id: number;
  name: string;
  email: string;
  email_verified_at: string | null;
  nik: string;
  nomor_hp: string;
  alamat: string;
  id_divisi: number;
  id_level_akses: number;
  id_gender: number;
  id_status: number;
  photo: string | null;
  created_at: string;
  updated_at: string;
  refresh_token: string;
  absen_masuk_id?: number;
  opd_id?: number;
}

// Fungsi untuk mendapatkan pesan dari storage
export function getMessage(): UserData | null {
  const value = storage.getString(MESSAGE_KEY);
  return value ? JSON.parse(value) : null;
}

// Fungsi untuk menyimpan pesan ke storage
export async function setMessage(message: UserData): Promise<void> {
  storage.set(MESSAGE_KEY, JSON.stringify(message)); // Simpan pesan dalam bentuk string JSON
}

// Fungsi untuk menghapus pesan dari storage
export async function removeMessage(): Promise<void> {
  storage.delete(MESSAGE_KEY); // Hapus pesan dari storage
}
