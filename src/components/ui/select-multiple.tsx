/* eslint-disable max-lines-per-function */
import { FlashList } from '@shopify/flash-list';
import { Check } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import React from 'react';
import { Pressable, View } from 'react-native';
import { tv } from 'tailwind-variants';

import colors from './colors';
import { CaretDown } from './icons';
import { Modal } from './modal';
import { useModal } from './modal';
import { type OptionType, type SelectProps } from './select';
import { Text } from './text';

const selectTv = tv({
  slots: {
    container: 'mb-4',
    label: 'mb-1 text-lg text-black',
    input:
      'border-grey-50 mt-0 flex-row items-center justify-center rounded-xl border-[0.5px] p-3  dark:border-neutral-500 dark:bg-neutral-800',
    inputValue: 'dark:text-neutral-100',
  },

  variants: {
    focused: {
      true: {
        input: 'border-neutral-600',
      },
    },
    error: {
      true: {
        input: 'border-danger-600',
        label: 'text-danger-600 dark:text-danger-600',
        inputValue: 'text-danger-600',
      },
    },
    disabled: {
      true: {
        input: 'bg-neutral-200',
      },
    },
  },
  defaultVariants: {
    error: false,
    disabled: false,
  },
});

type MultipleSelectProps = Omit<SelectProps, 'value' | 'onSelect'> & {
  value?: (string | number)[];
  onSelect?: (value: (string | number)[]) => void;
};

export const SelectMultiple: React.FC<MultipleSelectProps> = ({
  label,
  value = [],
  error,
  options = [],
  placeholder = 'select...',
  disabled = false,
  onSelect,
  testID,
}) => {
  const modal = useModal();

  // Toggle item on/off dari array
  const onToggleOption = React.useCallback(
    (option: OptionType) => {
      let newValue: (string | number)[];
      if (value.includes(option.value)) {
        // remove
        newValue = value.filter((v) => v !== option.value);
      } else {
        // add
        newValue = [...value, option.value];
      }
      onSelect?.(newValue);
    },
    [value, onSelect]
  );

  // Buat string label ringkas: gabungkan label pilihan atau placeholder
  const textValue = React.useMemo(() => {
    if (value.length === 0) return placeholder;
    // Cari label sesuai value terpilih
    const labels = options
      .filter((o) => value.includes(o.value))
      .map((o) => o.label);
    if (labels.length === 0) return placeholder;
    if (labels.length <= 3) return labels.join(', ');
    return `${labels.slice(0, 3).join(', ')} (+${labels.length - 3} lainnya)`;
  }, [value, options, placeholder]);

  const styles = React.useMemo(
    () =>
      selectTv({
        error: Boolean(error),
        disabled,
      }),
    [error, disabled]
  );

  // Render option dengan checkbox dan selected
  const renderSelectItem = React.useCallback(
    ({ item }: { item: OptionType }) => (
      <Pressable
        key={`select-item-${item.value}`}
        className="flex-row items-center border-b border-neutral-300 bg-white px-3 py-2 dark:border-neutral-700 dark:bg-neutral-800"
        onPress={() => onToggleOption(item)}
        testID={testID ? `${testID}-item-${item.value}` : undefined}
      >
        <Text className="flex-1 dark:text-neutral-100 ">{item.label}</Text>
        {value.includes(item.value) && (
          <Check color={isDark ? 'white' : 'black'} />
        )}
      </Pressable>
    ),
    [onToggleOption, value, testID]
  );

  const height = options.length * 70 + 100;
  const snapPoints = React.useMemo(() => [height], [height]);
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <>
      <View className={styles.container()}>
        {label && (
          <Text
            testID={testID ? `${testID}-label` : undefined}
            className={styles.label()}
          >
            {label}
          </Text>
        )}
        <Pressable
          className={styles.input()}
          disabled={disabled}
          onPress={modal.present}
          testID={testID ? `${testID}-trigger` : undefined}
        >
          <View className="flex-1">
            <Text className={styles.inputValue()}>{textValue}</Text>
          </View>
          <CaretDown />
        </Pressable>
        {error && (
          <Text
            testID={`${testID}-error`}
            className="text-sm text-danger-300 dark:text-danger-600"
          >
            {error}
          </Text>
        )}
      </View>
      <Modal
        ref={modal.ref}
        index={0}
        snapPoints={snapPoints}
        backgroundStyle={{
          backgroundColor: isDark ? colors.neutral[800] : colors.white,
        }}
      >
        <FlashList
          data={options}
          keyExtractor={(item) => `select-item-${item.value}`}
          renderItem={renderSelectItem}
          testID={testID ? `${testID}-modal` : undefined}
          estimatedItemSize={52}
        />
      </Modal>
    </>
  );
};
