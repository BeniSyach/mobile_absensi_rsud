import * as FileSystem from 'expo-file-system';
import React from 'react';
import { type UseFormSetValue } from 'react-hook-form';

import { GetWaktuKerjaByShiftAndOPD } from '@/api';
import { GetShiftsByOpd } from '@/api/shift/get-shift-by-opd';

import { type FormType } from './absensi-types';

type PhotoFile = {
  uri: string;
  type: string;
  name: string;
} | null;

const createPhotoFile = async (base64Data: string) => {
  const fileName = `photo_${Date.now()}.jpg`;
  const fileUri = `${FileSystem.documentDirectory}${fileName}`;

  await FileSystem.writeAsStringAsync(fileUri, base64Data, {
    encoding: FileSystem.EncodingType.Base64,
  });

  return {
    uri: fileUri,
    type: 'image/jpeg',
    name: fileName,
  };
};

export const UseFormState = (setValue: UseFormSetValue<FormType>) => {
  const [tipe_absensi, Settipe_absensi] = React.useState<string | number>();
  const [shift, Setshift] = React.useState<string | number>();
  const [hari_kerja, Sethari_kerja] = React.useState<string | number>();
  const [longitude, setLongitude] = React.useState<string | null>(null);
  const [latitude, setLatitude] = React.useState<string | null>(null);
  const [photo, setPhoto] = React.useState<PhotoFile>(null);

  const { data: shifts } = GetShiftsByOpd();
  const { data: workTimes } = GetWaktuKerjaByShiftAndOPD({
    variables: { shiftId: Number(shift) },
    enabled: !!shift,
  });

  React.useEffect(() => {
    let isSubscribed = true;

    if (isSubscribed) {
      if (tipe_absensi) setValue('tipe_absensi', tipe_absensi.toString());
      if (shift) setValue('shift_id', shift.toString());
      if (hari_kerja) setValue('waktu_kerja_id', hari_kerja.toString());
      if (longitude) setValue('longitude', longitude);
      if (latitude) setValue('latitude', latitude);
      if (photo) setValue('photo', photo);
    }

    return () => {
      isSubscribed = false;
    };
  }, [tipe_absensi, shift, hari_kerja, longitude, latitude, photo, setValue]);

  const handlePhotoCapture = async (photoData: {
    uri: string;
    base64: string;
  }) => {
    try {
      const photoFile = await createPhotoFile(photoData.base64);
      setPhoto(photoFile);
      setValue('photo', photoFile);
    } catch (error) {
      console.error('Error processing photo:', error);
    }
  };

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
    photo,
    handlePhotoCapture,
    shifts,
    workTimes,
  };
};
