import * as React from 'react';
import type {
  Control,
  FieldValues,
  Path,
  RegisterOptions,
} from 'react-hook-form';
import { useController } from 'react-hook-form';
import type { TextInputProps } from 'react-native';
import { I18nManager, StyleSheet, View } from 'react-native';
import { TextInput as NTextInput } from 'react-native';
import { tv } from 'tailwind-variants';

import colors from '@/components/ui/colors';
import { Text } from '@/components/ui/text';

const inputTv = tv({
  slots: {
    container: 'mb-2',
    label: 'mb-1 text-lg text-black ',
    input:
      'mt-0 rounded-xl border-[0.5px] border-neutral-300 bg-neutral-100 px-4 py-3 font-inter text-base font-medium leading-5 text-black dark:border-neutral-700 dark:bg-neutral-800 dark:text-white',
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

export interface NInputProps extends TextInputProps {
  label?: string;
  disabled?: boolean;
  error?: string;
  rightIcon?: React.ReactNode;
  leftIcon?: React.ReactNode;
}

type TRule<T extends FieldValues> =
  | Omit<
      RegisterOptions<T>,
      'disabled' | 'valueAsNumber' | 'valueAsDate' | 'setValueAs'
    >
  | undefined;

export type RuleType<T extends FieldValues> = { [name in keyof T]: TRule<T> };
export type InputControllerType<T extends FieldValues> = {
  name: Path<T>;
  control: Control<T>;
  rules?: RuleType<T>;
};

interface ControlledInputProps<T extends FieldValues>
  extends NInputProps,
    InputControllerType<T> {}

const IconContainer = ({
  icon,
  position,
}: {
  icon: React.ReactNode;
  position: 'left' | 'right';
}) => {
  if (!icon) return null;
  return (
    <View
      pointerEvents={position === 'left' ? 'none' : 'auto'}
      style={{
        position: 'absolute',
        [position]: 10,
        top: '50%',
        transform: [{ translateY: -12 }],
        zIndex: position === 'left' ? 1 : 0,
      }}
    >
      {icon}
    </View>
  );
};

const useInputFocus = (
  onFocusProp?: TextInputProps['onFocus'],
  onBlurProp?: TextInputProps['onBlur']
) => {
  const [isFocussed, setIsFocussed] = React.useState(false);

  const onBlur = React.useCallback(
    (e: any) => {
      setIsFocussed(false);
      onBlurProp?.(e);
    },
    [onBlurProp]
  );

  const onFocus = React.useCallback(
    (e: any) => {
      setIsFocussed(true);
      onFocusProp?.(e);
    },
    [onFocusProp]
  );

  return { isFocussed, onBlur, onFocus };
};

const useInputStyles = ({
  error,
  isFocussed,
  disabled,
  style,
}: {
  error?: string;
  isFocussed: boolean;
  disabled?: boolean;
  style?: TextInputProps['style'];
}) => {
  const styles = React.useMemo(
    () =>
      inputTv({
        error: !!error,
        focused: isFocussed,
        disabled: !!disabled,
      }),
    [error, isFocussed, disabled]
  );

  const textStyle = React.useMemo(
    () =>
      StyleSheet.flatten([
        {
          writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr',
          textAlign: I18nManager.isRTL ? 'right' : 'left',
        } as const,
        style,
      ]),
    [style]
  );

  return { styles, textStyle };
};

export const AciInput = React.forwardRef<NTextInput, NInputProps>(
  (props, ref) => {
    const {
      label,
      error,
      testID,
      rightIcon,
      leftIcon,
      className,
      onFocus: onFocusProp,
      onBlur: onBlurProp,
      ...inputProps
    } = props;
    const { isFocussed, onBlur, onFocus } = useInputFocus(
      onFocusProp,
      onBlurProp
    );

    const { styles, textStyle } = useInputStyles({
      error,
      isFocussed,
      disabled: props.disabled,
      style: inputProps.style,
    });

    return (
      <View className={styles.container()}>
        {label && (
          <Text
            testID={testID ? `${testID}-label` : undefined}
            className={styles.label()}
          >
            {label}
          </Text>
        )}
        <View style={{ position: 'relative' }}>
          <IconContainer icon={leftIcon} position="left" />
          <NTextInput
            testID={testID}
            ref={ref}
            placeholderTextColor={colors.neutral[400]}
            className={className ? `${className} text-black` : styles.input()}
            onBlur={onBlur}
            onFocus={onFocus}
            {...inputProps}
            style={[textStyle, { color: 'black' }]}
          />
          <IconContainer icon={rightIcon} position="right" />
        </View>
        {error && (
          <Text
            testID={testID ? `${testID}-error` : undefined}
            className="text-sm text-danger-400 dark:text-danger-600"
          >
            {error}
          </Text>
        )}
      </View>
    );
  }
);

// only used with react-hook-form
export function ControlledAciInput<T extends FieldValues>(
  props: ControlledInputProps<T>
) {
  const { name, control, rules, ...inputProps } = props;

  const { field, fieldState } = useController({ control, name, rules });
  return (
    <AciInput
      ref={field.ref}
      autoCapitalize="none"
      onChangeText={field.onChange}
      value={(field.value as string) || ''}
      {...inputProps}
      error={fieldState.error?.message}
    />
  );
}
