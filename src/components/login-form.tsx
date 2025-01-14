import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff } from 'lucide-react-native';
import React, { useState } from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import * as z from 'zod';

import {
  Button,
  ControlledInput,
  Image,
  Pressable,
  Text,
  View,
} from '@/components/ui';

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

const renderControlledInputs = (
  control: any,
  showPassword: boolean,
  togglePasswordVisibility: () => void
) => (
  <>
    <ControlledInput
      testID="email-input"
      control={control}
      name="email"
      label="Email"
    />
    <ControlledInput
      testID="password-input"
      control={control}
      name="password"
      label="Password"
      placeholder="***"
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
  </>
);

export const LoginForm = ({
  onSubmit = () => {},
  isPending,
}: LoginFormProps) => {
  const [showPassword, setShowPassword] = useState(true);
  const { handleSubmit, control } = useForm<FormType>({
    resolver: zodResolver(schema),
  });
  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior="padding"
      keyboardVerticalOffset={10}
    >
      <View className="flex-1 justify-center p-4">
        <View className="items-center justify-center">
          <Text
            testID="form-title"
            className="pb-6 text-center text-4xl font-bold"
          >
            Login Absensi
          </Text>

          <Image
            source={require('../../assets/logorsud.png')}
            className="my-5 size-24"
          />
        </View>

        {renderControlledInputs(
          control,
          showPassword,
          togglePasswordVisibility
        )}

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
