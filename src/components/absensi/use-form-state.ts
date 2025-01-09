import React from 'react';
import { type UseFormSetValue } from 'react-hook-form';

import { GetShifts, GetWaktuKerjaByShift } from '@/api';

import { type FormType } from './absensi-form';
import { UseImagePicker } from './use-image-picker';

export const UseFormState = (setValue: UseFormSetValue<FormType>) => {
  const [tipe_absensi, Settipe_absensi] = React.useState<string | number>();
  const [shift, Setshift] = React.useState<string | number>();
  const [hari_kerja, Sethari_kerja] = React.useState<string | number>();
  const [longitude, setLongitude] = React.useState<string | null>(null);
  const [latitude, setLatitude] = React.useState<string | null>(null);
  const { image, mimeType, name, takePhoto } = UseImagePicker(setValue);

  const { data: shifts } = GetShifts();
  const { data: workTimes } = GetWaktuKerjaByShift({
    variables: { shiftId: Number(shift) },
    enabled: !!shift,
  });

  React.useEffect(() => {
    if (tipe_absensi) setValue('tipe_absensi', tipe_absensi.toString());
    if (shift) setValue('shift', shift.toString());
    if (hari_kerja) setValue('hari_kerja', hari_kerja.toString());
    if (longitude) setValue('longitude', longitude);
    if (latitude) setValue('latitude', latitude);
    if (image) setValue('photo', image);
    if (mimeType) setValue('mimeType', mimeType);
    if (name) setValue('name', name);
  }, [
    tipe_absensi,
    shift,
    hari_kerja,
    longitude,
    latitude,
    image,
    mimeType,
    name,
    setValue,
  ]);

  return {
    tipe_absensi,
    Settipe_absensi,
    shift,
    Setshift,
    hari_kerja,
    Sethari_kerja,
    longitude,
    setLongitude,
    latitude,
    setLatitude,
    image,
    mimeType,
    name,
    takePhoto,
    shifts,
    workTimes,
  };
};
