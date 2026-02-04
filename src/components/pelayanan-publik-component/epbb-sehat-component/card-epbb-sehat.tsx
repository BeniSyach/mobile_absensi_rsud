/* eslint-disable max-lines-per-function */
import axios from 'axios';
import { useState } from 'react';
import {
  ActivityIndicator,
  Modal,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { type NopPerTahunResponse, type RiwayatNop } from '@/api/bapenda';
import { Image } from '@/components/ui';

interface CardProps {
  dataTagihan: RiwayatNop;
  nop: string;
}

const parseNOP = (nop: string) => {
  const [
    kd_propinsi,
    kd_dati2,
    kd_kecamatan,
    kd_kelurahan,
    kd_blok,
    no_urut,
    kd_jns_op,
  ] = nop.split('.');

  return {
    kd_propinsi,
    kd_dati2,
    kd_kecamatan,
    kd_kelurahan,
    kd_blok,
    no_urut,
    kd_jns_op,
  };
};

const Row = ({ label, value }: { label: string; value?: string }) => (
  <View className="flex-row">
    <Text className="w-44 text-xs text-gray-700">{label}</Text>
    <Text className="mx-1 text-xs">:</Text>
    <Text className="flex-1 text-xs font-semibold text-gray-900">
      {value ?? '-'}
    </Text>
  </View>
);

export default function CardEPbbSehat({ dataTagihan, nop }: CardProps) {
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [detail, setDetail] = useState<NopPerTahunResponse | null>(null);
  const handleReview = async () => {
    try {
      const {
        kd_propinsi,
        kd_dati2,
        kd_kecamatan,
        kd_kelurahan,
        kd_blok,
        no_urut,
        kd_jns_op,
      } = parseNOP(nop);

      setVisible(true);
      setLoading(true);

      const res = await axios.get<NopPerTahunResponse>(
        'https://bpdsumut-dss.deliserdangkab.go.id/api/mobile/NOPPerTahun',
        {
          params: {
            kd_propinsi,
            kd_dati2,
            kd_kecamatan,
            kd_kelurahan,
            kd_blok,
            no_urut,
            kd_jns_op,
            tahun: dataTagihan.tahun_pajak,
          },
        }
      );

      setDetail(res.data); // ✅ axios
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const formatRupiah = (value: any) => {
    if (!value) return 'Rp0';
    return `Rp ${Number(value).toLocaleString('id-ID')}`;
  };
  const isLunas = dataTagihan.status === 'LUNAS';
  return (
    <View className="m-3 rounded-3xl bg-[#C9D6F5] p-5">
      {/* CONTENT */}
      <View className="flex-row justify-between">
        {/* KIRI */}
        <View className="flex-1 space-y-2">
          <View className="flex-row">
            <Text className="w-36 text-lg font-bold">Tahun Pajak</Text>
            <Text className="text-lg font-bold">
              : {dataTagihan.tahun_pajak}
            </Text>
          </View>

          <View className="flex-row">
            <Text className="w-36 text-base">Tgl. Jatuh Tempo</Text>
            <Text className="text-base">: {dataTagihan.jatuh_tempo}</Text>
          </View>

          <View className="flex-row">
            <Text className="w-36 text-base">Pokok Pajak</Text>
            <Text className="text-base">
              : {formatRupiah(dataTagihan.pokok_pajak)}
            </Text>
          </View>
        </View>

        {/* KANAN */}
        <View className="ml-4 items-end space-y-2">
          <View className="flex-row">
            <Text className="w-16 text-right text-base">Denda</Text>
            <Text className="text-base">
              {' '}
              : {formatRupiah(dataTagihan.denda)}
            </Text>
          </View>

          <View className="flex-row">
            <Text className="w-16 text-right text-base">Total</Text>
            <Text className="text-base">
              : {formatRupiah(dataTagihan.total)}
            </Text>
          </View>

          <View className="flex-row items-center">
            <Text className="w-16 text-right text-base">Status</Text>
            <Text className="text-base"> :</Text>
            <View
              className={`ml-2 rounded-md px-3 py-1 ${
                isLunas ? 'bg-green-700' : 'bg-red-600'
              }`}
            >
              <Text className="text-xs font-bold text-white">
                {isLunas ? 'LUNAS' : 'BELUM LUNAS'}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* BUTTON REVIEW */}
      <View className="mt-4 items-end">
        <TouchableOpacity
          onPress={handleReview}
          activeOpacity={0.85}
          className="rounded-lg bg-blue-600 px-6 py-2"
        >
          <Text className="font-bold text-white">REVIEW</Text>
        </TouchableOpacity>
      </View>
      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={() => setVisible(false)}
      >
        <View className="flex-1 items-center justify-center bg-black/50">
          <View className="w-[92%] rounded-2xl bg-white p-5">
            {/* HEADER */}
            <View className="relative">
              {/* LOGO KIRI */}
              <Image
                source={require('../../../../assets/image/pelayanan-publik/logo_kab.png')}
                className="absolute left-0 top-0 size-12"
                contentFit="contain"
              />

              {/* TEXT CENTER */}
              <View className="items-center px-12">
                <Text className="text-center text-xs font-bold">
                  PEMERINTAH KABUPATEN DELI SERDANG
                </Text>

                <Text className="mt-0.5 text-center text-xs font-bold">
                  SURAT SETORAN PAJAK DAERAH (SPPD) PBB
                </Text>

                <Text className="mt-0.5 text-center text-xs">
                  Tahun Pajak {detail?.detailNOP.tahun}
                </Text>
              </View>

              {/* GARIS HEADER */}
              <View className="mt-2 w-full border-t border-gray-400" />
            </View>

            {/* LOADING */}
            {loading && <ActivityIndicator size="large" color="#2563eb" />}

            {/* DATA */}
            {!loading && detail && (
              <View className="space-y-2">
                <Row label="Tempat Pembayaran" value="Bank SUMUT" />
                <Row
                  label="Telah Menerima Pembayaran PBB Tahun"
                  value={detail.detailNOP.tahun}
                />
                <Row label="Nama Wajib Pajak" value={detail.detailNOP.nama} />
                <Row
                  label="Letak Objek Pajak"
                  value={detail.detailNOP.alamat}
                />
                <Row label="Nomor SPPT (NOP)" value={detail.nop} />
                <Row
                  label="Sejumlah"
                  value={
                    detail.detailNOP.sejumlah
                      ? formatRupiah(detail.detailNOP.sejumlah)
                      : '-'
                  }
                />
                <Row
                  label="Tanggal Pembayaran"
                  value={detail.detailNOP.tanggalPembayaran ?? '-'}
                />
                <Row
                  label="Jumlah yang di Bayar"
                  value={
                    detail.detailNOP.jumlahDiBayar
                      ? formatRupiah(detail.detailNOP.jumlahDiBayar)
                      : '-'
                  }
                />
              </View>
            )}

            {/* FOOTER NOTE */}
            <Text className="mt-4 text-[10px] italic text-gray-600">
              Dokumen ini disahkan secara elektronik oleh Jabatan selaku Pejabat
              yang Berwenang.
            </Text>

            {/* BUTTON CLOSE */}
            <TouchableOpacity
              onPress={() => setVisible(false)}
              className="mt-6 rounded-xl bg-gray-800 py-3"
            >
              <Text className="text-center font-bold text-white">Tutup</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
