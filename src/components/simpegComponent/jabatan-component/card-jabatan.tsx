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

export default function CardJabatan() {
  return (
    <View className="mx-5 flex flex-col space-y-2 rounded-xl bg-white p-4 shadow">
      <Text className="mb-4 mt-2 text-xl font-bold text-[#0B3880]">
        JABATAN STRUKTURAL/FUNGSIONAL/FUNGSIONAL UMUM(JFU)
      </Text>

      <View className="my-4"></View>
    </View>
  );
}
