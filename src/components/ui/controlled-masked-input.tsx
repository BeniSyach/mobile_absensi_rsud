import React from 'react';
import {
  type Control,
  type FieldValues,
  type Path,
  useController,
} from 'react-hook-form';

import { MaskedInput, type MaskedInputProps } from './mask-input'; // path sesuai struktur kamu

interface ControlledMaskedInputProps<T extends FieldValues>
  extends MaskedInputProps {
  name: Path<T>;
  control: Control<T>;
}

export function ControlledMaskedInput<T extends FieldValues>({
  name,
  control,
  ...rest
}: ControlledMaskedInputProps<T>) {
  const { field, fieldState } = useController({ name, control });

  return (
    <MaskedInput
      value={field.value}
      onChangeText={field.onChange}
      error={fieldState.error?.message}
      {...rest}
    />
  );
}
