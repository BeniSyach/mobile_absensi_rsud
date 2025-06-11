/* eslint-disable max-lines-per-function */
import axios from 'axios';
import { Stack } from 'expo-router';
import { Search } from 'lucide-react-native';
import { useState } from 'react';
import { Alert, ImageBackground, SafeAreaView, StatusBar } from 'react-native';
import { z } from 'zod';

import { type UMKMResponse } from '@/api/sada-sada';
import ListDataUmkm from '@/components/pelayanan-publik-component/sada-sada-component/data-umkm-component/list-data-umkm';
import { Button, Image, Input, View } from '@/components/ui';
import { white } from '@/components/ui/colors';

const searchSchema = z.object({
  nik: z.string().min(16, 'NIK harus 16 digit'),
});

export default function DataUmkm() {
  const [nik, setNik] = useState('');
  const [data, setData] = useState([]);
  const [dataUmkm, setDataUmkm] = useState<UMKMResponse>({
    status: 200,
    messages: '',
    data: {
      nomorIndukKependudukan: '',
      namaLengkap: '',
      alamatPribadi: '',
      nomorTelepon: '',
      email: '',
      usaha: [],
    },
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isPending, setIsPending] = useState(false);
  const handleCari = async () => {
    const result = searchSchema.safeParse({ nik });
    if (!result.success) {
      // Mapping error per field
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        const field = err.path[0] as string;
        fieldErrors[field] = err.message;
      });
      setFormErrors(fieldErrors);
      return;
    }

    // Reset error jika valid
    setFormErrors({});
    setIsPending(true); // Set loading state
    try {
      const response = await axios.post(
        'https://diskopukm.deliserdangkab.go.id/API/deliserdangsehat/PencarianUMKMByNIK',
        {
          nik: nik,
        }
      );
      if (response.data.status === 200) {
        setData(response.data.data.usaha);
        setDataUmkm(response.data);
      } else {
        Alert.alert('Data tidak ditemukan', 'Gagal Mengirim Berkas');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      Alert.alert('Gagal Menghubungi Server', 'Server Tidak Dapat Terhubung');
    } finally {
      setIsPending(false); // Set selesai loading
    }
  };
  return (
    <SafeAreaView className="flex-1 bg-[#91F4F4]">
      <StatusBar backgroundColor="#91F4F4" barStyle="dark-content" />
      <Stack.Screen
        options={{
          title: 'Data-UMKM',
          headerBackTitle: 'Data-UMKM',
          headerShown: false,
        }}
      />
      <ImageBackground
        source={require('../../../../../assets/image/pelayanan-publik/koperasi/background-sada-sada.png')}
        resizeMode="cover"
        className="flex-1"
      >
        <View className="items-center justify-center">
          <Image
            source={require('../../../../../assets/image/pelayanan-publik/koperasi/pencarian-data-umkm.png')}
            contentFit="contain"
            className="h-36 w-80"
          />
        </View>
        <View className="m-4">
          <Input
            placeholder="Masukkan NIK anda"
            label="Pencarian Berdasarkan NIK"
            value={nik}
            onChangeText={(text) => {
              setNik(text);
              setFormErrors((prev) => ({ ...prev, nik: '' })); // hapus error saat edit
            }}
            error={formErrors.nik}
            keyboardType="number-pad"
          />
          <Button
            label="CARI"
            icon={<Search color={white} size={18} />}
            onPress={handleCari}
            className="bg-[#015757]"
            loading={isPending}
          />
        </View>
        <ListDataUmkm
          Pending={isPending}
          dataUmkm={dataUmkm}
          dataUsaha={data}
        />
      </ImageBackground>
    </SafeAreaView>
  );
}
