import React from 'react';
import { I18nManager, StyleSheet, View } from 'react-native';
import {
  TextInputMask,
  type TextInputMaskProps,
} from 'react-native-masked-text';
import { tv } from 'tailwind-variants';

import colors from './colors';
import { Text } from './text';

const inputTv = tv({
  slots: {
    container: 'mb-2',
    label: 'mb-1 text-lg text-black ',
    // Note: input digunakan untuk mengenerate style className → kita konversi manual ke style objek
    input:
      'rounded-xl border-[0.5px] border-neutral-300 bg-neutral-100 px-4 py-3 text-base font-medium leading-5 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white',
  },
  variants: {
    focused: {
      true: {
        input: 'border-neutral-400 dark:border-neutral-300',
      },
    },
    error: {
      true: {
        input: 'border-danger-600',
        label: 'text-danger-600 dark:text-danger-600',
      },
    },
    disabled: {
      true: {
        input: 'bg-neutral-200',
      },
    },
  },
  defaultVariants: {
    focused: false,
    error: false,
    disabled: false,
  },
});

export interface MaskedInputProps extends TextInputMaskProps {
  label?: string;
  error?: string;
}

export const MaskedInput = React.forwardRef<TextInputMask, MaskedInputProps>(
  ({ label, error, ...rest }, ref) => {
    const [focused, setFocused] = React.useState(false);

    const {
      type,
      options,
      style, // user-defined custom style
      editable,
      ...otherProps
    } = rest;

    const styles = inputTv({
      focused,
      error: Boolean(error),
      disabled: editable === false,
    });

    return (
      <View style={{ marginBottom: 8 }}>
        {label && <Text className={styles.label()}>{label}</Text>}
        <TextInputMask
          ref={ref}
          type={type}
          options={options}
          editable={editable}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholderTextColor={colors.neutral[400]}
          {...otherProps}
          style={StyleSheet.flatten([
            {
              backgroundColor: colors.neutral[100],
              borderColor: colors.neutral[300],
              borderWidth: 0.5,
              borderRadius: 12,
              paddingHorizontal: 16,
              paddingVertical: 12,
              fontSize: 16,
              fontWeight: '500',
              color: colors.neutral[900],
              writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr',
              textAlign: I18nManager.isRTL ? 'right' : 'left',
            },
            editable === false && { backgroundColor: colors.neutral[200] },
            focused && { borderColor: colors.neutral[400] },
            error && { borderColor: colors.danger[600] },
            style, // user-defined styles
          ])}
        />
        {error && (
          <Text className="mt-1 text-sm text-danger-400 dark:text-danger-600">
            {error}
          </Text>
        )}
      </View>
    );
  }
);

MaskedInput.displayName = 'MaskedInput';
