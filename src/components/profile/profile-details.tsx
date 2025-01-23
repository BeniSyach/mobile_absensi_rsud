import { type GetUserDetailResponse } from '@/api';
import { Text, View } from '@/components/ui';

const renderField = (label: string, value: string) => (
  <View className="flex flex-row">
    <Text className=" dark:text-dark-500 w-1/3 text-lg text-gray-600">
      {label}
    </Text>
    <Text className=" dark:text-dark-500 text-lg font-medium text-gray-800">
      : {value}
    </Text>
  </View>
);

export const ProfileDetails = ({
  message,
}: {
  message: GetUserDetailResponse;
}) => (
  <>
    <View className="flex flex-col space-y-2">
      {renderField('NIK', message.nik)}
      {renderField('Nomor HP', message.nomor_hp)}
      {renderField(
        'Alamat',
        message.alamat.length > 15
          ? `${message.alamat.substring(0, 15)}...`
          : message.alamat
      )}
      {renderField(
        'Divisi',
        message.divisi.nama_divisi.length > 15
          ? `${message.divisi.nama_divisi.substring(0, 15)}...`
          : message.divisi.nama_divisi
      )}
      {renderField('Login Sebagai', message.level_akses.nama_level)}
      {renderField('Jenis Kelamin', message.gender.nama_gender)}
      {renderField('Status Pegawai', message.status_pegawai.nama_status)}
      {renderField('OPD', message.opd.place_name)}
    </View>
  </>
);
