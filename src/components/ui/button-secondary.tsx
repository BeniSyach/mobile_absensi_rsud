import { CirclePlus, SaveIcon, X } from 'lucide-react-native';
import React from 'react';
import { Modal } from 'react-native';

import {
  Button,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from '@/components/ui';

import { type FormType } from '../login-form';

type Props = {
  label: string;
  renderForm: () => JSX.Element;
  onSubmit?: (data: FormType) => void;
  isPending?: boolean;
  isError?: boolean;
};

const AlertModal = ({
  visible,
  onConfirm,
  onCancel,
}: {
  visible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) => (
  <Modal
    visible={visible}
    transparent
    animationType="fade"
    className="rounded-xl"
  >
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
      }}
    >
      <View className="w-80 rounded-lg bg-white p-6">
        <Image
          source={require('../../../assets/image/warning.png')}
          className="mb-4 size-16 self-center"
          contentFit="contain"
        />
        <Text className="mb-4 text-center text-base font-semibold">
          Apakah Anda yakin mengubah data ini?
        </Text>
        <View className="flex-row justify-center space-x-4">
          <TouchableOpacity
            className="mx-2 rounded-xl bg-[#0B3880] px-4 py-2"
            onPress={onConfirm}
          >
            <Text className="font-bold text-white">Simpan</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="mx-2 rounded-xl bg-[#C9DEFE] px-4 py-2"
            onPress={onCancel}
          >
            <Text className="font-bold">Tidak</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  </Modal>
);

const ModalContent = ({
  onClose,
  renderForm,
  onSavePress,
}: {
  onClose: () => void;
  renderForm: () => JSX.Element;
  onSavePress: () => void;
}) => (
  <View
    className=" bg-white dark:bg-black"
    style={{
      width: '90%',
      borderRadius: 10,
      padding: 20,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    }}
  >
    <TouchableOpacity onPress={onClose} className="absolute right-3 top-3">
      <X size={24} color="red" />
    </TouchableOpacity>
    <Text className="text-2xl font-bold text-[#0B3880]">Update Data</Text>
    {renderForm()}
    <View className="mt-4 flex-row justify-start">
      <Button
        label="Simpan"
        size="default"
        variant="outline"
        className="w-auto rounded-full bg-[#C9DEFE] px-4 text-[#0B3880]"
        onPress={onSavePress}
        icon={<SaveIcon size={20} color="#0B3880" />}
        iconPosition="left"
      />
    </View>
  </View>
);

const UpdateModal = ({
  visible,
  onClose,
  renderForm,
  onSubmit,
  isPending,
  isError,
}: {
  visible: boolean;
  onClose: () => void;
  renderForm: () => JSX.Element;
  onSubmit?: (data: FormType) => void;
  isPending?: boolean;
  isError?: boolean;
}) => {
  const [alertVisible, setAlertVisible] = React.useState(false);
  const formRef = React.useRef<{ submit: () => Promise<boolean> }>(null);

  const handleSavePress = () => setAlertVisible(true);
  const handleConfirmSave = async () => {
    if (!formRef.current) return;

    setAlertVisible(false); // Close alert immediately
    await formRef.current.submit(); // Let form handle validation
  };

  const renderFormWithRef = () => {
    const Form = renderForm();
    return React.cloneElement(Form, {
      ref: formRef,
      isPending,
      isError,
      onSubmit,
    });
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <ScrollView
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
        }}
      >
        <View className="items-center justify-center py-2">
          <ModalContent
            onClose={onClose}
            renderForm={renderFormWithRef}
            onSavePress={handleSavePress}
          />
        </View>
      </ScrollView>
      <AlertModal
        visible={alertVisible}
        onConfirm={handleConfirmSave}
        onCancel={() => setAlertVisible(false)}
      />
    </Modal>
  );
};

export const ButtonSecondary = ({
  label,
  renderForm,
  onSubmit,
  isPending,
  isError,
}: Props) => {
  const [modalVisible, setModalVisible] = React.useState(false);
  return (
    <>
      <Button
        onPress={() => setModalVisible(true)}
        label={label}
        size="default"
        variant="outline"
        className="w-auto rounded-full bg-[#C9DEFE] px-4 text-[#0B3880]"
        icon={<CirclePlus size={20} color="#0B3880" />}
        iconPosition="left"
      />
      <UpdateModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        renderForm={renderForm}
        onSubmit={onSubmit}
        isPending={isPending}
        isError={isError}
      />
    </>
  );
};
