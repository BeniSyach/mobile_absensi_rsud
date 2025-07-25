import { Button, Select, View } from '@/components/ui';

export default function FormExportTPP() {
  return (
    <View>
      <View className="mx-5 mt-5">
        <Select label="Bulan" placeholder="Pilih Bulan" options={[]} />
      </View>
      <View className="flex-row items-center justify-center gap-5 px-5">
        <Button
          label="Tampilkan"
          className="rounded-lg bg-[#C9DEFE] font-bold text-black"
          variant="outline"
        />
        <Button
          label="Export"
          className="rounded-lg bg-[#C9DEFE] font-bold text-black"
          variant="outline"
        />
      </View>
    </View>
  );
}
