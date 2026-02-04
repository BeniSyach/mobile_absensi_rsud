import { useCallback, useState } from 'react';

import { type AciAlertType } from '../../../../components/pelayanan-publik-component/aci/aci-alert';

const INITIAL_ALERT_CONFIG = {
  show: false,
  type: 'info' as AciAlertType,
  title: '',
  message: '',
  confirmText: 'OK',
  cancelText: 'Batal',
  errorList: [] as string[],
  showConfirmButton: true,
  onConfirm: () => {},
  onCancel: () => {},
};

export const useAciAlert = () => {
  const [alertConfig, setAlertConfig] = useState(INITIAL_ALERT_CONFIG);

  const hideAlert = useCallback(() => {
    setAlertConfig((prev) => {
      return {
        ...prev,
        show: false,
      };
    });
  }, []);

  const showAlert = useCallback(
    (config: {
      type?: AciAlertType;
      title: string;
      message: string;
      confirmText?: string;
      cancelText?: string;
      errorList?: string[];
      showConfirmButton?: boolean;
      onConfirm?: () => void;
      onCancel?: () => void;
      autoCloseMillis?: number;
    }) => {
      setAlertConfig({
        show: true,
        type: config.type || 'info',
        title: config.title,
        message: config.message,
        confirmText: config.confirmText || 'OK',
        cancelText: config.cancelText || 'Batal',
        errorList: config.errorList || [],
        showConfirmButton:
          config.showConfirmButton !== undefined
            ? config.showConfirmButton
            : true,
        onConfirm: () => {
          hideAlert();
          if (config.onConfirm) {
            config.onConfirm();
          }
        },
        onCancel: () => {
          hideAlert();
          if (config.onCancel) config.onCancel();
        },
      });

      if (config.autoCloseMillis) {
        setTimeout(() => {
          hideAlert();
        }, config.autoCloseMillis);
      }
    },
    [hideAlert]
  );

  return { alertConfig, showAlert, hideAlert };
};

export default function Ignored() {
  return null;
}
