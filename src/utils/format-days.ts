import 'dayjs/locale/id';

import dayjs from 'dayjs';

dayjs.locale('id');

export function formatTanggalWIB(isoDate?: string | null): string {
  if (!isoDate) return '-';

  // Date bawaan JS → otomatis parse UTC dari string Z
  const jsDate = new Date(isoDate);

  // lalu bungkus ke dayjs, anggap sudah WIB
  const parsedDate = dayjs(jsDate).locale('id');

  const hari = parsedDate.format('dddd'); // Selasa
  const tanggal = parsedDate.format('D MMMM YYYY'); // 2 September 2025
  const jam = parsedDate.format('HH.mm'); // 10.19

  return `${hari}, ${tanggal} | ${jam} WIB`;
}
