import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
  Dimensions,
  Keyboard,
  Modal,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

import { Text } from '@/components/ui/text';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export type AciAlertType = 'success' | 'error' | 'warning' | 'info' | 'confirm';

interface AciAlertProps {
  show: boolean;
  type?: AciAlertType;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel?: () => void;
  errorList?: string[];
  showConfirmButton?: boolean;
}

const getIconConfig = (type: AciAlertType) => {
  switch (type) {
    case 'success':
      return { name: 'checkmark-circle', color: '#10B981', bg: '#DCFCE7' };
    case 'error':
      return { name: 'close-circle', color: '#EF4444', bg: '#FEE2E2' };
    case 'warning':
      return { name: 'alert-circle', color: '#F59E0B', bg: '#FEF3C7' };
    case 'confirm':
      return { name: 'help-circle', color: '#3B82F6', bg: '#DBEAFE' };
    default:
      return { name: 'information-circle', color: '#6366F1', bg: '#EEF2FF' };
  }
};

const AlertErrorList = ({ errors }: { errors: string[] }) => (
  <View style={styles.errorListContainer}>
    {errors.map((err, index) => (
      <View key={index} style={styles.errorItem}>
        <Text style={styles.errorDot}>•</Text>
        <Text style={styles.errorText}>{err}</Text>
      </View>
    ))}
  </View>
);

const AlertButtons = ({
  type,
  onConfirm,
  onCancel,
  confirmText,
  cancelText,
  showConfirmButton,
}: {
  type: AciAlertType;
  onConfirm: () => void;
  onCancel?: () => void;
  confirmText: string;
  cancelText: string;
  showConfirmButton: boolean;
}) => {
  const handleConfirm = () => {
    Keyboard.dismiss();
    onConfirm();
  };

  const handleCancel = () => {
    Keyboard.dismiss();
    if (onCancel) onCancel();
  };

  return (
    <View style={styles.buttonContainer}>
      {showConfirmButton && (
        <TouchableOpacity
          onPress={handleConfirm}
          activeOpacity={0.8}
          style={styles.confirmButton}
        >
          <Text style={styles.confirmButtonText}>{confirmText || 'OK'}</Text>
        </TouchableOpacity>
      )}

      {type === 'confirm' && (
        <TouchableOpacity
          onPress={handleCancel}
          activeOpacity={0.8}
          style={styles.cancelButton}
        >
          <Text style={styles.cancelButtonText}>{cancelText || 'Batal'}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

interface AlertContentProps {
  iconConfig: { name: string; color: string; bg: string };
  title: string;
  message: string;
  errorList?: string[];
  type: AciAlertType;
  onConfirm: () => void;
  onCancel?: () => void;
  confirmText: string;
  cancelText: string;
  showConfirmButton: boolean;
}

const AlertContent = ({
  iconConfig,
  title,
  message,
  errorList,
  type,
  onConfirm,
  onCancel,
  confirmText,
  cancelText,
  showConfirmButton,
}: AlertContentProps) => (
  <View style={styles.contentContainer}>
    <View style={[styles.iconWrapper, { backgroundColor: iconConfig.bg }]}>
      <Ionicons
        name={iconConfig.name as any}
        size={36}
        color={iconConfig.color}
      />
    </View>

    <Text style={styles.titleText}>{title}</Text>

    <Text style={styles.messageText}>{message}</Text>

    {errorList && errorList.length > 0 && <AlertErrorList errors={errorList} />}

    <AlertButtons
      type={type}
      onConfirm={onConfirm}
      onCancel={onCancel}
      confirmText={confirmText}
      cancelText={cancelText}
      showConfirmButton={showConfirmButton}
    />
  </View>
);

export const AciAlert = ({
  show,
  type = 'info',
  title,
  message,
  confirmText = 'OK',
  cancelText = 'Batal',
  onConfirm,
  onCancel,
  errorList,
  showConfirmButton = true,
}: AciAlertProps) => {
  const iconConfig = getIconConfig(type);

  const handleBackdropPress = () => {
    if (type === 'confirm' && onCancel) {
      onCancel();
    } else {
      onConfirm();
    }
  };

  const handleRequestClose = () => {
    if (onCancel) {
      onCancel();
    } else {
      onConfirm();
    }
  };

  return (
    <Modal
      key="aci-alert-modal"
      transparent={true}
      visible={show}
      animationType="fade"
      onRequestClose={handleRequestClose}
      statusBarTranslucent={true}
    >
      <View style={styles.overlay}>
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={handleBackdropPress}
        />
        <Pressable style={styles.modalBox} onPress={() => {}}>
          <AlertContent
            iconConfig={iconConfig}
            title={title}
            message={message}
            errorList={errorList}
            type={type}
            onConfirm={onConfirm}
            onCancel={onCancel}
            confirmText={confirmText}
            cancelText={cancelText}
            showConfirmButton={showConfirmButton}
          />
        </Pressable>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },

  modalBox: {
    width: '100%',
    maxWidth: 300,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
  },
  contentContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapper: {
    marginBottom: 12,
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
  titleText: {
    marginBottom: 6,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0B2347',
  },
  messageText: {
    marginBottom: 16,
    textAlign: 'center',
    fontSize: 13,
    lineHeight: 18,
    color: '#6B7280',
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmButton: {
    alignSelf: 'stretch',
    backgroundColor: '#0061E6',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  confirmButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  cancelButton: {
    alignSelf: 'stretch',
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    color: '#6B7280',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  errorListContainer: {
    width: '100%',
    backgroundColor: '#FEF2F2',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },
  errorItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  errorDot: {
    marginRight: 8,
    fontSize: 12,
    fontWeight: 'bold',
    color: '#EF4444',
    marginTop: 2,
  },
  errorText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
    color: '#B91C1C',
  },
});
