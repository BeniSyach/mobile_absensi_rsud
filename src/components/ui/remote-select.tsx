/* eslint-disable max-lines-per-function */
import { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import { Search } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import React from 'react';
import { ActivityIndicator, Pressable, TextInput, View } from 'react-native';

import colors from '@/components/ui/colors';

import { Modal, useModal } from './modal';
import { Text } from './text';

export type OptionType = {
  label: string;
  value: string | number;
};

interface RemoteSelectProps {
  label?: string;
  value?: string | number;
  placeholder?: string;
  fetchOptions: (page: number, search: string) => Promise<OptionType[]>;
  onSelect: (value: string | number) => void;
  debounceMs?: number;
}

export const RemoteSelect: React.FC<RemoteSelectProps> = ({
  label,
  value,
  fetchOptions,
  onSelect,
  placeholder = 'Pilih...',
  debounceMs = 400,
}) => {
  const modal = useModal();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  const [isVisible, setIsVisible] = React.useState(false);
  const [options, setOptions] = React.useState<OptionType[]>([]);
  const [search, setSearch] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [page, setPage] = React.useState(1);
  const [hasMore, setHasMore] = React.useState(true);

  const debounceRef = React.useRef<NodeJS.Timeout>();
  const abortRef = React.useRef<AbortController>();
  const deferredSearch = React.useDeferredValue(search);

  const selectedLabel = React.useMemo(() => {
    if (!value) return '';
    const found = options.find((opt) => opt.value === value);
    return found?.label || '';
  }, [value, options]);

  const cleanup = React.useCallback(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (abortRef.current) abortRef.current.abort();
  }, []);

  const loadData = React.useCallback(
    async (pageNum: number, searchTerm: string, reset = false) => {
      if (abortRef.current) abortRef.current.abort();

      const controller = new AbortController();
      abortRef.current = controller;

      try {
        setLoading(true);
        const fetched = await fetchOptions(pageNum, searchTerm);

        if (controller.signal.aborted) return;

        const newOptions = fetched.slice(0, 50); // batas maksimal render

        if (reset) {
          setOptions(newOptions);
          setPage(2);
        } else {
          setOptions((prev) => [...prev, ...newOptions]);
          setPage((prev) => prev + 1);
        }

        setHasMore(newOptions.length >= 20);
      } catch (error) {
        if (!controller.signal.aborted) {
          console.error('Load options error:', error);
          setHasMore(false);
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    },
    [fetchOptions]
  );

  React.useEffect(() => {
    if (!isVisible) return;

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      setPage(1);
      setHasMore(true);
      loadData(1, deferredSearch, true);
    }, debounceMs);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [deferredSearch, isVisible, debounceMs, loadData]);

  const handleOpen = React.useCallback(() => {
    setIsVisible(true);
    setSearch('');
    setOptions([]);
    setPage(1);
    setHasMore(true);
    setLoading(true);
    modal.present();

    setTimeout(() => {
      loadData(1, '', true);
    }, 100);
  }, [modal, loadData]);

  const handleClose = React.useCallback(() => {
    setIsVisible(false);
    cleanup();
    modal.dismiss();
  }, [modal, cleanup]);

  const handleSearchChange = (text: string) => {
    setSearch(text);
  };

  const handleSelect = React.useCallback(
    (option: OptionType) => {
      onSelect(option.value);
      handleClose();
    },
    [onSelect, handleClose]
  );

  const renderItem = React.useCallback(
    ({ item }: { item: OptionType }) => (
      <Pressable
        onPress={() => handleSelect(item)}
        className="border-b border-neutral-200 p-3 dark:border-neutral-700"
      >
        <Text className="dark:text-white">{item.label}</Text>
      </Pressable>
    ),
    [handleSelect]
  );

  const keyExtractor = React.useCallback(
    (item: OptionType, index: number) => `option-${item.value}-${index}`,
    []
  );

  const handleEndReached = React.useCallback(() => {
    if (!loading && hasMore && options.length > 0) {
      loadData(page, search, false);
    }
  }, [loading, hasMore, options.length, page, loadData, search]);

  // const LoadingFooter = loading && options.length > 0 && (
  //   <View className="py-4">
  //     <ActivityIndicator color={colors.primary?.[600]} />
  //   </View>
  // );

  const EmptyComponent = React.useMemo(() => {
    if (loading) {
      return (
        <View className="items-center justify-center p-8">
          <ActivityIndicator color={colors.primary?.[600]} />
          <Text className="mt-2 text-gray-500 dark:text-gray-400">
            {search ? `Mencari "${search}"...` : 'Memuat data...'}
          </Text>
        </View>
      );
    }

    if (!loading && options.length === 0) {
      return (
        <View className="items-center justify-center p-8">
          <Text className="text-gray-500 dark:text-gray-400">
            {search
              ? `Tidak ada hasil untuk "${search}"`
              : 'Tidak ada data tersedia'}
          </Text>
        </View>
      );
    }

    return null;
  }, [loading, search, options.length]);

  React.useEffect(() => cleanup, [cleanup]);

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
            {selectedLabel || placeholder}
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
          <View className="mb-3 flex-row items-center rounded-lg border border-gray-300 bg-white p-2 dark:border-neutral-600 dark:bg-neutral-700">
            <Search
              className="mr-2 size-6"
              color={isDark ? 'white' : 'black'}
              strokeWidth={2}
            />
            <TextInput
              placeholder="Cari..."
              value={search}
              onChangeText={handleSearchChange}
              className="flex-1 text-black dark:text-white"
              placeholderTextColor={isDark ? '#9CA3AF' : '#6B7280'}
              returnKeyType="search"
              autoCapitalize="none"
              autoCorrect={false}
              clearButtonMode="while-editing"
            />
          </View>

          <BottomSheetFlatList
            data={options}
            keyExtractor={keyExtractor}
            renderItem={renderItem}
            onEndReached={handleEndReached}
            onEndReachedThreshold={0.5}
            // ListFooterComponent={LoadingFooter}
            ListEmptyComponent={EmptyComponent}
            keyboardShouldPersistTaps="handled"
            removeClippedSubviews
            maxToRenderPerBatch={10}
            updateCellsBatchingPeriod={50}
            initialNumToRender={15}
            windowSize={10}
          />
        </View>
      </Modal>
    </>
  );
};
