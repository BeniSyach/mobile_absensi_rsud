import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

import { AciInput } from './input-aci';

interface RegisterInputProps extends React.ComponentProps<typeof AciInput> {
  iconName: keyof typeof Ionicons.glyphMap;
  rightIcon?: React.ReactNode;
}

const RegisterInput = ({
  iconName,
  rightIcon,
  ...props
}: RegisterInputProps) => (
  <AciInput
    className="rounded-full border border-gray-300 bg-white py-3 pr-4"
    style={{ paddingLeft: 48 }}
    leftIcon={<Ionicons name={iconName} size={20} color="#9ca3af" />}
    rightIcon={rightIcon}
    {...props}
  />
);

interface RegisterFormProps {
  name: string;
  setName: (val: string) => void;
  nik: string;
  setNik: (val: string) => void;
  phoneNumber: string;
  setPhoneNumber: (val: string) => void;
  email: string;
  setEmail: (val: string) => void;
  password: string;
  setPassword: (val: string) => void;
  confirmPassword: string;
  setConfirmPassword: (val: string) => void;
  showPassword: boolean;
  setShowPassword: (val: boolean) => void;
  showConfirmPassword: boolean;
  setShowConfirmPassword: (val: boolean) => void;
  errors: Record<string, string>;
  setErrors: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  handleSendOtp: () => void;
  isOtpSending: boolean;
  isPhoneVerified: boolean;
}

const RegisterIdentityInputs = ({
  name,
  setName,
  nik,
  setNik,
  errors,
  setErrors,
}: Pick<
  RegisterFormProps,
  'name' | 'setName' | 'nik' | 'setNik' | 'errors' | 'setErrors'
>) => (
  <>
    <RegisterInput
      iconName="person-outline"
      placeholder="Masukkan nama sesuai KTP"
      value={name}
      onChangeText={(text) => {
        setName(text);
        if (errors.name) setErrors({ ...errors, name: '' });
      }}
      error={errors.name}
    />
    <RegisterInput
      iconName="card-outline"
      placeholder="Masukan 16 digit NIK"
      keyboardType="number-pad"
      maxLength={16}
      value={nik}
      onChangeText={(text) => {
        setNik(text);
        if (errors.nik) setErrors({ ...errors, nik: '' });
      }}
      error={errors.nik}
    />
  </>
);

const RegisterContactInputs = ({
  phoneNumber,
  setPhoneNumber,
  email,
  setEmail,
  errors,
  setErrors,
  handleSendOtp,
  isOtpSending,
  isPhoneVerified,
}: Pick<
  RegisterFormProps,
  | 'phoneNumber'
  | 'setPhoneNumber'
  | 'email'
  | 'setEmail'
  | 'errors'
  | 'setErrors'
  | 'handleSendOtp'
  | 'isOtpSending'
  | 'isPhoneVerified'
>) => (
  <>
    <RegisterInput
      iconName="phone-portrait-outline"
      placeholder="Masukan nomor ponsel"
      keyboardType="phone-pad"
      value={phoneNumber}
      editable={!isPhoneVerified}
      onChangeText={(text) => {
        setPhoneNumber(text);
        if (errors.phoneNumber) setErrors({ ...errors, phoneNumber: '' });
      }}
      error={errors.phoneNumber}
      rightIcon={
        isPhoneVerified ? (
          <View className="mr-2 size-7 items-center justify-center rounded-full bg-green-100">
            <Ionicons name="checkmark-circle" size={20} color="#22c55e" />
          </View>
        ) : (
          <TouchableOpacity
            onPress={handleSendOtp}
            disabled={isOtpSending}
            className="mr-2 rounded-lg bg-[#0061e6] px-3 py-1.5"
          >
            <Text className="text-xs font-bold text-white">
              {isOtpSending ? '...' : 'OTP'}
            </Text>
          </TouchableOpacity>
        )
      }
    />
    <RegisterInput
      iconName="mail-outline"
      placeholder="Masukan alamat email"
      keyboardType="email-address"
      autoCapitalize="none"
      value={email}
      onChangeText={(text) => {
        setEmail(text);
        if (errors.email) setErrors({ ...errors, email: '' });
      }}
      error={errors.email}
    />
  </>
);

const RegisterSecurityInputs = ({
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,
  showPassword,
  setShowPassword,
  showConfirmPassword,
  setShowConfirmPassword,
  errors,
  setErrors,
}: Pick<
  RegisterFormProps,
  | 'password'
  | 'setPassword'
  | 'confirmPassword'
  | 'setConfirmPassword'
  | 'showPassword'
  | 'setShowPassword'
  | 'showConfirmPassword'
  | 'setShowConfirmPassword'
  | 'errors'
  | 'setErrors'
>) => (
  <>
    <RegisterInput
      iconName="lock-closed-outline"
      placeholder="Masukkan kata sandi"
      secureTextEntry={!showPassword}
      value={password}
      onChangeText={(text) => {
        setPassword(text);
        if (errors.password) setErrors({ ...errors, password: '' });
      }}
      error={errors.password}
      rightIcon={
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Ionicons
            name={showPassword ? 'eye-off-outline' : 'eye-outline'}
            size={20}
            color="#9ca3af"
          />
        </TouchableOpacity>
      }
    />
    <RegisterInput
      iconName="lock-closed-outline"
      placeholder="Masukkan ulang kata sandi"
      secureTextEntry={!showConfirmPassword}
      value={confirmPassword}
      onChangeText={(text) => {
        setConfirmPassword(text);
        if (errors.confirmPassword)
          setErrors({ ...errors, confirmPassword: '' });
      }}
      error={errors.confirmPassword}
      rightIcon={
        <TouchableOpacity
          onPress={() => setShowConfirmPassword(!showConfirmPassword)}
        >
          <Ionicons
            name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'}
            size={20}
            color="#9ca3af"
          />
        </TouchableOpacity>
      }
    />
  </>
);

export const RegisterForm = (props: RegisterFormProps) => {
  return (
    <View className="gap-4">
      <RegisterIdentityInputs {...props} />
      <RegisterContactInputs {...props} />
      <RegisterSecurityInputs {...props} />
    </View>
  );
};
