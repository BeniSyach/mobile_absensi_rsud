/* eslint-disable max-lines-per-function */
import { type Permohonan } from '@/api/perizinan';
import { ScrollView, Text, View } from '@/components/ui';

interface ResponseData {
  dataResponse: Permohonan;
}

export default function DataHasilSeriDeli({ dataResponse }: ResponseData) {
  const allTimelineSteps = [
    'Menerima dan Memeriksa Berkas',
    'Entri Data',
    'Verifikasi Analis Kebijakan',
    'Penjadwalan Tinjauan',
    'Rekomendasi',
    'Pembuatan Nota Dinas Analis Kebijakan',
    'Verifikasi Kabid',
    'Penetapan Izin',
    'Pembuatan Izin',
    'Penyerahan Izin',
    'Arsip',
  ];

  const currentStepIndex = allTimelineSteps.findIndex(
    (step) => step === dataResponse.n_sts_permohonan
  );

  const timelineData = allTimelineSteps.map((title, index) => ({
    title,
    status: index <= currentStepIndex,
  }));

  return (
    <ScrollView className="flex-1 p-5">
      <Text className="mb-4 text-xl font-bold text-gray-900">
        Detail Status Permohonan
      </Text>
      <View className="rounded-xl border border-gray-200 bg-white p-6 shadow-md shadow-black/10">
        <View className="mb-1 flex-row items-center">
          <Text className="w-36 font-extrabold text-gray-700">
            Nomor Pendaftar
          </Text>
          <Text className="w-4 font-extrabold text-gray-700">:</Text>
          <Text className="flex-1 font-extrabold text-gray-700">
            {dataResponse.pendaftaran_id}
          </Text>
        </View>

        <View className="mb-1 flex-row items-center">
          <Text className="w-36 font-extrabold text-gray-700">
            Nama Pemohon
          </Text>
          <Text className="w-4 font-extrabold text-gray-700">:</Text>
          <Text className="flex-1 font-extrabold text-gray-700">
            {dataResponse.n_pemohon}
          </Text>
        </View>

        <View className="mb-1 flex-row items-center">
          <Text className="w-36 font-extrabold text-gray-700">
            Nama Perizinan
          </Text>
          <Text className="w-4 font-extrabold text-gray-700">:</Text>
          <Text className="flex-1 font-extrabold text-gray-700">
            {dataResponse.n_perizinan}
          </Text>
        </View>

        <View className="my-4 flex-row items-center">
          <Text className="font-extrabold text-gray-700">
            Status Proses Perizinan :
          </Text>
        </View>

        {timelineData.map((item, index) => {
          const isActive = item.status === true;

          return (
            <View key={index} className="flex-row items-start">
              {/* Line & Circle */}
              <View className="items-center">
                <View
                  className={`size-5 rounded-full ${
                    isActive ? 'bg-blue-500' : 'bg-gray-400'
                  }`}
                />
                {index !== timelineData.length - 1 && (
                  <View
                    className={`w-1 ${
                      isActive ? 'bg-blue-500' : 'bg-gray-400'
                    }`}
                    style={{ height: 25 }}
                  />
                )}
              </View>

              {/* Content */}
              <View className="mb-2 ml-4 flex-1">
                <Text
                  className={`text-base font-semibold ${
                    isActive ? 'text-blue-600' : 'text-gray-500'
                  }`}
                >
                  {item.title}
                </Text>
              </View>
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
}
