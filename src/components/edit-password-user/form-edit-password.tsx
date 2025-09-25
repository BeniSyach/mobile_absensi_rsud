/* eslint-disable max-lines-per-function */
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff } from 'lucide-react-native';
import React, { useState } from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import { KeyboardAvoidingView, Platform, Pressable } from 'react-native';
import * as z from 'zod';

import { Button, ControlledInput, Text, View } from '@/components/ui';

import { OtpInput } from './otp-input';

// Schema tiap step
const schemaStep1 = z.object({
  no_wa: z.string().min(10, 'Nomor WhatsApp tidak valid'),
});
const schemaStep2 = z.object({
  otp: z.string().length(4, 'Kode OTP harus 4 digit'),
});
const schemaStep3 = z
  .object({
    password: z.string().min(8, 'Password minimal 8 karakter'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Konfirmasi password tidak sama',
    path: ['confirmPassword'],
  });

export type Step1Values = z.infer<typeof schemaStep1>;
export type Step2Values = z.infer<typeof schemaStep2>;
export type Step3Values = z.infer<typeof schemaStep3>;

export type FormType =
  | z.infer<typeof schemaStep1>
  | z.infer<typeof schemaStep2>
  | z.infer<typeof schemaStep3>;

export default function ResetPasswordStepper({
  onSubmit = () => {},
  isPending,
}: {
  onSubmit?: SubmitHandler<FormType>;
  isPending?: boolean;
}) {
  const [step, setStep] = useState(1);
  const [phone, setPhone] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const schema =
    step === 1 ? schemaStep1 : step === 2 ? schemaStep2 : schemaStep3;

  const { handleSubmit, control, getValues, watch, setValue } =
    useForm<FormType>({
      resolver: zodResolver(schema),
    });

  const nextStep = handleSubmit(async (values) => {
    // kirim data ke parent
    await onSubmit?.(values);

    if (step === 1) {
      const no_wa = getValues('no_wa') as string;
      setPhone(no_wa);
    }
    setStep((prev) => prev + 1);
  });

  const prevStep = () => setStep((prev) => prev - 1);

  // ambil password dari form langsung
  const passwordValue = watch('password') || '';

  // rules untuk indikator password
  const rules = [
    { label: 'Minimal 8 karakter', valid: passwordValue.length >= 8 },
    { label: 'Mengandung angka', valid: /\d/.test(passwordValue) },
    { label: 'Mengandung simbol', valid: /[^A-Za-z0-9]/.test(passwordValue) },
  ];

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={20}
    >
      <View className="m-4 justify-center">
        {/* Progress Title */}
        <Text className="mb-4 text-center text-2xl font-bold text-gray-800">
          Reset Password
        </Text>
        <View className="mb-6 flex-row justify-center space-x-2">
          {[1, 2, 3].map((i) => (
            <View
              key={i}
              className={`h-2 w-12 rounded-full ${
                i <= step ? 'bg-[#20A0D8]' : 'bg-gray-300'
              }`}
            />
          ))}
        </View>

        {/* Step 1: Masukkan Nomor WA */}
        {step === 1 && (
          <>
            <Text className="text-center text-gray-600">
              Kami akan mengirimkan OTP
            </Text>
            <Text className="text-center text-gray-600">
              Melalui No WhatsApp Untuk Mengatur Ulang
            </Text>
            <Text className="text-center text-gray-600">Kata Sandi Anda</Text>
            <ControlledInput
              control={control}
              name="no_wa"
              label="No. WhatsApp"
              keyboardType="number-pad"
              placeholder="08xxxxxxxxxx"
            />
            <Button
              label="Kirim OTP"
              loading={isPending}
              onPress={nextStep}
              variant="outline"
              className="mt-6 bg-[#258DDB]"
            />
          </>
        )}

        {/* Step 2: Masukkan OTP */}
        {step === 2 && (
          <>
            <Text className="mb-4 text-center text-gray-600">
              Kami baru saja mengirim kode 4 digit{'\n'}
              ke No. WhatsApp <Text className="font-semibold">{phone}</Text>.
              {'\n'}
              Masukkan kode OTP di bawah ini:
            </Text>

            <OtpInput
              length={4}
              onChange={(code) => {
                setValue('otp', code, { shouldValidate: true }); // <<--- ini penting
              }}
            />

            <View className="mt-6 flex-row justify-between space-x-3">
              <Button
                label="Kembali"
                onPress={prevStep}
                variant="outline"
                className="bg-red-500"
              />
              <Button
                label="Verifikasi No WhatsApp"
                loading={isPending}
                onPress={nextStep}
                variant="outline"
                className="bg-[#258DDB]"
              />
            </View>
          </>
        )}

        {/* Step 3: Password Baru */}
        {step === 3 && (
          <>
            <Text className="mb-4 text-center text-gray-600">
              Masukkan password baru Anda
            </Text>
            {/* Password Baru */}
            <ControlledInput
              control={control}
              name="password"
              label="Password Baru"
              placeholder="******"
              secureTextEntry={!showPassword}
              rightIcon={
                <Pressable onPress={() => setShowPassword((p) => !p)}>
                  {showPassword ? (
                    <EyeOff size={20} color="gray" />
                  ) : (
                    <Eye size={20} color="gray" />
                  )}
                </Pressable>
              }
            />
            {/* Konfirmasi Password */}
            <ControlledInput
              control={control}
              name="confirmPassword"
              label="Konfirmasi Password"
              placeholder="******"
              secureTextEntry
            />

            {/* Indikator password */}
            <View className="mt-4 space-y-1">
              {rules.map((rule, idx) => (
                <Text
                  key={idx}
                  className={`text-sm ${
                    rule.valid ? 'text-green-600' : 'text-red-500'
                  }`}
                >
                  {rule.valid ? '✔' : '✖'} {rule.label}
                </Text>
              ))}
            </View>

            <View className="mt-6 flex-row justify-between space-x-3">
              <Button
                label="Kembali"
                onPress={prevStep}
                variant="outline"
                className="bg-red-500"
              />
              <Button
                label="Simpan Password"
                loading={isPending}
                onPress={handleSubmit(onSubmit)}
                variant="outline"
                className="bg-[#258DDB]"
              />
            </View>
          </>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}
