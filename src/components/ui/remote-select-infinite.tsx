/* eslint-disable max-lines-per-function */
import { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import { type UseInfiniteQueryResult } from '@tanstack/react-query';
import { Search } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import React from 'react';
import { ActivityIndicator, Pressable, TextInput, View } from 'react-native';

import colors from '@/components/ui/colors';
import { useDebouncedValue } from '@/utils/debaunce';

import { Modal, useModal } from './modal';
import { Text } from './text';

// Ubah OptionType jadi generic agar bisa extend
export type OptionType<T = Record<string, any>> = {
  label: string;
  value: string | number;
} & T;

interface RemoteSelectInfiniteProps<T = Record<string, any>> {
  label?: string;
  value?: string | number;
  placeholder?: string;

  // Ubah signature onSelect untuk menerima option lengkap
  onSelect: (value: string | number, option: OptionType<T>) => void;

  // Function yang return infinite query result (bukan hook langsung)
  // Parent component yang handle state search dan panggil hook
  getQueryResult: (search: string) => UseInfiniteQueryResult<any, Error>;

  // Function untuk transform data API ke format OptionType[]
  transformData: (data: any) => OptionType<T>[];

  // Optional: fetch single option by value (untuk display saat edit)
  fetchOptionByValue?: (
    value: string | number
  ) => Promise<OptionType<T> | null>;

  debounceMs?: number;
}

export const RemoteSelectInfinite = <
  T extends Record<string, any> = Record<string, any>,
>({
  label,
  value,
  onSelect,
  placeholder = 'Pilih...',
  getQueryResult,
  transformData,
  fetchOptionByValue,
  debounceMs = 400,
}: RemoteSelectInfiniteProps<T>) => {
  const modal = useModal();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  const [searchText, setSearchText] = React.useState('');
  const [selectedOption, setSelectedOption] =
    React.useState<OptionType<T> | null>(null);

  const isMountedRef = React.useRef(true);

  // Debounce search
  const debouncedSearch = useDebouncedValue(searchText, debounceMs);

  // Get query result dengan debounced search
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = getQueryResult(debouncedSearch);

  // Transform semua pages jadi flat array
  const options = React.useMemo(() => {
    if (!data?.pages) return [];
    return data.pages.flatMap((page: any) => transformData(page));
  }, [data, transformData]);

  /** Cleanup on unmount */
  React.useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  /** Ambil label dari value saat mount (edit form) */
  React.useEffect(() => {
    if (value == null) {
      setSelectedOption(null);
      return;
    }

    const found = options.find((opt: OptionType<T>) => opt.value === value);
    if (found) {
      setSelectedOption(found);
    } else if (fetchOptionByValue) {
      fetchOptionByValue(value)
        .then((opt: OptionType<T> | null) => {
          if (opt && isMountedRef.current) {
            setSelectedOption(opt);
          }
        })
        .catch(() => {
          // Silent fail jika fetch gagal
        });
    }
  }, [value, options, fetchOptionByValue]);

  /** Handlers */
  const handleOpen = () => {
    modal.present();
  };

  const handleClose = () => {
    modal.dismiss();
    // Reset search saat modal ditutup (optional)
    setSearchText('');
  };

  const handleSelect = (opt: OptionType<T>) => {
    setSelectedOption(opt);
    // ✅ Kirim value DAN option lengkap
    onSelect(opt.value, opt);
    handleClose();
  };

  /** UI helpers */
  const renderItem = ({ item }: { item: OptionType<T> }) => (
    <Pressable
      onPress={() => handleSelect(item)}
      className="border-b border-neutral-200 p-3 dark:border-neutral-700"
    >
      <Text className="dark:text-white">{item.label}</Text>
    </Pressable>
  );

  const keyExtractor = (item: OptionType<T>, index: number) =>
    `option-${item.value}-${index}`;

  const handleEndReached = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  const LoadingFooter = isFetchingNextPage ? (
    <View className="py-4">
      <ActivityIndicator color={colors.primary?.[600]} />
    </View>
  ) : null;

  const EmptyComponent =
    !isLoading && options.length === 0 ? (
      <View className="items-center justify-center p-8">
        <Text className="text-gray-500 dark:text-gray-400">
          {debouncedSearch
            ? `Tidak ada hasil untuk "${debouncedSearch}"`
            : 'Tidak ada data tersedia'}
        </Text>
      </View>
    ) : null;

  const ErrorComponent = isError ? (
    <View className="items-center justify-center p-8">
      <Text className="text-red-500">Terjadi kesalahan saat memuat data</Text>
    </View>
  ) : null;

  return (
    <>
      <View className="mb-4">
        {label && (
          <Text className="mb-1 text-lg text-black dark:text-white">
            {label}
          </Text>
        )}
        <Pressable
          onPress={handleOpen}
          className="rounded-xl border border-gray-300 bg-white p-3 dark:border-neutral-500 dark:bg-neutral-800"
        >
          <Text className="dark:text-white">
            {selectedOption?.label || placeholder}
          </Text>
        </Pressable>
      </View>

      <Modal
        ref={modal.ref}
        index={0}
        snapPoints={['80%']}
        backgroundStyle={{
          backgroundColor: isDark ? colors.neutral[800] : colors.white,
        }}
      >
        <View className="flex-1 p-3">
          {/* Search Input */}
          <View className="mb-3 flex-row items-center rounded-lg border border-gray-300 bg-white p-2 dark:border-neutral-600 dark:bg-neutral-700">
            <Search
              className="mr-2 size-6"
              color={isDark ? 'white' : 'black'}
              strokeWidth={2}
            />
            <TextInput
              defaultValue={searchText}
              onChangeText={setSearchText}
              className="flex-1 text-black dark:text-white"
              placeholder="Cari..."
              placeholderTextColor={isDark ? '#9CA3AF' : '#6B7280'}
              returnKeyType="search"
              autoCapitalize="none"
              autoCorrect={false}
              clearButtonMode="while-editing"
            />
            {isLoading && (
              <ActivityIndicator size="small" color={colors.primary?.[600]} />
            )}
          </View>

          {/* List */}
          <BottomSheetFlatList
            data={options}
            keyExtractor={keyExtractor}
            renderItem={renderItem}
            onEndReached={handleEndReached}
            onEndReachedThreshold={0.2}
            ListFooterComponent={LoadingFooter}
            ListEmptyComponent={
              isLoading ? (
                <View className="items-center justify-center p-8">
                  <ActivityIndicator color={colors.primary?.[600]} />
                  <Text className="mt-2 text-gray-500 dark:text-gray-400">
                    Memuat data...
                  </Text>
                </View>
              ) : ErrorComponent ? (
                ErrorComponent
              ) : (
                EmptyComponent
              )
            }
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={true}
            contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}
            style={{ flex: 1 }}
          />
        </View>
      </Modal>
    </>
  );
};
