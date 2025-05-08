import { zodResolver } from '@hookform/resolvers/zod';
import { useFocusEffect } from '@react-navigation/native';
import * as React from 'react';
import { useForm } from 'react-hook-form';

import type { ApiResponse } from '@/api';
import { type LastAbsenStatus } from '@/api/absensi/cek-status-absen-user';
import type { HariKerjaResponse } from '@/api/hari-kerja/types';
import type { ShiftResponse } from '@/api/shift/types';
import type { OptionType } from '@/components/ui';

import { type FormType, schema } from './absensi-types';
import { UseFormState } from './use-form-state';

const getShiftOptions = (shifts: ShiftResponse | undefined): OptionType[] => {
  if (!shifts?.data?.data) {
    return [];
  }

  const shiftData = Array.isArray(shifts.data.data) ? shifts.data.data : [];

  return shiftData.map((d) => ({
    value: d.id,
    label: d.nama_shift,
  }));
};

const getWorkTimeOptions = (
  workTimes: HariKerjaResponse | undefined
): OptionType[] => {
  if (!workTimes?.data?.data) {
    return [];
  }

  const workTimeData = Array.isArray(workTimes.data.data)
    ? workTimes.data.data
    : [];

  return workTimeData.map((w) => ({
    value: w.id,
    label: w.hari.nama_hari,
  }));
};

interface FormFieldConfig {
  state: ReturnType<typeof UseFormState>;
  isMapReady: boolean;
  initialTipeAbsensiValue: string;
  initialShiftValue: string;
  isTipeAbsensiDisabled: boolean;
  errors: any;
}

function useFormFieldProps({
  state,
  isMapReady,
  initialTipeAbsensiValue,
  initialShiftValue,
  isTipeAbsensiDisabled,
  errors,
}: FormFieldConfig) {
  const [showCamera, setShowCamera] = React.useState(false);

  return React.useMemo(
    () => ({
      tipe_absensi_value: initialTipeAbsensiValue,
      shift_value: initialShiftValue,
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
      initialShiftValue,
      state,
      isMapReady,
      errors,
      isTipeAbsensiDisabled,
      showCamera,
    ]
  );
}

function useAbsensiInitialState(
  userStatus: LastAbsenStatus | undefined,
  user: ApiResponse
) {
  const initialTipeAbsensiValue = React.useMemo(
    () => (userStatus?.status === 1 ? '1' : '0'),
    [userStatus?.status]
  );
  const initialShiftValue = React.useMemo(
    () => user.data.shift_absen_id,
    [user.data.shift_absen_id]
  );

  const isTipeAbsensiDisabled = React.useMemo(
    () => userStatus?.status === 1,
    [userStatus?.status]
  );

  return { initialTipeAbsensiValue, initialShiftValue, isTipeAbsensiDisabled };
}

export function useAbsensiForm(
  user: ApiResponse,
  userStatus: LastAbsenStatus | undefined
) {
  const {
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<FormType>({
    resolver: zodResolver(schema),
  });

  const state = UseFormState(setValue, user);
  const { refetchShifts, refetchWorkTimes } = state;

  const [isMapReady, setIsMapReady] = React.useState(false);
  const { initialTipeAbsensiValue, initialShiftValue, isTipeAbsensiDisabled } =
    useAbsensiInitialState(userStatus, user);

  useFocusEffect(
    React.useCallback(() => {
      if (refetchShifts) {
        console.log('Refetching shifts on focus');
        refetchShifts();
      }

      if (refetchWorkTimes) {
        console.log('Refetching work times on focus');
        refetchWorkTimes();
      }

      return () => {
        // Optional cleanup
      };
    }, [refetchShifts, refetchWorkTimes])
  );

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
    if (userStatus?.absen_masuk_id && user.data.shift_absen_id) {
      setValue('absen_masuk_id', userStatus.absen_masuk_id.toString());
      setValue('shift_id', user.data.shift_absen_id);
    }
  }, [
    initialTipeAbsensiValue,
    userStatus?.absen_masuk_id,
    user.data.shift_absen_id,
    setValue,
  ]);

  const formFieldProps = useFormFieldProps({
    state,
    isMapReady,
    initialTipeAbsensiValue,
    initialShiftValue,
    isTipeAbsensiDisabled,
    errors,
  });

  return { handleSubmit, handleLocationUpdate, formFieldProps };
}
