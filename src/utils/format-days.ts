// utils/formatDate.ts
import 'dayjs/locale/id';

import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';

dayjs.extend(localizedFormat);
dayjs.locale('id');

/**
 * Format tanggal ISO menjadi: "Senin, 28 Juli 2025 | 11.13 Wib"
 * @param isoDate - Tanggal dalam format ISO string (UTC)
 * @returns Tanggal dalam format lokal Indonesia, atau "-" jika tidak valid
 */
export function formatTanggalWIB(isoDate?: string | null): string {
  if (!isoDate) return '-';

  const parsedDate = dayjs(isoDate);
  if (!parsedDate.isValid()) return '-';

  const date = parsedDate.add(7, 'hour'); // Jika dari UTC, tambahkan 7 jam
  const hari = date.format('dddd'); // Senin, Selasa, ...
  const tanggal = date.format('D MMMM YYYY'); // 28 Juli 2025
  const jam = date.format('HH.mm'); // 11.13

  return `${hari}, ${tanggal} | ${jam} Wib`;
}
