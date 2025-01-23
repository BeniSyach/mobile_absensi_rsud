import { useEffect, useState } from 'react';
import type { UseFormSetValue } from 'react-hook-form';

import { ControlledInput, Select } from '../ui';
import type { FormType } from './form-edit-user';
import { useFormOptions } from './use-form-options';

export const FormFields = ({
  control,
  errors,
  setValue,
}: {
  control: any;
  errors: any;
  setValue: UseFormSetValue<FormType>;
}) => {
  const [divisi_id, setDivisi_id] = useState<string | number | undefined>();
  const [gender_id, setGender_id] = useState<string | number | undefined>();
  const [status_id, setStatus_id] = useState<string | number | undefined>();
  const {
    divisiOptions,
    genderOptions,
    statusOptions,
    divisiPlaceholder,
    genderPlaceholder,
    statusPlaceholder,
  } = useFormOptions();

  useEffect(() => {
    if (control?._defaultValues) {
      setDivisi_id(control._defaultValues.id_divisi);
      setGender_id(control._defaultValues.id_gender);
      setStatus_id(control._defaultValues.id_status);
    }
  }, [control]);

  useEffect(() => {
    if (divisi_id) setValue('id_divisi', divisi_id.toString());
    if (gender_id) setValue('id_gender', gender_id.toString());
    if (status_id) setValue('id_status', status_id.toString());
  }, [divisi_id, gender_id, status_id, setValue]);

  return (
    <>
      <ControlledInput control={control} name="name" label="Nama" />
      <ControlledInput control={control} name="email" label="Email" />
      <ControlledInput control={control} name="nik" label="NIK" />
      <Select
        label="Divisi"
        options={divisiOptions}
        value={Number(divisi_id)}
        onSelect={(option) => setDivisi_id(option)}
        placeholder={divisiPlaceholder}
        error={errors.id_divisi?.message}
      />
      <Select
        label="Jenis Kelamin"
        options={genderOptions}
        value={Number(gender_id)}
        onSelect={(option) => setGender_id(option)}
        placeholder={genderPlaceholder}
        error={errors.id_gender?.message}
      />
      <Select
        label="Status Kepegawaian"
        options={statusOptions}
        value={Number(status_id)}
        onSelect={(option) => setStatus_id(option)}
        placeholder={statusPlaceholder}
        error={errors.id_status?.message}
      />
    </>
  );
};
