import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff } from 'lucide-react-native';
import React, { useState } from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import { MMKV } from 'react-native-mmkv';
import * as z from 'zod';

import {
  Button,
  Checkbox,
  ControlledInput,
  Image,
  Pressable,
  View,
} from '@/components/ui';

const storage = new MMKV({
  id: 'credentials-storage',
  encryptionKey: 'credentials-key',
});

const schema = z.object({
  nik: z
    .string({
      required_error: 'NIK is required',
    })
    .length(16, 'NIK harus 16 digits')
    .regex(/^\d+$/, 'NIK harus angka'),
  password: z
    .string({
      required_error: 'Password is required',
    })
    .min(6, 'Password must be at least 6 characters'),
});

// Add a separate schema for the transformed output
const transformedSchema = schema.transform((data) => ({
  ...data,
  nik: parseInt(data.nik, 10),
}));

export type FormType = z.infer<typeof schema>;
export type TransformedFormType = z.infer<typeof transformedSchema>;

export type LoginFormProps = {
  onSubmit?: SubmitHandler<TransformedFormType>;
  isPending?: boolean;
  isError?: boolean;
};

type RenderInputsProps = {
  control: any;
  showPassword: boolean;
  togglePasswordVisibility: () => void;
  nik: string;
  password: string;
};

const renderControlledInputs = ({
  control,
  showPassword,
  togglePasswordVisibility,
  nik,
  password,
}: RenderInputsProps) => (
  <>
    <ControlledInput
      testID="email-input"
      control={control}
      name="nik"
      label="NIK"
      defaultValue={nik}
      keyboardType="numeric"
    />
    <ControlledInput
      testID="password-input"
      control={control}
      name="password"
      label="Password"
      placeholder="***"
      defaultValue={password}
      secureTextEntry={showPassword}
      rightIcon={
        <Pressable onPress={togglePasswordVisibility}>
          {showPassword ? (
            <EyeOff size={20} color="gray" />
          ) : (
            <Eye size={20} color="gray" />
          )}
        </Pressable>
      }
    />
    <CheckboxEmailAndPassword control={control} />
  </>
);

const CheckboxEmailAndPassword = ({ control }: { control: any }) => {
  const [checked, setChecked] = React.useState(false);

  const handleCheckboxChange = (isChecked: boolean) => {
    setChecked(isChecked);
    if (isChecked) {
      const values = control._formValues;
      try {
        storage.set(
          'savedCredentials',
          JSON.stringify({
            nik: values.nik,
            password: values.password,
          })
        );
      } catch (error) {
        console.error('Error saving credentials:', error);
      }
    } else {
      storage.delete('savedCredentials');
    }
  };

  return (
    <Checkbox.Root
      checked={checked}
      onChange={handleCheckboxChange}
      accessibilityLabel="accept terms of condition"
      className="py-2"
    >
      <Checkbox.Icon checked={checked} />
      <Checkbox.Label text="Nik dan Password Anda Akan Disimpan" />
    </Checkbox.Root>
  );
};

const FormHeader = () => (
  <View className="items-center justify-center">
    <Image
      source={require('../../assets/logo_login.png')}
      className="size-56"
      transition={1000}
      contentFit="contain"
    />
  </View>
);

export const LoginForm = ({
  onSubmit = () => {},
  isPending,
}: LoginFormProps) => {
  const [showPassword, setShowPassword] = useState(true);
  const [savedNik, setSavedNik] = useState('');
  const [savedPassword, setSavedPassword] = useState('');
  const { handleSubmit, control, setValue } = useForm<TransformedFormType>({
    resolver: zodResolver(transformedSchema),
    defaultValues: {
      nik: 0,
      password: '',
    },
  });
  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  React.useEffect(() => {
    const loadSavedCredentials = () => {
      try {
        const savedCredentials = storage.getString('savedCredentials');
        if (savedCredentials) {
          const { nik, password } = JSON.parse(savedCredentials);
          setSavedNik(nik);
          setSavedPassword(password);
          setValue('nik', nik);
          setValue('password', password);
        }
        console.log('sukses', savedCredentials);
      } catch (error) {
        console.error('Error loading credentials:', error);
      }
    };
    loadSavedCredentials();
  }, [setValue]);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior="padding"
      keyboardVerticalOffset={10}
    >
      <View className="flex-1 justify-center p-4">
        <FormHeader />
        {renderControlledInputs({
          control,
          showPassword,
          togglePasswordVisibility,
          nik: savedNik,
          password: savedPassword,
        })}
        <Button
          testID="login-button"
          label="Login"
          size="lg"
          className="rounded-full bg-[#0B3880] dark:bg-[#5491f3]"
          loading={isPending}
          onPress={handleSubmit(onSubmit)}
        />
      </View>
    </KeyboardAvoidingView>
  );
};
