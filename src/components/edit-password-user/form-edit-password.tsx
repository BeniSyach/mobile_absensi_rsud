import { zodResolver } from '@hookform/resolvers/zod';
import type { SubmitHandler } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import * as z from 'zod';

import { Button, ControlledInput, Text, View } from '@/components/ui';

const schema = z.object({
  old_password: z.string({
    required_error: 'Password lama is required',
  }),
  new_password: z.string({
    required_error: 'Password baru is required',
  }),
  new_password_confirmation: z.string({
    required_error: 'Konfirmasi Password is required',
  }),
});

export type FormEditPasswordProps = {
  onSubmit?: SubmitHandler<FormType>;
  isPending?: boolean;
  isError?: boolean;
};

export type FormType = z.infer<typeof schema>;

export default function FormEditPassword({
  onSubmit = () => {},
  isPending,
}: FormEditPasswordProps) {
  const { handleSubmit, control } = useForm<FormType>({
    resolver: zodResolver(schema),
  });
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior="padding"
      keyboardVerticalOffset={10}
    >
      <View className="justify-center p-4">
        <View className="items-center justify-center">
          <Text
            testID="form-title"
            className="pb-6 text-center text-4xl font-bold"
          >
            Edit Password User
          </Text>
        </View>
        <ControlledInput
          control={control}
          name="old_password"
          label="Password Lama"
        />
        <ControlledInput
          control={control}
          name="new_password"
          label="Password Baru"
          placeholder="***"
          secureTextEntry={true}
        />
        <ControlledInput
          control={control}
          name="new_password_confirmation"
          label="Konfirmasi Password"
          placeholder="***"
          secureTextEntry={true}
        />

        <Button
          testID="edit-user-button"
          label="Edit Data"
          loading={isPending}
          onPress={handleSubmit(onSubmit)}
        />
      </View>
    </KeyboardAvoidingView>
  );
}
