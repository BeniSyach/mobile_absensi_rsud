import { type User } from '@/api';

import { storage } from './storage'; // Import MMKV storage yang sudah Anda buat

const MESSAGE_KEY = 'message'; // Kunci untuk menyimpan pesan

// Fungsi untuk mendapatkan pesan dari storage
export function getMessage(): User | null {
  const value = storage.getString(MESSAGE_KEY);
  try {
    return value ? (JSON.parse(value) as User) : null;
  } catch {
    return null;
  }
}

// Fungsi untuk menyimpan pesan ke storage
export async function setMessage(message: User): Promise<void> {
  storage.set(MESSAGE_KEY, JSON.stringify(message)); // Simpan pesan dalam bentuk string JSON
}

// Fungsi untuk menghapus pesan dari storage
export async function removeMessage(): Promise<void> {
  storage.delete(MESSAGE_KEY); // Hapus pesan dari storage
}
