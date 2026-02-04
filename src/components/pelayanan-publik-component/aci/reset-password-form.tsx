import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

import { AciInput } from './input-aci';

interface PasswordInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  isVisible: boolean;
  onToggleVisibility: () => void;
  placeholder: string;
  containerClassName?: string;
  error?: string;
}

const PasswordInput = ({
  label,
  value,
  onChangeText,
  isVisible,
  onToggleVisibility,
  placeholder,
  containerClassName,
  error,
}: PasswordInputProps) => (
  <View className={containerClassName}>
    <Text className="mb-2 ml-1 text-sm font-medium text-gray-700">{label}</Text>
    <AciInput
      leftIcon={
        <Ionicons name="lock-closed-outline" size={20} color="#9ca3af" />
      }
      rightIcon={
        <TouchableOpacity onPress={onToggleVisibility}>
          <Ionicons
            name={isVisible ? 'eye-off-outline' : 'eye-outline'}
            size={20}
            color="#9ca3af"
          />
        </TouchableOpacity>
      }
      placeholder={placeholder}
      secureTextEntry={!isVisible}
      className="rounded-full border border-gray-300 bg-white py-3 pr-4"
      style={{ paddingLeft: 48 }}
      value={value}
      onChangeText={onChangeText}
      error={error}
    />
  </View>
);

interface ResetPasswordFormProps {
  password: string;
  setPassword: (text: string) => void;
  confirmPassword: string;
  setConfirmPassword: (text: string) => void;
  isPasswordVisible: boolean;
  setIsPasswordVisible: (visible: boolean) => void;
  isConfirmPasswordVisible: boolean;
  setIsConfirmPasswordVisible: (visible: boolean) => void;
  onSubmit: () => void;
  errors: { password?: string; confirmPassword?: string };
}

export const ResetPasswordForm = ({
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,
  isPasswordVisible,
  setIsPasswordVisible,
  isConfirmPasswordVisible,
  setIsConfirmPasswordVisible,
  onSubmit,
  errors,
}: ResetPasswordFormProps) => {
  return (
    <View>
      <PasswordInput
        label="Kata Sandi Baru"
        value={password}
        onChangeText={setPassword}
        isVisible={isPasswordVisible}
        onToggleVisibility={() => setIsPasswordVisible(!isPasswordVisible)}
        placeholder="Masukan kata sandi baru"
        containerClassName="mb-4"
        error={errors.password}
      />

      <PasswordInput
        label="Konfirmasi Kata Sandi"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        isVisible={isConfirmPasswordVisible}
        onToggleVisibility={() =>
          setIsConfirmPasswordVisible(!isConfirmPasswordVisible)
        }
        placeholder="Masukan ulang kata sandi"
        containerClassName="mb-8"
        error={errors.confirmPassword}
      />

      <TouchableOpacity
        onPress={onSubmit}
        className="mb-4 items-center justify-center rounded-xl bg-[#0061e6] py-4"
        activeOpacity={0.8}
      >
        <Text className="text-center text-lg font-bold text-white">Simpan</Text>
      </TouchableOpacity>
    </View>
  );
};
