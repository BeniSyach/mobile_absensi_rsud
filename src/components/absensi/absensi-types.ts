import { z } from 'zod';

export const schema = z.object({
  tipe_absensi: z.string({ required_error: 'Tipe Absensi Tidak Boleh Kosong' }),
  shift_id: z.string({ required_error: 'Shift Tidak Boleh Kosong' }),
  waktu_kerja_id: z.string({ required_error: 'Hari Kerja Tidak Boleh Kosong' }),
  photo: z.object(
    {
      uri: z.string(),
      type: z.string(),
      name: z.string(),
    },
    { required_error: 'Photo Tidak Boleh Kosong' }
  ),
  longitude: z.string({ required_error: 'Lokasi Tidak Boleh Kosong' }),
  latitude: z.string({ required_error: 'Lokasi Tidak Boleh Kosong' }),
  absen_masuk_id: z.string().optional(),
});

export type FormType = z.infer<typeof schema>;
