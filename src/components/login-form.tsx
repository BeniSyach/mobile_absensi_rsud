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
  Text,
  View,
} from '@/components/ui';

const storage = new MMKV({
  id: 'credentials-storage',
  encryptionKey: 'credentials-key',
});

const schema = z.object({
  email: z
    .string({
      required_error: 'Email is required',
    })
    .email('Invalid email format'),
  password: z
    .string({
      required_error: 'Password is required',
    })
    .min(6, 'Password must be at least 6 characters'),
});

export type FormType = z.infer<typeof schema>;

export type LoginFormProps = {
  onSubmit?: SubmitHandler<FormType>;
  isPending?: boolean;
  isError?: boolean;
};

type RenderInputsProps = {
  control: any;
  showPassword: boolean;
  togglePasswordVisibility: () => void;
  email: string;
  password: string;
};

const renderControlledInputs = ({
  control,
  showPassword,
  togglePasswordVisibility,
  email,
  password,
}: RenderInputsProps) => (
  <>
    <ControlledInput
      testID="email-input"
      control={control}
      name="email"
      label="Email"
      defaultValue={email}
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
            email: values.email,
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
      <Checkbox.Label text="Email dan Password Anda Akan Disimpan" />
    </Checkbox.Root>
  );
};

const FormHeader = () => (
  <View className="items-center justify-center">
    <Text testID="form-title" className="pb-6 text-center text-4xl font-bold">
      Login Absensi
    </Text>
    <Image
      source={require('../../assets/logorsud.png')}
      className="my-5 size-24"
      transition={1000}
    />
  </View>
);

export const LoginForm = ({
  onSubmit = () => {},
  isPending,
}: LoginFormProps) => {
  const [showPassword, setShowPassword] = useState(true);
  const [savedEmail, setSavedEmail] = useState('');
  const [savedPassword, setSavedPassword] = useState('');
  const { handleSubmit, control, setValue } = useForm<FormType>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: '',
      password: '',
    },
  });
  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  React.useEffect(() => {
    const loadSavedCredentials = () => {
      try {
        const savedCredentials = storage.getString('savedCredentials');
        if (savedCredentials) {
          const { email, password } = JSON.parse(savedCredentials);
          setSavedEmail(email);
          setSavedPassword(password);
          setValue('email', email);
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
          email: savedEmail,
          password: savedPassword,
        })}
        <Button
          testID="login-button"
          label="Login"
          size="lg"
          loading={isPending}
          onPress={handleSubmit(onSubmit)}
        />
      </View>
    </KeyboardAvoidingView>
  );
};
