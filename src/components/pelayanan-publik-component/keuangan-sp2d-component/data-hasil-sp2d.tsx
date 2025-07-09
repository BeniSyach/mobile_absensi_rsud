/* eslint-disable max-lines-per-function */
import { type ResponseSPM } from '@/api/keuangan';
import { ScrollView, Text, View } from '@/components/ui';

interface ResponseData {
  dataResponse: ResponseSPM;
}

export default function DataHasilSp2d({ dataResponse }: ResponseData) {
  const data = dataResponse.data;

  return (
    <ScrollView className="flex-1 p-5">
      <Text className="mb-4 text-xl font-bold text-gray-900">
        Daftar Berkas SP2D
      </Text>

      {data.length === 0 ? (
        <View className="rounded-xl border border-gray-200 bg-white p-6 shadow-md shadow-black/10">
          <Text className="text-center font-bold text-red-600">
            No SPM tidak ada
          </Text>
        </View>
      ) : (
        data.map((detail, index) => (
          <View
            key={index}
            className="mb-6 rounded-xl border border-gray-200 bg-white p-6 shadow-md shadow-black/10"
          >
            <RenderRow label="Nama SKPD" value={detail.nm_skpd} />
            <RenderRow label="No. SPM" value={detail.no_spm} />
            <RenderRow label="Tanggal SPM" value={detail.tgl_spm} />
            <RenderRow
              label="Tanggal Antar Berkas"
              value={detail.tgl_antar_berkas}
            />
            <RenderRow
              label="Jam Antar Berkas"
              value={detail.jam_antar_berkas}
            />
            <RenderRow
              label="Pengantar Berkas"
              value={detail.pengantar_berkas}
            />
            <RenderRow label="Nama Penerima" value={detail.nm_penerima} />
            <RenderRow label="Jumlah Dana" value={detail.jumlah_dana} />
            <RenderRow label="Uraian SPM" value={detail.uraian_spm} />
            <RenderRow label="No. SP2D" value={detail.no_sp2d} />
            <RenderRow label="Tanggal SP2D" value={detail.tgl_sp2d} />

            <View className="mt-4 flex-row items-center">
              <Text className="font-extrabold text-gray-700">Status:</Text>
              <Text
                className={`ml-2 font-bold ${
                  detail.status === 'Proses Selesai'
                    ? 'text-green-600'
                    : 'text-yellow-600'
                }`}
              >
                {detail.status}
              </Text>
            </View>
          </View>
        ))
      )}
    </ScrollView>
  );
}

const RenderRow = ({ label, value }: { label: string; value: string }) => (
  <View className="mb-1 flex-row items-center">
    <Text className="w-40 font-extrabold text-gray-700">{label}</Text>
    <Text className="w-4 font-extrabold text-gray-700">:</Text>
    <Text className="flex-1 font-medium text-gray-800">{value}</Text>
  </View>
);
