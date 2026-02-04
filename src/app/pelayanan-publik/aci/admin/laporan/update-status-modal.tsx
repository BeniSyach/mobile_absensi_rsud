import React from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

import { AciAlert } from '@/components/pelayanan-publik-component/aci/aci-alert';

import { useAciAlert } from '../../hooks/use-aci-alert';
import {
  ModalFooter,
  ModalHeader,
  UpdateStatusForm,
} from './update-status-components';
import { useUpdateStatusLogic } from './use-update-status-modal-logic';

interface UpdateStatusModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
  report: any;
  user: any;
}

export const UpdateStatusModal = (props: UpdateStatusModalProps) => {
  const { visible, onClose, onSuccess, report, user } = props;
  const { alertConfig, showAlert } = useAciAlert();
  const logic = useUpdateStatusLogic({
    reportId: report.id,
    user,
    currentStatus: Number(report.status_laporan || 0),
    visible,
    onSuccess,
    onClose,
    showAlert,
  });

  return (
    <>
      <Modal
        visible={visible}
        transparent
        animationType="slide"
        onRequestClose={onClose}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          className="flex-1"
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
        >
          <View className="flex-1 bg-black/50">
            <TouchableWithoutFeedback onPress={onClose}>
              <View className="flex-1" />
            </TouchableWithoutFeedback>

            <View className="h-[90%] rounded-t-[32px] bg-white shadow-2xl">
              <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View className="flex-1">
                  <ModalHeader title="Update Status" onClose={onClose} />
                  <UpdateStatusForm
                    {...logic}
                    currentStatus={Number(report.status_laporan || 0)}
                    user={user}
                    setSelectedStatus={logic.setSelectedStatus}
                  />
                  <ModalFooter
                    loading={logic.loading}
                    disabled={
                      logic.loading ||
                      logic.selectedStatus === null ||
                      !logic.message.trim() ||
                      (logic.selectedStatus === 1 && !logic.selectedUptId) ||
                      ((logic.selectedStatus === 2 ||
                        logic.selectedStatus === 4) &&
                        !logic.file)
                    }
                    onPress={logic.handleSubmit}
                    label="Simpan Perubahan"
                  />
                </View>
              </TouchableWithoutFeedback>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
      <AciAlert {...alertConfig} />
    </>
  );
};

export default function Ignored() {
  return null;
}
