/* eslint-disable max-lines-per-function */
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { ActivityIndicator, Modal, Pressable, View } from 'react-native';
import { showMessage } from 'react-native-flash-message';
import { z } from 'zod';

import { queryClient } from '@/api';
import {
  type PostCutiSaldoVariables,
  PostSaldoCuti,
  useCheckSaldoCuti,
} from '@/api/cuti';
import {
  Button,
  ControlledInput,
  Image,
  showErrorMessage,
  Text,
} from '@/components/ui';
import { getMessage } from '@/lib';

const cutiSchema = z.object({
  cutiN2: z.preprocess(
    (val) => (val === '' ? undefined : Number(val)),
    z
      .number({
        required_error: 'Wajib diisi',
        invalid_type_error: 'Harus berupa angka',
      })
      .int('Harus bilangan bulat')
      .min(0, 'Tidak boleh negatif')
  ),

  cutiN1: z.preprocess(
    (val) => (val === '' ? undefined : Number(val)),
    z
      .number({
        required_error: 'Wajib diisi',
        invalid_type_error: 'Harus berupa angka',
      })
      .int('Harus bilangan bulat')
      .min(0, 'Tidak boleh negatif')
  ),

  cutiN: z.preprocess(
    (val) => (val === '' ? undefined : Number(val)),
    z
      .number({
        required_error: 'Wajib diisi',
        invalid_type_error: 'Harus berupa angka',
      })
      .int('Harus bilangan bulat')
      .min(0, 'Tidak boleh negatif')
  ),
});

export type CutiFormValues = z.infer<typeof cutiSchema>;

export default function MenuUtama() {
  const router = useRouter();
  const [isModalVisible, setModalVisible] = useState(false);
  // eslint-disable-next-line unused-imports/no-unused-vars
  const [apiResponse, setApiResponse] = useState<any>(null);
  const storedMessage = getMessage();
  const { mutateAsync: postSaldoCuti } = PostSaldoCuti({
    onSuccess: (res) => {
      showMessage({
        message: res.message,
        type: 'success',
        duration: 7000,
      });
    },
    onError: (e: any) => {
      showErrorMessage(e.error);
    },
  });
  const nik = storedMessage?.nik ?? '';

  const { isLoading, isFetching, isError, error, refetch } = useCheckSaldoCuti({
    variables: { nik },
    enabled: false, // ⬅️ kita trigger manual
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CutiFormValues>({
    resolver: zodResolver(cutiSchema),
    defaultValues: {
      cutiN2: apiResponse?.data?.sisaCuti?.cutiN2 ?? undefined,
      cutiN1: apiResponse?.data?.sisaCuti?.cutiN1 ?? undefined,
      cutiN: apiResponse?.data?.sisaCuti?.cutiN ?? undefined,
    },
  });

  // Simulasi API trigger
  // eslint-disable-next-line unused-imports/no-unused-vars
  const checkCutiStatus = async () => {
    const response = {
      success: true,
      message: 'User belum mengisi cuti',
      data: {
        userId: 123,
        cutiAvailable: false,
        cutiId: null,
        sisaCuti: { N2: 5, N1: 7, N: 10 },
      },
    };
    const result = await refetch();

    if (!result.data) return;

    if (result.data.data.exists) {
      // sudah mengisi cuti
      router.push('/cuti');
    } else {
      // belum mengisi cuti
      setApiResponse(response);
      setModalVisible(true);
    }
  };

  const onSubmit = async (data: any) => {
    console.log('Data cuti user:', data);
    const payloadSaldoCuti: PostCutiSaldoVariables = {
      nik: nik ?? '',
      sisa_cuti_2023: data?.cutiN2 ?? '',
      sisa_cuti_2024: data.cutiN1 ?? '',
      sisa_cuti_2025: data.cutiN ?? '',
    };

    await postSaldoCuti(payloadSaldoCuti);
    queryClient.invalidateQueries({ queryKey: ['useCheckSaldoCuti'] });
    setModalVisible(false);
    router.push('/cuti');
  };

  const LoadingSpinner = ({ text = 'Memuat...' }: { text?: string }) => {
    return (
      <View className="flex-row items-center justify-center gap-2 py-4">
        <ActivityIndicator size="small" color="#2563eb" />
        <Text className="text-sm text-gray-700">{text}</Text>
      </View>
    );
  };

  if (isLoading || isFetching) {
    return <LoadingSpinner />;
  }

  if (isError) {
    return <div>Error: {(error as Error).message}</div>;
  }

  return (
    <View>
      <View className="flex-row items-center justify-between py-2">
        <Link href="/absensi/menu-absensi" asChild>
          <Pressable>
            <Image
              source={require('../../../../assets/image/logo_absensi.png')}
              className="size-52 rounded-lg"
              transition={1000}
              contentFit="contain"
            />
          </Pressable>
        </Link>
        <Link href="/ekin" asChild>
          <Pressable>
            <Image
              source={require('../../../../assets/image/logo_ekin.png')}
              className="size-52 rounded-lg"
              transition={1000}
              contentFit="contain"
            />
          </Pressable>
        </Link>
      </View>
      <View className="flex-row items-center justify-between">
        <Link href="/simpeg" asChild>
          <Pressable>
            <Image
              source={require('../../../../assets/image/logo_pegawai.png')}
              className="size-52 rounded-lg"
              transition={1000}
              contentFit="contain"
            />
          </Pressable>
        </Link>
        <Pressable onPress={checkCutiStatus}>
          <Image
            source={require('../../../../assets/image/icon-cuti.png')}
            className="size-52 rounded-lg"
            transition={1000}
            contentFit="contain"
          />
        </Pressable>
      </View>
      {/* Modal */}
      <Modal
        visible={isModalVisible}
        animationType="fade"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        {/* Overlay */}
        <View className="flex-1 items-center justify-center bg-black/30">
          {/* Kontainer modal sempit */}
          <View className="w-11/12 rounded-lg bg-white p-6">
            {/* Logo */}
            <View className="mb-4 items-center">
              <Image
                source={require('../../../../assets/gif/notif.gif')}
                className="size-28"
                contentFit="contain"
              />
            </View>

            {/* Keterangan */}
            <Text className="text-center text-xl font-bold">
              Harap Lengkapi Sisa Cuti Anda
            </Text>
            <Text className="mb-4 text-center text-sm">
              Pengisian ini hanya dilakukan sekali setelah instalasi aplikasi
            </Text>

            {/* Form input cuti */}
            {apiResponse?.data.sisaCuti && (
              <>
                {[
                  { key: 'N2', name: 'cutiN2' as const, label: 'N-2 (2023)' },
                  { key: 'N1', name: 'cutiN1' as const, label: 'N-1 (2024)' },
                  { key: 'N', name: 'cutiN' as const, label: 'N (2025)' },
                ].map((item) => (
                  <View className="mb-3" key={item.key}>
                    <ControlledInput
                      control={control}
                      name={item.name}
                      label={item.label}
                      keyboardType="number-pad"
                      rightText="hari"
                      placeholder="Masukkan hari cuti"
                      error={errors.cutiN?.message}
                    />
                  </View>
                ))}
              </>
            )}

            {/* Tombol */}
            <View className="mt-4 flex-row justify-start space-x-3">
              <Button
                label="Simpan"
                variant="outline"
                className="mr-2 bg-[#20A0D8] font-bold"
                textClassName="text-white"
                onPress={handleSubmit(onSubmit)}
              />
              <Button
                label="Kembali"
                className="bg-[#D9D9D9]"
                onPress={() => setModalVisible(false)}
                variant="outline"
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
