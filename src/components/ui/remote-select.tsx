/* eslint-disable max-lines-per-function */
import { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import { ChevronDown, Search } from 'lucide-react-native';
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
  onSelect: (value: string | number) => void;

  fetchOptions: (page: number, search: string) => Promise<OptionType[]>;
  fetchOptionByValue?: (value: string | number) => Promise<OptionType | null>;

  pageSize?: number;
  debounceMs?: number;
  showIcons?: boolean;
}

export const RemoteSelect: React.FC<RemoteSelectProps> = ({
  label,
  value,
  onSelect,
  placeholder = 'Pilih...',
  fetchOptions,
  fetchOptionByValue,
  pageSize = 20,
  debounceMs = 400,
  showIcons = true, // default: tampilkan icon
}) => {
  const modal = useModal();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  const [isVisible, setIsVisible] = React.useState(false);
  const [options, setOptions] = React.useState<OptionType[]>([]);
  const [searchText, setSearchText] = React.useState('');
  const [committedSearch, setCommittedSearch] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [loadingMore, setLoadingMore] = React.useState(false);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [hasMore, setHasMore] = React.useState(true);
  const [selectedOption, setSelectedOption] = React.useState<OptionType | null>(
    null
  );

  const debounceRef = React.useRef<NodeJS.Timeout>();

  /** Ambil label dari value saat mount (edit form) */
  React.useEffect(() => {
    if (value == null) {
      setSelectedOption(null);
      return;
    }

    const found = options.find((opt) => opt.value === value);
    if (found) {
      setSelectedOption(found);
    } else if (fetchOptionByValue) {
      fetchOptionByValue(value).then((opt) => {
        if (opt) setSelectedOption(opt);
      });
    }
  }, [value, options, fetchOptionByValue]);

  /** Load data list */
  const loadData = React.useCallback(
    async (page: number, searchTerm: string, reset = false) => {
      try {
        if (reset) {
          setLoading(true);
          setOptions([]);
        } else {
          setLoadingMore(true);
        }

        const fetched = await fetchOptions(page, searchTerm);

        if (reset) {
          setOptions(fetched);
          setCurrentPage(2);
          setHasMore(fetched.length >= pageSize);
        } else {
          setOptions((prev) => {
            const newOptions = fetched.filter(
              (opt) => !prev.some((p) => p.value === opt.value)
            );
            return [...prev, ...newOptions];
          });
          setCurrentPage((prev) => prev + 1);
          setHasMore(fetched.length >= pageSize);
        }

        // ✅ kalau kosong, jangan load lagi
        if (fetched.length === 0) {
          setHasMore(false);
        }
      } catch (e) {
        console.error('loadData error:', e);
        setHasMore(false);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [fetchOptions, pageSize]
  );

  /** Debounce search */
  React.useEffect(() => {
    if (!isVisible) return;
    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      setCommittedSearch(searchText);
      loadData(1, searchText, true);
    }, debounceMs);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [searchText, isVisible, debounceMs, loadData]);

  /** Load awal saat modal buka */
  React.useEffect(() => {
    if (isVisible && options.length === 0 && !loading) {
      loadData(1, '', true);
    }
  }, [isVisible, options.length, loading, loadData]);

  /** Handlers */
  const handleOpen = () => {
    setIsVisible(true);
    modal.present();
  };
  const handleClose = () => {
    setIsVisible(false);
    modal.dismiss();
  };
  const handleSelect = (opt: OptionType) => {
    setSelectedOption(opt);
    onSelect(opt.value);
    handleClose();
  };

  /** UI helpers */
  const renderItem = ({ item }: { item: OptionType }) => (
    <Pressable
      onPress={() => handleSelect(item)}
      className="border-b border-neutral-200 p-3 dark:border-neutral-700"
    >
      <Text className="dark:text-white">{item.label}</Text>
    </Pressable>
  );
  const keyExtractor = (item: OptionType, index: number) =>
    `option-${item.value}-${index}`;

  const handleEndReached = () => {
    if (!hasMore) return; // ✅ stop kalau tidak ada data lagi
    if (!loading && !loadingMore) {
      loadData(currentPage, committedSearch, false);
    }
  };

  const LoadingFooter = loadingMore ? (
    <View className="py-4">
      <ActivityIndicator color={colors.primary?.[600]} />
    </View>
  ) : null;

  const EmptyComponent =
    !loading && options.length === 0 ? (
      <View className="items-center justify-center p-8">
        <Text className="text-gray-500 dark:text-gray-400">
          {committedSearch
            ? `Tidak ada hasil untuk "${committedSearch}"`
            : 'Tidak ada data tersedia'}
        </Text>
      </View>
    ) : null;

  return (
    <>
      <View className="mb-4">
        {label && <Text className="mb-1 text-lg text-black">{label}</Text>}
        <Pressable
          onPress={handleOpen}
          className="flex-row items-center justify-between rounded-xl border border-gray-300 bg-white p-3 dark:border-neutral-500 dark:bg-neutral-800"
        >
          {/* Kiri: search icon + label */}
          <View className="flex-1 flex-row items-center">
            {showIcons && (
              <Search
                size={20}
                color={isDark ? '#D1D5DB' : '#6B7280'}
                strokeWidth={2.2}
                className="mr-2"
              />
            )}
            <Text
              className={`flex-1 ${
                selectedOption ? 'text-black dark:text-white' : 'text-gray-400'
              }`}
            >
              {selectedOption?.label || placeholder}
            </Text>
          </View>

          {/* Kanan: panah bawah */}
          {showIcons && (
            <ChevronDown
              size={18}
              color={isDark ? '#D1D5DB' : '#6B7280'}
              strokeWidth={2}
            />
          )}
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
            {loading && (
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
              loading ? (
                <View className="items-center justify-center p-8">
                  <ActivityIndicator color={colors.primary?.[600]} />
                  <Text className="mt-2 text-gray-500 dark:text-gray-400">
                    Mencari "{committedSearch}"...
                  </Text>
                </View>
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
