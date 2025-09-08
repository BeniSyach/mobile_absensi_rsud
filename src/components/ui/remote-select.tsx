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
  pageSize?: number;
}

export const RemoteSelect: React.FC<RemoteSelectProps> = ({
  label,
  value,
  fetchOptions,
  onSelect,
  placeholder = 'Pilih...',
  debounceMs = 400,
  pageSize = 20,
}) => {
  const modal = useModal();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  const [isVisible, setIsVisible] = React.useState(false);
  const [options, setOptions] = React.useState<OptionType[]>([]);
  const [search, setSearch] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [hasMore, setHasMore] = React.useState(true);
  const [loadingMore, setLoadingMore] = React.useState(false);

  const debounceRef = React.useRef<NodeJS.Timeout>();
  const abortRef = React.useRef<AbortController>();
  const currentSearchRef = React.useRef('');
  const loadingRef = React.useRef(false);

  const selectedLabel = React.useMemo(() => {
    if (!value) return '';
    const found = options.find((opt) => opt.value === value);
    return found?.label || '';
  }, [value, options]);

  const cleanup = React.useCallback(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
      debounceRef.current = undefined;
    }
    if (abortRef.current) {
      abortRef.current.abort();
      abortRef.current = undefined;
    }
    loadingRef.current = false;
  }, []);

  const loadData = React.useCallback(
    async (pageNum: number, searchTerm: string, reset = false) => {
      // Prevent multiple simultaneous requests
      if (loadingRef.current) return;

      // Abort previous request
      if (abortRef.current) {
        abortRef.current.abort();
      }

      const controller = new AbortController();
      abortRef.current = controller;
      loadingRef.current = true;

      try {
        if (reset) {
          setLoading(true);
          setLoadingMore(false);
        } else {
          setLoadingMore(true);
        }

        console.log(
          'Fetching data - Page:',
          pageNum,
          'Search:',
          searchTerm,
          'Reset:',
          reset
        );
        const fetched = await fetchOptions(pageNum, searchTerm);

        // Check if request was aborted
        if (controller.signal.aborted) {
          return;
        }

        console.log('Fetched data:', fetched.length, 'items for page', pageNum);

        if (reset) {
          setOptions(fetched);
          setCurrentPage(2); // Next page will be 2
          setHasMore(fetched.length >= pageSize);
          console.log('Reset complete, next page will be: 2');
        } else {
          setOptions((prev) => {
            // Avoid duplicates
            const newOptions = fetched.filter(
              (newOption) =>
                !prev.some((prevOption) => prevOption.value === newOption.value)
            );
            console.log(
              'Adding new options:',
              newOptions.length,
              'filtered from',
              fetched.length
            );
            return [...prev, ...newOptions];
          });
          const nextPage = pageNum + 1;
          setCurrentPage(nextPage);
          setHasMore(fetched.length >= pageSize);
          console.log('Pagination complete, next page will be:', nextPage);
        }
      } catch (error) {
        if (!controller.signal.aborted) {
          console.error('Load options error:', error);
          setHasMore(false);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
          setLoadingMore(false);
          loadingRef.current = false;
        }
      }
    },
    [fetchOptions, pageSize]
  );

  // Debounced search effect
  React.useEffect(() => {
    if (!isVisible) return;

    // Clear previous timeout
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    // Skip if search hasn't changed
    // if (currentSearchRef.current === search) return;

    // currentSearchRef.current = search;

    debounceRef.current = setTimeout(() => {
      if (currentSearchRef.current === search) return; // cek di sini
      currentSearchRef.current = search; // update setelah confirm jalan
      setHasMore(true);
      setOptions([]);
      setCurrentPage(1);
      loadData(1, search, true);
    }, debounceMs);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [search, isVisible, debounceMs, loadData]);

  // Initial load when modal opens
  React.useEffect(() => {
    if (isVisible && options.length === 0 && !loading) {
      loadData(1, '', true);
    }
  }, [isVisible, options.length, loading, loadData]);

  const handleOpen = React.useCallback(() => {
    setIsVisible(true);
    setSearch('');
    setOptions([]);
    setCurrentPage(1);
    setHasMore(true);
    currentSearchRef.current = '';
    modal.present();
  }, [modal]);

  const handleClose = React.useCallback(() => {
    setIsVisible(false);
    cleanup();
    modal.dismiss();
  }, [modal, cleanup]);

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
    console.log('handleEndReached called', {
      hasMore,
      loadingMore,
      loading,
      optionsLength: options.length,
      currentPage,
      search,
    });

    // Only trigger if we're near the end and have more data
    if (!hasMore || loadingMore || loading || options.length === 0) {
      console.log('Skipping load more:', {
        hasMore,
        loadingMore,
        loading,
        optionsLength: options.length,
      });
      return;
    }

    console.log('Triggering load more for page:', currentPage);
    loadData(currentPage, search, false);
  }, [
    hasMore,
    loadingMore,
    loading,
    options.length,
    currentPage,
    search,
    loadData,
  ]);

  const LoadingFooter = React.useMemo(() => {
    if (loadingMore && options.length > 0) {
      return (
        <View className="py-4">
          <ActivityIndicator color={colors.primary?.[600]} />
        </View>
      );
    }
    return null;
  }, [loadingMore, options.length]);

  const EmptyComponent = React.useMemo(() => {
    if (loading && options.length === 0) {
      return (
        <View className="items-center justify-center p-8">
          <ActivityIndicator color={colors.primary?.[600]} />
          <Text className="mt-2 text-gray-500 dark:text-gray-400">
            {search ? `Mencari "${search}"...` : 'Memuat data...'}
          </Text>
        </View>
      );
    }

    if (!loading && !loadingMore && options.length === 0) {
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
  }, [loading, loadingMore, search, options.length]);

  // Cleanup on unmount
  React.useEffect(() => {
    return cleanup;
  }, [cleanup]);

  return (
    <>
      <View className="mb-4">
        {label && <Text className="mb-1 text-lg text-black">{label}</Text>}
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
          {/* Input Search */}
          <View className="mb-3 flex-row items-center rounded-lg border border-gray-300 bg-white p-2 dark:border-neutral-600 dark:bg-neutral-700">
            <Search
              className="mr-2 size-6"
              color={isDark ? 'white' : 'black'}
              strokeWidth={2}
            />
            <TextInput
              placeholder="Cari..."
              value={search}
              onChangeText={setSearch}
              className="flex-1 text-black dark:text-white"
              placeholderTextColor={isDark ? '#9CA3AF' : '#6B7280'}
              returnKeyType="search"
              autoCapitalize="none"
              autoCorrect={false}
              clearButtonMode="while-editing"
            />
          </View>

          {/* List Data */}
          <BottomSheetFlatList
            data={options}
            keyExtractor={keyExtractor}
            renderItem={renderItem}
            onEndReached={handleEndReached}
            onEndReachedThreshold={0}
            ListFooterComponent={LoadingFooter}
            ListEmptyComponent={EmptyComponent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={true}
            contentContainerStyle={{
              flexGrow: 1,
              paddingBottom: 20,
            }}
            style={{ flex: 1 }}
          />
        </View>
      </Modal>
    </>
  );
};
