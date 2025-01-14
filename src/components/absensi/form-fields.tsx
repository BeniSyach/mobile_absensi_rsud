import {
  Button,
  Image,
  type OptionType,
  Select,
  Text,
  View,
} from '@/components/ui';

interface FormFieldsProps {
  tipe_absensi_value: string | number | undefined;
  shift_value: string | number | undefined;
  hari_kerja_value: string | number | undefined;
  tipe_shift: OptionType[];
  tipe_hari_kerja: OptionType[];
  onTipeAbsensiSelect: (value: string | number) => void;
  onShiftSelect: (value: string | number) => void;
  onHariKerjaSelect: (value: string | number) => void;
  onImageSelect: () => Promise<void>;
  image: string | null;
  errors: any;
}

const tipe_absensi: OptionType[] = [
  { value: '0', label: 'Masuk' },
  { value: '1', label: 'Pulang' },
];

const ImagePreview = ({
  image,
  errors,
}: {
  image: string | null;
  errors: any;
}) =>
  image ? (
    <View className="mt-2 items-center">
      <Image
        source={{ uri: image }}
        className="h-44 w-full"
        style={{ resizeMode: 'contain' }}
      />
    </View>
  ) : (
    errors.photo && (
      <View className="mb-2">
        <Text className="text-red-500">
          {errors.photo?.message || 'Belum ada foto yang diunggah.'}
        </Text>
      </View>
    )
  );

export const FormFields: React.FC<FormFieldsProps> = ({
  tipe_absensi_value,
  shift_value,
  hari_kerja_value,
  tipe_shift,
  tipe_hari_kerja,
  onTipeAbsensiSelect,
  onShiftSelect,
  onHariKerjaSelect,
  onImageSelect,
  image,
  errors,
}) => (
  <>
    <Select
      label="Tipe Absensi"
      options={tipe_absensi}
      value={tipe_absensi_value}
      onSelect={onTipeAbsensiSelect}
      placeholder="Pilih Tipe Absensi"
      error={errors.tipe_absensi?.message}
      disabled={true}
    />
    <Select
      label="Tipe Shift"
      options={tipe_shift}
      value={shift_value}
      onSelect={onShiftSelect}
      placeholder="Pilih Tipe Shift"
      error={errors.shift_id?.message}
    />
    <Select
      label="Shift/Hari Kerja"
      options={tipe_hari_kerja}
      value={hari_kerja_value}
      onSelect={onHariKerjaSelect}
      placeholder="Pilih Hari Kerja"
      error={errors.waktu_kerja_id?.message}
    />
    <Button label="Ambil Foto Absensi" onPress={onImageSelect} />
    <ImagePreview image={image} errors={errors} />
  </>
);
