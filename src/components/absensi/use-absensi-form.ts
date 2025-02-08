import { zodResolver } from '@hookform/resolvers/zod';
import * as React from 'react';
import { useForm } from 'react-hook-form';

import type { GetUserDetailResponse } from '@/api';
import type { WaktuKerjaResponse } from '@/api/hari-kerja/types';
import { type GetShiftResponseArray } from '@/api/shift/types';
import type { OptionType } from '@/components/ui';

import { type FormType, schema } from './absensi-types';
import { UseFormState } from './use-form-state';

const getShiftOptions = (
  shifts: GetShiftResponseArray | undefined
): OptionType[] =>
  shifts?.map((d) => ({
    value: d.id,
    label: d.nama_shift,
  })) || [];

const getWorkTimeOptions = (
  workTimes: WaktuKerjaResponse | undefined
): OptionType[] =>
  workTimes?.map((w) => ({
    value: w.id,
    label: w.hari.nama_hari,
  })) || [];

interface FormFieldConfig {
  state: ReturnType<typeof UseFormState>;
  isMapReady: boolean;
  initialTipeAbsensiValue: string;
  isTipeAbsensiDisabled: boolean;
  errors: any;
}

function useFormFieldProps({
  state,
  isMapReady,
  initialTipeAbsensiValue,
  isTipeAbsensiDisabled,
  errors,
}: FormFieldConfig) {
  const [showCamera, setShowCamera] = React.useState(false);

  return React.useMemo(
    () => ({
      tipe_absensi_value: initialTipeAbsensiValue,
      shift_value: state.shift,
      hari_kerja_value: state.hari_kerja,
      tipe_shift: getShiftOptions(state.shifts),
      tipe_hari_kerja: getWorkTimeOptions(state.workTimes),
      onTipeAbsensiSelect: isMapReady ? state.Settipe_absensi : () => {},
      onShiftSelect: isMapReady ? state.Setshift : () => {},
      onHariKerjaSelect: isMapReady ? state.Sethari_kerja : () => {},
      onImageSelect: isMapReady ? state.handlePhotoCapture : () => {},
      image: state.photo,
      errors,
      isTipeAbsensiDisabled: !isMapReady || isTipeAbsensiDisabled,
      showCamera,
      setShowCamera,
    }),
    [
      initialTipeAbsensiValue,
      state,
      isMapReady,
      errors,
      isTipeAbsensiDisabled,
      showCamera,
    ]
  );
}

function useAbsensiInitialState(user: GetUserDetailResponse) {
  const initialTipeAbsensiValue = React.useMemo(
    () => (user.lastAbsenStatus?.status === 1 ? '1' : '0'),
    [user.lastAbsenStatus?.status]
  );

  const isTipeAbsensiDisabled = React.useMemo(
    () => user.lastAbsenStatus?.status === 1,
    [user.lastAbsenStatus?.status]
  );

  return { initialTipeAbsensiValue, isTipeAbsensiDisabled };
}

export function useAbsensiForm(user: GetUserDetailResponse) {
  const {
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<FormType>({
    resolver: zodResolver(schema),
  });

  const state = UseFormState(setValue);
  const [isMapReady, setIsMapReady] = React.useState(false);
  const { initialTipeAbsensiValue, isTipeAbsensiDisabled } =
    useAbsensiInitialState(user);

  const handleLocationUpdate = React.useCallback(
    (lat: string, lng: string) => {
      state.setLatitude(lat);
      state.setLongitude(lng);
      setIsMapReady(true);
    },
    [state]
  );

  React.useEffect(() => {
    setValue('tipe_absensi', initialTipeAbsensiValue);
    if (user.lastAbsenStatus?.absen_masuk_id) {
      setValue(
        'absen_masuk_id',
        user.lastAbsenStatus.absen_masuk_id.toString()
      );
    }
  }, [initialTipeAbsensiValue, user.lastAbsenStatus?.absen_masuk_id, setValue]);

  const formFieldProps = useFormFieldProps({
    state,
    isMapReady,
    initialTipeAbsensiValue,
    isTipeAbsensiDisabled,
    errors,
  });

  return { handleSubmit, handleLocationUpdate, formFieldProps };
}
